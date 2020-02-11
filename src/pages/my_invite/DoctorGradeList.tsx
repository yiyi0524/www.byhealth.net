import pathMap from "@/routes/pathMap"
import {
  FirstLevelDoctorChildOrderInfo,
  listFirstLevelDoctorChildOrderInfo,
} from "@/services/myInvite"
import { Icon } from "@ant-design/react-native"
import sColor from "@styles/color"
import global from "@styles/global"
import gImg from "@utils/img"
import gSass from "@utils/style"
import moment from "moment"
import React, { Component } from "react"
import { Image, PixelRatio, Text, View } from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { NavigationScreenProp } from "react-navigation"
import Empty from "@/components/Empty"
const style = gSass.myInvite.myInviteDoctorGradeList
interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  hasLoad: boolean
  level: number
  doctorId: number
  doctorName: string
  date: string
  list: FirstLevelDoctorChildOrderInfo[]
}

export default class DoctorGradeList extends Component<Props, State> {
  static navigationOptions = () => ({
    title: "邀请的医生",
    headerStyle: {
      backgroundColor: sColor.white,
      height: 50,
      elevation: 0,
      color: sColor.mainBlack,
      borderBottomWidth: 1 / PixelRatio.get(),
      borderBottomColor: sColor.colorEee,
    },
    headerTintColor: sColor.color333,
    headerTitleStyle: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      fontSize: 14,
      textAlign: "center",
    },
    headerRight: (
      <TouchableOpacity>
        {/* <Text style={[style.headerRight, global.fontSize14]}>保存</Text> */}
      </TouchableOpacity>
    ),
  })
  constructor(props: any) {
    super(props)
    this.state = this.getInitState(props)
  }
  getInitState = (props: Props): State => {
    let level = 0,
      doctorId = 0,
      doctorName = ""
    if (props.navigation.state.params) {
      level = props.navigation.state.params.level || 0
      doctorId = props.navigation.state.params.doctorId || 0
      doctorName = props.navigation.state.params.doctorName || ""
    }
    return {
      level,
      doctorId,
      doctorName,
      hasLoad: false,
      date: moment().format("YYYY-MM"),
      list: [],
    }
  }
  componentDidMount() {
    this.init()
  }
  init = async () => {
    let { date, doctorId, level } = this.state
    try {
      let listFirstLevelDoctorChildOrderInfoTask = listFirstLevelDoctorChildOrderInfo({
        year: parseInt(moment(date).format("YYYY")),
        month: parseInt(moment(date).format("M")),
        doctorId,
        level,
      })
      let {
        data: { list },
      } = await listFirstLevelDoctorChildOrderInfoTask
      this.setState({
        hasLoad: true,
        list,
      })
    } catch (err) {
      console.log(err)
    }
  }
  prevMonth = () => {
    let { date } = this.state
    date = moment(date)
      .subtract(1, "month")
      .format("YYYY-MM")
    this.setState(
      {
        date,
      },
      this.init,
    )
  }
  nextMonth = () => {
    let { date } = this.state
    date = moment(date)
      .add(1, "month")
      .format("YYYY-MM")
    let currDate = moment().format("YYYY-MM")
    if (date > currDate) {
      return false
    }
    this.setState(
      {
        date,
      },
      this.init,
    )
  }
  render() {
    let { date, doctorName, level, list } = this.state
    if (!this.state.hasLoad) {
      return (
        <View style={style.loading}>
          <View style={style.loadingPic}>
            <Image style={style.loadingImg} source={gImg.common.loading} />
          </View>
        </View>
      )
    }
    return (
      <>
        <ScrollView style={style.main}>
          <View style={style.header}>
            <View style={[style.year, global.flex, global.aCenter]}>
              <TouchableOpacity style={[style.iconPar]} onPress={this.prevMonth}>
                <Icon style={[style.icon, style.iconLeft]} name="left"></Icon>
              </TouchableOpacity>
              <Text style={style.time}>{moment(date).format("YYYY年MM月")}</Text>
              <TouchableOpacity style={style.iconPar} onPress={this.nextMonth}>
                <Icon style={style.icon} name="right"></Icon>
              </TouchableOpacity>
            </View>
            <View
              style={[
                style.theme,
                style.themeHeight,
                global.flex,
                global.aCenter,
                global.jBetween,
              ]}>
              <Text style={style.themeTitle}>
                {doctorName}医生 ({" "}
                {level === 1 ? "一级" : level === 2 ? "二级" : level === 3 ? "三级" : "四级"} )
              </Text>
              <View style={[global.flex, global.aCenter]}>
                <Text style={style.themeCount}>邀请数</Text>
                <Text style={style.themeNum}>{list.length}</Text>
              </View>
            </View>
          </View>
          <View style={style.list}>
            {list.map((item, idx) => {
              return (
                <TouchableOpacity
                  style={style.item}
                  key={"item" + idx}
                  onPress={() => {
                    this.props.navigation.push(pathMap.Order, {
                      doctorId: item.doctorId,
                      date,
                      doctorName: item.doctorName,
                    })
                  }}>
                  <Text style={style.title}>{item.doctorName}医生</Text>
                  <View style={[style.desc, global.flex, global.aCenter, global.jBetween]}>
                    <View style={[global.flex, global.aCenter]}>
                      <Text style={style.label}>订单量</Text>
                      <Text style={style.title}>{item.orderCount}</Text>
                    </View>
                    <View style={[style.money, global.flex, global.aCenter]}>
                      <Text style={style.moneyLabel}>交易金额 (元)</Text>
                      <Text style={style.moneyNum}>
                        ￥{parseFloat((item.moneyCount / 100).toFixed(0))}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            })}
            {list.length === 0 && <Empty />}
          </View>
        </ScrollView>
      </>
    )
  }
}
