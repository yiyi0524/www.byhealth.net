import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import gStyle from "@utils/style"
import storage from "@utils/storage"
import React, { Component } from "react"
import { TouchableOpacity, View, Text } from "react-native"
import { InputItem, Checkbox, Toast } from "@ant-design/react-native"
import pathMap from "@routes/pathMap"
// import { LocalStorage as storage } from "jsbdk";
import { connect } from "react-redux"
import { Dispatch } from "redux"
import global from "@/assets/styles/global"
import api from "@api/api"
import { NavigationScreenProp } from "react-navigation"
import { DeviceEventEmitter } from "react-native"

const style = gStyle.user.login
interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  saveInformation: boolean
  sendVerificationCode: boolean
  verificationCodePhone: string
  verificationCode: string
  phone: string
  pwd: string
  verificationCodeUuid: string
  verificationCodeMsg: string
  selectLoginStyle: string
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
export default class Login extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      verificationCodePhone: "",
      saveInformation: false,
      sendVerificationCode: false,
      verificationCode: "",
      phone: "",
      pwd: "",
      verificationCodeMsg: "获取验证码",
      verificationCodeUuid: "",
      selectLoginStyle: "verificationCodeLogin",
    }
  }
  getVerificationCode = () => {
    if (this.state.verificationCodePhone === "") {
      return Toast.fail("请输入手机号码", 1)
    }
    if (!/^1[3456789]\d{9}$/.test(this.state.verificationCodePhone)) {
      return Toast.fail("请输入正确的手机号码", 1)
    }
    api
      .getLoginPhoneVerifyCode({ phone: this.state.verificationCodePhone })
      .then(json => {
        Toast.info("发送成功", 1)
        let timeout = 60
        this.setState({
          verificationCodeMsg: timeout-- + "秒后重新发送",
        })
        let timer = setInterval(_ => {
          this.setState({
            verificationCodeMsg: timeout-- + "秒后重新发送",
          })
        }, 1000)
        this.setState({
          verificationCodeUuid: json.data.uuid,
        })
        setTimeout(_ => {
          clearInterval(timer)
          this.setState({
            verificationCodeMsg: "获取验证码",
          })
        }, timeout * 1000)
      })
      .catch(err => {
        Toast.info("发送失败 错误信息: " + err.msg, 1)
      })
  }
  verificationCodeLogin = () => {
    if (this.state.verificationCode === "") {
      return Toast.fail("请输入手机号码", 2)
    }
    if (!/^1[3456789]\d{9}$/.test(this.state.verificationCodePhone)) {
      return Toast.fail("请输入正确的手机号码", 1)
    }
    if (this.state.verificationCodeUuid === "") {
      return Toast.fail("请获取验证码", 2)
    }
    if (this.state.verificationCode === "") {
      return Toast.fail("请输入验证码", 2)
    }
    api
      .phoneLogin({
        phone: this.state.verificationCodePhone,
        code: this.state.verificationCode,
        codeUuid: this.state.verificationCodeUuid,
      })
      .then((json: any) => {
        Toast.success("登录成功", 1, () => {
          this.props.navigation.navigate(pathMap.Home)
          // 登录成功之后,刷新某个页面 (pathMap.Home:为某页面路由名字)
          storage.set("session", json.data.appSession as string, 3 * 60 * 24)
          DeviceEventEmitter.emit(pathMap.Home + "Reload", null)
          DeviceEventEmitter.emit(pathMap.PersonalCenter + "Reload", null)
          DeviceEventEmitter.emit(pathMap.AddressBookIndex + "Reload", null)
          DeviceEventEmitter.emit(pathMap.AdvisoryIndex + "Reload", null)
        })
      })
      .catch(err => {
        Toast.fail("登录失败: " + err.msg, 2)
      })
  }
  pwdLogin = () => {
    if (this.state.phone === "") {
      return Toast.fail("请输入手机号码", 2)
    }
    if (!/^1[3456789]\d{9}$/.test(this.state.phone)) {
      return Toast.fail("请输入正确的手机号码", 1)
    }
    if (this.state.pwd === "") {
      return Toast.fail("请输入密码", 2)
    }
    console.log({
      account: this.state.phone,
      pwd: this.state.pwd,
      saveInformation: this.state.saveInformation,
    })
    api
      .accountLogin({
        account: this.state.phone,
        pwd: this.state.pwd,
      })
      .then((json: any) => {
        Toast.success("登录成功", 1, () => {
          this.props.navigation.navigate(pathMap.Home)
          // 登录成功之后,刷新某个页面 (pathMap.Home:为某页面路由名字)
          storage.set("session", json.data.appSession as string, 3 * 60 * 24)
          DeviceEventEmitter.emit(pathMap.Home + "Reload", null)
          DeviceEventEmitter.emit(pathMap.PersonalCenter + "Reload", null)
          DeviceEventEmitter.emit(pathMap.AddressBookIndex + "Reload", null)
          DeviceEventEmitter.emit(pathMap.AdvisoryIndex + "Reload", null)
        })
      })
      .catch(err => {
        Toast.fail("登录失败: " + err.msg, 2)
      })
  }
  render() {
    return (
      <View style={style.main}>
        <View style={[style.tabs]}>
          <View
            style={[
              style.header,
              global.flex,
              global.alignItemsCenter,
              global.justifyContentSpaceAround,
            ]}>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  selectLoginStyle: "verificationCodeLogin",
                })
              }}>
              <Text
                style={[
                  this.state.selectLoginStyle === "verificationCodeLogin"
                    ? style.activeTitle
                    : style.title,
                  global.fontSize14,
                ]}>
                验证码登录
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  selectLoginStyle: "pwdLogin",
                })
              }}>
              <Text
                style={[
                  this.state.selectLoginStyle === "pwdLogin" ? style.activeTitle : style.title,
                  global.fontSize14,
                ]}>
                密码登录
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={
              this.state.selectLoginStyle === "verificationCodeLogin"
                ? style.tabItem
                : global.hidden
            }>
            <View style={style.inputList}>
              <View style={style.inputItem}>
                <InputItem
                  clear
                  value={this.state.verificationCodePhone}
                  style={style.input}
                  placeholder="手机号码"
                  type="number"
                  onChange={value => {
                    this.setState({ verificationCodePhone: value })
                  }}
                />
              </View>
              <View style={style.inputItem}>
                <InputItem
                  value={this.state.verificationCode}
                  style={style.input}
                  placeholder="验证码"
                  onChange={value => {
                    this.setState({ verificationCode: value })
                  }}
                />
                <TouchableOpacity style={style.verificationBtn} onPress={this.getVerificationCode}>
                  <Text style={[style.verificationCode, global.fontSize14, global.fontStyle]}>
                    {this.state.verificationCodeMsg}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={style.register}
              onPress={() => this.props.navigation.navigate(pathMap.Register)}>
              <Text style={[style.registerTitle, global.fontStyle, global.fontSize14]}>
                我要注册
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.subBtn} onPress={this.verificationCodeLogin}>
              <Text style={[style.subBtnName, global.fontStyle, global.fontSize18]}>
                登录医生版
              </Text>
            </TouchableOpacity>
          </View>
          {/* 密码登录 */}
          <View style={this.state.selectLoginStyle === "pwdLogin" ? style.tabItem : global.hidden}>
            <View style={style.inputList}>
              <View style={style.inputItem}>
                <InputItem
                  clear
                  value={this.state.phone}
                  style={style.input}
                  placeholder="手机号码"
                  type="number"
                  onChange={value => {
                    this.setState({ phone: value })
                  }}
                />
              </View>
              <View style={style.inputItem}>
                <InputItem
                  value={this.state.pwd}
                  style={style.input}
                  placeholder="密码"
                  type="password"
                  onChange={value => {
                    this.setState({ pwd: value })
                  }}
                />
                <TouchableOpacity
                  style={style.verificationBtn}
                  onPress={() => {
                    this.props.navigation.navigate(pathMap.ForgetPwd)
                  }}>
                  <Text style={[style.forgetPwd, global.fontSize14, global.fontStyle]}>
                    忘记密码?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={[
                style.savePwd,
                global.flex,
                global.justifyContentSpaceBetween,
                global.alignItemsCenter,
              ]}>
              <TouchableOpacity>
                <Checkbox
                  checked={this.state.saveInformation}
                  onChange={event => {
                    this.setState({ saveInformation: event.target.checked })
                  }}>
                  保存账户信息
                </Checkbox>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.navigate(pathMap.Register)}>
                <Text style={[style.savePwdTitle, global.fontStyle, global.fontSize14]}>
                  我要注册
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={style.subBtn} onPress={this.pwdLogin}>
              <Text style={[style.subBtnName, global.fontStyle, global.fontSize18]}>
                登录医生版
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}
