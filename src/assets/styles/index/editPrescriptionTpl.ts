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
    flex: 0.9,
    backgroundColor: sColor.mainBgColor,
  },
  headerRight: {
    paddingRight: 15,
    color: sColor.mainRed,
  },
  addPrescriptionTpl: {},
  addPrescriptionTplHeader: {
    marginTop: 8,
    backgroundColor: sColor.white,
    padding: 15,
  },
  addPrescriptionTplHeaderTitle: {
    color: sColor.color666,
  },
  addPrescriptionTplHeaderInput: {
    flex: 1,
  },
  input: {
    color: sColor.color666,
    fontSize: 14,
  },
  drugCategoryList: {
    marginTop: 8,
    backgroundColor: sColor.white,
    padding: 15,
  },
  traditionalChineseMedicine: {
    marginBottom: 8,
    marginRight: 15,
  },
  drugCategoryItem: {
    marginTop: 15,
  },
  drugCategoryName: {
    color: sColor.color333,
    marginBottom: 8,
  },
  drugList: {
    marginLeft: 15,
  },
  drugItem: {
    marginBottom: 8,
    marginRight: 15,
  },
  drugTitle: {
    color: sColor.color333,
  },
  drugName: {
    color: sColor.color666,
  },
  editDrug: {
    color: sColor.mainRed,
    marginTop: 8,
    marginRight: 8,
  },
  drugCategoryTitle: {
    marginBottom: 15,
  },
  spot: {
    width: 3,
    height: 3,
    borderRadius: 100,
    backgroundColor: sColor.color333,
    marginLeft: 15,
    marginRight: 15,
  },
  drugCategoryTheme: {
    color: sColor.color333,
  },
  addPrescriptionTplBtn: {
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    height: 45,
    lineHeight: 45,
    textAlign: "center",
    color: sColor.white,
    backgroundColor: sColor.mainRed,
    borderRadius: 5,
    marginBottom: 15,
  },
  drugItemLeft: {
    flex: 1,
  },
  drugItemRight: {
    width: 70,
  },
  drugItemRightTitle: {
    color: sColor.color333,
    textAlign: "right",
    marginBottom: 8,
  },
  drugMarginBottom: {
    marginBottom: 8,
  },
  empty: {
    fontSize: 14,
    textAlign: "center",
    color: sColor.color888,
    marginTop: 8,
  },
  dose: {
    height: 50,
  },
  doseTitle: {
    color: sColor.color666,
  },
  doseInputFather: {
    width: 55,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorDdd,
  },
  doseInput: {
    fontSize: 14,
    color: sColor.mainRed,
  },
})
