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
  main: {
    backgroundColor: sColor.mainBgColor,
  },
  headerRight: {
    color: sColor.white,
    paddingRight: 15,
  },
  header: {
    padding: 15,
    backgroundColor: sColor.lightGreen,
  },
  headerDescription: {
    color: sColor.whiteOpa7,
    marginBottom: 8,
    textAlign: "center",
  },
  headerCenter: {
    marginTop: 5,
  },
  headerCenterLeft: {
    flex: 1,
  },
  headerCenterLeftIcon: {
    color: sColor.whiteOpa7,
    marginRight: 5,
  },
  headerCenterLeftTitle: {
    color: sColor.whiteOpa7,
  },
  headerCenterTitle: {
    color: sColor.whiteOpa7,
    flex: 1,
  },
  headerCenterRight: {
    color: sColor.whiteOpa7,
    flex: 1,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: sColor.whiteOpa7,
    borderRadius: 25,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  bank: {
    marginTop: 15,
  },
  addBank: {
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: sColor.white,
    borderRadius: 15,
    overflow: "hidden",
  },
  addBankTitle: {
    padding: 30,
  },
  addBankIcon: {
    color: sColor.lightGreen,
  },
  addBankDescription: {
    color: sColor.color333,
    marginLeft: 8,
  },
  addBankBtn: {
    color: sColor.white,
    backgroundColor: sColor.lightGreen,
    height: 40,
    lineHeight: 40,
    textAlign: "center",
  },
  bankDescription: {
    marginTop: 15,
    backgroundColor: sColor.white,
    paddingLeft: 15,
    paddingRight: 15,
    height: 45,
  },
  bankDescriptionTitle: {
    color: sColor.color333,
  },
  bankDescriptionRight: {
    color: sColor.color888,
  },
})
