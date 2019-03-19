import React, { Component, } from 'react';
import {
  View, Text, Image, ScrollView, StatusBar, TouchableOpacity, ImageBackground,
  DeviceEventEmitter, RefreshControl, EmitterSubscription,
} from "react-native";
import { Carousel, Toast } from "antd-mobile-rn";
import Icons from "react-native-vector-icons/Entypo";
import styles from '../styles/home';
import pathMap from '../routes/pathMap';
import { noPage, } from '../utils/utils';
import api, { isCheckMode } from "../utils/api";
import Buff from '../utils/Buff';
import GoodsConstant from '../constants/Goods';
import { NavigationScreenProps } from 'react-navigation';
interface Props {
  name: string,
  age: number,
}
interface ResourceItem {
  title: string,
  url: string,
}
interface State {
  isLogin: boolean,
  hasRealNameAuth: boolean,
  todayNewGreetCutomerNumber: number,
  hasLoad: boolean,
  refreshing: boolean,
  isCheckMode: boolean,
  resourceList: ResourceItem[],
}
export default class HomeScreen extends Component<Props & NavigationScreenProps<any, any>, State> {
  subscription: EmitterSubscription | null = null
  constructor(props: any) {
    super(props);
    this.state = {
      isLogin: false,
      hasRealNameAuth: false,//实名认证
      todayNewGreetCutomerNumber: 0,
      hasLoad: false,
      refreshing: false,
      isCheckMode: true,
      resourceList: [],
    }
  }
  async componentDidMount() {
    this.setState({
      isCheckMode: await isCheckMode(),
    })
    this.init();
    this.props.navigation.setParams({ init: () => this.init() });//在导航中添加查询数据的方法，设置一个钩子
    this.subscription = DeviceEventEmitter.addListener(pathMap.Home + 'Reload', () => {
      console.log('首页被刷新');
      this.init()
    });
  }
  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.remove();
    }
  }
  init = async () => {
    let isLogin = await api.isLogin();
    this.setState({
      isLogin,
    })
    if (!isLogin) {
      this.setState({
        hasRealNameAuth: false,//实名认证
      })
    } else {
      api.updateGetuiCid(await Buff.getGetuiCid('1')).then(() => {
        console.log("更新个推cid成功");
      }).catch(err => {
        // Toast.fail("推送服务初始化失败,错误信息: " + err.msg, 1);
      })
    }
    api.getTodayNewGreetCustomerCount().then(json => {
      let todayNewGreetCustomerCount = parseInt(json.data.todayNewGreetCustomerCount);
      this.setState({
        todayNewGreetCutomerNumber: todayNewGreetCustomerCount,
      });
    }).catch(err => {
      console.log(err.msg)
    })
    let hasRealNameAuth = await api.getUserHasRealNameAuth();
    this.setState({
      hasRealNameAuth,
    })
    return Promise.resolve();
  }
  refresh = () => {
    this.init();
  }
  jumpMenuCheckLogin = async ({ url, method = 'push', param = {} }: { method?: string, url: string, param?: Record<string, any> }) => {
    const { navigation } = this.props;
    console.log(method)
    let isLogin = await api.isLogin();
    if (isLogin) {
      navigation.push(url, param);
    } else {
      Toast.info('请先登录', 1)
    }
  }
  onRefresh = () => {
    this.setState({ refreshing: true });
    Promise.all([
      this.init(),
      new Promise(s => setTimeout(s, 500)),
    ]).then(() => {
      this.setState({ refreshing: false });
    }).catch(err => {
      Toast.fail("刷新失败,错误信息: " + err.msg);
    });
  }
  render() {
    const { navigation } = this.props;
    return (
      <>
        {/* <View style={gStyle.linearGradient}>
          <Text style={gStyle.headerText}>首页</Text>
        </View> */}
        <ScrollView style={styles.index}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          {/* <StatusBar
            backgroundColor='transparent' translucent barStyle={'dark-content'}
          /> */}
          <StatusBar
            backgroundColor='#f53f68'
          />
          <View style={styles.banner}>
            <Carousel style={styles.wrapper} selectedIndex={2} autoplay infinite>
              {bannerList.map((v, k) => {
                return <View key={k} style={styles.bannerBox}>
                  <Image style={styles.bannerImg} source={v.image}></Image>
                </View>
              })}
            </Carousel>
          </View>
          {this.state.isLogin ? <>
            {this.state.hasRealNameAuth ? null :
              <TouchableOpacity
                onPress={() => { navigation.push(pathMap.MyRealNameAuth) }}
                style={styles.verified}
              >
                <Image style={styles.verifiedImg} source={require("../images/home/wranning.png")}></Image>
                <Text style={styles.verifiedTitle}>您还未实名认证, 请马上认证</Text>
                <Icons name="chevron-small-right" style={styles.verifiedIcon} size={24} color="#f53f68" />
              </TouchableOpacity>
            }
          </>
            : <TouchableOpacity
              onPress={() => {
                navigation.navigate(pathMap.Login, {
                  onGoBack: () => this.refresh()
                })
              }}
              style={styles.verified}
            ><Image style={styles.verifiedImg} source={require("../images/home/wranning.png")}></Image>
              <Text style={styles.verifiedTitle}>登录</Text>
              <Icons name="chevron-small-right" style={styles.verifiedIcon} size={24} color="#f53f68" />
            </TouchableOpacity>
          }
          <View style={styles.orderList}>
            {robMenuList.map((v, k) => {
              return (<TouchableOpacity key={k} style={styles.orderItem}
                onPress={() => {
                  // this.alipay();
                  // console.log(v.param.category);
                  // return;
                  navigation.push(v.url, {
                    category: v.param.category,
                  })
                }}>
                <Image style={styles.orderItemImg} source={v.image}></Image>
                <Text style={styles.orderItemTitle}>{v.title}</Text>
              </TouchableOpacity>)
            })}
          </View>
          <View style={this.state.isCheckMode ? styles.hidden : styles.center}>
            <TouchableOpacity style={[styles.centerItem, styles.centerBorderRight]}
              onPress={() => {
                if (this.state.isLogin) {
                  navigation.push(pathMap.GoldRecharge)
                } else {
                  Toast.info("请先登录", 1.5, null, true)
                }
              }}>
              <Text style={styles.centerTitle}>充值中心</Text>
              <Image style={styles.centerImg} source={require("../images/home/recharge.png")}></Image>
            </TouchableOpacity>
            <TouchableOpacity style={styles.centerItem}
              onPress={() => {
                navigation.push(pathMap.CustomerService);
              }}
            >
              <Text style={styles.centerTitle}>客服中心</Text>
              <Image style={styles.centerImg} source={require("../images/home/customer_service.png")}></Image>
            </TouchableOpacity>
          </View>
          <View style={styles.add}>
            <ImageBackground style={styles.addImg} source={require("../images/home/add.png")}>
              <Text style={styles.addTitle}>今日新增</Text>
              <Text style={styles.addNum}><Text style={styles.detail}>{this.state.todayNewGreetCutomerNumber}</Text> 位优质客户</Text>
            </ImageBackground>
          </View>
          <View style={styles.resource}>
            <Text style={styles.resourceTheme}>金融资源</Text>
            <View style={styles.resourceList}>
              {resourceList.map((v, k) => {
                if (this.state.isCheckMode && v.title === '成为会员') {
                  return false;
                }
                return (<TouchableOpacity key={k} style={styles.resourceItem}
                  onPress={() => {
                    if (v.url) {
                      if (v.url === pathMap.Shop || v.url === pathMap.VipCenter || v.url === pathMap.AutomaticGrab) {
                        this.jumpMenuCheckLogin({ url: v.url })
                      } else {
                        navigation.navigate(v.url);
                      }
                    } else {
                      noPage();
                    }
                  }}>
                  <View style={styles.left}>
                    <Image style={styles.resourceImg} source={v.image}></Image>
                    <Text style={styles.resourceTitle}>{v.title}</Text>
                  </View>
                  <View style={styles.right}>
                    <Text style={styles.resourceDetail}>{v.description}</Text>
                    <Icons name="chevron-small-right" size={20} color="#9f9f9f" />
                  </View>
                </TouchableOpacity>)
              })}
              <View style={styles.caseNumber}>
                <Text style={styles.caseNumberDescription}>© 2019 犇沪商务 上海信团资产管理有限公司
                <Text style={styles.caseNumberDescription}> 沪ICP备18041807号-1</Text>
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </>
    );
  }
}

const robMenuList = [
  {
    image: require("../images/home/grab_order.png"),
    title: '抢单',
    url: pathMap.Rob,
    param: {
      category: null,
    },
  },
  {
    image: require("../images/home/tao_order.png"),
    title: '淘单',//普通单
    url: pathMap.Rob,
    param: {
      category: GoodsConstant.CATEGORY.COMMON,
    },
  },
  {
    image: require("../images/home/discount_order.png"),
    title: '免费单',
    url: pathMap.Rob,
    param: {
      category: GoodsConstant.CATEGORY.FREE,
    },
  },
  {
    image: require("../images/home/clue_order.png"),
    title: '优质单',
    url: pathMap.Rob,
    param: {
      category: GoodsConstant.CATEGORY.HIGH_QUALITY,
    },
  },
];

const resourceList = [
  {
    image: require("../images/home/auto_grab.png"),
    title: '自动抢单',
    description: '自动抢单, 无需等待',
    url: pathMap.AutomaticGrab,
  },
  {
    image: require("../images/home/poster.png"),
    title: '展业海报',
    description: '开拓用户神器',
    url: pathMap.PosterIndex,
  },
  {
    image: require("../images/home/loan.png"),
    title: '成为会员',
    description: 'vip黄金特权',
    url: pathMap.VipCenter,
  },
  {
    image: require("../images/home/promoter.png"),
    title: '会员微店',
    description: '点击进入微店',
    url: pathMap.Shop,
  },
];
const bannerList = [
  {
    image: require("../images/home/banner0.png"),
  },
  {
    image: require("../images/home/banner1.jpg"),
  },
  {
    image: require("../images/home/banner2.jpg"),
  },
];
