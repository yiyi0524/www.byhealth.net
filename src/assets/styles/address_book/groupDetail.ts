import { StyleSheet, PixelRatio } from "react-native"
import sColor from "@styles/color"
import { windowWidth } from "@api/api"
import { windowHeight } from "@/utils/utils"
export default StyleSheet.create({
  headerTitleLeft: {
    color: sColor.mainRed,
    paddingRight: 15,
  },
  loading: {
    width: windowWidth,
    height: windowHeight,
    backgroundColor: sColor.white,
    justifyContent: "center",
    flex: 1,
  },
  loadingTitle: {
    textAlign: "center",
  },
  main: {
    backgroundColor: sColor.mainBgColor,
  },
  header: {
    marginTop: 10,
    backgroundColor: sColor.white,
  },
  selectHeader: {
    backgroundColor: sColor.white,
  },
  headerInput: {
    color: sColor.color999,
  },
  searchIcon: {
    color: sColor.color888,
  },
  patientTitle: {
    flex: 1,
    height: 45,
    lineHeight: 45,
    backgroundColor: sColor.white,
    marginTop: 15,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorDdd,
  },
  selectpatientTitle: {
    flex: 1,
    height: 45,
    lineHeight: 45,
    paddingLeft: 15,
    backgroundColor: sColor.white,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorDdd,
  },
  selectPatient: {
    flex: 1,
    height: 45,
    lineHeight: 45,
    paddingLeft: 15,
    backgroundColor: sColor.mainBgColor,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorDdd,
  },
  patientList: {
    backgroundColor: sColor.white,
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 8,
  },
  patientItem: {
    height: 50,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorEee,
  },
  patientItemAvatar: {
    width: 40,
    height: 40,
    borderRadius: 100,
    overflow: "hidden",
    marginRight: 10,
  },
  patientAvatar: {
    width: 40,
    height: 40,
    resizeMode: "center",
  },
  patientName: {
    color: sColor.color333,
    marginRight: 15,
  },
  patientItemDescription: {
    flex: 1,
  },
  patientDescription: {
    borderWidth: 1 / PixelRatio.get(),
    borderColor: sColor.colorDdd,
    paddingLeft: 3,
    paddingRight: 3,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 25,
  },
  patientGender: {
    width: 15,
    height: 15,
    resizeMode: "center",
    marginRight: 2,
  },
  patientAge: {
    color: sColor.color888,
  },
  selectIcon: {
    color: sColor.color999,
  },
  selectIconActive: {
    color: sColor.mainRed,
  },
  submitBtn: {
    flex: 0.1,
    height: 50,
    backgroundColor: sColor.mainRed,
  },
  submit: {
    height: 50,
    lineHeight: 50,
    textAlign: "center",
    color: sColor.white,
    backgroundColor: sColor.mainRed,
  },
})
