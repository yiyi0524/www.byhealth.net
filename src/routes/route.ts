import { Platform } from "react-native";
import bottomNav from "./bottomNav";
import Login from "@pages/user/Login";
import Register from "@pages/user/Register";
import { StackNavigatorConfig } from "react-navigation";
import { NavigationRouteConfigMap } from "react-navigation";
//todo 判断是否登录,如果登录initialRouteName = "Index";
//todo             如果没有登录initialRouteName = "Login"
let initialRouteName = "Login";
const config: [NavigationRouteConfigMap, StackNavigatorConfig] = [
  {
    Index: {
      screen: bottomNav,
    },
    Login: {
      screen: Login,
    },
    Register: {
      screen: Register,
    },
  },
  {
    initialRouteName: initialRouteName,
    headerMode: "none",
    mode: Platform.OS === "ios" ? "modal" : "card",
  },
];
export default config;
