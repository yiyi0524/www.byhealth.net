import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView, Alert, } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { Toast } from "antd-mobile-rn";
import styles from '../../styles/vip/Index';
import pathMap from '../../routes/pathMap';
import api from '../../utils/api';

export default class Member extends Component {
  static navigationOptions = {
    title: '会员中心',
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
      isVip: true,
      avatar: require("../../images/personalCenter/default_avatar.png"),
      vip_end_time: "",
    }
  }
  componentDidMount() {
    this.init();
  }
  init = async _ => {
    Toast.loading("加载中", 0, null, true)
    try {
      let json = await this.getPageData();
      let avatar = require("../../images/personalCenter/default_avatar.png");
      if (json.data.avatar_url) {
        avatar = { uri: json.data.avatar_url }
      }
      this.setState({
        isVip: json.data.isVip,
        avatar: avatar,
        vip_end_time: json.data.vip_end_time,
        hasLoad: true,
      })
    } catch (err) {
      console.log(err)
    }
    Toast.hide()
  }
  getPageData = async _ => {
    return await api.getVipInfo();
  }
  render() {
    const { navigation } = this.props;
    if (!this.state.hasLoad) {
      return <View style={{
        width: 3000,
        height: 1000,
        backgroundColor: 'white',
      }}></View>
    }
    return (
      <ScrollView style={styles.member}>
        <View style={styles.top}>
          <View style={styles.topImgBox}>
            <Image style={styles.topImg} source={this.state.avatar}></Image>
          </View>
          <Text style={styles.topTitle}>{this.state.isVip ? "VIP会员" : "您未开通会员"}</Text>
          {/* <Text style={styles.topTime}>{this.state.isVip ? "有效期至 " + this.state.vip_end_time.substr(0, 10) : ""}</Text> */}
        </View>
        <View style={styles.btns}>
          {/* <TouchableOpacity onPress={_ => navigation.push(pathMap.VipRecharge)}>
            <LinearGradient
              colors={['#f53f68', '#e92b32']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.btn}
            >
              <Text style={styles.btnTitle}>{this.state.isVip ? "会员续费" : "充值会员"}</Text>
            </LinearGradient>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={_ => navigation.push(pathMap.MyGold)}>
            <LinearGradient
              colors={['#f53f68', '#e92b32']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.btn}
            >
              <Text style={styles.btnTitle}>我的金币</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={styles.rightsAndInterests}>
          <Image style={styles.rightsAndInterestsImg} source={require("../../images/personalCenter/vip.png")}></Image>
          <Text style={styles.theme}>ip会员权益</Text>
        </View>
        <View style={styles.list}>
          <View
            style={styles.item}
          >
            <Image style={styles.listImg} source={require("../../images/personalCenter/exhibition_tools.png")}></Image>
            <Text style={styles.listTitle}>展业工具</Text>
          </View>
          <View style={styles.item}>
            <Image style={styles.listImg} source={require("../../images/personalCenter/golden_privilege.png")}></Image>
            <Text style={styles.listTitle}>VIP黄金特权</Text>
          </View>
          <View style={styles.item}>
            <Image style={styles.listImg} source={require("../../images/personalCenter/rob_tao.png")}></Image>
            <Text style={styles.listTitle}>抢单淘单</Text>
          </View>
        </View>
      </ScrollView >
    );
  }
}
