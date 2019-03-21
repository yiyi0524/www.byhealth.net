import { Platform } from "react-native";
import bottomNav from "./bottomNav";
import Login from "@pages/user/Login";
import { StackNavigatorConfig } from "react-navigation";
import { NavigationRouteConfigMap } from "react-navigation";
const config: [NavigationRouteConfigMap, StackNavigatorConfig] = [
  {
    Index: {
      screen: bottomNav,
    },
    Login: {
      screen: Login,
    },
  },
  {
    initialRouteName: "Login",
    headerMode: "none",
    mode: Platform.OS === "ios" ? "modal" : "card",
  },
];
export default config;
