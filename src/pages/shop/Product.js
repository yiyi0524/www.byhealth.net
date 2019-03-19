import React, { Component } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image, Alert, Linking,
  RefreshControl, DeviceEventEmitter,
} from "react-native";
import pathMap from "../../routes/pathMap"
import styles from "../../styles/shop/Product";
import gStyle from "../../styles/global";
import LinearGradient from "react-native-linear-gradient";
import { Toast } from "antd-mobile-rn";
import { windowHeight } from "../../utils/utils";
import Icons from "react-native-vector-icons/Entypo";
import { juiceApi } from '../../utils/api';
import api, { isCheckMode } from "../../utils/api";

export default class Product extends Component {
  static navigationOptions = {
    headerTitle: <View style={gStyle.linearGradient}>
      <Text style={gStyle.headerText}>个人产品</Text></View>,
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
      downIcon: "chevron-small-down",
      UpIcons: "chevron-small-up",
      refreshing: false,
      isCheckMode: true,
    }
  }
  async componentDidMount() {
    this.setState({
      isCheckMode: await isCheckMode(),
    })
    this.subscription = DeviceEventEmitter.addListener(pathMap.Product + 'Reload', _ => {
      this.init()
    });
    this.init();
  }
  componentWillUnmount() {
    this.subscription.remove();
  }
  init = async _ => {
    const { navigation } = this.props;
    let phone = parseInt(navigation.getParam('phone'));
    Toast.loading("加载中", 1, _ => { }, true)
    let json = await this.getPageData();
    this.setState({
      list: json.data,
      hasLoad: true,
      service_phone: phone,
    })
    Toast.hide()
  }
  getPageData = async () => {
    return juiceApi.personalProductList();
  }
  deleteProduct = productId => {
    // console.log(productId);
    return juiceApi.personalProductDelete(productId).then(_ => {
      Toast.success("删除成功", 1);
      this.init();
    }).catch(err => {
      Toast.fail("删除失败,失败原因:" + err.msg, 1);
    });
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
      <ScrollView style={styles.main}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
      >
        <View style={styles.list}>
          {this.state.list.length !== 0 ? this.state.list.map((v, k) => {
            return (<View style={styles.item} key={k}>
              <Image style={styles.itemImg} source={require("../../images/shop/product_bg.png")}></Image>
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <Text style={styles.headerLeftIcon}>{v.name.substr(0, 1)}</Text>
                  <Text style={styles.headerLeftName}>{v.name}</Text>
                </View>
                <View style={styles.headerRight}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate(pathMap.EditProduct, { productId: v.id })
                    }}
                  >
                    <Text style={styles.headerRightOperation}>编辑</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.deleteProduct(v.id);
                    }}>
                    <Text style={styles.headerRightOperation}>删除</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.content}>
                <View style={styles.contentLeft}>
                  <Text style={styles.contentName} numberOfLines={1}>{v.service}</Text>
                  <Text style={styles.contentDetail}>{v.loan_type}</Text>
                </View>
                <View style={styles.line}></View>
                <View style={styles.contentRight}>
                  <Text style={styles.contentLoanMoney}>额度: {v.loan_amount}</Text>
                  <Text style={styles.contentLoanRate}>月利率: {v.monthly_interest_rate}</Text>
                </View>
              </View>
              <View style={styles.informationDetail}>
                <TouchableOpacity
                  style={styles.informationDetailHeader}
                  onPress={() => {
                    let list = this.state.list;
                    if (list[k].isDetail) {
                      list[k].isDetail = false;
                      this.setState({
                        list
                      })
                    } else {
                      list[k].isDetail = true;
                      this.setState({
                        list
                      })
                    }
                  }}
                >
                  <Text style={styles.infromationDetailTitle}>查看产品详情</Text>
                  <Icons name={this.state.list[k].isDetail ? this.state.UpIcons : this.state.downIcon} size={20} color="#979797"></Icons>
                </TouchableOpacity>
                <View style={this.state.list[k].isDetail ? styles.infromationDetailList : styles.hidden}>
                  <View style={styles.infromationDetailItem}>
                    <Text style={styles.infromationDetailItemTitle}>产品说明</Text>
                    <View style={styles.infromationDetailItemBox}>
                      <Text style={styles.infromationDetailItemBoxTitle}>产品名称:</Text>
                      <Text style={styles.infromationDetailItemBoxDetail}>{v.name}</Text>
                    </View>
                    <View style={styles.infromationDetailItemBox}>
                      <Text style={styles.infromationDetailItemBoxTitle}>产品特点:</Text>
                      <Text style={styles.infromationDetailItemBoxDetail}>
                        {v.characteristics.map((val, key) => {
                          return val + " ";
                        })}
                      </Text>
                    </View>
                    <View style={styles.infromationDetailItemBox}>
                      <Text style={styles.infromationDetailItemBoxTitle}>服务种类:</Text>
                      <Text style={styles.infromationDetailItemBoxDetail}>{v.service}</Text>
                    </View>
                    <View style={styles.infromationDetailItemBox}>
                      <Text style={styles.infromationDetailItemBoxTitle}>货款方式:</Text>
                      <Text style={styles.infromationDetailItemBoxDetail}>{v.loan_type}</Text>
                    </View>
                  </View>
                  <View style={styles.infromationDetailItem}>
                    <Text style={styles.infromationDetailItemTitle}>费用说明</Text>
                    <View style={styles.infromationDetailItemBox}>
                      <Text style={styles.infromationDetailItemBoxTitle}>放款额度</Text>
                      <Text style={styles.infromationDetailItemBoxDetail}>{v.loan_amount}</Text>
                    </View>
                    <View style={styles.infromationDetailItemBox}>
                      <Text style={styles.infromationDetailItemBoxTitle}>放款时间:</Text>
                      <Text style={styles.infromationDetailItemBoxDetail}>{v.loan_time}</Text>
                    </View>
                    <View style={styles.infromationDetailItemBox}>
                      <Text style={styles.infromationDetailItemBoxTitle}>货款期限:</Text>
                      <Text style={styles.infromationDetailItemBoxDetail}>{v.loan_limit}</Text>
                    </View>
                    <View style={styles.infromationDetailItemBox}>
                      <Text style={styles.infromationDetailItemBoxTitle}>月利率:</Text>
                      <Text style={styles.infromationDetailItemBoxDetail}>{v.monthly_interest_rate}</Text>
                    </View>
                    <View style={styles.infromationDetailItemBox}>
                      <Text style={styles.infromationDetailItemBoxTitle}>一次性办理手续费:</Text>
                      <Text style={styles.infromationDetailItemBoxDetail}>{v.handling_fee}</Text>
                    </View>
                  </View>
                  <View style={styles.infromationDetailItem}>
                    <Text style={styles.infromationDetailItemTitle}>材料需求</Text>
                    <View style={styles.infromationDetailItemBox}>
                      <Text style={styles.infromationDetailItemBoxTitle}>{v.materialsNeed.map((val, key) => {
                        return val + " ";
                      })}</Text>
                    </View>
                  </View>
                  <LinearGradient
                    colors={["#f53f68", "#e92b32"]}
                    start={{ x: 0, y: 0, }}
                    end={{ x: 1, y: 1, }}
                    style={{ marginTop: 10, }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        Linking.openURL("tel:" + this.state.service_phone)
                      }}
                    >
                      <Text style={styles.btn} >拨打客服电话</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </View>
            </View>);
          }) : <Text style={{ textAlign: "center", height: 300, }}>暂无产品</Text>}
        </View>
        <LinearGradient
          colors={["#f53f68", "#e92b32"]}
          start={{ x: 0, y: 0, }}
          end={{ x: 1, y: 1, }}
          style={this.state.isCheckMode ? styles.hidden : styles.btnBox}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(pathMap.AddProduct);
            }}
          >
            <Text style={styles.btn}>添加产品</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    );
  }
}
