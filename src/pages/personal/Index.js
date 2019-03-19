import React, { Component } from 'react';
import {
  View, StyleSheet, Dimensions, Text, Image,
  ScrollView, StatusBar, TouchableOpacity, Alert, RefreshControl,
  DeviceEventEmitter,
} from "react-native";
import { Toast } from "antd-mobile-rn";
import pathMap from '../../routes/pathMap';
import api, { isCheckMode } from "../../utils/api";
import gStyle from '../../styles/global';
import styles from '../../styles/personal/index';
import storage from '../../utils/storage';
import { createStackNavigator } from 'react-navigation';
import MyCustomer from '../rob/MyCustomer';
const { width, height } = Dimensions.get('window');

const menuList = [
  {
    url: pathMap.MyCustomer,
    img: require("../../images/personalCenter/customer.png"),
    title: '我的客户',
  },
  {
    url: pathMap.Shop,
    img: require("../../images/personalCenter/shop.png"),
    title: '我的微店',
  },
  {
    url: pathMap.GoldRecharge,
    img: require("../../images/personalCenter/recharge.png"),
    title: '充值中心',
  },
  // {
  //   // url: pathMap.MyAppeal,
  //   url: null,
  //   img: require("../../images/personalCenter/appeal.png"),
  //   title: '我的申诉',
  // },
  {
    url: pathMap.Invite,
    img: require("../../images/personalCenter/invite.png"),
    title: '邀请好友',
  },
  {
    url: pathMap.Guidelines,
    img: require("../../images/personalCenter/novice.png"),
    title: '新手指引',
  },
  {
    url: pathMap.MyRealNameAuth,
    img: require("../../images/personalCenter/verified.png"),
    title: '实名认证',
  },
  {
    url: pathMap.Message,
    img: require("../../images/personalCenter/appeal.png"),
    title: '我的消息',
  },
  {
    url: pathMap.Feedback,
    img: require("../../images/personalCenter/feedback.png"),
    title: '意见反馈',
  },
  {
    url: pathMap.Settings,
    img: require("../../images/personalCenter/setting.png"),
    title: '设置中心',
  },
];
const isCheckedModulmenuList = [
  {
    url: pathMap.MyCustomer,
    img: require("../../images/personalCenter/customer.png"),
    title: '我的客户',
  },
  {
    url: pathMap.Shop,
    img: require("../../images/personalCenter/shop.png"),
    title: '我的微店',
  },
  {
    url: pathMap.MyRealNameAuth,
    img: require("../../images/personalCenter/verified.png"),
    title: '实名认证',
  },
  {
    url: pathMap.Message,
    img: require("../../images/personalCenter/appeal.png"),
    title: '我的消息',
  },
  {
    url: pathMap.Feedback,
    img: require("../../images/personalCenter/feedback.png"),
    title: '意见反馈',
  },
];

export default class HomeScreen extends Component {
  static navigationOptions = {
    headerTitle: <View style={styles.linearGradient}>
      <Text style={styles.headerText}>个人中心</Text></View>,
    headerStyle: {
      backgroundColor: '#f53f68',
      height: 45,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  };
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      information: {
        avatar: require('../../images/personalCenter/default_avatar.png'),
        nick: '未命名',
        phone: '未知',
      },
      level_score: 0,
      isLogin: false,
      balance: 0,
      hasLoad: true,
      refreshing: false,
      isCheckMode: true,
      menuList: [],
    }
  }
  async componentDidMount() {
    this.setState({
      isCheckMode: await isCheckMode(),
    })

    let menu = this.state.isCheckMode ? isCheckedModulmenuList : menuList;
    this.setState({
      menuList: menu,
    })
    this.init();
    this.props.navigation.setParams({ init: _ => this.init() });//在导航中添加查询数据的方法，设置一个钩子
    this.subscription = DeviceEventEmitter.addListener(pathMap.PersonCenter + 'Reload', _ => {
      this.init()
    });
  }
  componentWillUnmount() {
    this.subscription.remove();
  }
  init = async _ => {
    Toast.loading("加载中", 0, null, true)
    let isLogin = await api.isLogin();
    if (isLogin) {
      let json = await this.getPageData();
      let avatar = json.data.avatar ? { uri: json.data.avatar } :
        require('../../images/personalCenter/default_avatar.png');
      this.setState({
        information: {
          avatar,
          nick: json.data.nick || '未命名',
          phone: json.data.phone || '未知',
        },
        level_score: json.data.level_score,
        balance: json.data.balance,
        hasLoad: true,
        isLogin: true,
      })
    } else {
      this.setState({
        information: {
          avatar: require('../../images/personalCenter/default_avatar.png'),
          nick: '未命名',
          phone: '未知',
        },
        level_score: 0,
        balance: 0,
        hasLoad: true,
        isLogin: false,
      })
    }
    Toast.hide();
  }
  getPageData = async _ => {
    return api.getPersonalData();
  }
  jumpMenuCheckLogin = async ({ method = 'push', url, param = {} }) => {
    const { navigation } = this.props;
    let isLogin = await api.isLogin();
    if (isLogin) {
      navigation[method](url, param);
    } else {
      Toast.info('请先登录', 1)
      navigation.navigate(pathMap.Login);
    }
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
      <ScrollView style={styles.header}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
      >
        <View style={styles.content}>
          <View style={styles.information}>
            <View style={styles.informationTop}>
              <TouchableOpacity style={styles.informationAvatar}
                onPress={_ => this.jumpMenuCheckLogin({ url: pathMap.MyInformation })}
              >
                <Image style={styles.informationAvatarImg} source={this.state.information.avatar || require('../../images/personalCenter/default_avatar.png')}></Image>
              </TouchableOpacity>
              {this.state.isLogin ?
                <Text style={styles.informationTitle} >{this.state.information.nick}</Text> :
                <Text
                  style={styles.informationTitle}
                  onPress={() => {
                    navigation.navigate(pathMap.Login);
                  }}
                >请登录</Text>}

              <View style={styles.informationPhone}>
                <Image style={styles.informationPhoneAvatar} source={require("../../images/personalCenter/phone.png")}></Image>
                <Text style={styles.informationPhoneText}>{this.state.information.phone}</Text>
              </View>
            </View>
            <View style={this.state.isCheckMode ? styles.hidden : styles.informationList}>
              <TouchableOpacity style={styles.informationItem}
                onPress={_ => this.jumpMenuCheckLogin({ url: pathMap.Integral })}
              >
                <Text style={styles.informationItemNum}>{this.state.level_score}</Text>
                <Text style={styles.informationItemName}>积分</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.informationItem,
              styles.informationItemBorder]}
                onPress={_ => this.jumpMenuCheckLogin({ url: pathMap.MyGold })}
              >
                <Text style={styles.informationItemNum}>{this.state.balance}</Text>
                <Text style={styles.informationItemName}>金币</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.informationItem}
                onPress={_ => this.jumpMenuCheckLogin({ url: pathMap.VipCenter })}
              >
                <Image style={styles.informationItemImg} source={require("../../images/personalCenter/vip.png")}></Image>
                <Text style={styles.informationItemName}>会员中心</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.menuList}>
            {this.state.menuList.map((v, k) => {
              return (<TouchableOpacity key={k} style={styles.menuItem} onPress={() => {
                if (v.url) {
                  if (v.url === pathMap.About || v.url === pathMap.Guidelines) {
                    navigation.navigate(v.url);
                  } else {
                    this.jumpMenuCheckLogin({ url: v.url })
                  }
                } else {
                  Alert.alert(`还没有${v.title}页面`);
                }
              }}>
                <Image style={styles.menuItemImg} source={v.img}></Image>
                <Text style={styles.menuItemName}>{v.title}</Text>
              </TouchableOpacity>)
            })}
          </View>
          <View style={styles.caseNumber}>
            <Text style={styles.caseNumberDescription}>© 2019 犇沪商务 上海信团资产管理有限公司
                <Text style={styles.caseNumberDescription}> 沪ICP备18041807号-1</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}
