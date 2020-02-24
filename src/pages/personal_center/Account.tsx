import * as userAction from '@/redux/actions/user'
import { AppState } from '@/redux/stores/store'
import { getBalance } from '@/services/doctor'
import doctorBankCard, {
  DoctorBankCard,
  CashOutApply,
  CASH_OUT_APPLY_STATUS_ZH,
  CASH_OUT_APPLY_STATUS,
  Type,
  CashOutData,
} from '@/services/doctorBankCard'
import { Icon, Toast, Modal, InputItem } from '@ant-design/react-native'
import sColor from '@styles/color'
import gImg from '@utils/img'
import { AllScreenParam } from '@/routes/bottomNav'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import gStyle from '@utils/style'
import React, { Component } from 'react'
import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  DeviceEventEmitter,
  EmitterSubscription,
} from 'react-native'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import pathMap from '@/routes/pathMap'
const style = gStyle.personalCenter.account
const global = gStyle.global
interface Props {
  navigation: StackNavigationProp<AllScreenParam, 'Account'>
  route: RouteProp<AllScreenParam, 'Account'>
}
interface State {
  isCashOutModalActive: boolean
  aliAccount: string
  aliName: string
  wxAccount: string
  money: string
  cashType: Type
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
@connect(mapStateToProps, mapDispatchToProps)
export default class Account extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  functionList: functionItem[] = []
  subscription?: EmitterSubscription
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      aliAccount: '',
      aliName: '',
      cashType: 'bankCard',
      isCashOutModalActive: false,
      money: '',
      wxAccount: '',
      hasLoad: false,
      refreshing: false,
      isShowAccount: true,
      balance: 0.0,
      name: '',
      idCardNo: '',
      // 银行名
      bankName: '',
      cardNo: '',
      // 开户名
      openingBank: '',
      phone: '',
      bankList: [],
      records: [],
    }
  }
  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener(pathMap.Account + 'Reload', _ => {
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
        Toast.fail('刷新失败,错误信息: ' + err.msg)
      })
  }
  cashOut = (args: CashOutData) => {
    const { balance } = this.state
    if (args.money) {
      if (args.money > balance) {
        return Toast.fail('提现金额不能大于余额 ')
      }
      doctorBankCard
        .cashOut(args)
        .then(() => {
          Toast.success('提交成功, 请等待审核', 1)
          this.setState({
            aliAccount: '',
            aliName: '',
            wxAccount: '',
          })
          this.init()
        })
        .catch(err => {
          Toast.success('提交失败,错误原因: ' + err.msg, 1)
        })
    } else {
      Toast.info('请输入正确的金额', 2)
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
    let { bankList, records, isCashOutModalActive, aliAccount, aliName, cashType, wxAccount } = this.state
    return (
      <>
        <ScrollView
          style={style.main}
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
        >
          <View style={style.header}>
            <Text style={[style.headerDescription, global.fontSize14, global.fontStyle]}>
              余额已根据国家法律扣除个人所得税
            </Text>
            <View style={[style.headerCenter, global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}>
              <TouchableOpacity
                style={[style.headerCenterLeft, global.flex, global.alignItemsCenter]}
                onPress={() => this.setState({ isShowAccount: !this.state.isShowAccount })}
              >
                <Icon
                  name={this.state.isShowAccount ? 'eye-invisible' : 'eye'}
                  style={[style.headerCenterLeftIcon, global.fontSize14]}
                />
                <Text style={[style.headerCenterLeftTitle]}>{this.state.isShowAccount ? '隐藏余额' : '显示余额'}</Text>
              </TouchableOpacity>
              <Text style={[style.headerCenterTitle]}>
                ¥ {this.state.isShowAccount ? this.state.balance / 100 : '****'}
              </Text>
              <TouchableOpacity
                style={style.headerCenterRightFa}
                onPress={() => {
                  Modal.operation([
                    {
                      text: '支付宝',
                      onPress: () => {
                        this.setState({
                          cashType: 'aliPay',
                          isCashOutModalActive: true,
                        })
                      },
                    },
                    {
                      text: '微信',
                      onPress: () => {
                        this.setState({
                          cashType: 'wxPay',
                          isCashOutModalActive: true,
                        })
                      },
                    },
                    {
                      text: '提现到银行卡',
                      onPress: () => {
                        this.setState({
                          cashType: 'bankCard',
                          isCashOutModalActive: true,
                        })
                      },
                    },
                  ])
                }}
              >
                <Text style={[style.headerCenterRight, global.fontSize14, global.fontStyle]}>去提现</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* 银行卡部分先注释 */}
          <View style={style.bank}>
            {bankList.length === 0 ? (
              <TouchableOpacity
                style={style.addBank}
                onPress={() => {
                  this.props.navigation.push('AddBankCard')
                }}
              >
                <View style={[style.addBankTitle, global.flex, global.alignItemsCenter, global.justifyContentCenter]}>
                  <Icon name='plus' style={[style.addBankIcon, global.fontSize14]} />
                  <Text style={[style.addBankDescription, global.fontSize14, global.fontStyle]}>绑定银行卡</Text>
                </View>
                <Text style={[style.addBankBtn, global.fontSize14]}>暂无绑定银行卡</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[style.bankDescription, global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}
                onPress={() => {
                  this.props.navigation.push('EditBankCard')
                }}
              >
                <Text style={[style.bankDescriptionTitle, global.fontSize14]}>{bankList[0].bankName}</Text>
                <Text style={[style.bankDescriptionTitle, global.fontSize14]}>
                  {bankList[0].cardNo.substr(0, 4) + '************'}
                </Text>
                <View style={[global.flex, global.alignItemsCenter]}>
                  <Text style={[style.bankDescriptionTitle, global.fontSize14]}>去修改</Text>
                  <Icon name='right' style={[style.bankDescriptionRight, global.fontSize14]} />
                </View>
              </TouchableOpacity>
            )}
          </View>

          <View style={records.length > 0 ? style.record : global.hidden}>
            <Text style={style.recordTitle}>提现记录</Text>
            {records.map((v, k) => {
              let name = ''
              if (v.bankCard) {
                name = v.bankCard.bankName
              } else if (v.type === 'aliPay') {
                name = '支付宝'
              } else if (v.type === 'wxPay') {
                name = '微信'
              }
              return (
                <View
                  key={k}
                  style={[style.recordItem, global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}
                >
                  <Text style={style.recordName}>{name}</Text>
                  <Text style={style.recordMoney}>{(v.money / 100).toFixed(2)}</Text>
                  <Text
                    style={
                      v.status === CASH_OUT_APPLY_STATUS.pass
                        ? style.recordSuccess
                        : v.status === CASH_OUT_APPLY_STATUS.reject
                        ? style.recordFail
                        : style.recordMoney
                    }
                  >
                    {CASH_OUT_APPLY_STATUS_ZH[v.status]}
                  </Text>
                  <Text style={style.recordRime}>{v.ctime.substr(0, 10)}</Text>
                </View>
              )
            })}
          </View>
          <Modal
            title='提现'
            transparent
            onClose={() => {
              this.setState({
                isCashOutModalActive: false,
              })
            }}
            maskClosable
            visible={isCashOutModalActive}
            closable
            footer={[
              {
                text: '取消',
                onPress: () => {
                  this.setState({
                    isCashOutModalActive: false,
                  })
                },
              },
              {
                text: '确定',
                onPress: () => {
                  let { money } = this.state
                  let fmtMoney = parseFloat(money)
                  if (fmtMoney) {
                    if (fmtMoney <= 0) {
                      return Toast.fail('输入金额不正确')
                    }
                    fmtMoney *= 100
                    fmtMoney = parseInt(String(fmtMoney))
                  } else {
                    return Toast.fail('输入金额不正确')
                  }
                  this.cashOut({
                    type: cashType,
                    money: fmtMoney,
                    aliAccount,
                    aliName,
                    wxAccount,
                  })
                },
              },
            ]}
          >
            <View style={{ paddingVertical: 20 }}>
              <InputItem
                clear
                value={this.state.money}
                onChange={money => {
                  this.setState({
                    money,
                  })
                }}
                style={[global.fontSize14, global.fontStyle]}
                placeholder='请输入提现金额(元)'
              >
                金额
              </InputItem>
              {cashType === 'aliPay' && (
                <InputItem
                  clear
                  value={aliAccount}
                  onChange={editAliAccount => {
                    this.setState({
                      aliAccount: editAliAccount,
                    })
                  }}
                  style={[global.fontSize14, global.fontStyle]}
                  placeholder='请输入支付宝账号'
                >
                  账号
                </InputItem>
              )}
              {cashType === 'aliPay' && (
                <InputItem
                  clear
                  value={aliName}
                  onChange={editAliName => {
                    this.setState({
                      aliName: editAliName,
                    })
                  }}
                  style={[global.fontSize14, global.fontStyle]}
                  placeholder='请输入支付宝真实姓名'
                >
                  姓名
                </InputItem>
              )}
              {cashType === 'wxPay' && (
                <InputItem
                  clear
                  value={wxAccount}
                  onChange={editWxAccount => {
                    this.setState({
                      wxAccount: editWxAccount,
                    })
                  }}
                  style={[global.fontSize14, global.fontStyle]}
                  placeholder='请输入微信账号'
                >
                  微信账号
                </InputItem>
              )}
            </View>
          </Modal>
        </ScrollView>
      </>
    )
  }
}
