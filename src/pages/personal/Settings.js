import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  ScrollView, DeviceEventEmitter,
} from "react-native";
import { List, TextareaItem, Toast, } from "antd-mobile-rn";
import LinearGradient from "react-native-linear-gradient";
import Icons from "react-native-vector-icons/Entypo";
import styles from "../../styles/personal/Settings";
import gStyle from "../../styles/global";
import api from "../../utils/api";
import pathMap from "../../routes/pathMap";
import storage from '../../utils/storage';

const list = [
  {
    title: "关于犇沪",
    icon: require("../../images/personalCenter/settings_logo.png"),
    link: pathMap.About,
    param: {},
  },
  {
    title: "我的客服",
    icon: require("../../images/personalCenter/about.png"),
    link: pathMap.CustomerService,
    param: {},
  },
  {
    title: "修改密码",
    icon: require("../../images/personalCenter/set_password.png"),
    link: pathMap.ModifyPassword,
    param: {
      isLogin: true,
    },
  },
];
export default class Feedback extends Component {
  static navigationOptions = {
    headerTitle: <View style={gStyle.linearGradient}>
      <Text style={gStyle.headerText}>设置中心</Text></View>,
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
    }
  }
  logout = _ => {
    const { navigation } = this.props;
    (async _ => {
      Toast.loading('正在退出', 0, null, true)
      try {
        await Promise.all([api.logout(), new Promise(s => setTimeout(s, 300))])
        await storage.remove('session')
        DeviceEventEmitter.emit(pathMap.Home + 'Reload', null);
        DeviceEventEmitter.emit(pathMap.PersonCenter + 'Reload', null);
        Toast.hide();
        navigation.goBack()
      } catch (err) {
        console.log(err);
        Toast.hide();
        Toast.info('退出失败,错误信息: ' + err.msg, 2);
      }
    })()
  }
  render() {
    const { navigation } = this.props;
    return (
      <ScrollView>
        <View style={styles.banner}>
          <Image style={styles.bannerImg} source={require("../../images/personalCenter/settings_logo.png")}></Image>
          <Text style={styles.bannerTitle}>犇沪</Text>
        </View>
        <View style={styles.list}>
          {list.map((v, k) => {
            return (<TouchableOpacity
              style={styles.item} key={k}
              onPress={_ => navigation.push(v.link, v.param)}
            >
              <View style={styles.itemBox}>
                <Image style={styles.itemImg} source={v.icon}></Image>
                <Text style={styles.title}>{v.title}</Text>
              </View>
              <Icons name="chevron-small-right" size={22} color="#8d8d8d"></Icons>
            </TouchableOpacity>);
          })}
        </View>
        <TouchableOpacity style={styles.btn} onPress={this.logout}>
          <LinearGradient
            colors={['#f53f68', '#e92b32']}
            start={{ x: 0, y: 0, }}
            end={{ x: 1, y: 1, }}
            style={{ borderRadius: 5, }}
          >
            <Text style={styles.btnTitle}>退出登录</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

