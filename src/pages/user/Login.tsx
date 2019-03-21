import * as userAction from "@/redux/actions/user";
import { AppState } from "@/redux/stores/store";
import gStyle from "@utils/style";
import React, { Component } from "react";
import {
  TouchableOpacity, View, Text,
} from "react-native";
import {
  Tabs, InputItem, Checkbox, Toast,
} from '@ant-design/react-native';
import pathMap from "@routes/pathMap";
import sColor from "@styles/color";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import global from "@/assets/styles/global";
import api from "@api/api";
const style = gStyle.user.login;
interface Props {
  navigation: any,
}
interface State {
  saveInformation: boolean,
  sendVerificationCode: boolean,
  verificationCodePhone: string,
  verificationCode: string,
  phone: string,
  pwd: string,
  verificationCodeUuid: string,
  verificationCodeMsg: string,
}
interface TabsItem {
  title: string,
}
const mapStateToProps = (state: AppState) => {
  return {
    isLogin: state.user.isLogin,
    name: state.user.name,
    uid: state.user.uid,
  };
};
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    login: (preload: userAction.UserInfo) => {
      dispatch(userAction.userLogin(preload));
    },
  };
};
@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class Login extends Component<
Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
State> {
  tabs: TabsItem[] = [];
  constructor(props: any) {
    super(props);
    this.tabs = [
      { title: '验证码登录' },
      { title: '密码登录' },
    ];
    this.state = this.getInitState();
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
    };
  }
  getVerificationCode = () => {
    if (this.state.verificationCodePhone === "") {
      return Toast.fail('请输入手机号码', 1)
    }
    if (!/^1[3456789]\d{9}$/.test(this.state.verificationCodePhone)) {
      return Toast.fail('请输入正确的手机号码', 1)
    }
    api.getLoginPhoneVerifyCode({ phone: this.state.verificationCodePhone }).then(json => {
      Toast.info('发送成功', 1)
      let timeout = 60;
      this.setState({
        verificationCodeMsg: timeout-- + '秒后重新发送'
      })
      let timer = setInterval(_ => {
        this.setState({
          verificationCodeMsg: timeout-- + '秒后重新发送'
        })
      }, 1000)
      this.setState({
        verificationCodeUuid: json.data.uuid,
      })
      setTimeout(_ => {
        clearInterval(timer)
        this.setState({
          verificationCodeMsg: '获取验证码'
        })
      }, timeout * 1000);
    }).catch(err => {
      Toast.info('发送失败 错误信息: ' + err.msg, 1);
    })
  }
  verificationCodeLogin = () => {
    if (this.state.verificationCode === "") {
      return Toast.fail("请输入手机号码", 2)
    }
    if (!/^1[3456789]\d{9}$/.test(this.state.verificationCodePhone)) {
      return Toast.fail('请输入正确的手机号码', 1)
    }
    if (this.state.verificationCodeUuid === "") {
      return Toast.fail("请获取验证码", 2)
    }
    if (this.state.verificationCode === "") {
      return Toast.fail("请输入验证码", 2)
    }
    console.log({
      phone: this.state.verificationCodePhone,
      code: this.state.verificationCode,
      codeUuid: this.state.verificationCodeUuid,
    })
    api.phoneLogin({
      phone: this.state.verificationCodePhone,
      code: this.state.verificationCode,
      codeUuid: this.state.verificationCodeUuid,
    }).then(() => {
      Toast.success("登录成功", 1)
    }).catch(err => {
      Toast.fail("登录失败: " + err.msg, 2)
    })
  }
  pwdLogin = () => {
    if (this.state.phone === "") {
      return Toast.fail("请输入手机号码", 2)
    }
    if (!/^1[3456789]\d{9}$/.test(this.state.phone)) {
      return Toast.fail('请输入正确的手机号码', 1)
    }
    if (this.state.pwd === "") {
      return Toast.fail("请输入密码", 2)
    }
    console.log({
      account: this.state.phone,
      pwd: this.state.pwd,
      saveInformation: this.state.saveInformation,
    })
    api.accountLogin({
      account: this.state.phone,
      pwd: this.state.pwd,
    }).then(() => {
      Toast.success("登录成功", 1)
    }).catch(err => {
      Toast.fail("登录失败: " + err.msg, 2)
    })
  }
  render() {
    return (
      <View style={style.main}>
        <Tabs tabs={this.tabs} style={style.tabs} animated={false}
          tabBarActiveTextColor={sColor.mainRed}
          tabBarUnderlineStyle={style.tabBarUnderlineStyle}
        >
          <View style={style.tabItem}>
            <View style={style.inputList}>
              <View style={style.inputItem}>
                <InputItem clear value={this.state.verificationCodePhone}
                  style={style.input} placeholder="手机号码" type="digit"
                  onChange={value => {
                    this.setState({ verificationCodePhone: value, });
                  }}
                />
              </View>
              <View style={style.inputItem}>
                <InputItem value={this.state.verificationCode}
                  style={style.input} placeholder="验证码"
                  onChange={value => {
                    this.setState({ verificationCode: value, });
                  }}
                />
                <TouchableOpacity style={style.verificationBtn}
                  onPress={this.getVerificationCode}>
                  <Text style={[style.verificationCode, global.fontSize14, global.fontStyle]}>
                    {this.state.verificationCodeMsg}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={style.register} onPress={() =>
              this.props.navigation.navigate(pathMap.Register)}>
              <Text style={[style.registerTitle, global.fontStyle, global.fontSize14]}>
                我要注册</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.subBtn} onPress={this.verificationCodeLogin}>
              <Text style={[style.subBtnName, global.fontStyle, global.fontSize18]}>
                登录医生版</Text>
            </TouchableOpacity>
          </View>
          {/* 密码登录 */}
          <View style={style.tabItem}>
            <View style={style.inputList}>
              <View style={style.inputItem}>
                <InputItem clear value={this.state.phone}
                  style={style.input} placeholder="手机号码" type="digit"
                  onChange={value => {
                    this.setState({ phone: value, });
                  }}
                />
              </View>
              <View style={style.inputItem}>
                <InputItem value={this.state.pwd}
                  style={style.input} placeholder="密码" type="password"
                  onChange={value => {
                    this.setState({ pwd: value, });
                  }}
                />
                <TouchableOpacity style={style.verificationBtn}>
                  <Text style={[style.forgetPwd, global.fontSize14, global.fontStyle]}>
                    忘记密码?</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[style.savePwd, global.flex, global.justifyContentSpaceBetween,
            global.alignItemsCenter]}>
              <TouchableOpacity>
                <Checkbox checked={this.state.saveInformation}
                  onChange={event => {
                    this.setState({ saveInformation: event.target.checked });
                  }}
                >保存账户信息</Checkbox>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.navigate(pathMap.Register)}>
                <Text style={[style.savePwdTitle, global.fontStyle, global.fontSize14]}>
                  我要注册</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={style.subBtn} onPress={this.pwdLogin}>
              <Text style={[style.subBtnName, global.fontStyle, global.fontSize18]}>
                登录医生版</Text>
            </TouchableOpacity>
          </View>
        </Tabs>
      </View>
    );
  }
}
