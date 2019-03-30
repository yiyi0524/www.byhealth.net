import { StyleSheet, PixelRatio } from "react-native";
import sColor from "@styles/color";
import { windowWidth } from "@api/api";
import { windowHeight } from "@/utils/utils";
export default StyleSheet.create({
  loading: {
    width: windowWidth,
    height: windowHeight,
    backgroundColor: sColor.white,
    justifyContent: "center",
    flex: 1
  },
  detail: {
    flex: 1
  },
  loadingTitle: {
    textAlign: "center"
  },
  main: {
    backgroundColor: sColor.mainBgColor,
    flex: 0.9
  },
  header: {
    padding: 15,
    backgroundColor: sColor.lightRed
  },
  headerImg: {
    width: 50,
    height: 50,
    borderRadius: 100,
    overflow: "hidden"
  },
  headerPic: {
    width: 50,
    height: 50,
    resizeMode: "cover"
  },
  headerDescription: {
    marginLeft: 10
  },
  headerDescriptionTitle: {},
  headerDescriptionName: {
    color: sColor.white
  },
  headerDescriptionGender: {
    color: sColor.white,
    marginLeft: 10,
    marginRight: 10
  },
  headerDescriptionAge: {
    color: sColor.white
  },
  headerDescriptionRemarks: {
    marginTop: 5
  },
  headerDescriptionRemarksTitle: {
    color: sColor.white,
    marginRight: 10
  },
  headerDescriptionReamarksName: {
    color: sColor.white
  },
  headerDescriptionReamarksIcon: {
    color: sColor.white,
    marginLeft: 5
  },
  headerDescriptionPhone: {
    marginTop: 5
  },
  headerDescriptionPhoneTitle: {
    color: sColor.white
  },
  headerDescriptionPhoneDetail: {
    color: sColor.white,
    marginLeft: 10
  },
  physicalQuality: {
    height: 55,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: sColor.white
  },
  physicalQualityItem: {},
  physicalQualityItemTitle: {
    color: sColor.color999
  },
  physicalQualityItemDetail: {
    color: sColor.color333,
    marginTop: 5,
    fontWeight: "500"
  },
  physicalQualityItemLine: {
    height: 20,
    width: 1 / PixelRatio.get(),
    backgroundColor: sColor.colorDdd
  },
  medicalHistory: {
    marginTop: 8,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: sColor.white
  },
  medicalHistoryItem: {
    height: 45,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorDdd
  },
  medicalHistoryItemTitle: {
    color: sColor.color999
  },
  medicalHistoryItemDetail: {
    color: sColor.color333,
    marginLeft: 10
  },
  medicalRecordPic: {
    marginTop: 8,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: sColor.white
  },
  medicalRecordPicTitle: {},
  medicalRecordPicTitleName: {
    height: 45,
    lineHeight: 45,
    color: sColor.color999,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorDdd
  },
  medicalRecordPics: {
    paddingTop: 8,
    paddingBottom: 15
  },
  medicalRecordImg: {
    width: 70,
    height: 70,
    resizeMode: "cover",
    marginRight: 8,
    marginBottom: 8
  },
  showMode: {
    position: "absolute",
    flex: 1,
    backgroundColor: sColor.color333,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  showImg: {
    width: 350,
    height: 350,
    resizeMode: "center"
  },
  medicalRecord: {
    marginTop: 8,
    backgroundColor: sColor.white
  },
  medicalRecordTitleBox: {
    height: 45,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorDdd
  },
  medicalRecordIcon: {
    width: 6,
    height: 20,
    marginRight: 10,
    backgroundColor: sColor.mainRed
  },
  medicalRecordAdd: {
    color: sColor.mainRed,
    paddingRight: 15
  },
  medicalRecordTitle: {
    color: sColor.color333
  },
  medicalRecordAddIcon: {
    color: sColor.mainRed,
    paddingRight: 8
  },
  medicalRecordItem: {
    padding: 15,
    marginBottom: 8
  },
  medicalRecordItemTitle: {
    fontWeight: "500",
    color: sColor.color333,
    marginBottom: 10
  },
  medicalRecordItemSecondTitle: {
    fontWeight: "500",
    color: sColor.color333,
    marginBottom: 10,
    marginTop: 5
  },
  medicalRecordItemDetail: {
    color: sColor.color666,
    marginBottom: 10,
    lineHeight: 25
  },
  medicalRecordItemPicList: {},
  medicalRecordItemDoctorDiagnosis: {
    marginBottom: 5
  },
  medicalRecordItemDoctorDiagnosisTitle: {
    color: sColor.color333,
    fontWeight: "500",
    marginRight: 10
  },
  medicalRecordItemDoctorDiagnosisDetail: {
    color: sColor.color666,
    flex: 1,
    lineHeight: 25
  },
  medicalRecordItemReadMore: {
    color: sColor.color999,
    height: 45,
    lineHeight: 45,
    textAlign: "center"
  },
  medicalRecordItemReadMoreIcon: {
    color: sColor.color999,
    marginLeft: 5
  },
  bottomBtn: {
    flex: 0.1,
    height: 45,
    paddingLeft: 15,
    paddingRight: 15,
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: sColor.colorDdd
  },
  bottomTitle: {
    height: 40,
    width: (windowWidth - 45) / 2,
    backgroundColor: sColor.mainRed,
    color: sColor.white,
    borderRadius: 5,
    textAlign: "center",
    lineHeight: 45
  }
});
