import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import { DatePickerView, Icon, Switch, Toast } from "@ant-design/react-native"
import userApi from "@api/user"
import sColor from "@styles/color"
import gStyle from "@utils/style"
import moment from "moment"
import React, { Component } from "react"
import { PixelRatio, RefreshControl, Text, TouchableHighlight, View, Image } from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { NavigationScreenProp } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import gImg from "@utils/img"
const style = gStyle.index.DiagnosisSettings
const global = gStyle.global

interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  onlineReferralChecked: boolean
  isSelectDisturbanceFreePeriod: boolean
  reviewPrice: number
  isSelectReviewPrice: boolean
  isSelectFollowUpReviewPrice: boolean
  followUpReviewPrice: number
  reviewPriceList: number[]
  followUpReviewPriceList: number[]
}
const mapStateToProps = (state: AppState) => {
  return {
    isLogin: state.user.isLogin,
    name: state.user.name,
    uid: state.user.uid,
  }
}
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    login: (preload: userAction.UserInfo) => {
      dispatch(userAction.userLogin(preload))
    },
  }
}
@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class DiagnosisSettings extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = () => ({
    title: "复诊及诊后咨询设置",
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
    headerRight: <Text />,
  })
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      onlineReferralChecked: false,
      isSelectDisturbanceFreePeriod: false,
      isSelectReviewPrice: false,
      isSelectFollowUpReviewPrice: false,
      followUpReviewPrice: 0,
      reviewPrice: 0,
      reviewPriceList: [
        5,
        10,
        15,
        20,
        25,
        30,
        35,
        40,
        45,
        50,
        55,
        60,
        65,
        70,
        75,
        80,
        85,
        90,
        95,
        100,
        110,
        120,
        130,
        140,
        150,
        160,
        170,
        180,
        190,
        200,
        210,
        220,
        230,
        240,
        250,
        260,
        270,
        280,
        290,
        300,
        350,
        400,
        450,
        500,
        550,
        600,
        650,
        700,
        750,
        800,
        850,
        900,
        950,
        1000,
      ],
      followUpReviewPriceList: [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        15,
        20,
        25,
        30,
        35,
        40,
        45,
        50,
        55,
        60,
        65,
        70,
        75,
        80,
        85,
        90,
        95,
        100,
        110,
        120,
        130,
        140,
        150,
        160,
        170,
        180,
        190,
        200,
        210,
        220,
        230,
        240,
        250,
        260,
        270,
        280,
        290,
        300,
        350,
        400,
        450,
        500,
        600,
        700,
        800,
        900,
        1000,
        1100,
        1200,
        1300,
        1400,
        1500,
        1600,
        1700,
        1800,
        1900,
        2000,
      ],
    }
  }
  componentDidMount() {
    this.init()
  }
  init = async () => {
    this.setState({
      hasLoad: true,
    })
  }
  onRefresh = () => {
    this.setState({ refreshing: true })
    Promise.all([this.init(), new Promise(s => setTimeout(s, 500))])
      .then(_ => {
        this.setState({ refreshing: false })
      })
      .catch(err => {
        Toast.fail("刷新失败,错误信息: " + err.msg)
      })
  }
  onlineReferralChange = async () => {
    this.setState({
      onlineReferralChecked: !this.state.onlineReferralChecked,
    })
    try {
      await userApi.setOnlineReferral({
        onlineReferralChecked: this.state.onlineReferralChecked,
      })
      Toast.success("设置成功", 1)
    } catch (err) {
      Toast.fail("设置失败, 错误信息: " + err.msg, 3)
      console.log(err)
    }
  }
  closePicker = () => {
    this.setState({
      isSelectDisturbanceFreePeriod: false,
    })
  }
  setReviewPrice = async () => {
    let reviewPrice = this.state.reviewPrice * 100
    try {
      await userApi.setReviewPrice({ reviewPrice })
      Toast.success("设置复诊价格成功", 1)
    } catch (err) {
      Toast.fail("设置复诊价格失败, 错误信息: " + err.msg, 3)
      console.log(err)
    }
  }
  setFollowUpReviewPrice = async () => {
    let followUpReviewPrice = this.state.followUpReviewPrice * 100
    try {
      await userApi.setFollowUpReviewPrice({ followUpReviewPrice })
      Toast.success("设置后续复诊价格成功", 1)
    } catch (err) {
      Toast.fail("设置后续复诊价格失败, 错误信息: " + err.msg, 3)
      console.log(err)
    }
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
        <ScrollView
          style={style.main}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }>
          <View style={style.explain}>
            <View
              style={[
                style.header,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentSpaceBetween,
              ]}>
              <View style={[global.flex, global.alignItemsCenter]}>
                <View style={style.headerIcon} />
                <Text style={[style.headerTitle, global.fontSize14]}>是否开启复诊</Text>
              </View>
              <Switch
                checked={this.state.onlineReferralChecked}
                onChange={this.onlineReferralChange}
              />
            </View>
            <Text style={[style.title, global.fontSize14]}>在线复诊服务说明</Text>
            <View style={style.explainDetails}>
              <Text style={[style.explainDetail, global.fontSize14]}>
                您可以通过图文、语音、电话与患者交流, 首次回复需在6小时内( 22:00 -
                8:30与免打扰时段不计入 ), 默认单次交流时间为首次回复后48小时,
                辩证开方后经患者同意可随时结束对话。您可自定义收费价格。
              </Text>
              <Text style={[style.explainDetail, global.fontSize14]}>
                互联网诊疗仅适用常见病、慢性病复诊, 且您必须掌握患者病历,
                确定其在实体医疗机构有过同诊断。请勿为首诊、急重症患者在线诊疗。
              </Text>
            </View>
          </View>
          <View style={style.list}>
            <Text style={[style.title, global.fontSize14]}>图文复诊</Text>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                this.setState({
                  isSelectReviewPrice: true,
                })
              }}>
              <View
                style={[
                  style.item,
                  global.flex,
                  global.alignItemsCenter,
                  global.justifyContentSpaceBetween,
                ]}>
                <Text style={[style.itemTitle, global.fontSize14]}>复诊价格</Text>
                <View style={[style.itemDetail, global.flex, global.alignItemsCenter]}>
                  <Text style={[style.important, global.fontSize14]}>
                    ¥ {this.state.reviewPrice}
                  </Text>
                  <Icon style={[style.itemIcon, global.fontSize14]} name="right" />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                this.setState({
                  isSelectFollowUpReviewPrice: true,
                })
              }}>
              <View
                style={[
                  style.item,
                  global.flex,
                  global.alignItemsCenter,
                  global.justifyContentSpaceBetween,
                ]}>
                <Text style={[style.itemTitle, global.fontSize14]}>
                  后续复诊价格{" "}
                  <Text style={[style.itemDescription, global.fontSize12]}>
                    建议为老患者提供适当优惠
                  </Text>
                </Text>
                <View style={[style.itemDetail, global.flex, global.alignItemsCenter]}>
                  <Text style={[style.important, global.fontSize14]}>
                    ¥ {this.state.followUpReviewPrice}
                  </Text>
                  <Icon style={[style.itemIcon, global.fontSize14]} name="right" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {/* 选择复诊价格 */}
        <View style={this.state.isSelectReviewPrice ? style.reviewPrice : global.hidden}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              this.setState({
                isSelectReviewPrice: false,
              })
            }}>
            <Text style={[style.closeReviewPrice, global.fontSize14]}>取消</Text>
          </TouchableOpacity>
          <Text style={[style.description, global.fontSize14]}>
            收费指导: 主任医师平均定价60元, 副主任医师平均定价40元, 主治医师平均定价20元,
            您可根据实际情况进行调整。
          </Text>
          <ScrollView style={style.reviewPriceList}>
            {this.state.reviewPriceList.map((v: number, k: number) => {
              return (
                <TouchableOpacity
                  key={k}
                  onPress={() => {
                    this.setState({
                      reviewPrice: v,
                      isSelectReviewPrice: false,
                    })
                    this.setReviewPrice()
                  }}>
                  <Text
                    style={
                      v === this.state.reviewPrice
                        ? style.reviewPriceItemActive
                        : style.reviewPriceItem
                    }>
                    {v}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>
        {/* 选择后续复诊价格 */}
        <View style={this.state.isSelectFollowUpReviewPrice ? style.reviewPrice : global.hidden}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              this.setState({
                isSelectFollowUpReviewPrice: false,
              })
            }}>
            <Text style={[style.closeReviewPrice, global.fontSize14]}>取消</Text>
          </TouchableOpacity>
          <Text style={[style.description, global.fontSize14]}>
            收费指导: 主任医师平均定价30元, 副主任医师平均定价20元, 主治医师平均定价10元,
            您可根据实际情况进行调整。
          </Text>
          <ScrollView style={style.reviewPriceList}>
            {this.state.followUpReviewPriceList.map((v: number, k: number) => {
              return (
                <TouchableOpacity
                  key={k}
                  onPress={() => {
                    this.setState({
                      followUpReviewPrice: v,
                      isSelectFollowUpReviewPrice: false,
                    })
                    this.setFollowUpReviewPrice()
                  }}>
                  <Text
                    style={
                      v === this.state.followUpReviewPrice
                        ? style.reviewPriceItemActive
                        : style.reviewPriceItem
                    }>
                    {v}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>
      </>
    )
  }
}
