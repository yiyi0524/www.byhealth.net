import { Platform } from "react-native";
import bottomNav from "./bottomNav";
import { StackNavigatorConfig } from "react-navigation";
import { NavigationRouteConfigMap } from "react-navigation";
const config: [NavigationRouteConfigMap, StackNavigatorConfig] = [
  {
    Index: {
      screen: bottomNav,
    },
  },
  {
    initialRouteName: "Index",
    headerMode: "none",
    mode: Platform.OS === "ios" ? "modal" : "card",
  },
];
export default config;
