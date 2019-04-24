import { StyleSheet, PixelRatio } from "react-native"
import sColor from "@styles/color"
import { windowWidth } from "@api/api"
import { windowHeight } from "@/utils/utils"
export default StyleSheet.create({
  loading: {
    width: windowWidth,
    height: windowHeight,
    backgroundColor: sColor.white,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  loadingTitle: {
    textAlign: "center",
    justifyContent: "center",
  },
  loadingPic: {
    width: "100%",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingImg: {
    width: 300,
    resizeMode: "center",
  },
  main: {
    backgroundColor: sColor.mainBgColor,
  },
  headerList: {
    backgroundColor: sColor.white,
    height: 60,
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: sColor.colorDdd,
  },
  headerItem: {
    width: windowWidth / 2,
    justifyContent: "center",
  },
  headerIcon: {
    width: 30,
    height: 30,
    resizeMode: "center",
  },
  headerItemTitle: {
    color: sColor.color666,
    marginLeft: 5,
  },
  separationLine: {
    width: 1 / PixelRatio.get(),
    height: 35,
    backgroundColor: sColor.colorDdd,
  },
  msgList: {},
  msgItem: {
    padding: 15,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: sColor.white,
    marginTop: 10,
  },
  baseInformation: {
    width: 55,
    marginRight: 15,
  },
  avatarFormat: {
    width: 50,
    height: 50,
    borderRadius: 100,
    overflow: "hidden",
    marginBottom: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    resizeMode: "center",
  },
  baseInformationBottom: {
    borderWidth: 1 / PixelRatio.get(),
    borderColor: sColor.colorDdd,
    paddingLeft: 2,
    paddingRight: 2,
    borderRadius: 15,
  },
  gender: {
    width: 15,
    height: 15,
    resizeMode: "center",
  },
  age: {
    color: sColor.color666,
  },
  msgCenter: {
    flex: 1,
  },
  msgName: {
    color: sColor.mainBlack,
    marginBottom: 12,
  },
  msgTime: {
    color: sColor.color888,
  },
  msgDescription: {
    color: sColor.mainBlack,
  },
})
