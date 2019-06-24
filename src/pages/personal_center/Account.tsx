import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import { getBalance } from "@/services/doctor"
import doctorBankCard, {
  DoctorBankCard,
  CashOutApply,
  CASH_OUT_APPLY_STATUS_ZH,
  CASH_OUT_APPLY_STATUS,
} from "@/services/doctorBankCard"
import { Icon, Toast, Modal } from "@ant-design/react-native"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  DeviceEventEmitter,
  EmitterSubscription,
} from "react-native"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import pathMap from "@/routes/pathMap"
const style = gStyle.personalCenter.account
const global = gStyle.global
interface Props {
  navigation: any
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  isShowAccount: boolean
  balance: number
  name: string
  idCardNo: string
  // 银行名
  bankName: string
  cardNo: string
  // 开户名
  openingBank: string
  phone: string
  bankList: DoctorBankCard[]
  records: CashOutApply[]
}
interface functionItem {
  name: string
  link: string
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
export default class Account extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = () => {
    return {
      title: "账户",
      headerStyle: {
        backgroundColor: sColor.lightGreen,
        height: 45,
        elevation: 0,
        borderColor: sColor.lightGreen,
      },
      headerTintColor: sColor.white,
      headerTitleStyle: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        textAlign: "center",
      },
      headerRight: (
        <TouchableOpacity
        // onPress={() =>
        //   navigation.push(pathMap.PatientDetail, {
        //     id: navigation.getParam("patientId"),
        //   })
        // }
        >
          {/* <Text style={[style.headerRight, global.fontSize14, global.fontStyle]}>说明</Text> */}
        </TouchableOpacity>
      ),
    }
  }
  functionList: functionItem[] = []
  subscription?: EmitterSubscription
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      isShowAccount: true,
      balance: 0.0,
      name: "",
      idCardNo: "",
      // 银行名
      bankName: "",
      cardNo: "",
      // 开户名
      openingBank: "",
      phone: "",
      bankList: [],
      records: [],
    }
  }
  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener(pathMap.Account + "Reload", _ => {
      this.init()
    })
    this.init()
  }
  init = async () => {
    const {
      data: { balance },
    } = await getBalance()
    let {
      data: { list: bankList },
    } = await doctorBankCard.list({ page: 1, limit: 1, filter: {} })
    let {
      data: { list: records },
    } = await doctorBankCard.listCashOutApply({ page: -1, limit: -1, filter: {} })
    this.setState({
      balance,
      hasLoad: true,
      bankList,
      records,
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
    let { bankList, records, balance } = this.state
    return (
      <>
        <ScrollView
          style={style.main}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }>
          <View style={style.header}>
            <Text style={[style.headerDescription, global.fontSize14, global.fontStyle]}>
              余额已根据国家法律扣除个人所得税
            </Text>
            <View
              style={[
                style.headerCenter,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentSpaceBetween,
              ]}>
              <TouchableOpacity
                style={[style.headerCenterLeft, global.flex, global.alignItemsCenter]}
                onPress={() => this.setState({ isShowAccount: !this.state.isShowAccount })}>
                <Icon
                  name={this.state.isShowAccount ? "eye-invisible" : "eye"}
                  style={[style.headerCenterLeftIcon, global.fontSize14]}
                />
                <Text style={[style.headerCenterLeftTitle]}>
                  {this.state.isShowAccount ? "隐藏余额" : "显示余额"}
                </Text>
              </TouchableOpacity>
              <Text style={[style.headerCenterTitle]}>
                ¥ {this.state.isShowAccount ? this.state.balance / 100 : "****"}
              </Text>
              <TouchableOpacity
                style={style.headerCenterRightFa}
                onPress={() => {
                  Modal.prompt(
                    "提现",
                    "请输入提现金额(元)",
                    val => {
                      let money = parseFloat(val) * 100
                      if (money) {
                        if (money > balance) {
                          return Toast.fail("提现金额不能大于余额 ")
                        }
                        doctorBankCard
                          .cashOut({ money })
                          .then(() => {
                            Toast.success("提交成功, 请等待审核", 3)
                            this.init()
                          })
                          .catch(err => {
                            Toast.success("提交失败,错误原因: " + err.msg, 3)
                          })
                      } else {
                        Toast.info("请输入正确的金额", 2)
                      }
                    },
                    "text",
                  )
                }}>
                <Text style={[style.headerCenterRight, global.fontSize14, global.fontStyle]}>
                  去提现
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* 银行卡部分先注释 */}
          <View style={style.bank}>
            {bankList.length === 0 ? (
              <TouchableOpacity
                style={style.addBank}
                onPress={() => {
                  this.props.navigation.push(pathMap.AddBankCard)
                }}>
                <View
                  style={[
                    style.addBankTitle,
                    global.flex,
                    global.alignItemsCenter,
                    global.justifyContentCenter,
                  ]}>
                  <Icon name="plus" style={[style.addBankIcon, global.fontSize14]} />
                  <Text style={[style.addBankDescription, global.fontSize14, global.fontStyle]}>
                    绑定银行卡
                  </Text>
                </View>
                <Text style={[style.addBankBtn, global.fontSize14]}>暂无绑定银行卡</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  style.bankDescription,
                  global.flex,
                  global.alignItemsCenter,
                  global.justifyContentSpaceBetween,
                ]}
                onPress={() => {
                  this.props.navigation.push(pathMap.EditBankCard)
                }}>
                <Text style={[style.bankDescriptionTitle, global.fontSize14]}>
                  {bankList[0].bankName}
                </Text>
                <Text style={[style.bankDescriptionTitle, global.fontSize14]}>
                  {bankList[0].cardNo.substr(0, 4) + "************"}
                </Text>
                <View style={[global.flex, global.alignItemsCenter]}>
                  <Text style={[style.bankDescriptionTitle, global.fontSize14]}>去修改</Text>
                  <Icon name="right" style={[style.bankDescriptionRight, global.fontSize14]} />
                </View>
              </TouchableOpacity>
            )}
          </View>

          <View style={records.length > 0 ? style.record : global.hidden}>
            <Text style={style.recordTitle}>提现记录</Text>
            {records.map((v, k) => {
              return (
                <View
                  key={k}
                  style={[
                    style.recordItem,
                    global.flex,
                    global.alignItemsCenter,
                    global.justifyContentSpaceBetween,
                  ]}>
                  <Text style={style.recordName}>{v.bankCard.bankName}</Text>
                  <Text style={style.recordMoney}>{(v.money / 100).toFixed(2)}</Text>
                  <Text
                    style={
                      v.status === CASH_OUT_APPLY_STATUS.pass
                        ? style.recordSuccess
                        : v.status === CASH_OUT_APPLY_STATUS.reject
                        ? style.recordFail
                        : style.recordMoney
                    }>
                    {CASH_OUT_APPLY_STATUS_ZH[v.status]}
                  </Text>
                  <Text style={style.recordRime}>{v.ctime.substr(0, 10)}</Text>
                </View>
              )
            })}
          </View>
        </ScrollView>
      </>
    )
  }
}
