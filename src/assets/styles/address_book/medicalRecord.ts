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
  detail: {
    flex: 1,
  },
  main: {
    backgroundColor: sColor.mainBgColor,
  },
  header: {
    backgroundColor: sColor.white,
  },
  doctorInfo: {
    height: 45,
    lineHeight: 45,
    textAlign: "center",
    color: sColor.white,
    backgroundColor: sColor.mainRed,
  },
  patient: {
    padding: 15,
  },
  avatarFa: {
    width: 50,
    height: 50,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: sColor.colorEee,
    borderRadius: 100,
    overflow: "hidden",
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    resizeMode: "center",
  },
  patientName: {
    color: sColor.mainBlack,
    marginRight: 8,
  },
  patientTitle: {
    color: sColor.color666,
  },
  diagnosis: {
    padding: 15,
    backgroundColor: sColor.white,
  },
  diagnosisTitle: {
    color: sColor.mainBlack,
    fontWeight: "500",
    marginBottom: 10,
  },
  diagnosisDetail: {
    color: sColor.color666,
  },
  drug: {},
  drugCategory: {
    marginBottom: 10,
  },
  drugCategoryTitle: {
    color: sColor.mainBlack,
    fontWeight: "500",
  },
  drugList: {},
  drugItem: {
    marginBottom: 10,
  },
  drugName: {
    color: sColor.color333,
    marginTop: 6,
    marginBottom: 3,
  },
  drugDetail: {
    color: sColor.color666,
  },
  cost: {
    backgroundColor: sColor.white,
    padding: 15,
  },
  costTheme: {
    color: sColor.mainBlack,
    fontWeight: "500",
  },
  costItem: {
    marginTop: 8,
  },
  costTitle: {
    color: sColor.color333,
  },
  costDetail: {
    color: sColor.color888,
    marginLeft: 5,
  },
})
