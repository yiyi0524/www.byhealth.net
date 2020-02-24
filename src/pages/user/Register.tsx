import global from '@/assets/styles/global'
import * as userAction from '@/redux/actions/user'
import { AppState } from '@/redux/stores/store'
import { AllScreenParam } from '@/routes/bottomNav'
import { Checkbox, Icon, InputItem, Picker, Toast } from '@ant-design/react-native'
import api, { registerParam, TYPE } from '@api/api'
import hospitalApi from '@api/hospital'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import gColor from '@styles/color'
import gImg from '@utils/img'
import gStyle from '@utils/style'
import React, { Component } from 'react'
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
const AgreeItem = Checkbox.AgreeItem
const style = gStyle.user.register
interface Props {
  navigation: StackNavigationProp<AllScreenParam, 'Register'>
  route: RouteProp<AllScreenParam, 'Register'>
}
interface State {
  hasAgreeAgreement: boolean
  selectHospitalActive: boolean
  name: string
  phone: string
  pwd: string
  rePwd: string
  hospitalName: string
  verificationCode: string
  verificationCodeUuid: string
  verificationCodeMsg: string
  page: number
  limit: number
  addressId: any
  hospitalId: any
  region: any
  cityId: any
  regionCidMapAreaName: any
  filter: any
  hospitalList: any
}
interface RegionCidMapAreaName extends Record<string, string> {}
interface CityItem {
  value: string
  label: string
  children: CityItem[]
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
// @ts-ignore
@connect(mapStateToProps, mapDispatchToProps)
export default class Register extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasAgreeAgreement: true,
      selectHospitalActive: false,
      hospitalId: 0,
      page: -1,
      limit: -1,
      name: '',
      phone: '',
      pwd: '',
      rePwd: '',
      verificationCode: '',
      verificationCodeUuid: '',
      verificationCodeMsg: '获取验证码',
      hospitalName: '',
      filter: {},
      addressId: [],
      region: [],
      cityId: [],
      regionCidMapAreaName: [],
      hospitalList: [],
    }
  }
  componentDidMount() {
    this.init()
  }
  init = async () => {
    try {
      let regionCidMapAreaName: RegionCidMapAreaName = {},
        region = []
      let {
        data: { region: oriRegion },
      } = await api.getRegion()
      regionCidMapAreaName = this.getChildCidMapAreaName(oriRegion, regionCidMapAreaName)
      region = this.generateFormatRegion(oriRegion)
      this.setState({
        region,
        regionCidMapAreaName,
      })
    } catch (err) {
      console.log(err.msg)
    }
  }
  getChildCidMapAreaName = (arr: any, regionCidMapAreaName: any) => {
    for (let i = 0, len = arr.length; i < len; i++) {
      if (arr[i].children && arr[i].children.length > 0) {
        this.getChildCidMapAreaName(arr[i].children, regionCidMapAreaName)
      }
      regionCidMapAreaName[arr[i].cid] = arr[i].areaName
    }
    return regionCidMapAreaName
  }
  generateFormatRegion = (arr: any) => {
    let cityList: CityItem[] = []
    for (let i = 0, len = arr.length; i < len; i++) {
      let children: CityItem[] = []
      if (arr[i].children && arr[i].children.length > 0) {
        children = this.generateFormatRegion(arr[i].children)
      }
      let item = {
        value: arr[i].cid,
        label: arr[i].areaName,
        children,
      }
      cityList.push(item)
    }
    return cityList
  }
  chooseCityId = async (cityId: any) => {
    this.setState({
      cityId,
    })
    try {
      let {
        data: { list: hospitalList },
      } = await hospitalApi.getList({
        page: this.state.page,
        limit: this.state.limit,
        filter: {
          countyCid: {
            condition: TYPE.eq,
            val: cityId[2],
          },
        },
      })
      this.setState({
        hospitalList,
        hospitalName: '',
        hospitalId: 0,
      })
    } catch (err) {
      console.log(err.msg)
    }
  }
  sendVerificationCode = () => {
    if (this.state.phone === '') {
      return Toast.fail('请输入手机号码', 2)
    }
    if (!/^1[3456789]\d{9}$/u.test(this.state.phone)) {
      return Toast.fail('请输入正确的手机号码', 2)
    }
    api
      .sendPhoneRegisterVerifyCode({ phone: this.state.phone })
      // Promise.resolve({ data: { uuid: "2323" } })
      .then(json => {
        Toast.info('发送成功', 1)
        let timeout = 60
        this.setState({
          verificationCodeMsg: timeout-- + '秒后重新发送',
        })
        let timer = setInterval(_ => {
          this.setState({
            verificationCodeMsg: timeout-- + '秒后重新发送',
          })
        }, 1000)
        this.setState({
          verificationCodeUuid: json.data.uuid,
        })
        setTimeout(_ => {
          clearInterval(timer)
          this.setState({
            verificationCodeMsg: '获取验证码',
          })
        }, timeout * 1000)
      })
      .catch(err => {
        console.log(err)
        Toast.info('发送失败 错误信息: ' + err.msg, 3)
      })
  }
  submit = async () => {
    if (!this.state.hasAgreeAgreement) {
      return Toast.fail('请阅读并同意注册协议', 1)
    }
    if (this.state.cityId.length === 0) {
      return Toast.fail('请选择地区', 2)
    }
    if (this.state.hospitalId === 0 && this.state.hospitalName === '') {
      return Toast.fail('请选择医疗机构', 2)
    }
    if (this.state.name === '') {
      return Toast.fail('请输入姓名', 2)
    }
    if (this.state.phone === '') {
      return Toast.fail('请输入手机号码', 2)
    }
    if (!/^1[3456789]\d{9}$/.test(this.state.phone)) {
      return Toast.fail('请输入正确的手机号码', 2)
    }
    if (this.state.verificationCodeUuid === '') {
      return Toast.fail('请获取验证码', 2)
    }
    if (this.state.verificationCode === '') {
      return Toast.fail('请输入验证码', 2)
    }
    if (this.state.pwd === '') {
      return Toast.fail('请输入密码', 2)
    }
    if (this.state.rePwd === '') {
      return Toast.fail('请确认密码', 2)
    }
    const param: registerParam = {
      smsUuid: this.state.verificationCodeUuid,
      verifyCode: this.state.verificationCode,
      name: this.state.name,
      pwd: this.state.pwd,
      rePwd: this.state.rePwd,
      phone: this.state.phone,
      countyCid: this.state.cityId[2],
    }
    if (this.state.hospitalId !== 0) {
      param.hospitalId = this.state.hospitalId
    } else {
      param.hospitalName = this.state.hospitalName
    }
    try {
      await api.register(param)
      Toast.success('注册成功', 2, () => {
        this.props.navigation.navigate('Login')
      })
    } catch (err) {
      console.log(err)
      Toast.fail('注册失败, 错误信息: ' + err.msg, 3)
    }
  }
  render() {
    return (
      <>
        <KeyboardAvoidingView
          enabled={Platform.OS !== 'android'}
          behavior='padding'
          style={{ flex: 1 }}
          keyboardVerticalOffset={70}
        >
          <ScrollView
            style={[style.content, { backgroundColor: '#fff', position: 'relative' }]}
            keyboardShouldPersistTaps='handled'
          >
            <View style={[style.header, global.flex, global.justifyContentSpaceBetween, global.alignItemsCenter]}>
              <TouchableOpacity style={style.headerLeft} onPress={() => this.props.navigation.navigate('Login')}>
                <Text style={[style.headerLeftTitle, global.fontStyle, global.fontSize14]}>关闭</Text>
              </TouchableOpacity>
              <Text style={[style.headerTitle, global.fontStyle, global.fontSize14]}>注册</Text>
              <Text style={style.headerLeft} />
            </View>
            <View style={style.logo}>
              <Image style={style.logoImg} source={gImg.common.logo} />
            </View>
            <View style={style.form}>
              <View
                style={[
                  style.formItem,
                  style.pickerItem,
                  global.flex,
                  global.justifyContentSpaceBetween,
                  global.alignItemsCenter,
                ]}
              >
                <Text style={style.formItemTitle}>地区</Text>
                <Picker
                  data={this.state.region}
                  style={style.picker}
                  value={this.state.cityId}
                  triggerType='onPress'
                  onChange={cityId => this.chooseCityId(cityId)}
                >
                  <TouchableOpacity
                    style={[style.pickerTitle, global.flex, global.justifyContentEnd, global.alignItemsCenter]}
                  >
                    <Text style={[style.topItemTitle, global.fontStyle, global.fontSize14]}>
                      {this.state.cityId.length === 0
                        ? '请选择'
                        : this.state.regionCidMapAreaName[this.state.cityId[2]]}
                    </Text>
                    <Icon name='right' style={[style.inputIcon, global.fontSize16]} />
                  </TouchableOpacity>
                </Picker>
              </View>
              <View
                style={[
                  style.formItem,
                  style.pickerItem,
                  global.flex,
                  global.justifyContentSpaceBetween,
                  global.alignItemsCenter,
                ]}
              >
                <Text style={style.formItemTitle}>医疗机构</Text>
                <TouchableOpacity
                  style={[style.hospital, global.flex, global.justifyContentSpaceBetween]}
                  onPress={() => {
                    if (this.state.cityId.length === 0) {
                      return Toast.info('请先选择地区', 3)
                    }
                    this.setState({
                      selectHospitalActive: true,
                    })
                  }}
                >
                  <Text style={[style.hospitalTitle, global.fontSize14, global.fontStyle]}>
                    {this.state.hospitalName === '' ? '请选择' : this.state.hospitalName}
                  </Text>
                  <Icon name='right' style={[style.inputIcon, global.fontSize16]} />
                </TouchableOpacity>
              </View>

              <View style={style.formItem}>
                <InputItem
                  clear
                  style={[style.input, global.fontStyle, global.fontSize14]}
                  value={this.state.name}
                  placeholder='姓名'
                  onChange={name => {
                    this.setState({ name })
                  }}
                />
              </View>
              <View style={style.formItem}>
                <InputItem
                  clear
                  style={[style.input, global.fontStyle, global.fontSize14]}
                  value={this.state.phone}
                  placeholder='手机号码'
                  type='number'
                  onChange={phone => {
                    this.setState({ phone })
                  }}
                />
              </View>
              <View style={style.formItem}>
                <InputItem
                  type='number'
                  style={[style.input, global.fontStyle, global.fontSize14]}
                  value={this.state.verificationCode}
                  placeholder='验证码'
                  onChange={verificationCode => {
                    this.setState({ verificationCode })
                  }}
                />
                <TouchableOpacity
                  style={style.getVerificationCodeBtn}
                  onPress={() => {
                    this.sendVerificationCode()
                  }}
                >
                  <Text
                    style={[
                      style.verificationCode,
                      global.fontStyle,
                      global.fontSize14,
                      {
                        backgroundColor:
                          this.state.verificationCodeMsg === '获取验证码' ? gColor.mainRed : gColor.colorCcc,
                      },
                    ]}
                  >
                    {this.state.verificationCodeMsg}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={style.formItem}>
                <InputItem
                  clear
                  style={[style.input, global.fontStyle, global.fontSize14]}
                  value={this.state.pwd}
                  type='password'
                  placeholder='密码'
                  onChange={pwd => {
                    this.setState({ pwd })
                  }}
                />
              </View>
              <View style={style.formItem}>
                <InputItem
                  clear
                  style={[style.input, global.fontStyle, global.fontSize14]}
                  value={this.state.rePwd}
                  type='password'
                  placeholder='确认密码'
                  onChange={rePwd => {
                    this.setState({ rePwd })
                  }}
                  onBlur={() => {
                    if (this.state.pwd !== this.state.rePwd) {
                      Toast.fail('两次密码不一致', 2)
                      this.setState({
                        rePwd: '',
                      })
                    }
                  }}
                />
              </View>
            </View>
            <View style={[style.agreement, global.flex, global.alignItemsCenter, { flexWrap: 'wrap' }]}>
              <AgreeItem
                checked={this.state.hasAgreeAgreement}
                checkboxStyle={{ color: gColor.mainRed }}
                onChange={(evt: any) => {
                  this.setState({ hasAgreeAgreement: Boolean(evt.target.checked) })
                }}
              >
                <Text style={[{ color: gColor.color888 }, global.fontStyle, global.fontSize14]}>注册即同意</Text>
              </AgreeItem>
              <View
                style={[
                  global.flex,
                  global.aCenter,
                  {
                    flex: 1,
                    alignItems: 'flex-start',
                    marginLeft: 30,
                    marginTop: 5,
                    marginBottom: 5,
                  },
                ]}
              >
                <TouchableOpacity
                  style={{
                    marginTop: 5,
                    marginBottom: 5,
                  }}
                  onPress={() => {
                    this.props.navigation.navigate('RegisterAgreement')
                  }}
                >
                  <Text style={[style.agreementName, global.fontStyle, global.fontSize14]}>医生注册协议</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    marginTop: 5,
                    marginBottom: 5,
                  }}
                  onPress={() => {
                    this.props.navigation.navigate('LawAgreement')
                  }}
                >
                  <Text style={[style.agreementName, global.fontStyle, global.fontSize14]}>法律声明与隐私政策</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={style.subBtn} onPress={this.submit}>
              <Text style={[style.subTitle, global.fontStyle, global.fontSize15]}>完成医生版注册</Text>
            </TouchableOpacity>
            {/* 医疗机构选择 */}
            <View style={this.state.selectHospitalActive ? style.hospitalSelect : global.hidden}>
              <ScrollView style={style.hospitalContent} keyboardShouldPersistTaps='handled'>
                <View
                  style={[style.hospitalAdd, global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}
                >
                  <Icon style={style.hospitalSearchIcon} name='search' />
                  <View style={style.hospitalSearch}>
                    <InputItem
                      clear
                      style={[style.hospitalInput, global.fontStyle, global.fontSize14]}
                      value={this.state.hospitalName}
                      placeholder='输入所在医疗机构'
                      onChange={hospitalName => {
                        this.setState({ hospitalName })
                      }}
                    />
                  </View>
                  <TouchableOpacity
                    style={style.closeBtn}
                    onPress={() => {
                      this.setState({
                        selectHospitalActive: false,
                        hospitalName: '',
                        hospitalId: 0,
                      })
                    }}
                  >
                    <Text style={[style.close, global.fontSize14, global.fontStyle]}>取消</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={[
                    this.state.hospitalName !== '' ? style.addHospital : global.hidden,
                    global.flex,
                    global.alignItemsCenter,
                    global.justifyContentCenter,
                  ]}
                  onPress={() => {
                    this.setState({
                      selectHospitalActive: false,
                    })
                  }}
                >
                  <Text style={[style.addHospitalBtn, global.fontSize14, global.fontStyle]}>添加</Text>
                  <Text numberOfLines={1} style={[style.addHospitalBtn, global.fontSize14, global.fontStyle]}>
                    {this.state.hospitalName}
                  </Text>
                </TouchableOpacity>
                <View style={style.hospitalList}>
                  {this.state.hospitalList.map((v: any, k: number) => {
                    return (
                      <TouchableOpacity
                        key={k}
                        onPress={() => {
                          this.setState({
                            hospitalId: v.id,
                            hospitalName: v.name,
                            selectHospitalActive: false,
                          })
                        }}
                      >
                        <Text style={style.hospitalItem}>{v.name}</Text>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </>
    )
  }
}
