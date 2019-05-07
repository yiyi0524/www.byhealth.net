import doctor, { STAGE, SITTING, STAGE_ZH } from "@/services/doctor"
import hospital from "@/services/hospital"
import { windowWidth } from "@/utils/utils"
import { Radio, Modal, Picker, Icon, Toast } from "@ant-design/react-native"
import moment from "moment"
import React, { Fragment } from "react"
import {
  PixelRatio,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  DeviceEventEmitter,
  EmitterSubscription,
} from "react-native"
import global from "@/assets/styles/global"
import pathMap from "@/routes/pathMap"
const RadioItem = Radio.RadioItem
// 一天的时间段
export enum DayStage {
  morning,
  afterroom,
  night,
}
interface Props {}
interface sittingHospitalMapList extends Record<string, string> {}
interface State {
  isShowMode: boolean
  // 医院id 映射 颜色 不同的医生的坐诊信息颜色不一样
  hospitalIdMapColor: Record<number, string>
  // 坐诊医院列表
  hospitalList: SittingHospital[]
  //坐诊医院列表
  // 坐诊记录列表
  sittingRecordList: SittingRecord[]
  // 日期时间段(2019-05-05-0,年-月-日-时间段) 映射坐诊信息
  timeMapSittingRecord: Record<string, SittingRecordId>
  // 日程表
  calendar: Calendar
  //医院列表
  sittingHospitalList: picker[]
  sittingHospitalMapList: sittingHospitalMapList
  selectHospital: number[]
  isSitting: number
  day: string
  stage: number
}
interface picker {
  value: number
  label: string
}
interface Calendar {
  /**
   * 年份
   */
  year: number
  // 月份 这个是1-12
  month: number
  // 日期列表
  dateList: {
    day: number
  }[]
}
// 坐诊医院
interface SittingHospital {
  id: number
  name?: string
  address: Address
}
type SittingRecordId = number
// 坐诊记录
interface SittingRecord {
  id: SittingRecordId //id 用来编辑
  time: string //取数据的时候 13:00:00 不需要用到,我们计算时间段用stage
  stage: DayStage // 0 上午,1下午,2 晚上
  hospitalId: number //医院id
}
interface Address {
  provinceCid: string
  cityCid?: string
  countyCid?: string
  detail: string
  whole?: string
}
class CalendarMode extends React.Component<Props, State> {
  hospitalColorList = ["#f2878d", "#d68db5", "#ac84bf", "#9b9fc5", "#8fb2d4", "#82c6c9", "#71c797"]
  subscription?: EmitterSubscription
  constructor(props: any) {
    super(props)
    this.state = {
      isShowMode: false,
      isSitting: 0,
      stage: 0,
      day: "",
      hospitalIdMapColor: {},
      hospitalList: [],
      //坐诊记录列表
      sittingRecordList: [],
      timeMapSittingRecord: {},
      // 日程表
      calendar: {
        year: 0,
        month: 0,
        dateList: [],
      },
      sittingHospitalList: [],
      sittingHospitalMapList: {},
      selectHospital: [],
    }
  }
  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener(pathMap.SittingHospital + "Reload", _ => {
      this.init()
    })
    this.init()
  }
  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.remove()
    }
  }
  init = async () => {
    try {
      let dMoment = moment(),
        dayCount = dMoment.daysInMonth(),
        { calendar } = this.state,
        firstDayWeekday = moment()
          .year(calendar.year)
          .month(calendar.month - 1)
          .isoWeekday()
      calendar.year = dMoment.year()
      calendar.month = dMoment.month() + 1
      calendar.dateList = []
      for (let i = 0; i < dayCount; i++) {
        calendar.dateList.push({
          day: i + 1,
        })
      }
      let firstLineInsertCount = firstDayWeekday - 1
      let lastLineInsertCount = 7 - ((dayCount - 7 + firstDayWeekday - 1) % 7)
      for (let i = 0; i < firstLineInsertCount; i++) {
        calendar.dateList.unshift({
          day: 0,
        })
      }
      for (let i = 0; i < lastLineInsertCount; i++) {
        calendar.dateList.push({
          day: 0,
        })
      }
      let timeMapSittingRecord: Record<string, SittingRecordId> = {}
      //坐诊列表
      let {
        data: { list: sittingRecordList },
      } = await doctor.listSittingRecord({ page: -1, limit: -1, filter: {} })
      for (let i = 0; i < sittingRecordList.length; i++) {
        let timeStage = sittingRecordList[i].time.substr(0, 10) + "-" + sittingRecordList[i].stage
        timeMapSittingRecord[timeStage] = sittingRecordList[i].hospitalId
      }
      let {
        data: { list },
      } = await doctor.listSittingHospital({ page: -1, limit: -1, filter: {} })
      //医院列表
      let {
        data: { list: hospitalList },
      } = await hospital.getList({ page: -1, limit: -1, filter: {} })
      //坐诊医院列表
      let {
        data: { list: listSittingHospital },
      } = await doctor.listSittingHospital({ page: -1, limit: -1, filter: {} })
      let sittingHospitalList: picker[] = [],
        sittingHospitalMapList: sittingHospitalMapList = {}
      for (let v of list) {
        let hospitalName = v.hospitalName
        for (let v1 of hospitalList) {
          if (v1.id === v.hospitalId) {
            hospitalName = v1.name
          }
        }
        sittingHospitalList.push({
          value: v.id,
          label: hospitalName,
        })
        sittingHospitalMapList[v.id] = hospitalName
      }
      let { hospitalIdMapColor } = this.state
      for (let i = 0; i < listSittingHospital.length && i < 7; i++) {
        hospitalIdMapColor[listSittingHospital[i].id] = this.hospitalColorList[i]
      }
      this.setState({
        calendar,
        hospitalList: listSittingHospital,
        sittingHospitalList,
        sittingHospitalMapList,
        hospitalIdMapColor,
        sittingRecordList,
        timeMapSittingRecord,
      })
    } catch (err) {
      console.log(err)
    }
  }
  buildCalendar = () => {
    let { timeMapSittingRecord } = this.state
    return this.state.calendar.dateList.map((v, k) => {
      let dateFmt = `${moment([
        this.state.calendar.year,
        this.state.calendar.month - 1,
        v.day,
      ]).format("YYYY-MM-DD")}`
      if (k % 7 === 0) {
        return (
          // 第一列的上午下午晚上
          <Fragment key={k}>
            <View style={style.mainRow}>
              <View style={style.mainRowItem} />
              <Text style={style.mainRowItem}>上午</Text>
              <Text style={style.mainRowItem}>下午</Text>
              <Text style={style.mainRowItem}>晚上</Text>
            </View>
            {v.day === 0 ? (
              <View style={style.otherMonth}>
                <View style={style.otherMonthItem} />
                <View style={style.otherMonthItem} />
                <View style={style.otherMonthItem} />
                <View style={style.otherMonthItem} />
              </View>
            ) : (
              <View style={style.currMonth}>
                <Text style={style.currMonthItem}>{v.day}</Text>
                <TouchableOpacity
                  onPress={() => {
                    // let isSitting = false,
                    //   sittingHospitalId = 0
                    this.setSitting(dateFmt, STAGE.morning)
                  }}>
                  <Text
                    style={[
                      style.currMonthItem,
                      {
                        backgroundColor:
                          `${dateFmt}-0` in timeMapSittingRecord
                            ? this.state.hospitalIdMapColor[timeMapSittingRecord[`${dateFmt}-0`]]
                            : "white",
                      },
                    ]}>
                    {`${dateFmt}-0` in timeMapSittingRecord ? "坐诊" : null}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setSitting(dateFmt, STAGE.afternoon)
                  }}>
                  <Text
                    style={[
                      style.currMonthItem,
                      {
                        backgroundColor:
                          `${dateFmt}-1` in timeMapSittingRecord
                            ? this.state.hospitalIdMapColor[timeMapSittingRecord[`${dateFmt}-1`]]
                            : "white",
                      },
                    ]}>
                    {`${dateFmt}-1` in timeMapSittingRecord ? "坐诊" : null}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setSitting(dateFmt, STAGE.night)
                  }}>
                  <Text
                    style={[
                      style.currMonthItem,
                      {
                        backgroundColor:
                          `${dateFmt}-2` in timeMapSittingRecord
                            ? this.state.hospitalIdMapColor[timeMapSittingRecord[`${dateFmt}-2`]]
                            : "white",
                      },
                    ]}>
                    {`${dateFmt}-2` in timeMapSittingRecord ? "坐诊" : null}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Fragment>
        )
      }
      if (v.day === 0) {
        return (
          <View key={k} style={style.otherMonth}>
            <View style={style.otherMonthItem} />
            <View style={style.otherMonthItem} />
            <View style={style.otherMonthItem} />
            <View style={style.otherMonthItem} />
          </View>
        )
      } else {
        return (
          // 除了第一列的所有上午下午晚上
          <View key={k} style={style.currMonth}>
            <Text style={style.currMonthItem}>{v.day}</Text>
            <TouchableOpacity
              onPress={() => {
                this.setSitting(dateFmt, STAGE.morning)
              }}>
              <Text
                style={[
                  style.currMonthItem,
                  {
                    backgroundColor:
                      `${dateFmt}-0` in timeMapSittingRecord
                        ? this.state.hospitalIdMapColor[timeMapSittingRecord[`${dateFmt}-0`]]
                        : "white",
                  },
                ]}>
                {`${dateFmt}-0` in timeMapSittingRecord ? "坐诊" : null}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setSitting(dateFmt, STAGE.afternoon)
              }}>
              <Text
                style={[
                  style.currMonthItem,
                  {
                    backgroundColor:
                      `${dateFmt}-1` in timeMapSittingRecord
                        ? this.state.hospitalIdMapColor[timeMapSittingRecord[`${dateFmt}-1`]]
                        : "white",
                  },
                ]}>
                {`${dateFmt}-1` in timeMapSittingRecord ? "坐诊" : null}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setSitting(dateFmt, STAGE.night)
              }}>
              <Text
                style={[
                  style.currMonthItem,
                  {
                    backgroundColor:
                      `${dateFmt}-2` in timeMapSittingRecord
                        ? this.state.hospitalIdMapColor[timeMapSittingRecord[`${dateFmt}-2`]]
                        : "white",
                  },
                ]}>
                {`${dateFmt}-2` in timeMapSittingRecord ? "坐诊" : null}
              </Text>
            </TouchableOpacity>
          </View>
        )
      }
    })
  }
  //设置是否坐诊
  setSitting = (time: string, stage: number) => {
    let { isSitting, timeMapSittingRecord, selectHospital } = this.state
    isSitting = time + "-" + stage in timeMapSittingRecord ? SITTING.TRUE : SITTING.FALSE
    selectHospital = isSitting === SITTING.TRUE ? [timeMapSittingRecord[time + "-" + stage]] : []
    console.log(timeMapSittingRecord[time + "-" + stage])
    this.setState({
      day: time,
      stage,
      isShowMode: true,
      isSitting,
      selectHospital,
    })
  }
  editSittingInfo = async () => {
    try {
      if (this.state.selectHospital.length === 0 || this.state.selectHospital[0] === 0) {
        return Toast.info("请选择医疗机构", 3)
      }
      await doctor.editSittingInfo({
        time: this.state.day + " 00:00:00",
        stage: this.state.stage,
        sittingHospitalId: this.state.selectHospital[0],
        isSitting: this.state.isSitting === SITTING.TRUE,
      })
      Toast.success("设置成功", 1)
      DeviceEventEmitter.emit(pathMap.SittingHospital + "Reload", null)
      // DeviceEventEmitter.emit(pathMap.Calendar + "Reload", null)
      this.setState({
        isShowMode: false,
        selectHospital: [],
        isSitting: SITTING.FALSE,
      })
      await this.init()
    } catch (err) {
      Toast.success("设置失败, 错误信息: " + err.msg, 1)
      console.log(err)
    }
  }
  render() {
    let day = "",
      time = this.state.day
    switch (moment(time).format("d")) {
      case "0":
        day = "星期一"
        break
      case "1":
        day = "星期二"
        break
      case "2":
        day = "星期三"
        break
      case "3":
        day = "星期四"
        break
      case "4":
        day = "星期五"
        break
      case "5":
        day = "星期六"
        break
      case "6":
        day = "星期天"
        break
    }
    return (
      <View style={style.main}>
        <View style={style.head}>
          <Text style={style.headerItem}>星期</Text>
          <Text style={style.headerItem}>一</Text>
          <Text style={style.headerItem}>二</Text>
          <Text style={style.headerItem}>三</Text>
          <Text style={style.headerItem}>四</Text>
          <Text style={style.headerItem}>五</Text>
          <Text style={style.headerItem}>六</Text>
          <Text style={style.headerItem}>日</Text>
        </View>
        <View style={style.calendar}>{this.buildCalendar()}</View>
        <Modal
          title={moment(this.state.day).format("M月D日 ") + day + " " + STAGE_ZH[this.state.stage]}
          transparent
          onClose={() =>
            this.setState({
              isShowMode: false,
            })
          }
          maskClosable
          visible={this.state.isShowMode}
          closable>
          <View style={style.mode}>
            <View
              style={[
                style.modeItem,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentSpaceBetween,
              ]}>
              <Text style={[style.modeItemTitle, global.fontSize14]}>医疗机构</Text>
              <View>
                <Picker
                  style={style.modeItemPicker}
                  data={this.state.sittingHospitalList}
                  cols={1}
                  value={this.state.selectHospital}
                  onChange={selectHospital => {
                    this.setState({
                      selectHospital: selectHospital as [number],
                    })
                  }}>
                  <TouchableOpacity>
                    <View style={[global.flex, global.alignItemsCenter]}>
                      <Text style={[style.pickerItem, global.fontStyle, global.fontSize14]}>
                        {this.state.selectHospital.length === 0
                          ? "请选择"
                          : this.state.sittingHospitalMapList[this.state.selectHospital[0]]}
                      </Text>
                      <Icon name="right" style={[style.pickerIcon, global.fontSize16]} />
                    </View>
                  </TouchableOpacity>
                </Picker>
              </View>
            </View>
            <View style={style.modeItem}>
              <RadioItem
                checked={this.state.isSitting === SITTING.TRUE}
                onChange={(evt: any) => {
                  if (evt.target.checked) {
                    this.setState({ isSitting: SITTING.TRUE })
                  }
                }}>
                坐诊
              </RadioItem>
              <RadioItem
                checked={this.state.isSitting === SITTING.FALSE}
                onChange={(evt: any) => {
                  if (evt.target.checked) {
                    this.setState({ isSitting: SITTING.FALSE })
                  }
                }}>
                不作诊
              </RadioItem>
            </View>
          </View>
          <TouchableOpacity onPress={this.editSittingInfo}>
            <Text style={[style.btn, global.fontSize14]}>保存修改</Text>
          </TouchableOpacity>
        </Modal>
      </View>
    )
  }
}
const style = StyleSheet.create({
  main: {
    paddingLeft: 8,
    paddingRight: 8,
    marginBottom: 15,
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerItem: {
    width: (windowWidth - 16) / 8,
    height: 35,
    lineHeight: 35,
    textAlign: "center",
    borderColor: "#eee",
    borderBottomWidth: 1 / PixelRatio.get(),
    borderTopWidth: 1 / PixelRatio.get(),
    borderRightWidth: 1 / PixelRatio.get(),
  },
  calendar: {
    width: windowWidth,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  mainRow: {
    width: (windowWidth - 16) / 8,
    height: 100,
  },
  mainRowItem: {
    width: (windowWidth - 16) / 8,
    height: 35,
    lineHeight: 35,
    textAlign: "center",
    borderColor: "#eee",
    borderBottomWidth: 1 / PixelRatio.get(),
    borderTopWidth: 1 / PixelRatio.get(),
    borderRightWidth: 1 / PixelRatio.get(),
    borderLeftWidth: 1 / PixelRatio.get(),
  },
  otherMonth: {},
  otherMonthItem: {
    width: (windowWidth - 16) / 8,
    height: 35,
    backgroundColor: "#f2f2f2",
    borderColor: "#eee",
    borderBottomWidth: 1 / PixelRatio.get(),
    borderTopWidth: 1 / PixelRatio.get(),
    borderRightWidth: 1 / PixelRatio.get(),
  },
  currMonth: {},
  currMonthItem: {
    width: (windowWidth - 16) / 8,
    height: 35,
    lineHeight: 35,
    textAlign: "center",
    backgroundColor: "white",
    borderColor: "#eee",
    borderBottomWidth: 1 / PixelRatio.get(),
    borderTopWidth: 1 / PixelRatio.get(),
    borderRightWidth: 1 / PixelRatio.get(),
  },
  select: {
    flex: 1,
    borderWidth: 1,
  },
  picker: {
    flex: 1,
  },
  item: {
    width: 80,
  },
  pickerItem: {
    fontSize: 14,
    color: "#666",
  },
  pickerIcon: {
    color: "#ddd",
  },
  isSitting: {
    flex: 1,
  },
  mode: {
    padding: 15,
    height: 200,
  },
  modeItem: {
    height: 45,
  },
  modeItemTitle: {
    color: "#333",
  },
  modeItemPicker: {
    textAlign: "right",
    fontSize: 14,
    color: "#666",
  },
  btn: {
    paddingLeft: 15,
    paddingRight: 15,
    height: 45,
    lineHeight: 45,
    backgroundColor: "#fd8469",
    borderRadius: 5,
    textAlign: "center",
    color: "#fff",
  },
})
export default CalendarMode
