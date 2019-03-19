import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView, Alert,
  RefreshControl,
} from "react-native";
import { Toast } from "antd-mobile-rn";
import pathMap from '../../routes/pathMap';
import styles from "../../styles/personal/Gold";
import { createStackNavigator } from "react-navigation";
import Icons from "react-native-vector-icons/Entypo";
import { windowHeight, windowWidth } from "../../utils/utils";
import { juiceApi } from "../../utils/api";

export default class Gold extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: '我的金币',
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
      <TouchableOpacity
        onPress={_ => navigation.navigate(pathMap.VipCenter)}
      >
        <Text style={{ color: '#fff', marginRight: 15, }}>会员中心</Text>
      </TouchableOpacity>
    ),
  });
  constructor(props) {
    super(props);
    this.state = {
      balance: 0,
      list: [],
      refreshing: false,
    }
  }
  componentDidMount() {
    this.init();
  }

  init = async _ => {
    Toast.loading("加载中", 1, _ => { }, true)
    let json = await this.getPageData();
    this.setState({
      list: json.data.balance_record_list,
      balance: json.data.balance,
      hasLoad: true,
    })
    Toast.hide()
  }
  getPageData = async () => {
    return juiceApi.moneyRecord();
  }
  onRefresh = () => {
    this.setState({ refreshing: true });
    Promise.all([
      this.init(),
      new Promise(s => setTimeout(s, 500)),
    ]).then(_ => {
      this.setState({ refreshing: false });
    }).catch(err => {
      Toast.fail("刷新失败,错误信息: " + err.msg);
    });
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
        <ScrollView style={styles.gold}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          <View style={styles.top}>
            <Text style={styles.topName}>金币余额(个)</Text>
            <Text style={styles.topNum}>{this.state.balance / 100}</Text>
          </View>
          <View style={styles.pointsDetailsList}>
            <View style={styles.pointsDetailsTitle}>
              <Image style={styles.titleImg} source={require("../../images/personalCenter/integral.png")}></Image>
              <Text style={styles.title}>金币明细</Text>
            </View>
            <View style={styles.list}>
              {this.state.list.length !== 0 ? this.state.list.map((v, k) => {
                let category = "+";
                switch (v.category) {
                  case 0:
                    category = '+';
                    break;
                  case 1:
                    category = '-';
                    break;
                  case 2: {
                    let i = v.curr_balance > v.ori_balance ? 1 : 2;
                    switch (i) {
                      case 1:
                        category = '+';
                        break;
                      case 2:
                        category = '-';
                        break;
                    }
                    break;
                  }
                  case 3:
                    category = "-";
                    break;
                  case 4:
                    category = "-";
                    break;
                  default:
                    category = "-";
                    break;
                }
                return (
                  < View style={styles.item} key={k}>
                    <View style={styles.left}>
                      <Text style={styles.leftTitle}>{v.change_reason}</Text>
                      <Text>{v.ctime}</Text>
                    </View>
                    <View>
                      <Text style={styles.rightTitle}>{category}{v.offset / 100}</Text>
                    </View>
                  </View>
                );
              }) : <Text style={{ textAlign: 'center' }}>暂无数据</Text>}
            </View>
          </View>
          <View style={styles.caseNumber}>
            <Text style={styles.caseNumberDescription}>© 2019 犇沪商务 上海信团资产管理有限公司
                <Text style={styles.caseNumberDescription}> 沪ICP备18041807号-1</Text>
            </Text>
          </View>
          <View style={{ height: 50, }}></View>
        </ScrollView>
        <TouchableOpacity
          onPress={() => navigation.navigate(pathMap.GoldRecharge)}
          style={styles.btnBox}
        >
          <Text style={styles.btn}>充值金币</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

