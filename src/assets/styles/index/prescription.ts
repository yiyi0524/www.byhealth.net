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
    resizeMode: "contain",
  },
  main: {
    flex: 1,
    backgroundColor: sColor.mainBgColor,
  },
  prescription: {
    flex: 1,
  },
  prescriptionTitle: {
    color: sColor.color333,
  },
  prescriptionList: {
    flex: 1,
  },
  tabScroll: {
    flex: 1,
    marginBottom: 8,
    paddingBottom: 8,
  },
  tabBarUnderlineStyle: {
    backgroundColor: sColor.mainRed,
    width: "35%",
    marginLeft: "5%",
  },
  prescriptionItem: {
    marginTop: 8,
    backgroundColor: sColor.white,
  },
  prescriptionItemHeader: {
    height: 45,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorDdd,
    paddingRight: 15,
  },
  prescriptionItemHeaderLeft: {},
  prescriptionItemHeaderLeftIcon: {
    width: 4,
    height: 20,
    backgroundColor: sColor.mainRed,
    marginRight: 8,
  },
  prescriptionItemHeaderLeftTitle: {
    color: sColor.color333,
  },
  prescriptionItemHeaderLeftDetail: {
    color: sColor.color888,
    marginLeft: 5,
  },
  prescriptionItemHeaderRight: {},
  prescriptionItemHeaderRightTitle: {
    color: sColor.color666,
    marginRight: 5,
  },
  prescriptionItemHeaderRightIcon: {
    color: sColor.color888,
  },
  prescriptionItemDescription: {
    padding: 8,
  },
  prescriptionItemDescriptionDiagnosis: {
    color: sColor.color666,
    marginBottom: 10,
  },
  prescriptionItemDescriptionDetail: {},
  prescriptionItemDescriptionTime: {
    color: sColor.color888,
  },
  prescriptionItemDescriptionStatus: {
    color: sColor.mainRed,
  },
  header: {
    height: 45,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  headerItem: {
    width: 150,
    height: 45,
  },
  headerTitle: {
    color: sColor.color666,
    lineHeight: 45,
    height: 45,
    width: 150,
    borderBottomWidth: 1,
    borderBottomColor: sColor.white,
    textAlign: "center",
  },
  headerTitleActive: {
    lineHeight: 45,
    height: 45,
    width: 150,
    borderBottomWidth: 1,
    borderBottomColor: sColor.mainRed,
    textAlign: "center",
    color: sColor.mainRed,
  },
})
