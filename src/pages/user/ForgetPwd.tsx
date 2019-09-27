import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import gStyle from "@utils/style"
import React, { Component } from "react"
import { TouchableOpacity, View, Text } from "react-native"
import { InputItem, Toast, Icon } from "@ant-design/react-native"
import pathMap from "@routes/pathMap"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import global from "@/assets/styles/global"
import api from "@api/api"
const style = gStyle.user.forgetPwd
interface Props {
  navigation: any
}
interface State {
  saveInformation: boolean
  sendVerificationCode: boolean
  phone: string
  verificationCode: string
  pwd: string
  confirmPwd: string
  verificationCodeUuid: string
  verificationCodeMsg: string
}
interface TabsItem {
  title: string
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
export default class ForgetPwd extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  tabs: TabsItem[] = []
  constructor(props: any) {
    super(props)
    this.tabs = [{ title: "验证码登录" }, { title: "密码登录" }]
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      phone: "",
      saveInformation: false,
      sendVerificationCode: false,
      verificationCode: "",
      pwd: "",
      confirmPwd: "",
      verificationCodeMsg: "获取验证码",
      verificationCodeUuid: "",
    }
  }
  getVerificationCode = () => {
    if (this.state.phone === "") {
      return Toast.fail("请输入手机号码", 1)
    }
    if (!/^1[3456789]\d{9}$/.test(this.state.phone)) {
      return Toast.fail("请输入正确的手机号码", 1)
    }
    api
      .getLoginPhoneVerifyCode({ phone: this.state.phone })
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
  submit = () => {
    if (this.state.phone === "") {
      return Toast.fail("请输入手机号码", 2)
    }
    if (!/^1[3456789]\d{9}$/.test(this.state.phone)) {
      return Toast.fail("请输入正确的手机号码", 1)
    }
    if (this.state.verificationCodeUuid === "") {
      return Toast.fail("请获取验证码", 2)
    }
    if (this.state.verificationCode === "") {
      return Toast.fail("请输入验证码", 2)
    }
    if (this.state.pwd === "") {
      return Toast.fail("请输入6位以上新密码", 2)
    }
    if (this.state.pwd !== this.state.confirmPwd) {
      return Toast.fail("两次密码不一致", 2)
    }
    console.log({
      phone: this.state.phone,
      code: this.state.verificationCode,
      codeUuid: this.state.verificationCodeUuid,
      pwd: this.state.pwd,
    })
    // api.changePwd({
    //   phone: this.state.phone,
    //   code: this.state.verificationCode,
    //   codeUuid: this.state.verificationCodeUuid,
    //   pwd: this.state.pwd,
    // }).then(() => {
    //   Toast.success("修改密码成功", 1)
    // setTimeout(()=>{
    //   this.props.navigation.goBack();
    // },1000)
    // }).catch(err => {
    //   Toast.fail("修改密码失败: " + err.msg, 2)
    // })
  }
  comfirePwd = () => {
    let pwd = this.state.pwd,
      confirePwd = this.state.confirmPwd
    if (pwd !== confirePwd) {
      Toast.fail("两次密码不一致", 2)
    }
  }
  verificationPhone = () => {
    if (this.state.phone === "") {
      return Toast.fail("手机号码不能为空", 1)
    }
    if (!/^1[3456789]\d{9}$/.test(this.state.phone)) {
      return Toast.fail("手机号码格式不正确", 1)
    }
    try {
      // let isExitPhone = api.checkedPhoneIsExit({ phone: this.state.phone })
      // if (!isExitPhone) {
      //   return Toast.fail("手机号码不存在", 2)
      // }
    } catch (err) {
      console.log(err)
    }
  }
  render() {
    return (
      <View style={style.main}>
        <View
          style={[
            style.header,
            global.flex,
            global.justifyContentSpaceBetween,
            global.alignItemsCenter,
          ]}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icon name="left" style={[style.headerLeft, global.fontSize16]} />
          </TouchableOpacity>
          <Text style={style.headerCenter}>忘记密码</Text>
          <Text />
        </View>
        <View style={style.tabItem}>
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
                onBlur={this.verificationPhone}
              />
            </View>
            <View style={style.inputItem}>
              <InputItem
                type="number"
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
            <View style={style.inputItem}>
              <InputItem
                clear
                value={this.state.pwd}
                style={style.input}
                placeholder="6位以上新密码"
                type="password"
                onChange={value => {
                  this.setState({ pwd: value })
                }}
              />
            </View>
            <View style={style.inputItem}>
              <InputItem
                clear
                value={this.state.confirmPwd}
                style={style.input}
                placeholder="再次确认密码"
                type="password"
                onChange={value => {
                  this.setState({ confirmPwd: value })
                }}
                onBlur={this.comfirePwd}
              />
            </View>
          </View>
          <TouchableOpacity style={style.subBtn} onPress={this.submit}>
            <Text style={[style.subBtnName, global.fontStyle, global.fontSize18]}>提交</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
