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
  list: {
    backgroundColor: sColor.white,
    height: windowHeight,
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
  itemCenterTitle: {
    color: sColor.color333,
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
})
