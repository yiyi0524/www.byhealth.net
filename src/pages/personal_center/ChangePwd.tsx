import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import { InputItem, Toast } from "@ant-design/react-native"
import sColor from "@styles/color"
import gStyle from "@utils/style"
import React, { Component } from "react"
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  PixelRatio,
  Image,
} from "react-native"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import api from "@/services/api"
import userApi from "@/services/user"
import gImg from "@utils/img"
const style = gStyle.personalCenter.changePwd
const global = gStyle.global
interface Props {
  navigation: any
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  phone: string
  verificationUuid: string
  verificationCode: string
  verificationMsg: string
  pwd: string
  rePwd: string
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
export default class ChangePwd extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = () => {
    return {
      title: "重新设置密码",
      headerStyle: {
        backgroundColor: sColor.white,
        height: 45,
        elevation: 0,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: sColor.colorDdd,
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
    }
  }
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      phone: "",
      verificationUuid: "",
      verificationCode: "",
      verificationMsg: "获取验证码",
      pwd: "",
      rePwd: "",
    }
  }
  async componentDidMount() {
    await this.init()
  }
  init = async () => {
    try {
      let { data } = await userApi.getPersonalInfo()
      let phone = data.info.phone
      this.setState({
        phone,
      })
    } catch (err) {
      console.log(err.msg)
    }
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
  sendVerificationCode = () => {
    api
      .getmodifyPwdWithPhoneCode({ phone: this.state.phone })
      .then(json => {
        Toast.info("发送成功", 1)
        let timeout = 60
        this.setState({
          verificationMsg: timeout-- + "秒后重新发送",
        })
        let timer = setInterval(() => {
          this.setState({
            verificationMsg: timeout-- + "秒后重新发送",
          })
        }, 1000)
        this.setState({
          verificationMsg: json.data.uuid,
        })
        setTimeout(() => {
          clearInterval(timer)
          this.setState({
            verificationMsg: "获取验证码",
          })
        }, timeout * 1000)
      })
      .catch(err => {
        console.log(err)
        Toast.info("发送失败 错误信息: " + err.msg, 3)
      })
  }
  comfirePwd = () => {
    if (this.state.pwd !== this.state.rePwd) {
      Toast.fail("两次密码不一致", 3)
    }
  }
  submit = () => {
    if (this.state.verificationUuid === "") {
      return Toast.info("请获取验证码", 3)
    }
    if (this.state.verificationCode === "") {
      return Toast.info("请输入验证码", 3)
    }
    if (this.state.pwd === "") {
      return Toast.info("请输入新密码", 3)
    }
    if (this.state.rePwd === "") {
      return Toast.info("再次输入密码", 3)
    }
    if (this.state.rePwd !== this.state.pwd) {
      return Toast.info("两次密码不一致", 3)
    }
    let phone = this.state.phone,
      uuid = this.state.verificationUuid,
      code = this.state.verificationCode,
      pwd = this.state.pwd,
      rePwd = this.state.rePwd
    api
      .modifyPwdWithPhoneCode({ phone, uuid, code, pwd, rePwd })
      .then(() => {
        Toast.success("修改成功", 2)
      })
      .catch(err => {
        Toast.fail("修改失败, 错误信息: " + err.msg, 3)
      })
  }
  render() {
    if (!this.state.hasLoad) {
      return (
        <View style={style.loading}>
          <View style={style.loadingPic}>
            <Image style={style.loadingImg} source={gImg.common.loading} />
          </View>
          <Text style={[style.loadingTitle, global.fontSize14, global.fontStyle]}>加载中...</Text>
        </View>
      )
    }
    return (
      <>
        <ScrollView
          style={style.main}
          keyboardShouldPersistTaps="always"
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }>
          <View style={style.list}>
            <View style={style.item}>
              <InputItem
                value={this.state.phone}
                editable={false}
                placeholder="手机号"
                style={style.input}
              />
            </View>
            <View style={style.item}>
              <InputItem
                clear
                value={this.state.verificationCode}
                onChange={verificationCode => {
                  this.setState({
                    verificationCode,
                  })
                }}
                placeholder="验证码"
                style={style.input}
              />
              <TouchableOpacity style={style.verification} onPress={this.sendVerificationCode}>
                <Text style={[style.verificationTitle, global.fontSize12]}>
                  {this.state.verificationMsg}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={style.item}>
              <InputItem
                clear
                value={this.state.pwd}
                placeholder="6位以上新密码"
                style={style.input}
                onChange={pwd => {
                  this.setState({
                    pwd,
                  })
                }}
              />
            </View>
            <View style={style.item}>
              <InputItem
                clear
                value={this.state.rePwd}
                placeholder="再次输入密码"
                style={style.input}
                onChange={rePwd => {
                  this.setState({
                    rePwd,
                  })
                }}
                onBlur={this.comfirePwd}
              />
            </View>
            <TouchableOpacity onPress={this.submit}>
              <Text style={[style.btn, global.fontSize14]}>登录</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </>
    )
  }
}
