import sColor from "@styles/color"
import global from "@styles/global"
import gImg from "@utils/img"
import gSass from "@utils/style"
import React, { Component } from "react"
import { Image, PixelRatio, Text, View } from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import pathMap from "@/routes/pathMap"
import { NavigationScreenProp } from "react-navigation"
import { Icon } from "@ant-design/react-native"
import moment from "moment"
import { InviteDoctorChildInfo, listInviteDoctorChildInfo } from "@/services/myInvite"
import Empty from "@/components/Empty"
const style = gSass.myInvite.myInviteDoctorList
interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  hasLoad: boolean
  date: string
  total: number //总金额
  list: InviteDoctorChildInfo[]
}

export default class OrderMoney extends Component<Props, State> {
  static navigationOptions = () => ({
    title: "订单金额",
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
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      date: moment().format("YYYY-MM"),
      total: 0,
      list: [],
    }
  }
  componentDidMount() {
    this.init()
  }
  init = async () => {
    try {
      let { date } = this.state,
        total = 0
      let listInviteDoctorChildInfoTask = listInviteDoctorChildInfo({
        year: parseInt(moment(date).format("YYYY")),
        month: parseInt(moment(date).format("M")),
      })
      let {
        data: { list },
      } = await listInviteDoctorChildInfoTask
      for (let item of list) {
        total += item.firstLevelMoneyCount
        total += item.secondLevelMoneyCount
        total += item.thirdLevelMoneyCount
      }
      total = parseFloat((total / 100).toFixed(0))
      this.setState({
        hasLoad: true,
        list,
        total,
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
    let { date, list, total } = this.state
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
              <Text style={style.themeTitle}>我邀请的金额</Text>
              <View style={[global.flex, global.aCenter]}>
                <Text style={style.themeCount}>￥</Text>
                <Text style={style.themeNum}>{total}</Text>
              </View>
            </View>
          </View>
          <View style={style.list}>
            <View
              style={[style.item, style.itemGray, global.flex, global.aCenter, global.jBetween]}>
              <View style={style.title}>
                <Text style={style.desc}>医师</Text>
              </View>
              <Text style={style.desc}>一级</Text>
              <Text style={style.desc}>二级</Text>
              <Text style={style.desc}>三级</Text>
            </View>
            {list.map((item, idx) => {
              return (
                <View
                  style={[
                    style.item,
                    idx % 2 !== 0 ? style.itemGray : style.item,
                    global.flex,
                    global.aCenter,
                    global.jBetween,
                  ]}
                  key={"item" + idx}>
                  <View style={style.title}>
                    <Text style={style.desc}>
                      {item.name} ￥{(item.moneyCount / 100).toFixed(0)}
                    </Text>
                  </View>
                  <Text
                    style={style.desc}
                    onPress={() => {
                      this.props.navigation.push(pathMap.InviteDoctorGradeList, {
                        doctorId: item.doctorId,
                        level: 1,
                        doctorName: item.name,
                      })
                    }}>
                    ￥{(item.firstLevelMoneyCount / 100).toFixed(0)}
                  </Text>
                  <Text
                    style={style.desc}
                    onPress={() => {
                      this.props.navigation.push(pathMap.InviteDoctorGradeList, {
                        doctorId: item.doctorId,
                        level: 2,
                        doctorName: item.name,
                      })
                    }}>
                    ￥{(item.secondLevelMoneyCount / 100).toFixed(0)}
                  </Text>
                  <Text
                    style={style.desc}
                    onPress={() => {
                      this.props.navigation.push(pathMap.InviteDoctorGradeList, {
                        doctorId: item.doctorId,
                        level: 3,
                        doctorName: item.name,
                      })
                    }}>
                    ￥{(item.thirdLevelMoneyCount / 100).toFixed(0)}
                  </Text>
                </View>
              )
            })}
            {list.length === 0 && <Empty />}
          </View>
        </ScrollView>
      </>
    )
  }
}
