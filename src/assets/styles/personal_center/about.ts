import { windowHeight } from "@/utils/utils"
import { windowWidth } from "@api/api"
import sColor from "@styles/color"
import { PixelRatio, StyleSheet } from "react-native"
export default StyleSheet.create({
  loading: {
    width: windowWidth,
    height: windowHeight,
    backgroundColor: sColor.white,
    justifyContent: "center",
    flex: 1,
  },
  loadingTitle: {
    textAlign: "center",
  },
  about: {
    flex: 1,
  },
  main: {
    flex: 0.85,
    backgroundColor: sColor.mainBgColor,
    height: windowHeight,
  },
  header: {
    alignItems: "center",
    backgroundColor: sColor.white,
    paddingTop: 30,
    paddingBottom: 30,
  },
  headerImg: {
    marginBottom: 10,
    width: 50,
    height: 50,
    resizeMode: "center",
  },
  headerTitle: {
    color: sColor.color333,
    marginBottom: 5,
  },
  headerVersion: {
    color: sColor.color888,
  },
  checkedVersion: {
    height: 45,
    lineHeight: 45,
    paddingLeft: 15,
    backgroundColor: sColor.white,
    color: sColor.color666,
    marginTop: 8,
  },
  weixin: {
    marginTop: 30,
  },
  weixinLogo: {
    color: sColor.white,
    padding: 3,
    marginRight: 5,
    borderRadius: 100,
    backgroundColor: sColor.mainRed,
  },
  weixinTitle: {
    color: sColor.color888,
  },
  bottom: {
    flex: 0.15,
    backgroundColor: sColor.mainBgColor,
  },
  agreement: {
    textAlign: "center",
    color: sColor.mainRed,
  },
  footer: {
    color: sColor.color999,
    textAlign: "center",
    marginTop: 15,
  },
})
