import sColor from "@styles/color"
import global from "@styles/global"
import gImg from "@utils/img"
import gSass from "@utils/style"
import React, { Component } from "react"
import { Image, PixelRatio, Text, View } from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import pathMap from "@/routes/pathMap"
import { NavigationScreenProp } from "react-navigation"
const style = gSass.myInvite.myInviteIndex
interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  hasLoad: boolean
}

export default class Index extends Component<Props, State> {
  static navigationOptions = () => ({
    title: "我的邀请",
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
          <View style={style.list}>
            <View style={style.item}>
              <TouchableOpacity style={style.header} onPress={() => {
                this.props.navigation.push(pathMap.InviteDoctorList)
              }}>
                <Text style={style.theme}>我邀请的医师</Text>
              </TouchableOpacity>
              <View style={[style.detail, global.flex, global.aCenter, global.jBetween]}>
                <View style={style.detail}>
                  <TouchableOpacity onPress={() => {
                    this.props.navigation.push(pathMap.InviteDoctorList)
                  }}>
                    <Text style={style.desc}>59</Text>
                    <Text style={style.title}>医师数</Text>
                  </TouchableOpacity>
                </View>
                <View style={style.detail}>
                  <TouchableOpacity onPress={() => {
                    this.props.navigation.push(pathMap.InviteDoctorGradeList)
                  }}>
                    <Text style={style.desc}>59</Text>
                    <Text style={style.title}>一级</Text>
                  </TouchableOpacity>
                </View>
                <View style={style.detail}>
                  <TouchableOpacity onPress={() => {
                    this.props.navigation.push(pathMap.InviteDoctorGradeList)
                  }}>
                    <Text style={style.desc}>59</Text>
                    <Text style={style.title}>二级</Text>
                  </TouchableOpacity>
                </View>
                <View style={style.detail}>
                  <TouchableOpacity onPress={() => {
                    this.props.navigation.push(pathMap.InviteDoctorGradeList)
                  }}>
                    <Text style={style.desc}>59</Text>
                    <Text style={style.title}>三级</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={style.item}>
              <TouchableOpacity style={[style.header, global.flex, global.jBetween]} onPress={() => {
                this.props.navigation.push(pathMap.OrderMoney)
              }}>
                <Text style={style.theme}>我邀请的订单金额</Text>
                <Text style={style.time}>2019年12月</Text>
              </TouchableOpacity>
              <View style={[style.detail, global.flex, global.aCenter, global.jBetween]}>
                <View style={style.detail}>
                  <TouchableOpacity onPress={() => {
                    this.props.navigation.push(pathMap.OrderMoney)
                  }}>
                    <Text style={style.desc}>59</Text>
                    <Text style={style.title}>订单金额</Text>
                  </TouchableOpacity>
                </View>
                <View style={style.detail}>
                  <TouchableOpacity onPress={() => {
                    this.props.navigation.push(pathMap.InviteDoctorGradeList)
                  }}>
                    <Text style={style.desc}>59</Text>
                    <Text style={style.title}>一级</Text>
                  </TouchableOpacity>
                </View>
                <View style={style.detail}>
                  <TouchableOpacity onPress={() => {
                    this.props.navigation.push(pathMap.InviteDoctorGradeList)
                  }}>
                    <Text style={style.desc}>59</Text>
                    <Text style={style.title}>二级</Text>
                  </TouchableOpacity>
                </View>
                <View style={style.detail}>
                  <TouchableOpacity onPress={() => {
                    this.props.navigation.push(pathMap.InviteDoctorGradeList)
                  }}>
                    <Text style={style.desc}>59</Text>
                    <Text style={style.title}>三级</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={style.item}>
              <TouchableOpacity style={[style.header, global.flex, global.jBetween]} onPress={() => {
                this.props.navigation.push(pathMap.OrderCount)
              }}>
                <Text style={style.theme}>我邀请的订单</Text>
                <Text style={style.time}>2019年12月</Text>
              </TouchableOpacity>
              <View style={[style.detail, global.flex, global.aCenter, global.jBetween]}>
                <View style={style.detail}>
                  <TouchableOpacity onPress={() => {
                    this.props.navigation.push(pathMap.OrderCount)
                  }}>
                    <Text style={style.desc}>59</Text>
                    <Text style={style.title}>订单数</Text>
                  </TouchableOpacity>
                </View>
                <View style={style.detail}>
                  <TouchableOpacity onPress={() => {
                    this.props.navigation.push(pathMap.InviteDoctorGradeList)
                  }}>
                    <Text style={style.desc}>59</Text>
                    <Text style={style.title}>一级</Text>
                  </TouchableOpacity>
                </View>
                <View style={style.detail}>
                  <TouchableOpacity onPress={() => {
                    this.props.navigation.push(pathMap.InviteDoctorGradeList)
                  }}>
                    <Text style={style.desc}>59</Text>
                    <Text style={style.title}>二级</Text>
                  </TouchableOpacity>
                </View>
                <View style={style.detail}>
                  <TouchableOpacity onPress={() => {
                    this.props.navigation.push(pathMap.InviteDoctorGradeList)
                  }}>
                    <Text style={style.desc}>59</Text>
                    <Text style={style.title}>三级</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

          </View>
        </ScrollView>
      </>
    )
  }
}
