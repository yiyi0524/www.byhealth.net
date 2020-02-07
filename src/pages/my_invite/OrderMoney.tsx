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
const style = gSass.myInvite.myInviteDoctorList
interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  hasLoad: boolean
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
          <View style={[style.year,global.flex,global.aCenter]}>
            <TouchableOpacity>
              <Icon style={style.icon} name="left"></Icon>
            </TouchableOpacity>
            <Text style={style.time}>2019年12月</Text>
            <TouchableOpacity>
              <Icon style={style.icon} name="right"></Icon>
            </TouchableOpacity>
          </View>
          <View style={[style.theme,style.themeHeight, global.flex, global.aCenter, global.jBetween]}>
            <Text style={style.themeTitle}>我邀请的金额</Text>
            <View style={[global.flex, global.aCenter]}>
              <Text style={style.themeCount}>￥
            </Text>
              <Text style={style.themeNum}>41242</Text>
            </View>
          </View>
          </View>
          <View style={style.list}>
            <View style={[style.item, style.itemGray, global.flex, global.aCenter, global.jBetween]}>
              <View style={style.title}>
                <Text style={style.desc}>医师</Text>
              </View>
              <Text style={style.desc}>一级</Text>
              <Text style={style.desc}>二级</Text>
              <Text style={style.desc}>三级</Text>
            </View>
            <View style={[style.item, global.flex, global.aCenter, global.jBetween]}>
              <View style={style.title}>
                <Text style={style.desc}>霍建华</Text>
              </View>
              <Text style={style.desc}>￥10</Text>
              <Text style={style.desc}>￥200</Text>
              <Text style={style.desc}>￥1000</Text>
            </View>
            <View style={[style.item, style.itemGray,global.flex, global.aCenter, global.jBetween]}>
              <View style={style.title}>
                <Text style={style.desc}>霍建华</Text>
              </View>
              <Text style={style.desc}>￥10</Text>
              <Text style={style.desc}>￥200</Text>
              <Text style={style.desc}>￥1000</Text>
            </View>
            <View style={[style.item, global.flex, global.aCenter, global.jBetween]}>
              <View style={style.title}>
                <Text style={style.desc}>霍建华</Text>
              </View>
              <Text style={style.desc}>￥10</Text>
              <Text style={style.desc}>￥200</Text>
              <Text style={style.desc}>￥1000</Text>
            </View>
            <View style={[style.item, style.itemGray,global.flex, global.aCenter, global.jBetween]}>
              <View style={style.title}>
                <Text style={style.desc}>霍建华</Text>
              </View>
              <Text style={style.desc}>￥10</Text>
              <Text style={style.desc}>￥200</Text>
              <Text style={style.desc}>￥1000</Text>
            </View>
            <View style={[style.item, global.flex, global.aCenter, global.jBetween]}>
              <View style={style.title}>
                <Text style={style.desc}>霍建华</Text>
              </View>
              <Text style={style.desc}>￥10</Text>
              <Text style={style.desc}>￥200</Text>
              <Text style={style.desc}>￥1000</Text>
            </View>
            <View style={[style.item, style.itemGray,global.flex, global.aCenter, global.jBetween]}>
              <View style={style.title}>
                <Text style={style.desc}>霍建华</Text>
              </View>
              <Text style={style.desc}>￥10</Text>
              <Text style={style.desc}>￥200</Text>
              <Text style={style.desc}>￥1000</Text>
            </View>
          </View>
        </ScrollView>
      </>
    )
  }
}
