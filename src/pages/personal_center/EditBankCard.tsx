import * as userAction from '@/redux/actions/user'
import { AppState } from '@/redux/stores/store'
import { AllScreenParam } from '@/routes/bottomNav'
import pathMap from '@/routes/pathMap'
import doctorBankCard from '@/services/doctorBankCard'
import { InputItem, List, Toast } from '@ant-design/react-native'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import gImg from '@utils/img'
import gStyle from '@utils/style'
import React, { Component } from 'react'
import {
  DeviceEventEmitter,
  Image,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
const style = gStyle.personalCenter.editBankCard
interface Props {
  navigation: StackNavigationProp<AllScreenParam, 'EditBankCard'>
  route: RouteProp<AllScreenParam, 'EditBankCard'>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  id: number
  name: string
  idCardNo: string
  // 银行名
  bankName: string
  cardNo: string
  // 开户名
  openingBank: string
  phone: string
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
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      id: 0,
      name: '',
      idCardNo: '',
      // 银行名
      bankName: '',
      cardNo: '',
      // 开户名
      openingBank: '',
      phone: '',
    }
  }
  componentDidMount() {
    this.props.navigation.setParams({
      navigatePress: this.submit,
    })
    this.init()
  }
  init = async () => {
    let {
      data: {
        list: [{ id, name, bankName, cardNo, phone, idCardNo, openingBank }],
      },
    } = await doctorBankCard.list({ page: 1, limit: 1, filter: {} })

    this.setState({
      hasLoad: true,
      id,
      name,
      idCardNo,
      // 银行名
      bankName,
      cardNo,
      // 开户名
      openingBank,
      phone,
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
  submit = async () => {
    let { name, idCardNo, bankName, cardNo, openingBank, phone } = this.state
    if (name === '') {
      return Toast.fail('请填写持卡人姓名', 3)
    }
    if (idCardNo === '') {
      return Toast.fail('请填写身份证号码', 3)
    }
    // eslint-disable-next-line prefer-named-capture-group
    if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCardNo)) {
      Toast.fail('身份证号码位数不正确', 3)
    }
    // if (!api.idCardIDChecked(idCardNo)) {
    //   Toast.fail('身份证号码不正确', 3)
    // }
    // if (!api.idCardIDChecked(idCardNo)) {
    //   Toast.fail('身份证号码不正确', 3)
    // }
    if (bankName === '') {
      Toast.fail('请填写银行名称', 3)
    }
    if (cardNo === '') {
      Toast.fail('请填写卡号', 3)
    }
    if (openingBank === '') {
      Toast.fail('请填写开户名', 3)
    }
    if (phone === '') {
      Toast.fail('请填写手机号码', 3)
    }
    if (!/^1[3456789]\d{9}$/.test(phone)) {
      return Toast.fail('请输入正确的手机号码', 1)
    }
    doctorBankCard
      .edit(this.state)
      .then(() => {
        Toast.success('编辑成功', 2, () => {
          this.props.navigation.goBack()
          DeviceEventEmitter.emit(pathMap.Account + 'Reload', null)
        })
      })
      .catch(err => {
        Toast.fail('编辑失败, 错误信息: ' + err.msg, 3)
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
    if (Platform.OS === 'android') {
      return (
        <>
          <ScrollView
            style={style.main}
            keyboardShouldPersistTaps='always'
            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
          >
            <View style={style.addBankCard}>
              <List renderHeader={'添加银行卡'}>
                <InputItem
                  style={style.input}
                  labelNumber={5}
                  clear
                  value={this.state.name}
                  maxLength={4}
                  onChange={name => {
                    this.setState({
                      name,
                    })
                  }}
                  placeholder='持卡人姓名'
                >
                  持卡人
                </InputItem>
                <InputItem
                  style={style.input}
                  labelNumber={5}
                  clear
                  type='text'
                  value={this.state.idCardNo}
                  onChange={idCardNo => {
                    this.setState({
                      idCardNo,
                    })
                  }}
                  onBlur={(idCardNo: any) => {
                    if (!idCardNo) {
                      return false
                    }
                    // if (!api.idCardIDChecked(idCardNo)) {
                    //   Toast.fail('身份证不正确', 3)
                    // }
                    //
                    // eslint-disable-next-line prefer-named-capture-group
                    if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCardNo)) {
                      Toast.fail('身份证号码位数不正确', 3)
                    }
                  }}
                  placeholder='持卡人身份证号码'
                >
                  身份证号码
                </InputItem>
                <InputItem
                  style={style.input}
                  clear
                  type='text'
                  labelNumber={5}
                  value={this.state.bankName}
                  onChange={bankName => {
                    this.setState({
                      bankName,
                    })
                  }}
                  placeholder='银行卡所属银行名称'
                >
                  银行
                </InputItem>
                <InputItem
                  style={style.input}
                  clear
                  labelNumber={5}
                  type='text'
                  value={this.state.cardNo}
                  onChange={cardNo => {
                    this.setState({
                      cardNo,
                    })
                  }}
                  placeholder='储蓄卡卡号'
                >
                  卡号
                </InputItem>
                <InputItem
                  style={style.input}
                  clear
                  type='text'
                  labelNumber={5}
                  value={this.state.openingBank}
                  onChange={openingBank => {
                    this.setState({
                      openingBank,
                    })
                  }}
                  placeholder='开户行'
                >
                  开户行
                </InputItem>
                <InputItem
                  style={style.input}
                  clear
                  labelNumber={5}
                  last
                  type='number'
                  value={this.state.phone}
                  onChange={phone => {
                    this.setState({
                      phone,
                    })
                  }}
                  onBlur={(phone: any) => {
                    if (!/^1[3456789]\d{9}$/.test(phone)) {
                      return Toast.fail('请输入正确的手机号码', 1)
                    }
                  }}
                  placeholder='手机号码'
                >
                  手机号
                </InputItem>
              </List>
            </View>
          </ScrollView>
        </>
      )
    }
    return (
      <>
        <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }} keyboardVerticalOffset={70}>
          <ScrollView
            style={style.main}
            keyboardShouldPersistTaps='always'
            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
          >
            <View style={style.addBankCard}>
              <List renderHeader={'添加银行卡'}>
                <InputItem
                  style={style.input}
                  labelNumber={5}
                  clear
                  value={this.state.name}
                  maxLength={4}
                  onChange={name => {
                    this.setState({
                      name,
                    })
                  }}
                  placeholder='持卡人姓名'
                >
                  持卡人
                </InputItem>
                <InputItem
                  style={style.input}
                  labelNumber={5}
                  clear
                  type='text'
                  value={this.state.idCardNo}
                  onChange={idCardNo => {
                    this.setState({
                      idCardNo,
                    })
                  }}
                  onBlur={(idCardNo: any) => {
                    if (!idCardNo) {
                      return false
                    }
                    // if (!api.idCardIDChecked(idCardNo)) {
                    //   Toast.fail('身份证不正确', 3)
                    // }
                    // eslint-disable-next-line prefer-named-capture-group
                    if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCardNo)) {
                      Toast.fail('身份证号码位数不正确', 3)
                    }
                  }}
                  placeholder='持卡人身份证号码'
                >
                  身份证号码
                </InputItem>
                <InputItem
                  style={style.input}
                  clear
                  type='text'
                  labelNumber={5}
                  value={this.state.bankName}
                  onChange={bankName => {
                    this.setState({
                      bankName,
                    })
                  }}
                  placeholder='银行卡所属银行名称'
                >
                  银行
                </InputItem>
                <InputItem
                  style={style.input}
                  clear
                  labelNumber={5}
                  type='bankCard'
                  value={this.state.cardNo}
                  onChange={cardNo => {
                    this.setState({
                      cardNo,
                    })
                  }}
                  placeholder='储蓄卡卡号'
                >
                  卡号
                </InputItem>
                <InputItem
                  style={style.input}
                  clear
                  type='text'
                  labelNumber={5}
                  value={this.state.openingBank}
                  onChange={openingBank => {
                    this.setState({
                      openingBank,
                    })
                  }}
                  placeholder='开户行'
                >
                  开户行
                </InputItem>
                <InputItem
                  style={style.input}
                  clear
                  labelNumber={5}
                  last
                  type='number'
                  value={this.state.phone}
                  onChange={phone => {
                    this.setState({
                      phone,
                    })
                  }}
                  onBlur={(phone: any) => {
                    if (!/^1[3456789]\d{9}$/.test(phone)) {
                      return Toast.fail('请输入正确的手机号码', 1)
                    }
                  }}
                  placeholder='手机号码'
                >
                  手机号
                </InputItem>
              </List>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </>
    )
  }
}
