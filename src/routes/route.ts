import { Platform } from "react-native"
import bottomNav from "./bottomNav"
import { StackNavigatorConfig, NavigationRouteConfigMap } from "react-navigation"
import Login from "@pages/user/Login"
import Register from "@pages/user/Register"
import ForgetPwd from "@pages/user/ForgetPwd"
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
    ForgetPwd: {
      screen: ForgetPwd,
    },
  },
  {
    initialRouteName: "Index",
    headerMode: "none",
    mode: Platform.OS === "ios" ? "modal" : "card",
  },
]
export default config
