import { Platform, Dimensions } from "react-native";

const os = Platform.OS;
export const isAndroid = os === "android";
export const isIos = os === "ios";
export const windowWidth = Dimensions.get("window").width;
export const windowHeight = Dimensions.get("window").height;
