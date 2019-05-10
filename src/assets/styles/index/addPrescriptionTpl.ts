import { windowHeight } from "@/utils/utils"
import { windowWidth } from "@api/api"
import sColor from "@styles/color"
import { StyleSheet } from "react-native"
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
    marginBottom: 8,
    backgroundColor: sColor.white,
    padding: 15,
  },
  traditionalChineseMedicine: {
    marginBottom: 8,
    marginRight: 15,
  },
  drugCategoryItem: {
    marginBottom: 15,
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
  drugName: {
    color: sColor.color666,
  },
  editDrug: {
    color: sColor.mainRed,
  },
  addPrescriptionTplBtn: {},
})
