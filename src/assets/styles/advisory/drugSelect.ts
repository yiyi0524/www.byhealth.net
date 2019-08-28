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
    resizeMode: "contain",
  },
  main: {
    flex: 1,
    backgroundColor: sColor.mainBgColor,
  },
  header: {
    height: 45,
    backgroundColor: sColor.white,
    marginBottom: 8,
  },
  headerItem: {
    width: windowWidth / 3,
    textAlign: "center",
    color: sColor.color333,
  },
  headerItemDisabled: {
    width: windowWidth / 3,
    textAlign: "center",
    color: sColor.color999,
  },
  headerLine: {
    width: 1 / PixelRatio.get(),
    height: 25,
    backgroundColor: sColor.colorDdd,
  },
  headerLeft: {
    paddingLeft: 15,
    paddingRight: 30,
    paddingTop: 5,
    paddingBottom: 5,
    color: sColor.color666,
  },
  list: {
    backgroundColor: sColor.white,
    minHeight: windowHeight - 100,
    paddingBottom: 15,
  },
  theme: {
    height: 50,
    lineHeight: 50,
    textAlign: "center",
    color: sColor.color333,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorDdd,
    backgroundColor: sColor.white,
  },
  littleSpot: {
    marginLeft: 2,
    marginRight: 2,
    width: 2,
    height: 2,
    borderRadius: 100,
    backgroundColor: sColor.color333,
  },
  item: {
    padding: 15,
    paddingTop: 5,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorEee,
  },
  itemIcon: {
    color: sColor.mainRed,
    marginRight: 15,
  },
  itemCenter: {
    flex: 1,
    marginRight: 15,
  },
  itemCenterTitleFa: {
    height: 40,
  },
  itemCenterTitlePar: {
    height: 40,
  },
  itemCenterTitle: {
    lineHeight: 40,
    color: sColor.blue,
    flex: 1,
    marginRight: 15,
  },
  itemCenterDetail: {},
  itemCenterDetailTitle: {
    color: sColor.color666,
    marginBottom: 5,
  },
  itemCenterDetailCompany: {
    color: sColor.color888,
  },
  stepper: {},
  stepperInput: {
    fontSize: 14,
    color: sColor.color666,
  },
  input: {
    fontSize: 14,
    color: sColor.color666,
  },
  drugList: {
    backgroundColor: sColor.white,
  },
  drugItem: {
    marginLeft: 15,
    marginRight: 15,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorEee,
  },
  drugTitle: {
    color: sColor.color333,
    marginBottom: 5,
  },
  drugDetail: {},
  drugDescription: {
    color: sColor.color666,
    marginTop: 5,
  },
  drugCompany: {
    color: sColor.color999,
    marginTop: 5,
  },
  setCount: {
    width: 130,
  },
  btn: {
    width: 35,
    height: 25,
    borderRadius: 5,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: sColor.colorDdd,
    lineHeight: 25,
    textAlign: "center",
  },
  count: {
    width: 70,
    margin: 0,
    padding: 0,
    color: sColor.color666,
    textAlign: "center",
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorDdd,
  },
})
