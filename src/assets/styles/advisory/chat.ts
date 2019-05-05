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
  content: {
    flex: 0.75,
    backgroundColor: sColor.mainBgColor,
    paddingBottom: 30,
    marginBottom: 30,
  },
  list: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  item: {
    marginBottom: 15,
    overflow: "hidden",
  },
  sendTime: {
    height: 40,
    lineHeight: 40,
    textAlign: "center",
    color: sColor.color999,
  },
  downloadMore: {
    height: 35,
    lineHeight: 35,
    textAlign: "center",
    color: sColor.color999,
  },
  leftItem: {
    justifyContent: "flex-start",
    flex: 1,
  },
  itemPic: {
    width: 40,
    height: 40,
    borderRadius: 100,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: sColor.white,
  },
  itemImg: {
    width: 40,
    height: 40,
    resizeMode: "cover",
  },
  leftItemIcon: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 8,
    borderRightWidth: 15,
    borderBottomWidth: 4,
    borderTopWidth: 4,
    borderLeftColor: "transparent",
    borderRightColor: sColor.white,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    marginTop: 8,
  },
  rightItemIcon: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 15,
    borderRightWidth: 8,
    borderBottomWidth: 4,
    borderTopWidth: 4,
    borderLeftColor: sColor.lightChatBlue,
    borderRightColor: "transparent",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    marginTop: 8,
  },
  leftItemTitle: {
    maxWidth: windowWidth - 110,
    color: sColor.color666,
    backgroundColor: sColor.white,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 5,
    lineHeight: 20,
  },
  rightItemTitle: {
    maxWidth: windowWidth - 110,
    color: sColor.color666,
    backgroundColor: sColor.lightChatBlue,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 5,
    lineHeight: 20,
  },
  leftItemPicture: {
    minWidth: 50,
    maxWidth: 150,
    padding: 8,
    backgroundColor: sColor.white,
    borderRadius: 5,
    overflow: "hidden",
  },
  rightItemPicture: {
    maxWidth: 150,
    maxHeight: 150,
    padding: 8,
    backgroundColor: sColor.lightChatBlue,
    borderRadius: 5,
    overflow: "hidden",
  },
  itemPicImg: {
    resizeMode: "center",
    height: 130,
    width: 130,
  },
  bottom: {
    flex: 0.25,
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: sColor.colorDdd,
    position: "relative",
    backgroundColor: sColor.white,
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomNavList: {
    height: 70,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5,
    overflow: "hidden",
    backgroundColor: sColor.white,
  },
  bottomNavListActive: {
    height: 140,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5,
    overflow: "hidden",
    backgroundColor: sColor.white,
  },
  bottomNavItem: {
    width: (windowWidth - 30) / 4,
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    marginBottom: 8,
  },
  bottomNavItemPic: {
    width: 40,
    height: 40,
    resizeMode: "center",
  },
  bottomNavItemTitle: {
    color: sColor.color666,
  },
  bottomInputFa: {
    backgroundColor: sColor.white,
  },
  bottomInput: {
    paddingLeft: 15,
    paddingRight: 15,
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: sColor.colorEee,
    marginTop: 5,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: sColor.white,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorDdd,
  },
  bottomInputFaActive: {
    height: 110,
    paddingLeft: 15,
    paddingRight: 15,
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: sColor.colorEee,
    marginTop: 2,
    paddingTop: 2,
    backgroundColor: sColor.white,
  },
  bottomInputImg: {
    width: 35,
    height: 35,
    resizeMode: "cover",
  },
  bottomInputSendBtn: {
    color: sColor.white,
    width: 50,
    height: 35,
    lineHeight: 35,
    textAlign: "center",
    backgroundColor: sColor.mainRed,
    borderRadius: 5,
  },
  inputFa: {
    flex: 1,
  },
  input: {
    fontSize: 14,
    color: sColor.color666,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: sColor.colorDdd,
    borderRadius: 5,
    marginRight: 8,
    paddingTop: 12,
  },
  selectPic: {
    height: 0,
    overflow: "hidden",
  },
  selectPicActive: {
    overflow: "hidden",
    height: 90,
    backgroundColor: sColor.mainBgColor,
  },
  selectPicFa: {
    alignItems: "center",
    position: "relative",
  },
  selectImg: {
    width: 50,
    height: 50,
    resizeMode: "cover",
  },
  imgSelector: {
    position: "absolute",
    opacity: 0,
  },
  selectTitle: {
    color: sColor.color666,
    marginTop: 5,
  },
  showPic: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: sColor.color666,
    zIndex: 100,
  },
  howImgFa: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  showImg: {
    width: windowWidth - 30,
    height: windowHeight - 60,
    resizeMode: "center",
  },
  // 治疗方案
  treatmentPlan: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
  },
  treatmentPlanCenter: {
    backgroundColor: sColor.white,
    borderRadius: 5,
    padding: 15,
    position: "relative",
    overflow: "hidden",
  },
  treatmentPlanHeader: {
    paddingBottom: 15,
  },
  treatmentPlanHeaderImg: {
    width: 60,
    resizeMode: "center",
    marginRight: 15,
  },
  treatmentPlanHeaderTitle: {},
  treatmentPlanHeaderTheme: {
    color: sColor.color333,
    marginBottom: 5,
  },
  treatmentPlanHeaderTime: {
    color: sColor.color888,
  },
  treatmentPlanItem: {
    height: 45,
    lineHeight: 45,
    color: sColor.color666,
  },
  treatmentPlanBtn: {
    marginTop: 15,
    height: 35,
    lineHeight: 35,
    textAlign: "center",
    color: sColor.white,
    backgroundColor: sColor.mainRed,
    borderRadius: 5,
  },
  treatmentPlanFlag: {
    position: "absolute",
    top: -2,
    right: 30,
    width: 25,
    height: 35,
    resizeMode: "cover",
  },
  // 问诊单
  inquirySheet: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
  },
  inquirySheetContent: {
    padding: 15,
    backgroundColor: sColor.white,
    borderRadius: 5,
    position: "relative",
    overflow: "hidden",
  },
  inquirySheetHeader: {
    marginBottom: 15,
  },
  inquirySheetHeaderImg: {
    width: 60,
    resizeMode: "center",
    marginRight: 15,
  },
  inquirySheetHeaderTitle: {
    color: sColor.color333,
    marginBottom: 5,
  },
  inquirySheetHeaderTime: {
    color: sColor.color888,
  },
  inquirySheetPatient: {
    color: sColor.color333,
    height: 45,
    lineHeight: 45,
  },
  inquirySheetDetail: {
    color: sColor.color888,
    height: 45,
    lineHeight: 45,
  },
  inquirySheetFlag: {
    position: "absolute",
    top: -2,
    right: 30,
    width: 25,
    height: 35,
    resizeMode: "cover",
  },
  //患者自述
  patientsThemselves: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
  },
  patientsThemselvesContent: {
    padding: 15,
    backgroundColor: sColor.white,
  },
  patientsThemselvesHeader: {
    marginBottom: 20,
  },
  patientsThemselvesHeaderTitle: {
    color: sColor.color333,
    marginBottom: 10,
    textAlign: "center",
  },
  patientsThemselvesHeaderPatient: {
    justifyContent: "center",
  },
  patientsThemselvesHeaderPatientTitle: {
    color: sColor.color666,
  },
  dot: {
    width: 2,
    height: 2,
    borderRadius: 100,
    backgroundColor: sColor.color333,
    marginLeft: 5,
    marginRight: 5,
  },
  patientsThemeselvesPatient: {},
  patientsThemeselvesPatientTitle: {
    color: sColor.color888,
    marginBottom: 5,
  },
  patientsThemeselvesPatientDetail: {
    color: sColor.color333,
  },
  patientsThemeselvesPatientItem: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  patientsThemeselvesPatientPic: {
    marginBottom: 10,
    marginTop: 10,
  },
  patientsThemeselvesPatientImg: {
    width: 80,
    height: 80,
    resizeMode: "cover",
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
  },
})
