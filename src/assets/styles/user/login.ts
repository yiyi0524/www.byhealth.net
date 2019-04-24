import { StyleSheet, PixelRatio } from "react-native"
import sColor from "@styles/color"
import { windowHeight } from "@api/api"
export default StyleSheet.create({
  main: {
    backgroundColor: sColor.white,
    flex: 1,
    marginTop: 15,
  },
  tabs: {
    height: windowHeight,
    paddingLeft: 15,
    paddingRight: 15,
  },
  tabItem: {
    height: windowHeight,
    flex: 1,
  },
  tabBarUnderlineStyle: {
    width: "30%",
    marginLeft: "7%",
    backgroundColor: sColor.mainRed,
  },
  inputList: {
    marginTop: 30,
  },
  inputItem: {
    position: "relative",
    marginRight: 15,
    height: 55,
    justifyContent: "center",
  },
  input: {
    fontSize: 14,
    color: sColor.color888,
  },
  verificationBtn: {
    position: "absolute",
    top: 8,
    right: 5,
  },
  verificationCode: {
    width: 100,
    height: 30,
    lineHeight: 30,
    backgroundColor: sColor.colorCcc,
    color: sColor.white,
    textAlign: "center",
    borderRadius: 5,
  },
  register: {
    marginTop: 8,
    marginBottom: 8,
  },
  registerTitle: {
    height: 45,
    marginRight: 30,
    lineHeight: 45,
    textAlign: "right",
    color: sColor.color888,
  },
  subBtn: {
    marginLeft: 15,
    marginRight: 15,
    flex: 1,
  },
  subBtnName: {
    height: 45,
    width: "100%",
    backgroundColor: sColor.mainRed,
    lineHeight: 45,
    textAlign: "center",
    borderRadius: 5,
    color: sColor.white,
  },
  forgetPwd: {
    width: 100,
    height: 30,
    lineHeight: 30,
    color: sColor.color888,
    textAlign: "center",
    borderRadius: 5,
  },
  savePwd: {
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
    width: "100%",
  },
  savePwdTitle: {
    height: 50,
    paddingRight: 15,
    lineHeight: 50,
  },
})
