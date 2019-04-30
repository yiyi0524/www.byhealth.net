import sColor from "@styles/color"
import { StyleSheet } from "react-native"
import { windowHeight } from "@/utils/utils"
export default StyleSheet.create({
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
    height: 45,
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
    marginRight: 15,
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
})
