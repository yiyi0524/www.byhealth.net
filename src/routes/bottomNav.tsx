import React from "react";
import { Image } from "react-native";
import {
  createBottomTabNavigator,
  createStackNavigator,
  getActiveChildNavigationOptions,
} from "react-navigation";
import Home from "@pages/Home";
import PersonalCenter from "@pages/user/Index";
import pathMap from "./pathMap";
import gStyle from "@utils/style";
import gImg from "@utils/img";
const bottomNavStyle = gStyle.common.bottomNav;
const TabNav = createBottomTabNavigator(
  {
    [pathMap.Home]: {
      screen: Home,
      headerMode: "none",
      navigationOptions: ({}) => ({
        title: "首页",
        tabBarIcon: () => {
          return <Image style={bottomNavStyle.home} source={gImg.common.home} />;
        },
      }),
      tabBarOnPress: (obj: any) => {
        if (obj.navigation.state.params && obj.navigation.state.params.init) {
          obj.navigation.state.params.init(); //查询数据
        }
        obj.navigation.navigate(obj.navigation.state.routeName); //跳转
      },
    },
    [pathMap.PersonCenter]: {
      screen: PersonalCenter,
      headerMode: "none",
      navigationOptions: ({}) => ({
        title: "我的",
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
        tabBarIcon: ({ focused }: { focused: boolean }) => {
          return (
            <Image
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
      activeTintColor: "#e92b32", // 选中时tab的label/icon的颜色
      inactiveTintColor: "#c9c9c9", // 未选中的颜色
      showLabel: true,
      showIcon: true,
      style: {
        backgroundColor: "#fff",
        height: 50,
        borderTopColor: "#eee",
      },
      tabStyle: {
        // TabBar内单独tab的样式
        height: 50,
        paddingTop: 5,
        paddingBottom: 5,
      },
      labelStyle: {
        // TabBar内单独tab的文字样式
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
});
export default StacksOverTabs;
