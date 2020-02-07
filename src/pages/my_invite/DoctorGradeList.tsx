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
const style = gSass.myInvite.myInviteDoctorGradeList
interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  hasLoad: boolean
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
            <View style={[style.year, global.flex, global.aCenter]}>
              <TouchableOpacity>
                <Icon style={style.icon} name="left"></Icon>
              </TouchableOpacity>
              <Text style={style.time}>2019年12月</Text>
              <TouchableOpacity>
                <Icon style={style.icon} name="right"></Icon>
              </TouchableOpacity>
            </View>
            <View style={[style.theme, style.themeHeight, global.flex, global.aCenter, global.jBetween]}>
              <Text style={style.themeTitle}>霍建华医生 （一级）</Text>
              <View style={[global.flex, global.aCenter]}>
                <Text style={style.themeCount}>邀请数
            </Text>
                <Text style={style.themeNum}>10</Text>
              </View>
            </View>
          </View>
          <View style={style.list}>
            <TouchableOpacity style={style.item} onPress={() => {
              this.props.navigation.push(pathMap.Order)
            }}>
              <Text style={style.title}>李安宁医生</Text>
              <View style={[style.desc, global.flex, global.aCenter, global.jBetween]}>
                <View style={[global.flex, global.aCenter]}>
                  <Text style={style.label}>订单量</Text>
                  <Text style={style.title}>89</Text>
                </View>
                <View style={[style.money, global.flex, global.aCenter]}>
                  <Text style={style.moneyLabel}>交易金额</Text>
                  <Text style={style.moneyNum}>￥789</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={style.item} onPress={() => {
              this.props.navigation.push(pathMap.Order)
            }}>
              <Text style={style.title}>李安宁医生</Text>
              <View style={[style.desc, global.flex, global.aCenter, global.jBetween]}>
                <View style={[global.flex, global.aCenter]}>
                  <Text style={style.label}>订单量</Text>
                  <Text style={style.title}>89</Text>
                </View>
                <View style={[style.money, global.flex, global.aCenter]}>
                  <Text style={style.moneyLabel}>交易金额</Text>
                  <Text style={style.moneyNum}>￥789</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={style.item} onPress={() => {
              this.props.navigation.push(pathMap.Order)
            }}>
              <Text style={style.title}>李安宁医生</Text>
              <View style={[style.desc, global.flex, global.aCenter, global.jBetween]}>
                <View style={[global.flex, global.aCenter]}>
                  <Text style={style.label}>订单量</Text>
                  <Text style={style.title}>89</Text>
                </View>
                <View style={[style.money, global.flex, global.aCenter]}>
                  <Text style={style.moneyLabel}>交易金额</Text>
                  <Text style={style.moneyNum}>￥789</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={style.item} onPress={() => {
              this.props.navigation.push(pathMap.Order)
            }}>
              <Text style={style.title}>李安宁医生</Text>
              <View style={[style.desc, global.flex, global.aCenter, global.jBetween]}>
                <View style={[global.flex, global.aCenter]}>
                  <Text style={style.label}>订单量</Text>
                  <Text style={style.title}>89</Text>
                </View>
                <View style={[style.money, global.flex, global.aCenter]}>
                  <Text style={style.moneyLabel}>交易金额</Text>
                  <Text style={style.moneyNum}>￥789</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={style.item} onPress={() => {
              this.props.navigation.push(pathMap.Order)
            }}>
              <Text style={style.title}>李安宁医生</Text>
              <View style={[style.desc, global.flex, global.aCenter, global.jBetween]}>
                <View style={[global.flex, global.aCenter]}>
                  <Text style={style.label}>订单量</Text>
                  <Text style={style.title}>89</Text>
                </View>
                <View style={[style.money, global.flex, global.aCenter]}>
                  <Text style={style.moneyLabel}>交易金额</Text>
                  <Text style={style.moneyNum}>￥789</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </>
    )
  }
}
