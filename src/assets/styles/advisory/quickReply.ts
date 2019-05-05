import sColor from "@styles/color"
import { StyleSheet } from "react-native"
import { windowHeight, windowWidth } from "@/utils/utils"
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
    flex: 1,
    backgroundColor: sColor.mainBgColor,
  },
  headerRight: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5,
    color: sColor.mainRed,
  },
  content: {},
  msg: {},
  type: {
    width: 100,
  },
  typeTitle: {
    height: 60,
    lineHeight: 60,
    textAlign: "center",
    color: sColor.color666,
  },
  typeTitleActive: {
    height: 60,
    lineHeight: 60,
    textAlign: "center",
    color: sColor.color666,
    backgroundColor: sColor.lightBlue,
  },
  msgList: {
    flex: 1,
    backgroundColor: sColor.white,
    minHeight: windowHeight,
  },
  msgAdd: {
    height: 50,
    justifyContent: "center",
  },
  msgIcon: {
    marginRight: 5,
    color: sColor.mainRed,
  },
  addTitle: {
    color: sColor.color666,
  },
  msgItem: {
    padding: 8,
  },
  msgItemIcon: {
    marginRight: 16,
    marginLeft: 8,
    color: sColor.mainRed,
  },
  msgTitle: {
    color: sColor.color666,
    lineHeight: 20,
  },
  msgItemActive: {
    padding: 8,
    color: sColor.color666,
    backgroundColor: sColor.lightBlue,
  },
  // 编辑
  edit: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: sColor.white,
    padding: 15,
  },
  input: {
    fontSize: 14,
    color: sColor.color666,
  },
  editBtn: {
    marginTop: 30,
    height: 45,
    lineHeight: 45,
    textAlign: "center",
    borderRadius: 5,
    backgroundColor: sColor.mainRed,
    color: sColor.white,
  },
})
