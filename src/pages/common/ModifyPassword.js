import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, Alert, } from "react-native";
import { InputItem, List, Toast, } from "antd-mobile-rn";
import LinearGradient from "react-native-linear-gradient";
import { trim } from 'jsbdk';
import styles from "../../styles/common/ModifyPassword";
import pathMap from '../../routes/pathMap';
import api from '../../utils/api';

var { width, height } = Dimensions.get('window');
class Register extends Component {
    static navigationOptions = {
        title: '修改密码',
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
        const { navigation } = this.props;
        let phone = navigation.getParam('phone'),
            verifyCodeUuid = navigation.getParam('verifyCodeUuid'),
            code = navigation.getParam('code');
        this.state = {
            phone,
            verifyCodeUuid,
            code,
            isLogin: false,
            oriPassword: '',
            password: "",
            rePassword: "",
        }
    }
    async componentDidMount() {
        this.setState({
            isLogin: await api.isLogin(),
        })
    }
    modifyPwd = async _ => {
        const { navigation } = this.props;
        Toast.loading('loading...', 0, null, true)
        let isLogin = await api.isLogin();
        try {
            if (isLogin) {
                await api.modifyPwd(this.state.oriPassword, this.state.password, this.state.rePassword)
            } else {
                await api.modifyPwdWithPhoneCode(this.state.phone, this.state.verifyCodeUuid, this.state.code,
                    this.state.password, this.state.rePassword)
            }
            Toast.hide();
            Toast.info('修改成功', 1, _ => {
                navigation.goBack();
            });
        } catch (err) {
            Toast.hide();
            Toast.info('修改失败,错误信息: ' + err.msg || err, 1);
        }
    }
    render() {
        return (
            <ScrollView style={styles.main}>
                <View style={styles.banner}>
                    <Image style={styles.bannerImg} source={require("../../images/common/register_banner.jpg")}></Image>
                </View>
                <View style={styles.registerSelect}>
                    <Text style={styles.registerSelectTitle}>修改密码</Text>
                </View>
                <View>
                    {this.state.isLogin ? <View style={styles.inputBox}>
                        <Image style={styles.inputBoxImg} source={require("../../images/common/password.png")}></Image>
                        <InputItem
                            clear value={this.state.oriPassword}
                            onChange={val => {
                                this.setState({
                                    oriPassword: trim(val),
                                });
                            }}
                            type="password"
                            style={styles.InputItem}
                            placeholder="请输入原密码"
                        >
                        </InputItem>
                    </View> : null}
                    <View style={styles.inputBox}>
                        <Image style={styles.inputBoxImg} source={require("../../images/common/password.png")}></Image>
                        <InputItem
                            clear value={this.state.password}
                            onChange={val => {
                                this.setState({
                                    password: trim(val),
                                });
                            }}
                            type="password"
                            style={styles.InputItem}
                            placeholder="请输入新密码"
                        >
                        </InputItem>
                    </View>
                    <View style={styles.inputBox}>
                        <Image style={styles.inputBoxImg} source={require("../../images/common/password.png")}></Image>
                        <InputItem
                            clear value={this.state.rePassword}
                            onChange={val => {
                                this.setState({
                                    rePassword: trim(val),
                                });
                            }}
                            style={styles.InputItem}
                            type="password"
                            placeholder="请确认新密码"
                        >
                        </InputItem>
                    </View>
                </View>
                <LinearGradient
                    colors={['#f53f68', '#e92b32']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.btn}
                >
                    <TouchableOpacity onPress={_ => {
                        if (!this.state.password) {
                            return Toast.fail('请输入新密码', 1);
                        }
                        if (!this.state.rePassword) {
                            return Toast.fail('请确认新密码', 1);
                        }
                        if (this.state.password !== this.state.rePassword) {
                            return Toast.fail('两次密码不一致', 1);
                        }
                        if (this.state.password.length < 6) {
                            return Toast.fail('两次密码不一致', 1);
                        }
                        this.modifyPwd();
                    }}>
                        <Text style={styles.btnTitle}>完成</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </ScrollView >
        );
    }
}


export default Register;
