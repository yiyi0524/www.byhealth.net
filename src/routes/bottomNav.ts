import React from 'react';
import pathMap from './pathMap';
import { createBottomTabNavigator, createStackNavigator, getActiveChildNavigationOptions } from 'react-navigation';
import { Image, StyleSheet, View, Text } from 'react-native';
import gStyle from "../styles/global";
import Home from '../pages/Home';
import Rob from '../pages/rob/Index';
import PersonalCenter from '../pages/personal/Index';
// juice
import Integral from '../pages/personal/Integral';
import MyGold from '../pages/personal/Gold';
import MyRealNameAuth from '../pages/personal/RealNameAuth';
import GoldRecharge from '../pages/personal/Recharge';
import Feedback from '../pages/personal/Feedback';
import VipCenter from '../pages/vip/Index';
import VipRecharge from '../pages/vip/Recharge';
import MyCustomer from '../pages/rob/MyCustomer';
import GoodsDetail from '../pages/rob/Detail';
import MyCustomerDetail from '../pages/rob/MyCustomerDetail';
import Shop from '../pages/shop/Index';
import MyInformation from '../pages/personal/Information';
import Register from '../pages/common/Register';
import Login from '../pages/common/Login';
import ForgetPassword from '../pages/common/ForgetPassword';
import ModifyPassword from '../pages/common/ModifyPassword';
import Settings from '../pages/personal/Settings';
import About from '../pages/personal/About';
import PosterIndex from '../pages/poster/Index';
import Test from "../pages/common/Test";
import PosterDetail from "../pages/poster/Detail";
import Product from "../pages/shop/Product";
import AddProduct from "../pages/shop/AddProduct";
import SuccessCase from "../pages/shop/SuccessCase";
import AddSuccessCase from "../pages/shop/AddSuccessCase";
import Guidelines from "../pages/personal/Guidelines";
import Manual from "../pages/common/Manual";
import Appeal from "../pages/personal/Appeal";
import MyAppeal from "../pages/personal/MyAppeal";
import MyAppealDetail from "../pages/personal/MyAppealDetail";
import Invite from "../pages/personal/Invite";
import CustomerService from "../pages/common/CustomerService";
import Preview from "../pages/shop/Preview";
import RegisterManual from "../pages/common/RegisterManual";
import EditProduct from "../pages/shop/EditProduct";
import EditSuccessCase from "../pages/shop/EditSuccessCase";
import Message from "../pages/personal/Message";
import AutomaticGrab from "../pages/rob/AutomaticGrab";

const styles = StyleSheet.create({
  grob: {
    maxWidth: 20,
    maxHeight: 20,
    resizeMode: "contain",
  },
  home: {
    maxWidth: 60,
    maxHeight: 60,
    position: "relative",
    top: 3,
    resizeMode: "contain",
  },

});
const TabNav = createBottomTabNavigator({
  [pathMap.Rob]: {
    screen: Rob,
    // navigationOptions: () => ({
    //   title: '抢单',
    //   tabBarIcon: ({ focused, }) => {
    //     return (<Image style= { styles.grob }
    //     source = { focused? require("../images/common/grob_active.png"): 
    //     require("../images/common/grob.png")
    //   }> </Image>);
    //   },
    // }),
  },
  [pathMap.Home]: {
    screen: Home,
    headerMode: 'none',
    navigationOptions: ({ }) => ({
      title: "首页",
      // tabBarIcon: () => {
      //   return (<Image
      //     style= { styles.home }
      //   source = { require("../images/common/home.png") }
      //     > </Image>);
      // },
    }),
    tabBarOnPress: (obj: any) => {
      if (obj.navigation.state.params && obj.navigation.state.params.init) {
        obj.navigation.state.params.init();//查询数据
      }
      obj.navigation.navigate(obj.navigation.state.routeName);//跳转 
    },
  },
  [pathMap.PersonCenter]: {
    screen: PersonalCenter,
    headerMode: 'none',
    navigationOptions: () => ({
      title: '我的',
      headerTitleStyle: {
        color: "#fff",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        fontSize: 14,
      },
      headerStyle: {
        backgroundColor: "#f53f68",
        elevation: 0,
      },
      // tabBarIcon: ({ focused, horizontal, tintColor }) => {
      //   return (<Image
      //     style= { styles.grob }
      //   source = {
      //     focused?
      //       require("../images/common/personal_center_active.png"):
      //       require("../images/common/personal_center.png")
      // }
      //   > </Image>);
      // },
      tabBarOnPress: (obj: any) => {
        obj.navigation.navigate(obj.navigation.state.routeName);//跳转 
        if (obj.navigation.state.params && obj.navigation.state.params.init) {
          obj.navigation.state.params.init();//查询数据
        }
      },
    }),
  },
},
  {
    initialRouteName: 'Home',
    lazy: true, // 是否在app打开的时候将底部标签栏全部加载
    backBehavior: "none", // 点击返回退到上级界面
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: "#e92b32", // 选中时tab的label/icon的颜色
      inactiveTintColor: "#c9c9c9", // 未选中的颜色
      showLabel: true,
      showIcon: true,
      style: {
        backgroundColor: "#fff",
        height: 50,
        borderTopColor: "#eee",
      },
      tabStyle: { // TabBar内单独tab的样式
        height: 50,
        paddingTop: 5,
        paddingBottom: 5,
      },
      labelStyle: { // TabBar内单独tab的文字样式
        fontSize: 10,
      },
    },
  }
);
TabNav.navigationOptions = ({ navigation, screenProps }: { navigation: any, screenProps: any }) => {
  const childOptions = getActiveChildNavigationOptions(navigation, screenProps);
  return {
    title: childOptions.title,
    headerTitleStyle: {
      color: "#fff",
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      fontSize: 14,
    },
    headerStyle: {
      backgroundColor: "#f53f68",
      elevation: 0,
      borderBottomColor: "#f53f68",
    },
  };
};

const StacksOverTabs = createStackNavigator({
  Root: {
    screen: TabNav,
  },
  [pathMap.Integral]: {
    screen: Integral,
  },
  [pathMap.MyCustomer]: {
    screen: MyCustomer,
  },
  [pathMap.MyGold]: {
    screen: MyGold,
  },
  [pathMap.GoldRecharge]: {
    screen: GoldRecharge,
  },
  [pathMap.MyRealNameAuth]: {
    screen: MyRealNameAuth,
  },
  [pathMap.VipCenter]: {
    screen: VipCenter,
  },
  [pathMap.VipRecharge]: {
    screen: VipRecharge,
  },
  [pathMap.Feedback]: {
    screen: Feedback,
  },
  [pathMap.GoodsDetail]: {
    screen: GoodsDetail,
  },
  [pathMap.MyCustomerDetail]: {
    screen: MyCustomerDetail,
  },
  [pathMap.Shop]: {
    screen: Shop,
  },
  [pathMap.MyInformation]: {
    screen: MyInformation,
  },
  [pathMap.Register]: {
    screen: Register,
  },
  [pathMap.Login]: {
    screen: Login,
  },
  [pathMap.ForgetPassword]: {
    screen: ForgetPassword,
  },
  [pathMap.ModifyPassword]: {
    screen: ModifyPassword,
  },
  [pathMap.Settings]: {
    screen: Settings,
  },
  [pathMap.About]: {
    screen: About,
  },
  [pathMap.PosterIndex]: {
    screen: PosterIndex,
  },
  [pathMap.Test]: {
    screen: Test,
  },
  [pathMap.PosterDetail]: {
    screen: PosterDetail,
  },
  [pathMap.Product]: {
    screen: Product,
  },
  [pathMap.AddProduct]: {
    screen: AddProduct,
  },
  [pathMap.SuccessCase]: {
    screen: SuccessCase,
  },
  [pathMap.AddSuccessCase]: {
    screen: AddSuccessCase,
  },
  [pathMap.Guidelines]: {
    screen: Guidelines,
  },
  [pathMap.Manual]: {
    screen: Manual,
  },
  [pathMap.Appeal]: {
    screen: Appeal,
  },
  [pathMap.MyAppeal]: {
    screen: MyAppeal,
  },
  [pathMap.MyAppealDetail]: {
    screen: MyAppealDetail,
  },
  [pathMap.Invite]: {
    screen: Invite,
  },
  [pathMap.CustomerService]: {
    screen: CustomerService,
  },
  [pathMap.Preview]: {
    screen: Preview,
  },
  [pathMap.RegisterManual]: {
    screen: RegisterManual,
  },
  [pathMap.EditSuccessCase]: {
    screen: EditSuccessCase,
  },
  [pathMap.EditProduct]: {
    screen: EditProduct,
  },
  [pathMap.Message]: {
    screen: Message,
  },
  [pathMap.AutomaticGrab]: {
    screen: AutomaticGrab,
  },
});
export default StacksOverTabs;
