import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, Alert } from "react-native";
import { InputItem, Toast } from "antd-mobile-rn";
import LinearGradient from "react-native-linear-gradient";
import pathMap from '../../routes/pathMap';
import styles from "../../styles/common/Register";
import { register, getVerifyCode } from "../../utils/api";

const { width, height } = Dimensions.get('window');
class Register extends Component {
  static navigationOptions = {
    title: '注册',
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
      account: "",
      password: "",
      rePassword: "",
      phone: "",
      verifyCode: "",
      agree: true,//同意用户使用规则
      getVerifyCodeTips: '获取验证码',
      verifyCodeUuid: '',
    }
  }
  register = async _ => {
    const { navigation } = this.props;
    if (!this.state.agree) {
      return Toast.fail("您未同意用户使用规则", 1)
    }
    if (!this.state.account) {
      return Toast.fail("请输入用户名", 1)
    }
    if (!this.state.password) {
      return Toast.fail("请输入密码", 1)
    }
    if (!this.state.rePassword) {
      return Toast.fail("请确认密码", 1)
    }
    if (this.state.password !== this.state.rePassword) {
      return Toast.fail("两次密码不一致", 1)
    }
    if (!this.state.phone) {
      return Toast.fail("请输入手机号", 1)
    }
    if (!this.state.verifyCode) {
      return Toast.fail("请输入验证码", 1)
    }
    Toast.loading('注册中', 0, null, true)
    Promise.all([register({
      account: this.state.account,
      pwd: this.state.password,
      verifyCode: this.state.verifyCode,
      phone: this.state.phone,
      verifyCodeUuid: this.state.verifyCodeUuid,
    }), new Promise(s => setTimeout(s, 300))]).then(_ => {
      Toast.hide();
      Toast.info('注册成功', 1, _ => {
        navigation.navigate(pathMap.Home);
      }, true)
    }).catch(err => {
      Toast.hide();
      Toast.fail('注册失败,错误信息: ' + err.msg, 1);
    })
  }
  getVerifyCode = _ => {
    if (!/^1[3456789]\d{9}$/.test(this.state.phone)) {
      return Toast.fail('请输入正确的手机号码', 1)
    }
    getVerifyCode({ phone: this.state.phone }).then(json => {
      Toast.info('发送成功', 1, _ => {
      }, true)
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
        verifyCodeUuid: json.data.uuid,
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
  render() {
    const { navigation } = this.props;
    return (
      <ScrollView style={styles.main} >
        <View style={styles.banner}>
          <Image style={styles.bannerImg} source={require("../../images/common/register_banner.jpg")}></Image>
        </View>
        <View style={styles.registerSelect}>
          <Text style={styles.registerSelectTitle}>注册用户</Text>
        </View>
        <View>
          <View style={styles.inputBox}>
            <Image style={styles.inputBoxImg} source={require("../../images/common/user.png")}></Image>
            <InputItem clear value={this.state.account} onChange={(value) => {
              this.setState({
                account: value,
              });
            }} style={styles.InputItem} placeholder="请输入账号" >
            </InputItem>
          </View>
          <View style={styles.inputBox}>
            <Image style={styles.inputBoxImg} source={require("../../images/common/password.png")}></Image>
            <InputItem
              clear
              value={this.state.password}
              onChange={(value) => {
                this.setState({
                  password: value,
                });
              }}
              style={styles.InputItem}
              placeholder="请输入密码"
              type="password"
            >
            </InputItem>
          </View>
          <View style={styles.inputBox}>
            <Image style={styles.inputBoxImg} source={require("../../images/common/password.png")}></Image>
            <InputItem
              clear
              value={this.state.rePassword}
              onChange={(value) => {
                this.setState({
                  rePassword: value,
                });
              }}
              style={styles.InputItem}
              placeholder="请确认新密码"
              type="password"
            >
            </InputItem>
          </View>
          <View style={styles.inputBox}>
            <Image style={styles.inputBoxImg} source={require("../../images/common/password.png")}></Image>
            <InputItem
              clear
              value={this.state.phone}
              onChange={(value) => {
                this.setState({
                  phone: value,
                });
              }}
              style={styles.InputItem}
              placeholder="请输入手机号"
            >
            </InputItem>
          </View>
          <View style={styles.inputBox}>
            <Image style={styles.inputBoxImg} source={require("../../images/common/password.png")}></Image>
            <InputItem
              clear
              value={this.state.verifyCode}
              onChange={(value) => {
                this.setState({
                  verifyCode: value,
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
                  this.getVerifyCode();
                }
              }}>
                <Text style={styles.codeTitle}>{this.state.getVerifyCodeTips}</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
        <TouchableOpacity
          style={styles.agree}
          onPress={_ => {
            this.setState({
              agree: !this.state.agree,
            })
          }}
        >
          <View>
            <Image style={styles.agreeImg} source={this.state.agree ?
              require("../../images/personalCenter/select_active.png") :
              require("../../images/personalCenter/select.png")
            }
            ></Image>
          </View>
          <Text style={styles.agreeTtitle}>
            我已阅读且同意遵守
                        <Text onPress={_ => navigation.navigate(pathMap.RegisterManual)}>《用户注册协议》</Text>
          </Text>
        </TouchableOpacity>
        <LinearGradient
          colors={['#f53f68', '#e92b32']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.btn}
        >
          <TouchableOpacity onPress={this.register}>
            <Text style={styles.btnTitle}>注册</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    );
  }
}


export default Register;
