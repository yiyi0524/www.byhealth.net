import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import { GENDER } from "@/services/doctor"
import { Icon, Tabs, Toast } from "@ant-design/react-native"
import userApi from "@api/user"
import sColor from "@styles/color"
import gStyle from "@utils/style"
import React, { Component } from "react"
import { PixelRatio, Text, View, Image } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { NavigationScreenProp } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import gImg from "@utils/img"
const style = gStyle.index.Prescription
const global = gStyle.global
interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  page: number
  limit: number
  filter: {}
  prescriptionList: prescriptionItem[]
  prescriptionPaymentList: prescriptionItem[]
}
interface prescriptionItem {
  id: number
  name: string
  gender: number
  age_year: number
  age_month: number
  diagnosis: string
  time: string
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
export default class Prescription extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = () => ({
    title: "已开处方",
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
      prescriptionList: [],
      prescriptionPaymentList: [],
      page: -1,
      limit: -1,
      filter: {},
    }
  }
  async componentDidMount() {
    await this.init()
  }
  init = async () => {
    // let {data} = await userApi.getPrescriptionList({page:this.state.page,limit:this.state.limit,filter:this.state.filter)
    // let filter = {
    //   status:1,
    // }
    // let {data:{prescriptionPaymentList,}} = await userApi.getPrescriptionList({page:this.state.page,limit:this.state.limit,filter)
    let prescriptionList = [
      {
        id: 1,
        name: "吴大伟",
        gender: 1,
        age_year: 23,
        age_month: 0,
        diagnosis: "病毒性感冒",
        time: "2019-03-23 12:00:00",
      },
      {
        id: 2,
        name: "吴二伟",
        gender: 2,
        age_year: 0,
        age_month: 18,
        diagnosis: "病毒性感冒",
        time: "2019-03-23 12:00:00",
      },
      {
        id: 3,
        name: "吴三伟",
        gender: 1,
        age_year: 23,
        age_month: 0,
        diagnosis: "病毒性感冒",
        time: "2019-03-23 12:00:00",
      },
    ]
    let prescriptionPaymentList = [
      {
        id: 1,
        name: "吴大伟",
        gender: 1,
        age_year: 23,
        age_month: 0,
        diagnosis: "病毒性感冒",
        time: "2019-03-23 12:00:00",
      },
      {
        id: 3,
        name: "吴三伟",
        gender: 1,
        age_year: 23,
        age_month: 0,
        diagnosis: "病毒性感冒",
        time: "2019-03-23 12:00:00",
      },
    ]
    this.setState({
      hasLoad: true,
      prescriptionList,
      prescriptionPaymentList,
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
  deleteGroup = (id: number) => {
    userApi
      .deletePatientGroup({ id })
      .then(() => {
        Toast.success("删除成功", 3)
        this.init()
      })
      .catch(err => {
        Toast.fail("删除失败, 错误原因: " + err.msg, 3)
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
        <View style={style.main}>
          <View style={style.prescription}>
            <Tabs
              tabBarActiveTextColor={sColor.mainRed}
              tabBarInactiveTextColor={sColor.color333}
              tabBarUnderlineStyle={style.tabBarUnderlineStyle}
              tabs={[
                {
                  title: `全部 ( ${this.state.prescriptionList.length} )`,
                },
                {
                  title: `已支付 ( ${this.state.prescriptionPaymentList.length} )`,
                },
              ]}>
              <View style={style.prescriptionList}>
                {this.state.prescriptionList.map((v: prescriptionItem, k: number) => {
                  return (
                    <TouchableOpacity key={k} style={style.prescriptionItem}>
                      <View
                        style={[
                          style.prescriptionItemHeader,
                          global.flex,
                          global.alignItemsCenter,
                          global.justifyContentSpaceBetween,
                        ]}>
                        <View
                          style={[
                            style.prescriptionItemHeaderLeft,
                            global.flex,
                            global.alignItemsCenter,
                          ]}>
                          <View style={style.prescriptionItemHeaderLeftIcon} />
                          <Text style={[style.prescriptionItemHeaderLeftTitle, global.fontSize14]}>
                            {v.name}
                          </Text>
                          <Text style={[style.prescriptionItemHeaderLeftDetail, global.fontSize14]}>
                            {v.gender === GENDER.MAN
                              ? "男"
                              : v.gender === GENDER.WOMAN
                              ? "女"
                              : "未知"}{" "}
                            {v.age_year !== 0
                              ? v.age_year + "岁"
                              : v.age_month !== 0
                              ? v.age_month > 12
                                ? Math.floor(v.age_month / 12) + "岁" + (v.age_month % 12) + "月"
                                : v.age_month + "月"
                              : "未知"}
                          </Text>
                        </View>
                        <View
                          style={[
                            style.prescriptionItemHeaderRight,
                            global.flex,
                            global.alignItemsCenter,
                          ]}>
                          <Text style={[style.prescriptionItemHeaderRightTitle, global.fontSize14]}>
                            查看详情
                          </Text>
                          <Icon
                            name="right"
                            style={[style.prescriptionItemHeaderRightIcon, global.fontSize14]}
                          />
                        </View>
                      </View>
                      <View style={style.prescriptionItemDescription}>
                        <Text
                          style={[style.prescriptionItemDescriptionDiagnosis, global.fontSize14]}
                          numberOfLines={1}>
                          [ 诊断 ] 病毒性感冒; 头疼, 流鼻涕 鼻子不通
                        </Text>
                        <View
                          style={[
                            style.prescriptionItemDescriptionDetail,
                            global.flex,
                            global.alignItemsCenter,
                            global.justifyContentSpaceBetween,
                          ]}>
                          <Text
                            style={[style.prescriptionItemDescriptionTime, global.fontSize14]}
                            numberOfLines={1}>
                            {v.time.substr(0, 4) +
                              "年" +
                              v.time.substr(5, 2) +
                              "月" +
                              v.time.substr(8, 2) +
                              "日" +
                              " " +
                              v.time.substr(12, 4)}
                          </Text>
                          <Text
                            style={[style.prescriptionItemDescriptionStatus, global.fontSize14]}
                            numberOfLines={1}>
                            待支付
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </View>
              <View style={style.prescriptionList}>
                {this.state.prescriptionPaymentList.map((v: prescriptionItem, k: number) => {
                  return (
                    <TouchableOpacity key={k} style={style.prescriptionItem}>
                      <View
                        style={[
                          style.prescriptionItemHeader,
                          global.flex,
                          global.alignItemsCenter,
                          global.justifyContentSpaceBetween,
                        ]}>
                        <View
                          style={[
                            style.prescriptionItemHeaderLeft,
                            global.flex,
                            global.alignItemsCenter,
                          ]}>
                          <View style={style.prescriptionItemHeaderLeftIcon} />
                          <Text style={[style.prescriptionItemHeaderLeftTitle, global.fontSize14]}>
                            {v.name}
                          </Text>
                          <Text style={[style.prescriptionItemHeaderLeftDetail, global.fontSize14]}>
                            {v.gender === GENDER.MAN
                              ? "男"
                              : v.gender === GENDER.WOMAN
                              ? "女"
                              : "未知"}{" "}
                            {v.age_year !== 0
                              ? v.age_year + "岁"
                              : v.age_month !== 0
                              ? v.age_month > 12
                                ? Math.floor(v.age_month / 12) + "岁" + (v.age_month % 12) + "月"
                                : v.age_month + "月"
                              : "未知"}
                          </Text>
                        </View>
                        <View
                          style={[
                            style.prescriptionItemHeaderRight,
                            global.flex,
                            global.alignItemsCenter,
                          ]}>
                          <Text style={[style.prescriptionItemHeaderRightTitle, global.fontSize14]}>
                            查看详情
                          </Text>
                          <Icon
                            name="right"
                            style={[style.prescriptionItemHeaderRightIcon, global.fontSize14]}
                          />
                        </View>
                      </View>
                      <View style={style.prescriptionItemDescription}>
                        <Text
                          style={[style.prescriptionItemDescriptionDiagnosis, global.fontSize14]}
                          numberOfLines={1}>
                          [ 诊断 ] 病毒性感冒; 头疼, 流鼻涕 鼻子不通
                        </Text>
                        <View
                          style={[
                            style.prescriptionItemDescriptionDetail,
                            global.flex,
                            global.alignItemsCenter,
                            global.justifyContentSpaceBetween,
                          ]}>
                          <Text
                            style={[style.prescriptionItemDescriptionTime, global.fontSize14]}
                            numberOfLines={1}>
                            {v.time.substr(0, 4) +
                              "年" +
                              v.time.substr(5, 2) +
                              "月" +
                              v.time.substr(8, 2) +
                              "日" +
                              " " +
                              v.time.substr(12, 4)}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </Tabs>
          </View>
        </View>
      </>
    )
  }
}
