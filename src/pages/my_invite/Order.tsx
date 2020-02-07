import sColor from "@styles/color"
import global from "@styles/global"
import gImg from "@utils/img"
import gSass from "@utils/style"
import React, { Component } from "react"
import { Image, PixelRatio, Text, View } from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import pathMap from "@/routes/pathMap"
import { Icon } from "@ant-design/react-native"
import { NavigationScreenProp } from "react-navigation"
const style = gSass.myInvite.order
interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  hasLoad: boolean
}

export default class Order extends Component<Props, State> {
  static navigationOptions = () => ({
    title: "医师订单",
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
    }
  }
  componentDidMount() {
    this.init()
  }
  init = () => {
    this.setState({
      hasLoad: true,
    })
  }

  render() {
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
            <View style={[style.yearPar, global.flex, global.aCenter, global.jBetween]}>
              <View style={[style.year, global.flex, global.aCenter]}>
                <TouchableOpacity>
                  <Icon style={style.icon} name="left"></Icon>
                </TouchableOpacity>
                <Text style={style.time}>2019年12月</Text>
                <TouchableOpacity>
                  <Icon style={style.icon} name="right"></Icon>
                </TouchableOpacity>
              </View>
              <View style={[style.rightContent, global.flex, global.aCenter]}>
                <Text style={style.themeCount}>订单量</Text>
                <Text style={style.themeNum}>59</Text>
              </View>
            </View>
            <View style={[style.theme, style.themeHeight, global.flex, global.aCenter, global.jBetween]}>
              <Text style={style.themeTitle}>我邀请的订单</Text>
              <View style={[style.rightContent,global.flex, global.aCenter]}>
                <Text style={style.themeCount}>订单总数</Text>
                <Text style={style.themeNum}>412122</Text>
              </View>
            </View>
          </View>
          <View style={style.list}>
            <View style={[style.item, style.itemGray, global.flex, global.aCenter, global.jBetween]}>
              <Text style={style.desc}>订单日期</Text>
              <Text style={style.desc}>订单编号</Text>
              <Text style={style.desc}>交易金额</Text>
            </View>
            <View style={[style.item, global.flex, global.aCenter, global.jBetween]}>
              <Text style={style.desc}>2022/02/02</Text>
              <Text style={style.desc}>41324566-01</Text>
              <Text style={style.money}>￥780</Text>
            </View>
            <View style={[style.item, style.itemGray, global.flex, global.aCenter, global.jBetween]}>
              <Text style={style.desc}>2022/02/02</Text>
              <Text style={style.desc}>41324566-01</Text>
              <Text style={style.money}>￥780</Text>
            </View>
            <View style={[style.item, global.flex, global.aCenter, global.jBetween]}>
              <Text style={style.desc}>2022/02/02</Text>
              <Text style={style.desc}>41324566-01</Text>
              <Text style={style.money}>￥780</Text>
            </View>
            <View style={[style.item, style.itemGray, global.flex, global.aCenter, global.jBetween]}>
              <Text style={style.desc}>2022/02/02</Text>
              <Text style={style.desc}>41324566-01</Text>
              <Text style={style.money}>￥780</Text>
            </View>
            <View style={[style.item, global.flex, global.aCenter, global.jBetween]}>
              <Text style={style.desc}>2022/02/02</Text>
              <Text style={style.desc}>41324566-01</Text>
              <Text style={style.money}>￥780</Text>
            </View>
            <View style={[style.item, style.itemGray, global.flex, global.aCenter, global.jBetween]}>
              <Text style={style.desc}>2022/02/02</Text>
              <Text style={style.desc}>41324566-01</Text>
              <Text style={style.money}>￥780</Text>
            </View>
          </View>
        </ScrollView>
      </>
    )
  }
}
