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
  headerRight: {
    color: sColor.mainRed,
    paddingRight: 15,
  },
  main: {
    flex: 1,
    backgroundColor: sColor.mainBgColor,
  },
  prompt: {
    height: 50,
  },
  promptTitle: {
    lineHeight: 50,
    textAlign: "center",
    color: sColor.color888,
  },
  diagnosis: {
    marginLeft: 8,
    marginRight: 0,
    padding: 15,
    marginBottom: 8,
    backgroundColor: sColor.white,
  },
  theme: {},
  title: {
    color: sColor.mainBlack,
    fontWeight: "500",
    marginBottom: 5,
  },
  titleSpot: {
    marginLeft: 15,
    marginRight: 15,
    width: 3,
    height: 3,
    borderRadius: 100,
    backgroundColor: sColor.color333,
  },
  littleSpot: {
    marginLeft: 2,
    marginRight: 2,
    width: 2,
    height: 2,
    borderRadius: 100,
    backgroundColor: sColor.color333,
  },
  diagnosisItem: {
    marginBottom: 8,
    marginTop: 8,
  },
  diagnosisItemTitle: {
    color: sColor.color666,
    marginRight: 5,
  },
  diagnosisItemAll: {
    color: sColor.color333,
    marginRight: 5,
  },
  diagnosisItemLineTitle: {
    color: sColor.color666,
    marginRight: 5,
  },
  diagnosisItemInput: {
    flex: 1,
  },
  input: {
    fontSize: 14,
    color: sColor.color666,
  },
  diagnosisPic: {},
  diagnosisPicTitle: {
    height: 50,
    lineHeight: 50,
  },
  diagnosisItemImg: {
    marginLeft: 15,
  },
  /**
   * 开方
   */
  pharmacyName: {
    paddingTop: 15,
    paddingBottom: 15,
  },
  pharmacyNameTitle: {
    color: sColor.color666,
  },
  editPharmacyName: {
    flex: 1,
    marginRight: 15,
  },
  pharmacyNameIcon: {
    color: sColor.color999,
    marginLeft: 5,
  },
  drug: {
    color: sColor.mainBlack,
    marginTop: 8,
  },
  drugList: {},
  drugCategoryItem: {
    marginTop: 5,
    marginBottom: 5,
  },
  drugItem: {
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorDdd,
  },
  drugItemLeft: {
    flex: 1,
  },
  drugItemLeftTitle: {
    color: sColor.color333,
    marginBottom: 10,
  },
  drugItemLeftDetail: {
    color: sColor.color666,
    marginTop: 5,
  },
  drugItemRight: {},
  usageDosage: {},
  drugPrompt: {
    color: sColor.color999,
    marginTop: 15,
  },
  important: {
    color: sColor.mainRed,
  },
  editDrug: {
    marginTop: 15,
    marginBottom: 8,
  },
  editDrugIcon: {
    marginRight: 10,
  },
  diagnosisItemDetail: {
    color: sColor.color999,
  },
  sendPatient: {
    marginTop: 8,
    height: 40,
    lineHeight: 40,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: sColor.mainRed,
    color: sColor.white,
    borderRadius: 5,
    textAlign: "center",
    marginBottom: 8,
  },
  selectPharmacy: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: windowWidth,
    height: windowHeight,
    backgroundColor: sColor.blackOpa7,
  },
  selectdrug: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: windowWidth,
    height: windowHeight,
    backgroundColor: sColor.blackOpa7,
  },
  doctor: {
    marginBottom: 8,
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: sColor.white,
    padding: 15,
  },
  doctorName: {
    color: sColor.color666,
  },
})
