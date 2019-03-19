import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, TextInput, Platform, PermissionsAndroid, Switch,
} from "react-native";
import { Toast, } from "antd-mobile-rn";
import LinearGradient from "react-native-linear-gradient";
import { trim } from "jsbdk";
import styles from "../../styles/rob/AutomaticGrab";
import { juiceApi } from "../../utils/api";
/**
 * 实名认证 状态
 */

export default class Verified extends Component {
  static navigationOptions = {
    title: '自动抢单',
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
      <Text> </Text>
    ),
  };
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      autoGrabStatus: 0,
      order: null,
      price: null,
    }
  }
  async componentDidMount() {
    await this.requestReadExteralStorage();
    try {
      let json = await juiceApi.getAutomaticGrab();
      console.log(json.data);
      this.setState({
        autoGrabStatus: json.data.autoGrabStatus,
        order: json.data.order.toString(),
        price: json.data.price.toString(),
      })
    } catch (err) {
      console.log(err);
    }
  }
  /**
   * 获取访问本地存储的权限
   */
  requestReadExteralStorage = async _ => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            'title': 'Permission To Load Photos From External Storage',
            'message': '需要获取本机存储权限',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log("READ_EXTERNAL_STORAGE permission denied!")
        }
      } catch (err) {
        console.warn(err)
      }
    }
  }

  submit = async _ => {
    let data = {};
    if (this.state.autoGrabStatus) {
      if (!this.state.order && this.state.order === null) {
        Toast.fail("请输入期望最大订单笔数", 1);
        return;
      }
      if (!this.state.price && this.state.price === null) {
        Toast.fail("请输入期望单笔订单最大金额", 1);
        return;
      }
      data = {
        autoGrabStatus: 1,
        order: parseInt(this.state.order),
        price: parseFloat(this.state.price),
      };
    } else {
      data = {
        autoGrabStatus: 0,
        order: null,
        price: null,
      };
    }
    try {
      juiceApi.setAutomaticGrab(data).then(_ => {
        const { navigation } = this.props;
        Toast.info('自动抢单已打开', 2);
        setTimeout(function () {
          navigation.goBack();
        }, 1500)
      }).catch(err => {
        Toast.fail('请求失败 错误信息: ' + err.msg, 1);
      })
    } catch (err) {
      Toast.fail('实名认证错误 错误信息: ' + err.msg, 1);
    }
  }
  onSwitchChange = async val => {
    this.setState({
      autoGrabStatus: val ? 1 : 0,
    });
    //关闭
    if (!val) {
      this.setState({
        autoGrabStatus: 0,
        order: null,
        price: null,
      })
      try {
        juiceApi.setAutomaticGrab({
          autoGrabStatus: 0,
          order: null,
          price: null,
        }).then(_ => {
          const { navigation } = this.props;
          Toast.info('已关闭自动抢单', 1);
        }).catch(err => {
          Toast.fail('请求失败 错误信息: ' + err.msg, 1);
        })
      } catch (err) {
        Toast.fail('实名认证错误 错误信息: ' + err.msg, 1);
      }
    }
  }

  render() {
    return (
      <View style={styles.main}>
        <ScrollView style={styles.verified}>
          <View style={styles.list}>
            <View style={styles.item}>
              <Text style={styles.title}>是否开启自动抢单</Text>
              <Switch
                value={this.state.autoGrabStatus === 1} onValueChange={this.onSwitchChange}
              />
            </View>
          </View>
          <View style={this.state.autoGrabStatus === 1 ? styles.list : styles.hidden}>
            <View style={styles.item}>
              <Text style={styles.title}>期望最大订单笔数</Text>
              <TextInput
                style={styles.input} keyboardType="number-pad"
                onChangeText={val => {
                  let value = val.split(".")[0];
                  if (parseInt(value) > 200) {
                    Toast.fail("最大订单笔数不能超过200", 1);
                    this.setState({
                      order: "",
                    })
                    return;
                  } else {
                    this.setState({ order: trim(value) })
                  }
                }}
                onFocus={_ => { }}
                value={this.state.order} placeholder="请输入" />
            </View>
            <View style={styles.item}>
              <Text style={styles.title}>期望单笔订单最大金额(元)</Text>
              <TextInput
                style={styles.input} keyboardType="number-pad"
                onChangeText={val => {
                  if (parseFloat(val) > 300) {
                    Toast.fail("单笔订单最大金额不能超过300", 1);
                    this.setState({
                      price: "",
                    })
                    return;
                  } else {
                    this.setState({ price: trim(val) })
                  }
                }}
                value={this.state.price} placeholder="请输入" />
            </View>
            <View style={styles.result}>
              <Text style={styles.title}>日最大消费额 : {(this.state.order * this.state.price).toFixed(2)} 元</Text>
            </View>
          </View>
          <View style={{ height: 50, }}></View>
        </ScrollView>
        <LinearGradient
          colors={['#f53f68', '#e92b32']} start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }} style={this.state.autoGrabStatus === 1 ? styles.btnBox : styles.hidden}
        >
          <TouchableOpacity onPress={this.submit}>
            <Text style={styles.btn}>提交</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }
}
