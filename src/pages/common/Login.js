import React, { Component, } from 'react';
import {
  View, Text, PixelRatio, StyleSheet, Image,
  TouchableOpacity, ScrollView, Dimensions,
  DeviceEventEmitter,
} from "react-native";
import { InputItem, List, Toast, } from "antd-mobile-rn";
import LinearGradient from "react-native-linear-gradient";
import pathMap from '../../routes/pathMap';
import styles from '../../styles/common/login';
import storage from '../../utils/storage';
import api from '../../utils/api';
import Buff from '../../utils/Buff';
import { windowWidth, trim, } from '../../utils/utils';

const LOGIN_WAY = {
  ACCOUNT: 0x0,
  PHONE: 0x1,
};
export default class Login extends Component {
  static navigationOptions = {
    title: '登录',
    headerStyle: {
      backgroundColor: '#f53f68',
      height: 45,
      elevation: 0,
      borderBottomColor: "#f53f68",
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      textAlign: 'center',
    },
    headerRight: (
      <TouchableOpacity>
        <Text style={{ color: '#fff', marginRight: 15, }}></Text>
      </TouchableOpacity>
    ),
  };
  constructor(props) {
    super(props);
    this.state = {
      loginWay: LOGIN_WAY.ACCOUNT,//0位密码账号注册,1:手机号码注册
      password: "",
      account: "",//用户名或手机号
      phone: "",//手机号
      code: "",//验证码
      phoneVerifyCodeUuid: '',//手机验证码uuid
      getVerifyCodeTips: '获取验证码',
    }
  }
  login = _ => {
    console.log("login ...")
    const { navigation } = this.props;
    if (this.state.loginWay === LOGIN_WAY.ACCOUNT) {
      if (this.state.account === '') {
        return Toast.info("请输入用户名或手机号", 1.5);
      } else if (this.state.password === '') {
        return Toast.info("请输入密码", 1.5);
      }
      Toast.loading("登录中", 0, null, true)
      api.accountLogin(this.state.account, this.state.password).then(json => {
        let appSession = json.data.app_session;
        (async _ => {
          await storage.set("session", appSession, new Date(new Date().getTime() + 30 * 1000 * 60 * 60 * 24));
          Toast.hide();
          api.updateGetuiCid(await Buff.getGetuiCid('1')).then(_ => {
            console.log("更新个推cid成功");
          }).catch(err => {
            // Toast.fail("推送服务初始化失败,错误信息: " + err.msg, 1);
          })
          Toast.info("登录成功", 1, _ => {
            DeviceEventEmitter.emit(pathMap.Home + 'Reload', null);
            DeviceEventEmitter.emit(pathMap.PersonCenter + 'Reload', null);
            navigation.goBack();
          }, true);
        })()
      }).catch(err => {
        console.log(err)
        Toast.hide();
        Toast.info("登录失败 ,错误信息: " + err.msg, 1.5, null, true);
      })

    } else {
      if (this.state.phone === '') {
        return Toast.info("请输入手机号", 1);
      } else if (this.state.phoneVerifyCodeUuid === '') {
        return Toast.info("请先获取手机验证码", 1);
      } else if (this.state.code === '') {
        return Toast.info("请输入验证码", 1);
      }
      Toast.loading("登录中", 0, null, true)
      api.phoneLogin(this.state.phone, this.state.code, this.state.phoneVerifyCodeUuid).then(json => {
        let appSession = json.data.app_session;
        (async _ => {
          await storage.set("session", appSession, new Date(new Date().getTime() + 30 * 1000 * 60 * 60 * 24));
          Toast.hide();
          api.updateGetuiCid(await Buff.getGetuiCid('1')).then(_ => {
            console.log("更新个推cid成功");
          }).catch(err => {
            // Toast.fail("推送服务初始化失败,错误信息: " + err.msg, 1);
          })
          Toast.info("登录成功", 1, _ => {
            DeviceEventEmitter.emit(pathMap.Home + 'Reload', null);
            DeviceEventEmitter.emit(pathMap.PersonCenter + 'Reload', null);
            navigation.goBack();
          }, true);
        })()
      }).catch(err => {
        console.log(err)
        Toast.hide();
        Toast.info("登录失败 ,错误信息: " + err.msg, 1.5, null, true);
      })
    }
  }
  componentDidMount() {
    let that = this;
    const { navigation } = this.props;
    (async _ => {
      let session = await storage.get('session');
      if (session) {
        if (await api.isLogin()) {
          navigation.goBack(pathMap.Home);
        } else {
          await storage.remove("session")
        }
      }
    })()

  }
  render() {
    const { navigation } = this.props;
    return (
      <ScrollView>
        <View style={[styles.banner, { height: windowWidth / 750 * 452 }]}>
          <Image style={styles.bannerImg} source={require('../../images/common/register_banner.jpg')}></Image>
        </View>
        <View style={styles.registerSelect}>
          <TouchableOpacity
            style={styles.registerSelectTitleBox}
            onPress={() => { this.setState({ loginWay: LOGIN_WAY.ACCOUNT, }) }}
          >
            <Text style={this.state.loginWay == LOGIN_WAY.ACCOUNT ?
              [styles.registerSelectTitle, styles.registerSelecActive] : styles.registerSelectTitle
            }>账号密码登录</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.registerSelectTitleBox}
            onPress={() => { this.setState({ loginWay: LOGIN_WAY.PHONE, }) }}
          >
            <Text style={this.state.loginWay == LOGIN_WAY.PHONE ?
              [styles.registerSelectTitle, styles.registerSelecActive] : styles.registerSelectTitle
            }>手机验证码登录</Text>
          </TouchableOpacity>
        </View>
        <View style={this.state.loginWay === LOGIN_WAY.ACCOUNT ? null : styles.hidden}>
          <View style={styles.inputBox}>
            <Image style={styles.inputBoxImg} source={require("../../images/common/user.png")}></Image>
            <InputItem
              clear
              value={this.state.account}
              onChange={val => {
                this.setState({
                  account: trim(val),
                });
              }}
              style={styles.InputItem}
              placeholder="请输入账号或手机号"
            >
            </InputItem>
          </View>
          <View style={styles.inputBox}>
            <Image style={styles.inputBoxImg} source={require("../../images/common/password.png")}></Image>
            <InputItem
              clear
              type="password"
              value={this.state.password}
              onChange={val => {
                this.setState({
                  password: trim(val),
                });
              }}
              style={styles.InputItem}
              placeholder="请输入密码"
            >
            </InputItem>
          </View>
        </View>
        <View style={this.state.loginWay === LOGIN_WAY.PHONE ? null : styles.hidden}>
          <View style={styles.inputBox}>
            <Image style={styles.inputBoxImg} source={require("../../images/common/user.png")}></Image>
            <InputItem
              clear
              value={this.state.phone}
              onChange={val => {
                this.setState({
                  phone: trim(val),
                });
              }}
              style={styles.InputItem}
              placeholder="请输入手机号码"
            >
            </InputItem>
          </View>
          <View style={styles.inputBox}>
            <Image style={styles.inputBoxImg} source={require("../../images/common/password.png")}></Image>
            <InputItem
              clear
              value={this.state.code}
              onChange={val => {
                this.setState({
                  code: trim(val),
                });
              }}
              style={styles.InputItem}
              placeholder="请输入验证码"
            >
            </InputItem>
            <LinearGradient
              colors={['#f53f68', '#e92b32']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.codeBox}
            >
              <TouchableOpacity onPress={_ => {
                if (this.state.getVerifyCodeTips === '获取验证码') {
                  this.getLoginVerifyCode();
                }
              }}>
                <Text style={styles.codeTitle}>{this.state.getVerifyCodeTips}</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

        </View>
        <LinearGradient
          colors={['#f53f68', '#e92b32']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.btn}
        >
          <TouchableOpacity onPress={this.login}>
            <Text style={styles.btnTitle}>登录</Text>
          </TouchableOpacity>
        </LinearGradient>
        <View style={styles.bottom}>
          <TouchableOpacity onPress={() => { navigation.push(pathMap.ForgetPassword) }}>
            <Text style={styles.bottomTitle}>忘记密码 ?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { navigation.push(pathMap.Register) }}>
            <Text style={styles.bottomTitle}>新用户注册</Text>
          </TouchableOpacity>
        </View>
      </ScrollView >
    );

  }
  getLoginVerifyCode = _ => {
    if (!/^1[3456789]\d{9}$/.test(this.state.phone)) {
      return Toast.fail('请输入正确的手机号码', 1)
    }
    api.getLoginVerifyCode({ phone: this.state.phone }).then(json => {
      Toast.info('发送成功', 1, null, true)
      let timeout = 60;
      this.setState({
        getVerifyCodeTips: timeout-- + '秒后重新发送'
      })
      let timer = setInterval(_ => {
        this.setState({
          getVerifyCodeTips: timeout-- + '秒后重新发送'
        })
      }, 1000)
      console.log(json.data.uuid)
      this.setState({
        phoneVerifyCodeUuid: json.data.uuid,
      })
      setTimeout(_ => {
        clearInterval(timer)
        this.setState({
          getVerifyCodeTips: '获取验证码'
        })
      }, timeout * 1000);
    }).catch(err => {
      Toast.info('发送失败 错误信息: ' + err.msg, 1);
    })
  }
}
