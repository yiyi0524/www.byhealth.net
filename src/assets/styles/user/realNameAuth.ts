import { StyleSheet, PixelRatio } from "react-native"
import sColor from "@styles/color"
import { windowHeight, windowWidth } from "@api/api"
import { s } from "@/services/user"
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
    backgroundColor: sColor.white,
    margin: 0,
    padding: 0,
    flex: 1,
    position: "relative",
  },
  content: {
    flex: 0.9,
    paddingBottom: 50,
  },
  header: {
    height: 45,
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorEee,
  },
  headerLeft: {
    width: 60,
  },
  headerLeftTitle: {
    color: sColor.color666,
  },
  headerTitle: {
    color: sColor.mainBlack,
  },
  Theme: {},
  ThemeTitle: {
    color: sColor.color888,
    height: 55,
    lineHeight: 55,
    flex: 1,
    textAlign: "center",
    backgroundColor: sColor.mainBgColor,
  },
  ThemeTitle_2: {
    color: sColor.color888,
    height: 90,
    padding: 15,
    lineHeight: 30,
    flex: 1,
    textAlign: "center",
    backgroundColor: sColor.mainBgColor,
  },
  form: {},
  separationModule: {
    flex: 1,
    height: 15,
    backgroundColor: sColor.mainBgColor,
  },
  formTitle: {
    height: 50,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorDdd,
  },
  formIcon: {
    width: 4,
    height: 30,
    backgroundColor: sColor.mainRed,
  },
  formThem: {
    color: sColor.color999,
    marginLeft: 5,
  },
  formImportant: {
    color: sColor.mainRed,
  },
  formAvatar: {
    height: 95,
    position: "relative",
    justifyContent: "center",
  },
  formItem: {
    height: 55,
    position: "relative",
    justifyContent: "center",
  },
  formItemTextarea: {
    height: 100,
    fontSize: 14,
    color: sColor.color888,
  },
  formItemPickerImage: {
    height: 55,
    position: "relative",
    justifyContent: "center",
    paddingLeft: 15,
  },
  formItemImg: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
  },
  fromItemTitle: {
    color: sColor.color999,
    marginLeft: 15,
    marginRight: 15,
  },
  fromItemTitle_2: {
    width: 160,
    color: sColor.colorCcc,
    marginLeft: 15,
  },
  hospital: {
    paddingRight: 15,
  },
  hospitalTitle: {
    color: sColor.color999,
  },
  input: {
    color: sColor.color666,
  },
  getVerificationCodeBtn: {
    position: "absolute",
    right: 10,
  },
  verificationCode: {
    width: 110,
    height: 30,
    backgroundColor: sColor.colorCcc,
    color: sColor.white,
    textAlign: "center",
    lineHeight: 30,
    borderRadius: 5,
  },
  pickerItem: {
    marginLeft: 15,
    height: 50,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorDdd,
  },
  formItemTitle: {
    color: sColor.color999,
  },
  pickerTitle: {
    width: 200,
    paddingRight: 15,
  },
  topItemTitle: {
    color: sColor.color999,
  },
  inputIcon: {
    color: sColor.color999,
    marginLeft: 3,
  },
  picker: {
    flex: 1,
  },
  agreement: {
    paddingLeft: 30,
    paddingRight: 30,
  },
  theme: {
    color: sColor.color888,
    marginRight: 15,
  },
  agreementName: {
    color: sColor.mainRed,
    marginRight: 15,
  },
  subBtn: {
    flex: 0.1,
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: sColor.colorDdd,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 8,
    paddingBottom: 5,
    height: 50,
  },
  subTitle: {
    height: 40,
    color: sColor.white,
    backgroundColor: sColor.mainRed,
    borderRadius: 5,
    lineHeight: 40,
    textAlign: "center",
  },
  hospitalSelect: {
    position: "absolute",
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: sColor.colorDdd,
    width: "100%",
    backgroundColor: sColor.white,
    height: windowHeight,
  },
  hospitalContent: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  hospitalAdd: {
    height: 55,
    paddingBottom: 8,
    position: "relative",
  },
  hospitalSearch: {
    borderRadius: 20,
    flex: 1,
  },
  hospitalSearchIcon: {
    fontSize: 20,
    color: sColor.color999,
  },
  hospitalInput: {
    color: sColor.color666,
  },
  closeBtn: {
    marginLeft: 15,
  },
  close: {
    textAlign: "right",
    color: sColor.color666,
  },
  hospitalList: {
    position: "relative",
  },
  hospitalItem: {
    height: 50,
    lineHeight: 50,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorDdd,
  },
  addHospital: {
    height: 50,
    lineHeight: 50,
  },
  addHospitalBtn: {
    color: sColor.mainRed,
    marginRight: 15,
  },
  // 擅长
  adeptSymptom: {
    position: "absolute",
    top: 1 / PixelRatio.get(),
    width: "100%",
    backgroundColor: sColor.white,
    height: windowHeight,
  },
  closeAdeptSymptom: {
    height: 50,
    lineHeight: 50,
    backgroundColor: sColor.mainRed,
    color: sColor.white,
    textAlign: "center",
    paddingLeft: 15,
    marginTop: -1,
  },
  adeptSymptomContent: {},
  symptomList: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  symptomTitle: {
    height: 45,
    lineHeight: 45,
    color: sColor.color888,
  },
  symptomItem: {
    padding: 12,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: sColor.colorDdd,
    marginLeft: 10,
    marginBottom: 10,
    color: sColor.color666,
    borderRadius: 5,
  },
  symptomItemActive: {
    padding: 12,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: sColor.mainRed,
    marginLeft: 10,
    marginBottom: 10,
    backgroundColor: sColor.mainRed,
    color: sColor.white,
    borderRadius: 5,
  },
  adeptSymptomIdList: {
    paddingTop: 15,
    paddingBottom: 15,
  },
  adeptSymptomIdItem: {
    padding: 8,
    backgroundColor: sColor.mainRed,
    color: sColor.white,
    marginLeft: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  previewPic: {
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: sColor.colorDdd,
    borderStyle: "dotted",
    padding: 15,
  },
  example: {
    width: 80,
    paddingTop: 2,
    paddingBottom: 2,
    textAlign: "center",
    height: 35,
    lineHeight: 35,
    backgroundColor: sColor.lightBlue,
    color: sColor.color888,
    marginTop: 5,
    marginBottom: 15,
  },
  previewPicRequirement: {
    color: sColor.color888,
    marginBottom: 5,
  },
  viewPic: {
    width: 150,
    height: 100,
    resizeMode: "cover",
  },
  picView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: sColor.mainBlack,
  },
  closePicView: {
    height: 45,
    lineHeight: 45,
    backgroundColor: sColor.mainBgColor,
    color: sColor.mainBlack,
    paddingLeft: 15,
  },
  viewImgFather: {
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  viewImg: {
    resizeMode: "center",
  },
})
