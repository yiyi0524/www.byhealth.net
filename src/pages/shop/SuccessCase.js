import React, { Component } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Alert,
  RefreshControl, DeviceEventEmitter,
} from "react-native";
import pathMap from "../../routes/pathMap"
import styles from "../../styles/shop/SuccessCase";
import gStyle from "../../styles/global";
import LinearGradient from "react-native-linear-gradient";
import { Toast, Picker } from "antd-mobile-rn";
import Icons from "react-native-vector-icons/Entypo";
import { juiceApi } from '../../utils/api';

export default class SuccessCase extends Component {
  static navigationOptions = {
    headerTitle: <View style={gStyle.linearGradient}>
      <Text style={gStyle.headerText}>成功案例</Text></View>,
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
      list: [],
      refreshing: false,
    }
  }
  componentDidMount() {
    this.init();
    this.subscription = DeviceEventEmitter.addListener(pathMap.SuccessCase + 'Reload', _ => {
      this.init()
    });
  }
  componentWillUnmount() {
    this.subscription.remove();
  }
  init = async _ => {
    Toast.loading("加载中", 1, _ => { }, true)
    let json = await this.getPageData();
    this.setState({
      list: json.data,
      hasLoad: true,
    })
    Toast.hide()
  }
  getPageData = async () => {
    return juiceApi.successCaseList();
    return Promise.resolve({
      list: [
        {
          id: 1,
          loan_money: 120000,
          loan_time: "12",
          name: "西楼",
          circumstances: "情况情况情况情况情况情况",
          material: "情况情况情况情况情况情况情况情况情况情况情况情况情况情况情况情况情况情况",
        },
        {
          id: 2,
          loan_money: 9000,
          loan_time: "12",
          name: "西楼",
          circumstances: "情况情况情况情况情况情况",
          material: "情况情况情况情况情况情况情况情况情况情况情况情况情况情况情况情况情况情况",
        },
      ],
    })
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
  deteleSuccessCase = uid => {
    console.log(uid);
    return juiceApi.successCaseDelete(uid).then(_ => {
      Toast.success("删除成功", 1);
      this.init();
    }).catch(err => {
      Toast.fail("删除失败,失败原因: " + err.msg, 1);
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
      <ScrollView style={styles.main}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
      >
        <View style={styles.list}>
          {this.state.list.length > 0 ? this.state.list.map((v, k) => {
            return (<View style={styles.item} key={k}>
              <View style={styles.header}>
                <Text style={styles.loanMoney}>贷款金额
                <Text style={styles.loanMoneyNum}>
                    {parseInt(v.loan_money) / 10000}
                  </Text> 万</Text>
                <Text style={styles.loanMoney}>放贷时间
                <Text style={styles.loanMoneyNum}>
                    {v.loan_time}
                  </Text> 天
                </Text>
              </View>
              <View style={styles.content}>
                <View style={styles.name}>
                  <Text style={styles.title}>客户称呼: </Text>
                  <Text style={styles.detail} numberOfLines={1}>{v.name}</Text>
                </View>
                <View style={styles.customerStatus}>
                  <Text style={styles.title}>客户情况: </Text>
                  <Text style={styles.detail} numberOfLines={2}>{v.circumstances}</Text>
                </View>
                <View style={styles.customerStatus}>
                  <Text style={styles.title}>资料情况: </Text>
                  <Text style={styles.detail} numberOfLines={2}>{v.material}</Text>
                </View>
                <View style={styles.bottom}>
                  <TouchableOpacity
                    onPress={_ => {
                      navigation.navigate(pathMap.EditSuccessCase, { successCaseId: v.id })
                    }}
                  >
                    <Text style={styles.operation}>编辑</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={_ => {
                      this.deteleSuccessCase(v.id)
                    }}
                  >
                    <Text style={styles.operation}>删除</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>);
          }) :
            <View style={styles.item}>
              <Text style={{ color: "#f53f68" }}>示例: </Text>
              <View style={styles.header}>
                <Text style={styles.loanMoney}>贷款金额 <Text style={styles.loanMoneyNum}>12</Text> 万</Text>
                <Text style={styles.loanMoney}>放贷时间 <Text style={styles.loanMoneyNum}>12</Text> 天</Text>
              </View>
              <View style={styles.content}>
                <View style={styles.name}>
                  <Text style={styles.title}>客户称呼: </Text>
                  <Text style={styles.detail} numberOfLines={1}>张先生</Text>
                </View>
                <View style={styles.customerStatus}>
                  <Text style={styles.title}>客户情况: </Text>
                  <Text style={styles.detail} numberOfLines={2}>银行上班近1月，代发1.8万，有社保，有公基金，有深房，信用良好</Text>
                </View>
                <View style={styles.customerStatus}>
                  <Text style={styles.title}>资料情况: </Text>
                  <Text style={styles.detail} numberOfLines={2}>1.身份证原件（原件） 2，房产证（复印件）</Text>
                </View>
              </View>
            </View>
          }

        </View>
        <View style={styles.btnBox}>
          <LinearGradient
            colors={['#f53f68', '#e92b32']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(pathMap.AddSuccessCase)
              }}
            >
              <Text style={styles.btn}>添加案例</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    );
  }
}
