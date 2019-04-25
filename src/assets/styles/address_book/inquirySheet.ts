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
    flex: 0.9,
  },
  patientInfo: {
    margin: 15,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 5,
    padding: 15,
    backgroundColor: sColor.white,
  },
  patientInfoName: {
    color: sColor.mainBlack,
    textAlign: "center",
    marginBottom: 10,
  },
  patientInfoHeight: {
    marginBottom: 15,
  },
  patientInfoTitle: {
    color: sColor.color888,
    marginBottom: 5,
  },
  patientInfoDetail: {
    color: sColor.color333,
  },
  patientPic: {
    margin: 15,
    marginTop: 0,
    backgroundColor: sColor.white,
  },
  patientPicTitle: {
    color: sColor.color666,
    height: 45,
    lineHeight: 45,
    paddingLeft: 15,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorEee,
  },
  patientPicList: {
    padding: 15,
  },
  patientImg: {
    width: 80,
    height: 80,
    resizeMode: "cover",
    marginBottom: 8,
    marginLeft: 8,
    marginRight: 8,
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
    alignItems: "center",
  },
  showImg: {
    width: 350,
    height: 350,
    resizeMode: "center",
  },
  problems: {
    margin: 15,
    marginTop: 0,
    padding: 15,
    backgroundColor: sColor.white,
  },
  theme: {
    color: sColor.mainBlack,
    marginBottom: 15,
  },
  problem: {
    marginBottom: 10,
  },
  problemTitle: {
    color: sColor.color888,
    marginBottom: 5,
  },
  problemDetail: {
    color: sColor.color666,
  },
})
