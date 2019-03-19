import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, Linking, ScrollView, Alert,
  RefreshControl,
} from "react-native";
import { List, InputItem, Tabs } from "antd-mobile-rn";
import { createStackNavigator, } from "react-navigation";
import { Toast, } from "antd-mobile-rn";
import { trim } from "jsbdk";
import pathMap from '../../routes/pathMap';
import gStyle from '../../styles/global';
import gColor from '../../styles/color';
import styles from "../../styles/rob/MyCustomer";
import { juiceApi } from "../../utils/api";
import api, { isCheckMode } from "../../utils/api";

export default class Page extends Component {
  static navigationOptions = {
    title: '我的客户',
    headerTitle: <View style={gStyle.linearGradient}>
      <Text style={gStyle.headerText}>我的客户</Text></View>,
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
      search: "",
      freeGoodsList: [],
      localGoodsList: [],
      qualityGoodsList: [],
      shopCustomer: [
      ],
      refreshing: false,
      isCheckMode: true,
    }
  }
  async componentDidMount() {
    this.setState({
      isCheckMode: await isCheckMode(),
    })
    this.init();
  }
  init = async _ => {
    Toast.loading("加载中", 0, null, true)
    let json = await this.getPageData(this.state.search);
    Toast.hide();
    this.setState({
      freeGoodsList: json.data.freeGoodsList,
      localGoodsList: json.data.localGoodsList,
      qualityGoodsList: json.data.qualityGoodsList,
      hasLoad: true,
    })
  }
  getPageData = async search => {
    return juiceApi.getMyCustomerList(search);
  }

  search = val => {
    Toast.loading("加载中", 0, null, true)
    juiceApi.getMyCustomerList(val).then(json => {
      this.setState({
        freeGoodsList: json.data.freeGoodsList,
        localGoodsList: json.data.localGoodsList,
        qualityGoodsList: json.data.qualityGoodsList,
      })
      Toast.hide();
    }).catch(err => {
      Toast.hide();
      Toast.loading("获取数据失败,错误信息: " + err.msg, 1)
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
  render() {
    const { navigation } = this.props;
    const tabs = [
      { title: '免费单' },
      { title: '普通单' },
      { title: '优质单' },
    ];
    if (!this.state.hasLoad) {
      return <View style={{
        width: 3000,
        height: 1000,
        backgroundColor: 'white',
      }}></View>
    }
    return (
      <ScrollView style={styles.client}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
      >
        <View style={styles.search}>
          <Image style={styles.searchImg} source={require("../../images/personalCenter/search.png")}></Image>
          <List style={styles.searchBox}>
            <InputItem
              clear
              value={this.state.search}
              onChange={val => {
                this.setState({
                  search: trim(val),
                });
              }}
              style={styles.searchInput}
              placeholder="请输入手机号码或姓名"
              onBlur={val => {
                this.search(val);
              }}
            >
            </InputItem>
          </List>
        </View>
        <Tabs tabs={tabs} initialPage={0}
          tabBarPosition="top" tabBarActiveTextColor="#f53f68"
          tabBarUnderlineStyle={{
            backgroundColor: "#f53f68", marginLeft: 0,
          }}
        >
          {/* 免费单 */}
          <View style={styles.list}>
            {this.state.freeGoodsList.length > 0 ? this.state.freeGoodsList.map((v, k) => {
              let smsto = "smsto:" + v.phone;
              let phone = "tel:" + v.phone;
              return (<TouchableOpacity style={styles.item} key={k}
                onPress={() => {
                  this.state.isCheckMode ? "" :
                    navigation.navigate(pathMap.MyCustomerDetail, { goodsId: v.goodsId })
                }}
              >
                <View style={styles.top}>
                  <Text style={styles.topTitle}>计划联系 <Text style={styles.topGolds}> {v.money / 100}金币</Text></Text>
                  <Text style={styles.topMore}>...</Text>
                </View>
                <View style={styles.center}>
                  <View style={styles.centerBox}>
                    <Text style={styles.centerName}>{v.name || "未命名"}</Text>
                    <Text style={styles.centerTime}>{v.time.substr(0, 10)}</Text>
                  </View>
                  <View style={styles.centerIcons}>
                    <TouchableOpacity style={styles.conterIcon}
                      onPress={() => {
                        if (v.phone) {
                          Linking.openURL(smsto)
                        } else {
                          Toast.fail("无联系方式", 1)
                        }
                      }}
                    >
                      <Image style={styles.centerImg} source={require("../../images/personalCenter/client_information.png")}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.conterIcon}
                    // onPress={() => { navigation.navigate(pathMap.Appeal) }}
                    >
                      <Image style={styles.centerImg} source={require("../../images/personalCenter/client_complaint.png")}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.conterIcon}
                      onPress={() => {
                        if (v.phone) {
                          Linking.openURL(phone)
                        } else {
                          Toast.fail("无联系方式", 1)
                        }
                      }}
                    >
                      <Image style={styles.centerImg} source={require("../../images/personalCenter/client_phone.png")}></Image>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>);
            }) : <Text style={styles.notOrder}>暂无免费单</Text>}
          </View>
          {/* 普通单 */}
          <View style={styles.list}>
            {this.state.localGoodsList.length > 0 ? this.state.localGoodsList.map((v, k) => {
              let smsto = "smsto:" + v.phone;
              let phone = "tel:" + v.phone;
              return (<TouchableOpacity style={styles.item} key={k}
                onPress={() => {
                  this.state.isCheckMode ? "" :
                    navigation.navigate(pathMap.MyCustomerDetail, { goodsId: v.goodsId })
                }}
              >
                <View style={styles.top}>
                  <Text style={styles.topTitle}>计划联系 <Text style={styles.topGolds}>{v.money / 100}金币</Text></Text>
                  <Text style={styles.topMore}>...</Text>
                </View>
                <View style={styles.center}>
                  <View style={styles.centerBox}>
                    <Text style={styles.centerName}>{v.name || "未命名"}</Text>
                    <Text style={styles.centerTime}>{v.time.substr(0, 10)}</Text>
                  </View>
                  <View style={styles.centerIcons}>
                    <TouchableOpacity style={styles.conterIcon}
                      onPress={() => {
                        if (v.phone) {
                          Linking.openURL(smsto)
                        } else {
                          Toast.fail("无联系方式", 1)
                        }
                      }}
                    >
                      <Image style={styles.centerImg} source={require("../../images/personalCenter/client_information.png")}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.conterIcon}>
                      <Image style={styles.centerImg} source={require("../../images/personalCenter/client_complaint.png")}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.conterIcon}
                      onPress={() => {
                        if (v.phone) {
                          Linking.openURL(phone)
                        } else {
                          Toast.fail("无联系方式", 1)
                        }
                      }}
                    >
                      <Image style={styles.centerImg} source={require("../../images/personalCenter/client_phone.png")}></Image>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>);
            }) : <Text style={styles.notOrder}>暂无普通单</Text>}
          </View>
          {/* 优质单 */}
          <View style={styles.list}>
            {this.state.qualityGoodsList.length > 0 ? this.state.qualityGoodsList.map((v, k) => {
              let smsto = "smsto:" + v.phone;
              let phone = "tel:" + v.phone;
              return (<TouchableOpacity style={styles.item} key={k}
                onPress={() => {
                  this.state.isCheckMode ? "" :
                    navigation.navigate(pathMap.MyCustomerDetail, { goodsId: v.goodsId })
                }}
              >
                <View style={styles.top}>
                  <Text style={styles.topTitle}>计划联系 <Text style={styles.topGolds}>{v.money / 100}金币</Text></Text>
                  <Text style={styles.topMore}>...</Text>
                </View>
                <View style={styles.center}>
                  <View style={styles.centerBox}>
                    <Text style={styles.centerName}>{v.name || "未命名"}</Text>
                    <Text style={styles.centerTime}>{v.time.substr(0, 10)}</Text>
                  </View>
                  <View style={styles.centerIcons}>
                    <TouchableOpacity style={styles.conterIcon}
                      onPress={() => {
                        if (v.phone) {
                          Linking.openURL(smsto)
                        } else {
                          Toast.fail("无联系方式", 1)
                        }
                      }}
                    >
                      <Image style={styles.centerImg} source={require("../../images/personalCenter/client_information.png")}></Image>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.conterIcon}>
                      <Image style={styles.centerImg} source={require("../../images/personalCenter/client_complaint.png")}></Image>
                    </TouchableOpacity> */}
                    <TouchableOpacity style={styles.conterIcon}
                      onPress={() => {
                        if (v.phone) {
                          Linking.openURL(phone)
                        } else {
                          Toast.fail("无联系方式", 1)
                        }
                      }}
                    >
                      <Image style={styles.centerImg} source={require("../../images/personalCenter/client_phone.png")}></Image>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>);
            }) : <Text style={styles.notOrder}>暂无优质单</Text>}
          </View>
          {/* 微店客户 */}
          {/* <View style={styles.list}>
            {this.state.shopCustomer.map((v, k) => {
              let smsto = "smsto:" + v.phone;
              let phone = "tel:" + v.phone;
              return (<TouchableOpacity style={styles.item} key={k}
              // onPress={() => navigation.push(pathMap.MyCustomerDetail, { customerId: v.id })}
              >
                <View style={styles.top}>
                  <Text style={styles.topTitle}>计划联系 <Text style={styles.topGolds}>{v.money / 100}金币</Text></Text>
                  <Text style={styles.topMore}>...</Text>
                </View>
                <View style={styles.center}>
                  <View style={styles.centerBox}>
                    <Text style={styles.centerName}>{v.name || "未命名"}</Text>
                    <Text style={styles.centerTime}>{v.time.substr(0, 10)}</Text>
                  </View>
                  <View style={styles.centerIcons}>
                    <TouchableOpacity style={styles.conterIcon}
                      onPress={() => {
                        if (v.phone) {
                          Linking.openURL(smsto)
                        } else {
                          Toast.fail("无联系方式", 1)
                        }
                      }}
                    >
                      <Image style={styles.centerImg} source={require("../../images/personalCenter/client_information.png")}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.conterIcon}>
                      <Image style={styles.centerImg} source={require("../../images/personalCenter/client_complaint.png")}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.conterIcon}
                      onPress={() => {
                        if (v.phone) {
                          Linking.openURL(phone)
                        } else {
                          Toast.fail("无联系方式", 1)
                        }
                      }}
                    >
                      <Image style={styles.centerImg} source={require("../../images/personalCenter/client_phone.png")}></Image>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>);
            })}
          </View> */}
        </Tabs>
      </ScrollView>
    );
  }
}


