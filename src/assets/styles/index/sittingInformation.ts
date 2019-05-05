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

  headerRight: {
    paddingRight: 15,
    color: sColor.mainRed,
  },
  main: {
    flex: 0.9,
    backgroundColor: sColor.mainBgColor,
  },
  content: {
    position: "relative",
  },
  header: {
    backgroundColor: sColor.white,
    paddingLeft: 15,
    paddingRight: 15,
    height: 45,
    lineHeight: 45,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorEee,
  },
  selectMedicalInstitution: {},
  selectMedicalInstitutionTitle: {
    color: sColor.color333,
    flex: 1,
    fontWeight: "500",
  },
  selectMedicalInstitutionTheme: {
    color: sColor.color666,
    textAlign: "right",
  },
  selectMedicalInstitutionIcon: {
    color: sColor.color888,
  },
  medicalInstitution: {
    backgroundColor: sColor.white,
    marginTop: 8,
  },
  medicalInstitutionList: {
    flex: 1,
  },
  medicalInstitutionItem: {
    height: 45,
    justifyContent: "center",
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorEee,
  },
  medicalInstitutionIcon: {
    width: 15,
    height: 15,
    backgroundColor: sColor.mainRed,
  },
  medicalInstitutionTitle: {
    color: sColor.color333,
    marginLeft: 10,
  },
  calendar: {
    marginTop: 8,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: sColor.white,
  },
})
