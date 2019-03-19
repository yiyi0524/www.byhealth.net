import React, { Component } from 'react';
import {
  View, StyleSheet, Text, Image, ScrollView, FlatList,
  TouchableOpacity, ImageBackground, TextInput, RefreshControl,
} from "react-native";
import { createStackNavigator } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import { Toast, Picker, List, } from "antd-mobile-rn";
import gStyle from '../../styles/global';
import pathMap from '../../routes/pathMap';
import { windowHeight, windowWidth } from '../../utils/utils';
import styles from "../../styles/rob/Index";
import GoodsConstant from "../../constants/Goods";
import api from "../../utils/api";

const PULL_UPLOAD_MORE = {
  loading: 0x0,
  noMore: 0x1,
};
const cityNameList = [
  {
    "value": "江苏省",
    "label": "江苏省",
    "children": [
      {
        "value": "扬州市",
        "label": "扬州市",
        "children": [],
      },
      {
        "value": "苏州市",
        "label": "苏州市",
        "children": [],
      },
    ],
  },
  {
    "value": "上海",
    "label": "上海",
    "children": [
      {
        "value": "上海市",
        "label": "上海市",
        "children": [],
      },
    ],
  }
];
const goodsCategoryIntMapZh = {
  [GoodsConstant.CATEGORY.FREE]: "免费单",
  [GoodsConstant.CATEGORY.COMMON]: "普通单",
  [GoodsConstant.CATEGORY.HIGH_QUALITY]: "优质单",
};
const goodsCategoryList = [
  {
    "value": GoodsConstant.CATEGORY.FREE,
    "label": goodsCategoryIntMapZh[GoodsConstant.CATEGORY.FREE],
  },
  {
    "value": GoodsConstant.CATEGORY.HIGH_QUALITY,
    "label": goodsCategoryIntMapZh[GoodsConstant.CATEGORY.HIGH_QUALITY],
  },
  {
    "value": GoodsConstant.CATEGORY.COMMON,
    "label": goodsCategoryIntMapZh[GoodsConstant.CATEGORY.COMMON],
  },
];
//Rob
class RobScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chooseCityNameInfo: [],
      chooseGoodsCateGory: [],
      cityNameList: [],
      goodsCategoryList: [],
      title: '抢单',
      page: 1,
      limit: 8,
      count: 100000,
      list: [],
      status: PULL_UPLOAD_MORE.loading,
      filter: false,
      minLoanAmount: "",
      maxLoanAmount: "",
      minLoanLimit: "",
      maxLoanLimit: "",
      minSalary: "",
      maxSalary: "",
      hasSocialSecurity: false,
      hasCar: false,
      hasHouse: false,
      refreshing: false,
    }
  }
  componentDidMount() {
    this.init();
  }
  init = async _ => {
    const { navigation } = this.props;
    let category = navigation.getParam('category', null);
    if (category !== null) {
      this.setState({
        chooseGoodsCateGory: [category],
        title: goodsCategoryIntMapZh[category],
      });
    }
    Toast.info("加载中", 0, null, true);
    let list = this.state.list, count = 0;
    try {
      let json = await this.getPageData(category, this.state.page, this.state.limit);
      list = json.data || list;
      count = json.count;
      if (count / this.state.limit > 1) {
        this.setState({
          status: "more",
        })
      } else {
        this.setState({
          status: "noMore",
        })
      }
    } catch (e) {

    }
    this.setState({
      list: list,
      count: count,
      hasLoad: true,
      cityNameList,
      goodsCategoryList,
    })
    Toast.hide();
  }
  getPageData = async (category, page, limit) => {
    return api.request('/goods/getList', {
      category,
      page,
      limit,
    })
  }
  filterCityName = chooseCityNameInfo => {
    this.setState({
      chooseCityNameInfo,
    })
  }
  getGoodsList = ({ category, page, limit }) => {
    return api.request('/goods/getList', {
      category,
      page,
      limit,
    })
  }
  filterGoodsCateGory = chooseGoodsCateGory => {
    if (this.state.chooseGoodsCateGory[0] === chooseGoodsCateGory[0]) {
      return;
    }
    this.setState({
      chooseGoodsCateGory,
    })
    let currPage = 1;
    Toast.loading("获取商品中", 0)
    this.getGoodsList({
      category: chooseGoodsCateGory[0],
      page: currPage,
      limit: this.state.limit,
    }).then(json => {
      this.setState({
        list: json.data,
        page: currPage + 1,
      })
      Toast.hide();
    }).catch(err => {
      console.log(err)
      Toast.hide();
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

  keyExtractor = (item, index) => item.id + "list";
  renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.grobItem} onPress={() => this.props.navigation.push(pathMap.GoodsDetail, {
        id: item.id,
      })}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.address} numberOfLines={1}>{item.city_name}</Text>
          <Text style={styles.career} numberOfLines={1}>{item.occupation}</Text>
          <Text style={styles.time} numberOfLines={1}>{item.apply_time}</Text>
        </View>
        <View style={styles.centerList}>
          <View style={styles.centerTextItem}>
            <Text style={[styles.centerTitle, styles.active]}>
              {item.loan_money > 10000 ? parseInt(item.loan_money / 10000) + "万元" : item.loan_money + "元"}
            </Text>
          </View>
          <View style={styles.centerTextItem}>
            <Text style={[styles.centerTitle, styles.active]}>{item.loan_time_limit}个月</Text>
          </View>
          <View style={styles.centerItem}>
            <Image style={styles.centerImg} source={item.social_security > 0 ?
              require("../../images/grob/insurance_active.png") :
              require("../../images/grob/insurance.png")}
            ></Image>
            <Text style={item.social_security > 0 ? [styles.centerTitle, styles.active] : styles.centerTitle}>
              {item.social_security > 0 ? "有社保" : "无社保"}</Text>
          </View>
          <View style={styles.centerItem}>
            <Image style={styles.centerImg} source={item.car_status === 1 ?
              require("../../images/grob/car_active.png") :
              require("../../images/grob/car.png")}
            ></Image>
            <Text style={item.car_status === 1 ? [styles.centerTitle, styles.active] : styles.centerTitle}>
              {item.car_status === 1 ? "有车产" : "无车产"}
            </Text>
          </View>
          <View style={styles.centerItem}>
            <Image style={styles.centerImg} source={item.house_status === 1 ?
              require("../../images/grob/hource_active.png") :
              require("../../images/grob/hource.png")}
            ></Image>
            <Text style={item.house_status === 1 ? [styles.centerTitle, styles.active] : styles.centerTitle}>
              {item.house_status == 1 ? "有房产" : "无房产"}
            </Text>
          </View>
          <View style={styles.centerItem}>
            <Image style={styles.centerImg} source={item.wages_of_month > 1 ?
              require("../../images/grob/cash_active.png") :
              require("../../images/grob/cash.png")}
            ></Image>
            <Text style={item.wages_of_month > 1 ? [styles.centerTitle, styles.active] : styles.centerTitle}>
              {item.wages_of_month > 1 ? parseInt(item.wages_of_month / 1000) + "k" : "工资"}
            </Text>
          </View>
        </View>
        <LinearGradient
          colors={["#ff7c22", "#ff1f1f"]}
          style={styles.btnGrob}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.btnGrobTitle}>{item.price}金币抢单</Text>
        </LinearGradient>
      </TouchableOpacity>
    )
  };
  loadingData = async _ => {
    let category = this.state.chooseGoodsCateGory[0],
      page = this.state.page + 1,
      limit = this.state.limit,
      count = this.state.count;

    if (page <= Math.ceil(count / limit)) {
      let json = await this.getPageData(category, page, limit);
      let oldList = this.state.list;
      for (let i = 0; i < json.data.length; i++) {
        oldList.push(json.data[i]);
      }
      if (page > Math.ceil(count / limit)) {
        this.setState({
          status: PULL_UPLOAD_MORE.noMore,
        })
      }
      this.setState({
        list: oldList,
        page,
      })
    }
    // console.log(this.state.list);
  }
  listFooter = _ => {
    switch (this.state.status) {
      case PULL_UPLOAD_MORE.loading:
        return (
          <View style={styles.container}>
            <Text style={styles.textColor}>加载中...</Text>
          </View>
        );
      case PULL_UPLOAD_MORE.noMore:
        return (
          <View style={styles.container}>
            <Text style={styles.textColor}>已无更多</Text>
          </View>
        )
      default:
        return (
          <View style={styles.container}>
            <Text style={styles.textColor}>加载中...</Text>
          </View>
        );
    }
  }
  render() {
    if (!this.state.hasLoad) {
      return <View style={{
        width: windowWidth,
        height: windowHeight,
        backgroundColor: 'white',
      }}></View>
    }
    const { renderItemNavigate } = this.props;
    return (
      <View style={styles.grob}>
        {/* <View style={gStyle.linearGradient}>
          <Text style={gStyle.headerText}>{this.state.title}</Text>
        </View> */}
        <View style={styles.banner}>
          <ImageBackground style={styles.bannerBg} source={require("../../images/grob/grob_banner.png")}></ImageBackground>
        </View>
        <View style={styles.topList}>
          <Picker
            data={this.state.goodsCategoryList}
            cols={1}
            value={this.state.chooseGoodsCateGory}
            onChange={this.filterGoodsCateGory}
            triggerType="onPress"
          >
            <TouchableOpacity style={styles.topItem} >
              <Text style={styles.topItemTitle}>{this.state.chooseGoodsCateGory.length === 0 ? '全部' :
                goodsCategoryIntMapZh[this.state.chooseGoodsCateGory[0]]}</Text>
              <Image style={styles.topItemImg} source={require("../../images/grob/down.png")}></Image>
            </TouchableOpacity>
          </Picker>
          <Picker
            data={this.state.cityNameList}
            cols={2}
            value={this.state.chooseCityNameInfo}
            onChange={this.filterCityName}
            triggerType="onPress"
          >
            <TouchableOpacity style={styles.topItem} >
              <Text style={styles.topItemTitle}>{this.state.chooseCityNameInfo.length === 0 ? '全国' :
                this.state.chooseCityNameInfo[this.state.chooseCityNameInfo.length - 1]}</Text>
              <Image style={styles.topItemImg} source={require("../../images/grob/down.png")}></Image>
            </TouchableOpacity>
          </Picker>
          <TouchableOpacity
            style={styles.topItem}
            onPress={() => {
              this.setState({
                filter: !this.state.filter
              })
            }}
          >
            <Text style={styles.topItemTitle}>自定义筛选</Text>
            <Image style={styles.topItemImg} source={require("../../images/grob/down.png")}></Image>
          </TouchableOpacity>
        </View>

        <View style={styles.grobList}>
          {this.state.list.length === 0 ? <Text style={{ textAlign: "center", marginTop: 15, }}>暂无订单</Text> : null}
          <FlatList
            data={this.state.list}
            extraData={this.state}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            onEndReachedThreshold={0.2}
            onEndReached={_ => this.loadingData()}
            ListFooterComponent={this.listFooter(this.state.states)}
          >
          </FlatList>
        </View>
        {/* //自定义筛选 */}
        <View style={this.state.filter ? styles.filter : styles.hidden}
        >
          <View style={styles.filterBg}>
            <ScrollView style={styles.filterBox}>
              <View style={styles.filterHeader}>
                <TouchableOpacity
                  onPress={() => { this.setState({ filter: !this.state.filter }) }}
                >
                  <Text style={styles.filterHeaderLeft}>&lt;</Text>
                </TouchableOpacity>
                <Text style={styles.filterHeaderTitle}>筛选</Text>
                <Text
                  style={styles.filterHeaderRight}
                  onPress={() => {
                    this.setState({
                      minLoanAmount: "",
                      maxLoanAmount: "",
                      minLoanLimit: "",
                      maxLoanLimit: "",
                      minSalary: "",
                      maxSalary: "",
                      hasSocialSecurity: false,
                      hasCar: false,
                      hasHouse: false,
                    })
                  }}
                >重置</Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.title}>贷款额度</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    onChangeText={(minLoanAmount) => this.setState({ minLoanAmount })}
                    value={this.state.minLoanAmount}
                    style={styles.input}
                    placeholder="最低金额"
                  />
                  <Text>万元 - </Text>
                  <TextInput
                    value={this.state.maxLoanAmount}
                    onChangeText={(maxLoanAmount) => this.setState({ maxLoanAmount })}
                    style={styles.input}
                    placeholder="最高金额"
                  />
                  <Text>万元</Text>
                </View>
              </View>
              <View style={styles.item}>
                <Text style={styles.title}>贷款期限</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    onChangeText={(minLoanLimit) => this.setState({ minLoanLimit })}
                    value={this.state.minLoanLimit}
                    style={styles.input}
                    placeholder="最少月数"
                  />
                  <Text>个月 - </Text>
                  <TextInput
                    value={this.state.maxLoanLimit}
                    onChangeText={(maxLoanLimit) => this.setState({ maxLoanLimit })}
                    style={styles.input}
                    placeholder="最多月数"
                  />
                  <Text>个月 </Text>
                </View>
              </View>
              <View style={styles.item}>
                <Text style={styles.title}>工资额度</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    onChangeText={(minSalary) => this.setState({ minSalary })}
                    value={this.state.minSalary}
                    style={styles.input}
                    placeholder="最低金额"
                  />
                  <Text>元 - </Text>
                  <TextInput
                    value={this.state.maxSalary}
                    onChangeText={(maxSalary) => this.setState({ maxSalary })}
                    style={styles.input}
                    placeholder="最高金额"
                  />
                  <Text>元</Text>
                </View>
              </View>
              <View style={styles.itemBox}>
                <Text style={styles.title}>资产情况</Text>
                <View style={styles.selectBox}>
                  <TouchableOpacity style={this.state.hasSocialSecurity ?
                    styles.selectItemActive : styles.selectItem}
                    onPress={() => {
                      if (this.state.hasSocialSecurity) {
                        this.setState({
                          hasSocialSecurity: false,
                        })
                      } else {
                        this.setState({
                          hasSocialSecurity: true,
                        })
                      }
                    }}
                  >
                    <Text style={this.state.hasSocialSecurity ?
                      styles.selectTitleActive : styles.selectTitle}>有社保</Text>
                    <Text style={this.state.hasSocialSecurity ? styles.has : styles.hidden}>√</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={this.state.hasHouse ?
                    styles.selectItemActive : styles.selectItem}
                    onPress={() => {
                      if (this.state.hasHouse) {
                        this.setState({
                          hasHouse: false,
                        })
                      } else {
                        this.setState({
                          hasHouse: true,
                        })
                      }
                    }}
                  >
                    <Text style={this.state.hasHouse ?
                      styles.selectTitleActive : styles.selectTitle}>有房</Text>
                    <Text style={this.state.hasHouse ? styles.has : styles.hidden}>√</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={this.state.hasCar ?
                    styles.selectItemActive : styles.selectItem}
                    onPress={() => {
                      if (this.state.hasCar) {
                        this.setState({
                          hasCar: false,
                        })
                      } else {
                        this.setState({
                          hasCar: true,
                        })
                      }
                    }}
                  >
                    <Text style={this.state.hasCar ? styles.selectTitleActive
                      : styles.selectTitle}>有车</Text>
                    <Text style={this.state.hasCar ? styles.has : styles.hidden}>√</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
            <LinearGradient
              style={styles.btnBox}
              colors={["#f53f68", "#e92b32"]}
              start={{ x: 0, y: 0, }}
              end={{ x: 1, y: 1, }}
            >
              <TouchableOpacity
                style={styles.btnClick}
                onPress={() => {
                  this.setState({ filter: !this.state.filter })
                  let data = {
                    "loan_amount": [this.state.minLoanAmount, this.state.maxLoanAmount],
                    "loan_limit": [this.state.minLoanLimit, this.state.maxLoanLimit],
                    "salary": [this.state.minSalary, this.state.maxSalary],
                    "hasSocialSecurity": this.state.hasSocialSecurity,
                    "hasHouse": this.state.hasHouse,
                    "hasCar": this.state.hasCar,
                  }
                }}
              >
                <Text style={styles.btn}>完成</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
        {/* filter-end */}
      </View>
    );
  }

}

export default createStackNavigator({
  [pathMap.Rob]: {
    screen: RobScreen,
  },
}, {
    headerMode: 'none'
  })
