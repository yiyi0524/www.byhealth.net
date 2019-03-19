import React, { Component } from 'react';
import {
  View, DeviceEventEmitter, Text, Image, ScrollView, FlatList,
  TouchableOpacity, ImageBackground, TextInput, RefreshControl,
} from "react-native";
import { createStackNavigator, } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import { Toast, Picker, } from "antd-mobile-rn";
import pathMap from '../../routes/pathMap';
import styles from "../../styles/rob/Index";
import GoodsConstant from "../../constants/Goods";
import api, { isCheckMode } from "../../utils/api";
import storage from "../../utils/storage";
import { windowHeight, windowWidth, } from '../../utils/utils';

const PULL_UPLOAD_MORE = {
  loading: 0x0,
  noMore: 0x1,
};

const goodsCategoryIntMapZh = {
  [GoodsConstant.CATEGORY.ALL]: "全部",
  [GoodsConstant.CATEGORY.FREE]: "免费单",
  [GoodsConstant.CATEGORY.COMMON]: "普通单",
  [GoodsConstant.CATEGORY.HIGH_QUALITY]: "优质单",
};

const goodsCategoryList = [
  {
    value: GoodsConstant.CATEGORY.ALL,
    label: goodsCategoryIntMapZh[GoodsConstant.CATEGORY.ALL],
  },
  {
    value: GoodsConstant.CATEGORY.FREE,
    label: goodsCategoryIntMapZh[GoodsConstant.CATEGORY.FREE],
  },
  {
    value: GoodsConstant.CATEGORY.HIGH_QUALITY,
    label: goodsCategoryIntMapZh[GoodsConstant.CATEGORY.HIGH_QUALITY],
  },
  {
    value: GoodsConstant.CATEGORY.COMMON,
    label: goodsCategoryIntMapZh[GoodsConstant.CATEGORY.COMMON],
  },
];
//Rob
class RobScreen extends Component {
  defaultState = {
    filter: {
      active: false,
      city: {
        level: null,
        cid: null,
      },
      condition: {
        loanMoney: {
          min: null,
          max: null
        },
        loanTimeLimit: {
          min: null,
          max: null,
        },
        wages_of_month: {
          min: null,
          max: null,
        },
        assetsInfo: {
          hasCar: false,
          hasHouse: false,
          hasSocialSecurity: false,
        },
      },
    },
  }
  constructor(props) {
    super(props);
    this.state = {
      chooseCitycid: [],
      chooseGoodsCateGory: [GoodsConstant.CATEGORY.ALL],
      cityNameList: [],
      goodsCategoryList: [],
      title: goodsCategoryIntMapZh[GoodsConstant.CATEGORY.ALL],
      page: 1,
      limit: 8,
      count: 0,
      list: [],
      status: PULL_UPLOAD_MORE.noMore,
      filter: this.clone(this.defaultState.filter),
      refreshing: false,
      region: [],
      isCheckMode: true,
      regionCidMapAreaName: [],
    }
  }
  clone = obj => {
    return JSON.parse(JSON.stringify(obj))
  }
  resetFilter = _ => {
    this.setState({
      filter: this.clone(this.defaultState.filter),
    })
  }
  async componentDidMount() {
    this.setState({
      isCheckMode: await isCheckMode(),
    })

    this.subscription = DeviceEventEmitter.addListener(pathMap.Rob + 'Reload', _ => {
      this.init()
    });
    this.init();
  }
  componentWillUnmount() {
    this.subscription.remove();
  }
  init = async _ => {
    const { navigation } = this.props;
    let category = navigation.getParam('category', null);
    if (category !== null) {
      await new Promise(s => {
        this.setState({
          chooseGoodsCateGory: [category],
          title: goodsCategoryIntMapZh[category],
        }, _ => s());
      })
    }
    console.log(this.state.chooseGoodsCateGory[0]);
    Toast.info("加载中", 0, null, true);
    let list = this.state.list, count = 0;
    try {
      let json = await this.getPageData(this.state.chooseGoodsCateGory[0], this.state.page, this.state.limit);
      list = json.data || list;
      count = json.count;
      if (count / this.state.limit > 1) {
        this.setState({
          status: PULL_UPLOAD_MORE.loading,
        })
      } else {
        this.setState({
          status: PULL_UPLOAD_MORE.noMore,
        })
      }
      // console.log(this.state.status);
    } catch (e) {
    }
    let region, regionCidMapAreaName = [];
    if (await storage.has('region')) {
      region = storage.get('region')
    } else {
      try {
        let json = await api.request('/common/getRegion')
        let oriRegion = json.data.region;
        regionCidMapAreaName = this.getChildCidMapAreaName(oriRegion, regionCidMapAreaName);
        let formatRegion = this.generateFormatRegion(oriRegion);
        region = this.extendFormatRegion(formatRegion);
      } catch (e) {
      }
    }
    this.setState({
      list: list,
      count: count,
      hasLoad: true,
      cityNameList: region,
      goodsCategoryList,
      region,
      regionCidMapAreaName,
    })
    Toast.hide();
  }
  generateFormatRegion = arr => {
    let cityNameList = [];
    for (let i = 0, len = arr.length; i < len; i++) {
      let children = [];
      if (arr[i].child && arr[i].child.length > 0) {
        children = this.generateFormatRegion(arr[i].child);
      }
      let item = {
        value: arr[i].cid,
        label: arr[i].areaName,
        children,
      };
      cityNameList.push(item)
    }
    return cityNameList;
  }
  extendFormatRegion = arr => {
    for (let i = 0, len = arr.length; i < len; i++) {
      arr[i].children = [
        {
          value: "-1",
          label: "全部",
          children: [
          ],
        }].concat(arr[i].children);
    }
    arr.unshift({
      value: "0",
      label: "全国",
      children: [
      ],
    })
    // console.log(arr);
    return arr;
  }
  getChildCidMapAreaName = (arr, regionCidMapAreaName) => {
    for (let i = 0, len = arr.length; i < len; i++) {
      if (arr[i].child && arr[i].child.length > 0) {
        this.getChildCidMapAreaName(arr[i].child, regionCidMapAreaName);
      }
      regionCidMapAreaName[arr[i].cid] = arr[i].areaName;
    }
    return regionCidMapAreaName;
  }

  getPageData = async (category, page, limit) => {
    return api.request('/goods/getList', {
      category,
      page,
      limit,
    })
  }
  filterCity = chooseCitycid => {
    new Promise((s, j) => {
      let filter = this.state.filter;
      if (parseInt(chooseCitycid[0]) !== 0) {
        if (parseInt(chooseCitycid[1]) !== -1) {
          filter.city.level = 1;
          filter.city.cid = chooseCitycid[1];
        } else {
          filter.city.level = 0;
          filter.city.cid = chooseCitycid[0];
        }
      } else {
        filter.city.level = -1;
        filter.city.cid = 0;
      }
      this.setState({
        filter,
        chooseCitycid,
      })
      s();
    }).then(_ => {
      let currPage = 1,
        category = this.state.chooseGoodsCateGory[0],
        limit = this.state.limit,
        filter = this.state.filter;
      console.log(filter);
      this.getGoodsList({
        category: category,
        page: currPage,
        limit: limit,
        filter: filter,
      }).then(json => {
        this.setState({
          list: json.data,
          status: this.state.count === 0 ? PULL_UPLOAD_MORE.noMore : PULL_UPLOAD_MORE.loading,
        })
        Toast.hide();
      }).catch(err => {
        Toast.hide();
      })
    })
  }
  getGoodsList = ({ category, page, limit, filter = {} }) => {
    console.log(filter);
    return api.request('/goods/getList', {
      category,
      page,
      limit,
      filter,
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
      filter: this.state.filter,
    }).then(json => {
      this.setState({
        list: json.data,
        count: json.count,
        page: currPage + 1,
      })
      if (this.state.count === 0) {
        this.setState({
          status: PULL_UPLOAD_MORE.noMore,
        })
      } else {
        this.setState({
          status: PULL_UPLOAD_MORE.loading,
        })
      }
      Toast.hide();
    }).catch(err => {
      // console.log(err)
      Toast.hide();
    })
  }
  onRefresh = _ => {
    this.setState({
      refreshing: true,
      page: 1,
      filter: this.clone(this.defaultState.filter),
    });
    Promise.all([
      this.getGoodsList({
        category: this.state.chooseGoodsCateGory[0],
        page: 1,
        limit: 8,
      }),
      new Promise(s => setTimeout(s, 500)),
    ]).then(jsonArr => {
      this.setState({
        refreshing: false,
        list: jsonArr[0].data,
        status: jsonArr[0].count === jsonArr[0].data.length ? PULL_UPLOAD_MORE.noMore : PULL_UPLOAD_MORE.loading,
      });
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
          <Text style={styles.time} numberOfLines={1}>{typeof item.apply_time === 'string' ? item.apply_time.substr(0, 10) : '未知'}</Text>
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
          <View style={this.state.isCheckMode ? styles.Placeholder : styles.hidden}></View>
          <View style={this.state.isCheckMode ? styles.hidden : styles.centerItem}>
            <Image style={styles.centerImg} source={item.social_security > 0 ?
              require("../../images/grob/insurance_active.png") :
              require("../../images/grob/insurance.png")}
            ></Image>
            <Text style={item.social_security > 0 ? [styles.centerTitle, styles.active] : styles.centerTitle}>
              {item.social_security > 0 ? "有社保" : "无社保"}</Text>
          </View>
          <View style={this.state.isCheckMode ? styles.hidden : styles.centerItem}>
            <Image style={styles.centerImg} source={item.car_status === 1 ?
              require("../../images/grob/car_active.png") :
              require("../../images/grob/car.png")}
            ></Image>
            <Text style={item.car_status === 1 ? [styles.centerTitle, styles.active] : styles.centerTitle}>
              {item.car_status === 1 ? "有车产" : "无车产"}
            </Text>
          </View>
          <View style={this.state.isCheckMode ? styles.hidden : styles.centerItem}>
            <Image style={styles.centerImg} source={item.house_status === 1 ?
              require("../../images/grob/hource_active.png") :
              require("../../images/grob/hource.png")}
            ></Image>
            <Text style={item.house_status === 1 ? [styles.centerTitle, styles.active] : styles.centerTitle}>
              {item.house_status == 1 ? "有房产" : "无房产"}
            </Text>
          </View>
          <View style={this.state.isCheckMode ? styles.hidden : styles.centerItem}>
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
      count = this.state.count,
      filter = this.state.filter;
    if (page <= Math.ceil(count / limit)) {
      let json = await this.getGoodsList({ category, page, limit, filter });
      let oldList = this.state.list;
      for (let i = 0; i < json.data.length; i++) {
        oldList.push(json.data[i]);
      }
      this.setState({
        list: oldList,
        page,
      })
    }
    if (page > Math.ceil(count / limit)) {
      this.setState({
        status: PULL_UPLOAD_MORE.noMore,
      })
    }
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
  toggleShowFilter = _ => {
    let filter = this.state.filter;
    filter.active = !filter.active;
    this.setState({
      filter,
    })
  }
  conversionNumber = val => {
    let newText =
      (val != '' && val.substr(0, 1) == '.') ? '' : val;
    newText = newText.replace(/^0+[0-9]+/g, ""); //不能以0开头输入
    newText = newText.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
    newText = newText.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
    newText = newText.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    newText = newText.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
    return newText;
  }
  conversionMonth = val => {
    let newText =
      (val != '' && val.substr(0, 1) == '.') ? '' : val;
    newText = newText.replace(/^0+[0-9]+/g, ""); //不能以0开头输入
    newText = newText.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
    newText = newText.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
    newText = newText.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    newText = newText.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2'); //只能输入两个小数
    return newText;
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
            value={this.state.chooseCitycid}
            onChange={this.filterCity}
            triggerType="onPress"
          >
            <TouchableOpacity style={styles.topItem} >
              <Text style={styles.topItemTitle}>{this.state.chooseCitycid.length === 0 || parseInt(this.state.chooseCitycid[0]) === 0 ? '全国' :
                this.state.regionCidMapAreaName[parseInt(this.state.chooseCitycid[1]) === -1 ? this.state.chooseCitycid[0] : this.state.chooseCitycid[1]]}</Text>
              <Image style={styles.topItemImg} source={require("../../images/grob/down.png")}></Image>
            </TouchableOpacity>
          </Picker>
          <TouchableOpacity
            style={styles.topItem}
            onPress={_ => this.toggleShowFilter()}
          >
            <Text style={styles.topItemTitle}>自定义筛选</Text>
            <Image style={styles.topItemImg} source={require("../../images/grob/down.png")}></Image>
          </TouchableOpacity>
        </View>

        <View style={styles.grobList}>
          {/* {this.state.list.length === 0 ? <Text style={{ textAlign: "center", marginTop: 15, }}>暂无订单</Text> : null} */}
          <FlatList
            data={this.state.list}
            extraData={this.state}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            onEndReachedThreshold={0.2}
            onEndReached={_ => this.loadingData()}
            ListFooterComponent={this.listFooter(this.state.states)}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
          >
          </FlatList>
        </View>
        {/* //自定义筛选 */}
        <View style={this.state.filter.active ? styles.filter : styles.hidden}
        >
          <View style={styles.filterBg}>
            <ScrollView style={styles.filterBox}>
              <View style={styles.filterHeader}>
                <TouchableOpacity
                  onPress={this.toggleShowFilter}
                >
                  <Text style={styles.filterHeaderRight}>关闭</Text>
                </TouchableOpacity>
                <Text style={styles.filterHeaderTitle}>筛选</Text>
                <TouchableOpacity
                  onPress={_ => {
                    let filter = this.clone(this.defaultState.filter);
                    filter.active = this.state.filter.active;
                    this.setState({
                      filter,
                      page: 1,
                    })
                  }}>
                  <Text
                    style={styles.filterHeaderRight}
                  >重置</Text>
                </TouchableOpacity>

              </View>
              <View style={styles.item}>
                <Text style={styles.title}>{this.state.isCheckMode ? "订单额度" : "贷款额度"}</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    keyboardType="number-pad"
                    onChangeText={minLoanAmount => {
                      minLoanAmount = this.conversionNumber(minLoanAmount);
                      let filter = this.state.filter;
                      filter.condition.loanMoney.min = minLoanAmount;
                      this.setState({
                        filter,
                      })
                    }}
                    value={this.state.filter.condition.loanMoney.min || ""}
                    style={styles.input}
                    placeholder="最低金额"
                  />
                  <Text>万元 - </Text>
                  <TextInput
                    keyboardType="number-pad"
                    onChangeText={maxLoanAmount => {
                      maxLoanAmount = this.conversionNumber(maxLoanAmount);
                      let filter = this.state.filter;
                      filter.condition.loanMoney.max = maxLoanAmount;
                      this.setState({
                        filter,
                      })
                    }}
                    value={this.state.filter.condition.loanMoney.max || ""}
                    style={styles.input}
                    placeholder="最高金额"
                  />
                  <Text>万元</Text>
                </View>
              </View>
              <View style={styles.item}>
                <Text style={styles.title}>{this.state.isCheckMode ? "订单期限" : "贷款期限"}</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    keyboardType="number-pad"
                    onChangeText={minLoanLimit => {
                      minLoanLimit = this.conversionMonth(minLoanLimit);
                      let filter = this.state.filter;
                      filter.condition.loanTimeLimit.min = minLoanLimit;
                      this.setState({
                        filter,
                      })
                    }}
                    value={this.state.filter.condition.loanTimeLimit.min || ""}
                    style={styles.input}
                    placeholder="最少月数"
                  />
                  <Text>个月 - </Text>
                  <TextInput
                    keyboardType="number-pad"
                    onChangeText={maxLoanLimit => {
                      maxLoanLimit = this.conversionMonth(maxLoanLimit);
                      let filter = this.state.filter;
                      filter.condition.loanTimeLimit.max = maxLoanLimit;
                      this.setState({
                        filter,
                      })
                    }}
                    value={this.state.filter.condition.loanTimeLimit.max || ""}
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
                    keyboardType="number-pad"
                    onChangeText={min_wages_of_month => {
                      min_wages_of_month = this.conversionNumber(min_wages_of_month);
                      let filter = this.state.filter;
                      filter.condition.wages_of_month.min = min_wages_of_month;
                      this.setState({
                        filter,
                      })
                    }}
                    value={this.state.filter.condition.wages_of_month.min || ""}
                    style={styles.input}
                    placeholder="最低金额"
                  />
                  <Text>元 - </Text>
                  <TextInput
                    keyboardType="number-pad"
                    onChangeText={max_wages_of_month => {
                      max_wages_of_month = this.conversionNumber(max_wages_of_month);
                      let filter = this.state.filter;
                      filter.condition.wages_of_month.max = max_wages_of_month;
                      this.setState({
                        filter,
                      })
                    }}
                    value={this.state.filter.condition.wages_of_month.max || ""}
                    style={styles.input}
                    placeholder="最高金额"
                  />
                  <Text>元</Text>
                </View>
              </View>
              <View style={this.state.isCheckMode ? styles.hidden : styles.itemBox}>
                <Text style={styles.title}>资产情况</Text>
                <View style={styles.selectBox}>
                  <TouchableOpacity style={this.state.filter.condition.assetsInfo.hasSocialSecurity ?
                    styles.selectItemActive : styles.selectItem}
                    onPress={_ => {
                      let filter = this.state.filter;
                      filter.condition.assetsInfo.hasSocialSecurity = !this.state.filter.condition.assetsInfo.hasSocialSecurity;
                      this.setState({
                        filter,
                      })
                    }}
                  >
                    <Text style={this.state.filter.condition.assetsInfo.hasSocialSecurity ?
                      styles.selectTitleActive : styles.selectTitle}>有社保</Text>
                    <Text style={this.state.hasSocialSecurity ? styles.has : styles.hidden}>√</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={this.state.filter.condition.assetsInfo.hasHouse ?
                    styles.selectItemActive : styles.selectItem}
                    onPress={_ => {
                      let filter = this.state.filter;
                      filter.condition.assetsInfo.hasHouse = !this.state.filter.condition.assetsInfo.hasHouse;
                      this.setState({
                        filter,
                      })
                    }}
                  >
                    <Text style={this.state.filter.condition.assetsInfo.hasHouse ?
                      styles.selectTitleActive : styles.selectTitle}>有房</Text>
                    <Text style={this.state.filter.condition.assetsInfo.hasHouse ? styles.has : styles.hidden}>√</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={this.state.filter.condition.assetsInfo.hasCar ?
                    styles.selectItemActive : styles.selectItem}
                    onPress={_ => {
                      let filter = this.state.filter;
                      filter.condition.assetsInfo.hasCar = !this.state.filter.condition.assetsInfo.hasCar;
                      this.setState({
                        filter,
                      })
                    }}
                  >
                    <Text style={this.state.filter.condition.assetsInfo.hasCar ? styles.selectTitleActive
                      : styles.selectTitle}>有车</Text>
                    <Text style={this.state.filter.condition.assetsInfo.hasCar ? styles.has : styles.hidden}>√</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
            <LinearGradient
              style={styles.btnBox} colors={["#f53f68", "#e92b32"]} start={{ x: 0, y: 0, }}
              end={{ x: 1, y: 1, }}
            >
              <TouchableOpacity
                style={styles.btnClick}
                onPress={_ => {
                  this.toggleShowFilter();
                  this.setState({
                    page: 1,
                  })
                  let page = 1,
                    limit = this.state.limit,
                    category = this.state.chooseGoodsCateGory[0],
                    filter = this.state.filter;
                  this.getGoodsList({ category, page, limit, filter }).then(json => {
                    this.setState({
                      refreshing: false,
                      list: json.data,
                      status: json.count === json.data.length ? PULL_UPLOAD_MORE.noMore : PULL_UPLOAD_MORE.loading,
                    });
                  }).catch(err => { });
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
