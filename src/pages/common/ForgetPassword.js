import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, Alert } from "react-native";
import { InputItem, List, Toast, } from "antd-mobile-rn";
import LinearGradient from "react-native-linear-gradient";
import pathMap from '../../routes/pathMap';
import styles from "../../styles/common/ForgetPassword";
import api from "../../utils/api";

var { width, height } = Dimensions.get('window');
class Register extends Component {
    static navigationOptions = {
        title: '忘记密码',
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
            phone: "",
            code: "",
            verifyCodeUuid: "",
            getVerifyCodeTips: '获取验证码',
        }
    }
    sendMsg = () => {

    }
    componentDidMount() {
        this.init();
    }
    init = async  _ => {
    }
    getForgetPwdVerifyCode = _ => {
        if (!/^1[3456789]\d{9}$/.test(this.state.phone)) {
            return Toast.fail('请输入正确的手机号码', 1)
        }
        api.getForgetPwdVerifyCode({ phone: this.state.phone }).then(json => {
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
        return (
            <ScrollView style={styles.main}>
                <View style={styles.banner}>
                    <Image style={styles.bannerImg} source={require("../../images/common/register_banner.jpg")}></Image>
                </View>
                <View style={styles.registerSelect}>
                    <Text style={styles.registerSelectTitle}>忘记密码</Text>
                </View>
                <View>
                    <View style={styles.inputBox}>
                        <Image style={styles.inputBoxImg} source={require("../../images/common/password.png")}></Image>
                        <InputItem
                            clear value={this.state.phone}
                            onChange={val => { this.setState({ phone: val, }) }}
                            style={styles.InputItem} placeholder="请输入手机号"
                        ></InputItem>
                    </View>
                    <View style={styles.inputBox}>
                        <Image style={styles.inputBoxImg} source={require("../../images/common/password.png")}></Image>
                        <InputItem
                            clear value={this.state.code}
                            onChange={val => { this.setState({ code: val, }) }}
                            style={styles.InputItem} placeholder="请输入验证码" >
                        </InputItem>
                        <LinearGradient
                            colors={['#f53f68', '#e92b32']} start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }} style={styles.codeBox}
                        >
                            <TouchableOpacity onPress={_ => {
                                if (this.state.getVerifyCodeTips === '获取验证码') {
                                    this.getForgetPwdVerifyCode();
                                }
                            }}>
                                <Text style={styles.codeTitle}>{this.state.getVerifyCodeTips}</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </View>
                <LinearGradient
                    colors={['#f53f68', '#e92b32']} start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }} style={styles.btn}>
                    <TouchableOpacity onPress={this.checkVerifyCode}>
                        <Text style={styles.btnTitle}>下一步</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </ScrollView>
        );
    }
    checkVerifyCode = _ => {
        const { navigation } = this.props;
        if (!this.state.code) {
            return Toast.fail('请输入验证码', 1);
        }
        if (!this.state.phone) {
            return Toast.fail('请输入手机号', 1);
        }
        if (!this.state.verifyCodeUuid) {
            return Toast.fail('请先发验证码', 1);
        }
        Toast.loading('加载中...', 0, null, true);
        api.checkforGetPwdVerifyCode(this.state.phone, this.state.verifyCodeUuid,
            this.state.code).then(_ => {
                Toast.hide();
                navigation.push(pathMap.ModifyPassword, {
                    phone: this.state.phone,
                    verifyCodeUuid: this.state.verifyCodeUuid,
                    code: this.state.code,
                })
            }).catch(err => {
                Toast.hide();
                Toast.fail('错误信息: ' + err.msg, 1)
            })
    }
}


export default Register;
