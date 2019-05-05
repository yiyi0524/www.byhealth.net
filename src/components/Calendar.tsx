import { windowWidth } from "@/utils/utils"
import gStyle from "@utils/style"
import moment from "moment"
import React from "react"
import { StyleSheet, Text, View } from "react-native"
const global = gStyle.global
// 一天的时间段
enum DayStage {
  morning,
  afterroom,
  night,
}
interface Props {}

interface State {
  // 医院id 映射 颜色 不同的医生的坐诊信息颜色不一样
  hospitalIdMapColor: Record<number, string>
  // 坐诊医院列表
  hospitalList: SittingHospital[]
  // 坐诊记录列表
  sittingRecordList: SittingRecord[]
  // 日期时间段(2019-05-05-0,年-月-日-时间段) 映射坐诊信息
  timeMapSittingRecord: Record<string, SittingRecordId>
  // 日程表
  calendar: Calendar
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
  name: string
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
  cityCid: string
  countyCid: string
  detail: string
  whole: string
}
class CalendarMode extends React.Component<Props, State> {
  hospitalColorList = ["#f2878d", "#d68db5", "#ac84bf", "#9b9fc5", "#8fb2d4", "#82c6c9", "#71c797"]
  constructor(props: any) {
    super(props)
    this.state = {
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
        stage: 0x1, // 1 上午,1下午,2 晚上
        hospitalId: 2,
      },
    ]
    for (let i = 0; i < sittingRecordList.length; i++) {
      let timeStage = sittingRecordList[i].time.substr(0, 10) + "-" + sittingRecordList[i].stage
      timeMapSittingRecord[timeStage] = sittingRecordList[i].hospitalId
    }
    this.setState({
      calendar,
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
          <View key={k}>
            <View
              style={{
                width: windowWidth / 8,
                height: 100,
                borderWidth: 1,
                borderColor: "#333",
              }}>
              <View style={{ height: 25 }} />
              <Text style={{ height: 25 }}>上午</Text>
              <Text style={{ height: 25 }}>下午</Text>
              <Text style={{ height: 25 }}>晚上</Text>
            </View>
            {v.day === 0 ? (
              <View style={{ width: (windowWidth - 30) / 8 }}>
                <View style={{ height: 25, backgroundColor: "gray" }} />
                <View style={{ height: 25, backgroundColor: "gray" }} />
                <View style={{ height: 25, backgroundColor: "gray" }} />
                <View style={{ height: 25, backgroundColor: "gray" }} />
              </View>
            ) : (
              <View>
                <Text style={{ width: windowWidth / 8, height: 25, backgroundColor: "white" }}>
                  {v.day}
                </Text>
                <Text
                  style={{
                    height: 25,
                    backgroundColor:
                      `${dateFmt}-0` in timeMapSittingRecord
                        ? this.state.hospitalIdMapColor[timeMapSittingRecord[`${dateFmt}-0`]]
                        : "white",
                  }}>
                  {`${dateFmt}-0` in timeMapSittingRecord ? "坐诊" : null}
                </Text>
                <Text
                  style={{
                    height: 25,
                    backgroundColor:
                      `${dateFmt}-1` in timeMapSittingRecord
                        ? this.state.hospitalIdMapColor[timeMapSittingRecord[`${dateFmt}-1`]]
                        : "white",
                  }}>
                  {`${dateFmt}-1` in timeMapSittingRecord ? "坐诊" : null}
                </Text>
                <Text
                  style={{
                    height: 25,
                    backgroundColor:
                      `${dateFmt}-2` in timeMapSittingRecord
                        ? this.state.hospitalIdMapColor[timeMapSittingRecord[`${dateFmt}-2`]]
                        : "white",
                  }}>
                  {`${dateFmt}-2` in timeMapSittingRecord ? "坐诊" : null}
                </Text>
              </View>
            )}
          </View>
        )
      }
      if (v.day === 0) {
        return (
          <View key={k} style={{ width: windowWidth / 8 }}>
            <View style={{ height: 25, backgroundColor: "gray" }} />
            <View style={{ height: 25, backgroundColor: "gray" }} />
            <View style={{ height: 25, backgroundColor: "gray" }} />
            <View style={{ height: 25, backgroundColor: "gray" }} />
          </View>
        )
      } else {
        return (
          <View key={k} style={{ width: windowWidth / 8 }}>
            <Text style={{ height: 25, backgroundColor: "white" }}>{v.day}</Text>
            <Text
              style={{
                height: 25,
                backgroundColor:
                  `${dateFmt}-0` in timeMapSittingRecord
                    ? this.state.hospitalIdMapColor[timeMapSittingRecord[`${dateFmt}-0`]]
                    : "white",
              }}>
              {`${dateFmt}-0` in timeMapSittingRecord ? "坐诊" : null}
            </Text>
            <Text
              style={{
                height: 25,
                backgroundColor:
                  `${dateFmt}-1` in timeMapSittingRecord
                    ? this.state.hospitalIdMapColor[timeMapSittingRecord[`${dateFmt}-1`]]
                    : "white",
              }}>
              {`${dateFmt}-1` in timeMapSittingRecord ? "坐诊" : null}
            </Text>
            <Text
              style={{
                height: 25,
                backgroundColor:
                  `${dateFmt}-2` in timeMapSittingRecord
                    ? this.state.hospitalIdMapColor[timeMapSittingRecord[`${dateFmt}-2`]]
                    : "white",
              }}>
              {`${dateFmt}-2` in timeMapSittingRecord ? "坐诊" : null}
            </Text>
          </View>
        )
      }
    })
  }
  render() {
    return (
      <View>
        <View style={[global.flex, global.flexWrap]}>
          <Text style={style.item}>星期</Text>
          <Text style={style.item}>一</Text>
          <Text style={style.item}>二</Text>
          <Text style={style.item}>三</Text>
          <Text style={style.item}>四</Text>
          <Text style={style.item}>五</Text>
          <Text style={style.item}>六</Text>
          <Text style={style.item}>日</Text>
        </View>
        <View style={[global.flex, global.flexWrap]}>{this.buildCalendar()}</View>
      </View>
    )
  }
}
export default CalendarMode
const style = StyleSheet.create({
  item: {
    width: (windowWidth - 30) / 8,
    textAlign: "center",
  },
})
