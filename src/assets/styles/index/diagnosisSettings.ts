import { windowHeight } from "@/utils/utils"
import { windowWidth } from "@api/api"
import sColor from "@styles/color"
import { StyleSheet, PixelRatio } from "react-native"
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
    flex: 0.9,
    backgroundColor: sColor.mainBgColor,
  },
  explain: {
    marginTop: 8,
    backgroundColor: sColor.white,
  },
  header: {
    height: 45,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorDdd,
  },
  headerIcon: {
    width: 4,
    height: 20,
    backgroundColor: sColor.mainRed,
    marginRight: 8,
  },
  headerTitle: {
    color: sColor.mainBlack,
  },
  explainDetails: {
    padding: 15,
  },
  explainDetail: {
    color: sColor.color666,
    lineHeight: 20,
  },
  title: {
    backgroundColor: sColor.mainBgColor,
    paddingLeft: 15,
    height: 45,
    lineHeight: 45,
    color: sColor.color999,
  },
  list: {},
  item: {
    height: 45,
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorDdd,
    backgroundColor: sColor.white,
  },
  itemTitle: {
    color: sColor.color333,
    flex: 1,
  },
  itemDescription: {
    color: sColor.color888,
  },
  itemDetail: {},
  important: {
    color: sColor.mainRed,
  },
  itemIcon: {
    color: sColor.color999,
  },
  notDisturb: {
    backgroundColor: sColor.white,
    marginTop: 8,
  },
  disturbanceFreePeriod: {
    paddingRight: 15,
  },
  notDisturbTime: {
    color: sColor.color666,
  },
  selectDisturbanceFreePeriod: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: sColor.white,
    zIndex: 10,
  },
  datePicker: {
    flex: 1,
    fontSize: 14,
    color: sColor.color888,
  },
  headerDisturbanceFreePeriod: {
    height: 45,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: sColor.mainBgColor,
  },
  close: {
    color: sColor.color666,
  },
  atAnyTime: {
    color: sColor.mainRed,
  },
  datePickerFa: {
    padding: 15,
  },
  submit: {
    height: 50,
    lineHeight: 50,
    textAlign: "center",
    color: sColor.white,
    backgroundColor: sColor.mainRed,
  },
  reviewPrice: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: sColor.blackOpa7,
    height: windowHeight,
    paddingTop: 100,
  },
  closeReviewPrice: {
    height: 45,
    lineHeight: 45,
    paddingLeft: 15,
    backgroundColor: sColor.mainBgColor,
    color: sColor.color888,
  },
  description: {
    color: sColor.color888,
    padding: 15,
    lineHeight: 20,
    backgroundColor: sColor.white,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorDdd,
  },
  reviewPriceList: {
    flex: 1,
    backgroundColor: sColor.white,
    marginBottom: 80,
  },
  reviewPriceItem: {
    height: 45,
    lineHeight: 45,
    textAlign: "center",
    color: sColor.color666,
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: sColor.colorDdd,
  },
  reviewPriceItemActive: {
    height: 45,
    lineHeight: 45,
    textAlign: "center",
    color: sColor.mainRed,
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: sColor.colorDdd,
  },
})
