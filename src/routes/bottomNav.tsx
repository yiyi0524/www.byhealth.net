import React from "react";
import { Image, StyleSheet } from "react-native";
import {
  createBottomTabNavigator, createStackNavigator,
  getActiveChildNavigationOptions,
} from "react-navigation";
import pathMap from "./pathMap";
import gImg from "@utils/img";
import sColor from "@styles/color";
import Test from "@pages/Test";
import Home from "@pages/Home";
import PersonalCenter from "@pages/personal_center/Index";
import AdvisoryIndex from "@pages/advisory/Index";
import AddressBookIndex from "@pages/address_book/Index";
import Register from "@pages/user/Register";
const style = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
    resizeMode: "center",
  },
})
const TabNav = createBottomTabNavigator(
  {
    [pathMap.Home]: {
      screen: Home,
      headerMode: "none",
      navigationOptions: ({ }) => ({
        title: "首页",
        tabBarIcon: ({ focused }: { focused: boolean }) => {
          return <Image style={style.icon}
            source={focused ? gImg.common.homeActive : gImg.common.home} />;
        },
      }),
      tabBarOnPress: (obj: any) => {
        if (obj.navigation.state.params && obj.navigation.state.params.init) {
          obj.navigation.state.params.init();
        }
        obj.navigation.navigate(obj.navigation.state.routeName);
      },
    },
    [pathMap.AdvisoryIndex]: {
      screen: AdvisoryIndex,
      headerMode: "none",
      navigationOptions: ({ }) => ({
        title: "咨询",
        tabBarIcon: ({ focused }: { focused: boolean }) => {
          return (
            <Image style={style.icon}
              source={focused ? gImg.common.advisoryActive : gImg.common.advisory}
            />
          );
        },
        tabBarOnPress: (obj: any) => {
          obj.navigation.navigate(obj.navigation.state.routeName);
          if (obj.navigation.state.params && obj.navigation.state.params.init) {
            obj.navigation.state.params.init();
          }
        },
      }),
    },
    [pathMap.AddressBookIndex]: {
      screen: AddressBookIndex,
      headerMode: "none",
      navigationOptions: ({ }) => ({
        title: "通讯录",
        tabBarIcon: ({ focused }: { focused: boolean }) => {
          return (
            <Image style={style.icon}
              source={focused ? gImg.common.addressBookActive : gImg.common.addressBook}
            />
          );
        },
        tabBarOnPress: (obj: any) => {
          obj.navigation.navigate(obj.navigation.state.routeName);
          if (obj.navigation.state.params && obj.navigation.state.params.init) {
            obj.navigation.state.params.init();
          }
        },
      }),
    },
    [pathMap.PersonalCenter]: {
      screen: PersonalCenter,
      headerMode: "none",
      navigationOptions: ({ }) => ({
        title: "我的",
        tabBarIcon: ({ focused }: { focused: boolean }) => {
          return (
            <Image style={style.icon}
              source={focused ? gImg.common.personalCenterActive : gImg.common.personalCenter}
            />
          );
        },
        tabBarOnPress: (obj: any) => {
          obj.navigation.navigate(obj.navigation.state.routeName); //跳转
          if (obj.navigation.state.params && obj.navigation.state.params.init) {
            obj.navigation.state.params.init(); //查询数据
          }
        },
      }),
    },
  },
  {
    initialRouteName: "Home",
    lazy: true, // 是否在app打开的时候将底部标签栏全部加载
    backBehavior: "none", // 点击返回退到上级界面
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: sColor.mainRed,
      inactiveTintColor: sColor.bottonNavColor,
      showLabel: true,
      showIcon: true,
      style: {
        backgroundColor: sColor.white,
        height: 50,
        borderTopColor: sColor.colorEee,
      },
      tabStyle: {
        height: 50,
        paddingTop: 5,
        paddingBottom: 5,
      },
      labelStyle: {
        fontSize: 10,
      },
    },
  },
);
TabNav.navigationOptions = ({ navigation, screenProps }: any) => {
  const childOptions = getActiveChildNavigationOptions(navigation, screenProps);
  return {
    title: childOptions.title,
    headerTitleStyle: {
      color: sColor.white,
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      fontSize: 14,
    },
    headerStyle: {
      height: 50,
      backgroundColor: sColor.mainRed,
      elevation: 0,
      borderBottomColor: sColor.mainRed,
    },
  };
};

const StacksOverTabs = createStackNavigator({
  Root: {
    screen: TabNav,
  },
  [pathMap.Test]: {
    screen: Test,
  },
  [pathMap.Register]: {
    screen: Register,
  },
});
export default StacksOverTabs;