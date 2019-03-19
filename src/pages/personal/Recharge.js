import React, { Component, Fragment } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { InputItem } from "antd-mobile-rn";
import { Toast } from "antd-mobile-rn";
import styles from "../../styles/personal/Recharge";
import gStyle from '../../styles/global';
import gColor from '../../styles/color';
import pathMap from "../../routes/pathMap";
import api from "../../utils/api";
import { windowWidth, windowHeight } from "../../utils/utils";
import { createStackNavigator } from "react-navigation";
import Icons from "react-native-vector-icons/Entypo";
import Buff from '../../utils/Buff';
const WX_PAY = 0x0;
const ALI_PAY = 0x1;
export default class Recharge extends Component {
  moneyGoodsList = [
    {
      price: 1000,
      title: "兑1100金币",
    },
    {
      price: 2000,
      title: "兑2300金币",
    },
    {
      price: 3000,
      title: "兑3600金币",
    },
    {
      price: 5000,
      title: "兑6250金币",
    },
    // {
    //   price: 10000,
    //   title: "兑13000金币",
    // },
  ];

  static navigationOptions = {
    headerTitle: <View style={gStyle.linearGradient}>
      <Text style={gStyle.headerText}>充值金币</Text></View>,
    headerStyle: {
      backgroundColor: '#f53f68',
      height: 45,
      elevation: 0,
      borderBottomColor: "#f53f68",
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerRight: (
      <Text> </Text>
    ),
  };
  constructor(props) {
    super(props);
    this.state = {
      balance: 0,
      money: 0,//充值金额
      payWay: ALI_PAY,//支付方式0:微信,1:支付宝
      agree: true,//同意用户使用规则
    }
  }
  componentDidMount() {
    this.init();
  }
  init = async _ => {
    Toast.loading("加载中", 0, null, true)
    let json = await this.getPageData();
    this.setState({
      balance: json.data.balance,
      hasLoad: true,
    })
    Toast.hide()
  }
  getPageData = async _ => {
    return await api.getBalance();
  }
  recharge = async _ => {
    if (this.state.money === 0) {
      return Toast.fail("请输入充值金额", 1)
    }
    if (this.state.payWay === ALI_PAY) {
      try {
        let json = await api.buildAliPayOrderInfo({
          body: "充值余额",
          subject: "小金牛充值余额",
          money: parseInt(this.state.money * 100),

        })
        let orderInfo = json.data.resp;
        Buff.aliPay(orderInfo);
        setTimeout(_ => { this.init() }, 3000)
      } catch (err) {
        Toast.fail("支付失败,错误信息: " + err.msg || err);
      }
    } else {
      Toast.fail("暂不支持微信充值", 1);
    }

  }
  render() {
    if (!this.state.hasLoad) {
      return <View style={{
        width: 3000,
        height: 1000,
        backgroundColor: 'white',
      }}></View>
    }
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1, flexDirection: 'column', }}>
        <ScrollView style={styles.gold}>
          <View style={styles.top}>
            <Text style={styles.topName}>金币余额(个)</Text>
            <Text style={styles.topNum}>{this.state.balance}</Text>
          </View>
          <View style={styles.pointsDetailsList}>
            <View style={styles.pointsDetailsTitle}>
              <Text style={styles.title}>充值金币</Text>
            </View>
            <View style={styles.list}>
              {/* <Text style={styles.price}>￥</Text>
              <TextInput
                onChangeText={val => {
                  this.setState({
                    money: parseInt(val) || 0,
                  });
                }}
                keyboardType="numeric"
                style={styles.item}
                underlineColorAndroid="transparent"
              ></TextInput> */}
              {this.moneyGoodsList.map((v, k) => {
                return (<TouchableOpacity key={k}
                  activeOpacity={1}
                  onPress={_ => { this.setState({ money: v.price, }) }}
                  style={this.state.money === v.price ? [styles.item, styles.itemActive] : styles.item}
                >
                  <Text><Text style={{ fontSize: 18, color: "rgba(0,0,0,.95)" }}>{v.price}</Text> 元</Text>
                  <Text style={{ marginTop: 10, color: "rgba(0,0,0,.35)", }}>{v.title}</Text>
                </TouchableOpacity>)
              })}
            </View>
          </View>
          <View style={styles.pay}>
            <TouchableOpacity
              onPress={_ => {
                this.setState({
                  payWay: WX_PAY,
                })
              }}
              style={styles.payList}
            >
              <View style={styles.payItem}>
                <Image style={styles.payItemImg} source={require("../../images/personalCenter/weixin.png")}></Image>
                <Text style={styles.payItemTitle}>微信支付</Text>
              </View>
              <Image style={styles.selectImg} source={this.state.payWay === WX_PAY ?
                require("../../images/personalCenter/select_active.png") :
                require("../../images/personalCenter/select.png")
              }></Image>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={_ => {
                this.setState({
                  payWay: ALI_PAY,
                })
              }}
              style={styles.payList}
            >
              <View style={styles.payItem}>
                <Image style={styles.payItemImg} source={require("../../images/personalCenter/alipay.png")}></Image>
                <Text style={styles.payItemTitle}>支付宝支付</Text>
              </View>
              <Image style={styles.selectImg} source={this.state.payWay === ALI_PAY ?
                require("../../images/personalCenter/select_active.png") :
                require("../../images/personalCenter/select.png")
              }></Image>
            </TouchableOpacity>
          </View>
          {/* <View style={styles.agree}>
            <TouchableOpacity
              onPress={_ => {
                this.setState({
                  agree: !this.state.agree,
                })
              }}
            >
              <Image style={styles.agreeImg} source={this.state.agree ?
                require("../../images/personalCenter/select_active.png") :
                require("../../images/personalCenter/select.png")
              }
              ></Image>
            </TouchableOpacity>
            <Text style={styles.agreeTtitle}>我已阅读且同意遵守
                        <Text onPress={_ => { navigation.push(pathMap.Manual) }}>《用户使用规则》</Text>
            </Text>
          </View> */}
          <View style={styles.caseNumber}>
            <Text style={styles.caseNumberDescription}>© 2019 犇沪商务 上海信团资产管理有限公司</Text>
            <Text style={styles.caseNumberDescription}> 沪ICP备18041807号-1</Text>
          </View>
          <View style={{ height: 50, }}></View>
        </ScrollView>
        <TouchableOpacity
          onPress={_ => this.recharge()}
          style={styles.btnBox}
        >
          <Text style={styles.btn}>确认支付</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

