import React, { Component } from 'react';
import {
  View, Text, Share, Image, TouchableOpacity, ScrollView, Alert,
  RefreshControl,
} from "react-native";
import { List, TextareaItem, Toast, } from "antd-mobile-rn";
import styles from "../../styles/shop/Index";
import gStyle from "../../styles/global";
import LinearGradient from "react-native-linear-gradient";
import Icons from "react-native-vector-icons/Entypo";
import pathMap from "../../routes/pathMap";
import { juiceApi } from "../../utils/api";
import api, { isCheckMode } from "../../utils/api";

export default class Page extends Component {
  static navigationOptions = {
    headerTitle: <View style={gStyle.linearGradient}>
      <Text style={gStyle.headerText}>我的微店</Text></View>,
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

  caseList = [
    {
      title: "展业海报",
      description: "数百张海报, 让展业更轻松, 更有趣!",
      image: require("../../images/personalCenter/poster.png"),
      link: pathMap.PosterIndex,
    },
    {
      title: "个人产品",
      description: "自定义添加个人或公司的信贷员产品",
      image: require("../../images/personalCenter/personal_product.png"),
      link: pathMap.Product,
    },
    {
      title: "成功案例",
      description: "自定义添加个人或公司的成功案例",
      image: require("../../images/personalCenter/success_case.png"),
      link: pathMap.SuccessCase,
    },
  ];
  constructor(props) {
    super(props);
    this.state = {
      avatar: require("../../images/common/default_avatar.png"),
      nick: "",
      phone: "",
      hasRealNameAuth: 0,
      shopView: "0",
      shopApply: "0",
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
    let json = await this.getPageData();
    let avatar = json.data.avatar ? { uri: json.data.avatar } : this.state.avatar;
    this.setState({
      avatar: avatar,
      nick: json.data.name,
      phone: json.data.phone,
      hasRealNameAuth: json.data.hasRealNameAuth,
      shopView: json.data.shopView,
      shopApply: json.data.shopApply,
    })
  }
  getPageData = async () => {
    return juiceApi.getMyShopDetail();
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
    return (
      <ScrollView style={styles.shop}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.left}>
            <Image style={styles.leftImg} source={this.state.avatar}></Image>
          </View>
          <View style={styles.right}>
            <Text style={styles.rightName}>{this.state.nick}</Text>
            <Text style={styles.rightPhone}>{this.state.phone}</Text>
            <View style={styles.verified}>
              <Text style={this.state.hasRealNameAuth ?
                [styles.verifiedTitle, styles.verifiedTitleActive] : styles.verifiedTitle}
              >实名认证</Text>
            </View>
          </View>
        </View>
        <View style={styles.applyList}>
          <View style={styles.applyItem}>
            <Text style={styles.applyNum}>{this.state.shopView}</Text>
            <Text style={styles.applyTitle}>微店浏览</Text>
          </View>
          <View style={styles.applyItem}>
            <Text style={styles.applyNum}>{this.state.shopApply}</Text>
            <Text style={styles.applyTitle}>微店申请</Text>
          </View>
        </View>
        <View style={styles.content}>
          {this.caseList.map((v, k) => {
            if(this.state.isCheckMode && v.title=== "成功案例"){
              return false;
            }
            return (<TouchableOpacity
              style={styles.item} key={k}
              onPress={() => navigation.push(v.link, { phone: this.state.phone })}
            >
              <Image style={styles.itemImg} source={v.image}></Image>
              <View style={styles.itemBox}>
                <Text style={styles.itemTitle}>{v.title}</Text>
                <Text style={styles.itemDetail}>{v.description}</Text>
              </View>
              <Icons name="chevron-small-right" size={30} color="#5f5f5f"></Icons>
            </TouchableOpacity>);
          })}
        </View>
        <TouchableOpacity
          style={this.state.isCheckMode ? styles.hidden : styles.btn}
          onPress={_ => navigation.navigate(pathMap.Invite)}
        >
          <LinearGradient
            colors={["#f53f68", "#e92b32"]}
            start={{ x: 0, y: 0, }}
            end={{ x: 1, y: 1, }}
            style={styles.btnBox}
          >
            <Image style={styles.btnImg} source={require("../../images/personalCenter/share_shop.png")}></Image>
            <Text style={styles.btnTitle}>分享微店赚积分</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={this.state.isCheckMode ? styles.hidden : styles.btnWhite}
          onPress={() => {
            navigation.navigate(pathMap.Preview)
          }}
        >
          <Text style={styles.btnWhiteTitle}>预览微店</Text>
        </TouchableOpacity>

      </ScrollView>
    );
  }
}
