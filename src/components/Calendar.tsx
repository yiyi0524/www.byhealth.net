import global from "@/assets/styles/global"
import doctor from "@/services/doctor"
import { windowWidth } from "@/utils/utils"
import { Modal, Picker, Radio, Icon } from "@ant-design/react-native"
import moment from "moment"
import React, { Fragment } from "react"
import { PixelRatio, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import hospital from "@/services/hospital"
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
  selectHospital: [number]
  isSitting: number
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
  constructor(props: any) {
    super(props)
    this.state = {
      isSitting: 0,
      hospitalIdMapColor: {},
      hospitalList: [
        {
          id: 1,
          name: "北京邻米中医院",
          address: {
            provinceCid: "",
            cityCid: "",
            countyCid: "",
            detail: "",
            whole: "", // 这个whole 没什么用,备用
          },
        },
        {
          id: 2,
          name: "上海邻米中医院",
          address: {
            provinceCid: "",
            cityCid: "",
            countyCid: "",
            detail: "",
            whole: "", // 这个whole 没什么用,备用
          },
        },
      ],
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
      selectHospital: [0],
    }
  }
  componentDidMount() {
    this.init()
  }
  init = async () => {
    let dMoment = moment(),
      dayCount = dMoment.daysInMonth(),
      { calendar } = this.state,
      firstDayWeekday = moment()
        .year(calendar.year)
        .month(calendar.month)
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
    let { hospitalIdMapColor } = this.state
    for (let i = 0; i < this.state.hospitalList.length && i < 7; i++) {
      hospitalIdMapColor[this.state.hospitalList[i].id] = this.hospitalColorList[i]
    }
    let { timeMapSittingRecord, sittingRecordList } = this.state
    sittingRecordList = [
      {
        id: 1, //id 用来编辑
        time: "2019-05-05 10:00:00", //取数据的时候 13:00:00 不需要用到,我们计算时间段用stage
        stage: 0x0, // 0 上午,1下午,2 晚上
        hospitalId: 1,
      },
      {
        id: 2, //id 用来编辑
        time: "2019-05-13 17:00:00", //取数据的时候 13:00:00 不需要用到,我们计算时间段用stage
        stage: 0x1, // 0 上午,1下午,2 晚上
        hospitalId: 2,
      },
    ]
    for (let i = 0; i < sittingRecordList.length; i++) {
      let timeStage = sittingRecordList[i].time.substr(0, 10) + "-" + sittingRecordList[i].stage
      timeMapSittingRecord[timeStage] = sittingRecordList[i].hospitalId
    }
    let {
      data: { list },
    } = await doctor.listSittingHospital({ page: -1, limit: -1, filter: {} })
    let {
      data: { list: hospitalList },
    } = await hospital.getList({ page: -1, limit: -1, filter: {} })
    let { sittingHospitalList, sittingHospitalMapList } = this.state
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
    this.setState({
      calendar,
      sittingHospitalList,
      sittingHospitalMapList,
      hospitalIdMapColor,
      sittingRecordList,
      timeMapSittingRecord,
    })
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
                    this.setSitting(dateFmt, DayStage.morning)
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
                    this.setSitting(dateFmt, DayStage.afterroom)
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
                    this.setSitting(dateFmt, DayStage.night)
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
                this.setSitting(dateFmt, DayStage.morning)
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
                this.setSitting(dateFmt, DayStage.afterroom)
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
                this.setSitting(dateFmt, DayStage.night)
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
    let day = ""
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

    let { timeMapSittingRecord } = this.state
    let isSitting = false,
      sittingHospitalId = 0
    if (`${time}-${stage}` in timeMapSittingRecord) {
      isSitting = true
    } else {
      isSitting = false
    }
    console.log(time, stage, isSitting, sittingHospitalId)
  }

  render() {
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
})
export default CalendarMode
{
  /* <View>

</View>,
<View style={style.select}>
<View style={[style.picker, global.flex, global.alignItemsCenter]}>
  <Text style={[style.item, global.fontSize14]}>医疗机构</Text>
  <Picker
    cols={1}
    data={this.state.sittingHospitalList}
    value={this.state.selectHospital}
    onChange={selectHospital => {
      this.setState({
        selectHospital: selectHospital as [number],
      })
    }}>
    <TouchableOpacity>
      <View style={[global.flex, global.alignItemsCenter]}>
        <Text style={[style.pickerItem, global.fontStyle, global.fontSize14]}>
          {this.state.selectHospital[0] === 0
            ? "请选择"
            : this.state.sittingHospitalMapList[this.state.selectHospital[0]]}
        </Text>
        <Icon name="right" style={[style.pickerIcon, global.fontSize16]} />
      </View>
    </TouchableOpacity>
  </Picker>
</View>
<View style={style.isSitting}>
  <RadioItem
    checked={this.state.isSitting === 1}
    onChange={(evt: any) => {
      if (evt.target.checked) {
        this.setState({ isSitting: 1 })
      }
    }}>
    诊断
  </RadioItem>
  <RadioItem
    checked={this.state.isSitting === 2}
    onChange={(evt: any) => {
      if (evt.target.checked) {
        this.setState({ isSitting: 2 })
      }
    }}>
    不诊断
  </RadioItem>
</View>
</View>, */
}
