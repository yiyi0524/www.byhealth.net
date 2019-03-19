import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Toast } from "antd-mobile-rn";
import styles from "../../styles/vip/Recharge";
import api from "../../utils/api";
import pathMap from "../../routes/pathMap";


export default class Gold extends React.Component {
  static navigationOptions = {
    title: '充值中心',
    headerStyle: {
      backgroundColor: '#f53f68',
      height: 45,
      elevation: 0,
      borderBottom: "#f53f68",
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
      <Text> </Text>
    ),
  };
  constructor(props) {
    super(props);
    this.state = {
      balance: 0,
      chooseVipGoodsKey: 0,
      vipGoodsList: [],
      payWay: true,
      agree: true,//同意用户使用规则
    }
  }
  componentDidMount() {
    this.init();
  }
  init = async  _ => {
    Toast.loading("加载中", 0, null, true)
    try {
      let json = await this.getPageData();
      console.log(json);
      this.setState({
        vipGoodsList: json.data.package,
        hasLoad: true,
        balance: json.data.balance,
      })
    } catch (err) {
      console.log(err)
    }
    Toast.hide()
  }
  getPageData = async () => {
    return await api.getVipRechargePageData()
  }
  buyVip = _ => {
    if (!this.state.agree) {
      return Toast.fail("您未同意用户使用规则", 1)
    }
    const { navigation } = this.props;
    const reloadFunc = navigation.getParam('init', false);
    if (this.state.balance < this.state.vipGoodsList[this.state.chooseVipGoodsKey]) {
      return Toast.fail('余额不足,请先充值', 1, null, true);
    }
    Toast.loading('购买中', 0, null, true)
    api.buyVip(this.state.chooseVipGoodsKey).then(_ => {
      Toast.hide();
      if (reloadFunc) {
        reloadFunc();
      }
      Toast.info('购买成功', 1, _ => navigation.goBack(), true)
    }).catch(err => {
      Toast.hide();
      Toast.loading('购买失败,错误信息: ' + err.msg, 1, null, true)
    })
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
      <View style={{ flex: 1, flexDirection: "row", }}>
        <ScrollView style={styles.gold}>
          <View style={styles.top}>
            <Text style={styles.topName}>金币余额(个)</Text>
            <Text style={styles.topNum}>{this.state.balance}</Text>
          </View>
          <View style={styles.pointsDetailsList}>
            <View style={styles.pointsDetailsTitle}>
              <Image style={styles.titleImg} source={require("../../images/personalCenter/vip.png")}></Image>
              <Text style={styles.title}>ip会员优惠套餐</Text>
            </View>
            <View style={styles.list}>
              {this.state.vipGoodsList.map((v, k) => {
                return (<TouchableOpacity key={k}
                  activeOpacity={1}
                  onPress={_ => { this.setState({ chooseVipGoodsKey: k, }) }}
                  style={this.state.chooseVipGoodsKey === k ? [styles.item, styles.itemActive] : styles.item}
                >
                  <Text style={styles.itemPrice}>{v.price}金币</Text>
                  <Text style={styles.itemMember}>{v.title}</Text>
                  <Text style={styles.itemPay}>购买</Text>
                </TouchableOpacity>)
              })}
            </View>
          </View>
          <View style={styles.pay}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.payList}
              onPress={() => {
                this.setState({
                  payWay: !this.state.payWay
                })
              }}
            >
              <View style={styles.payItem}>
                <Image style={styles.payItemImg} source={require("../../images/personalCenter/balance.png")}></Image>
                <Text style={styles.payItemTitle}>余额支付</Text>
              </View>
              <Image style={styles.selectImg} source={this.state.payWay ?
                require("../../images/personalCenter/select_active.png") :
                require("../../images/personalCenter/select.png")
              }></Image>
            </TouchableOpacity>
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
            <Text style={styles.agreeTtitle}>我已阅读且同意遵守
                        <Text onPress={_ => { navigation.push(pathMap.Manual) }}>《业务员合作协议》</Text>
            </Text>
          </TouchableOpacity>
          <View style={{ height: 50, }}></View>
        </ScrollView>
        <TouchableOpacity
          onPress={_ => this.buyVip()}
          style={styles.btnBox}
        >
          <Text style={styles.btn}>确认支付</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
