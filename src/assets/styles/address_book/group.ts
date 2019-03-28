import { StyleSheet, PixelRatio } from "react-native";
import sColor from "@styles/color";
import { windowWidth } from "@api/api";
import { windowHeight } from "@/utils/utils";
export default StyleSheet.create({
  headerTitleLeft: {
    paddingRight: 15,
    color: sColor.mainRed
  },
  loading: {
    width: windowWidth,
    height: windowHeight,
    backgroundColor: sColor.white,
    justifyContent: "center",
    flex: 1
  },
  loadingTitle: {
    textAlign: "center"
  },
  main: {
    backgroundColor: sColor.mainBgColor
  },
  patientGroupList: {
    marginTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: sColor.white
  },
  patientGroupItem: {
    height: 70,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorDdd
  },
  patientGroupItemTitle: {
    flex: 1
  },
  patientGroupTitle: {},
  patientGroupCount: {
    marginLeft: 10,
    color: sColor.color333
  },
  patientGroupDescription: {
    marginTop: 5
  },
  patientGroupNames: {
    color: sColor.color888,
    marginRight: 5
  },
  deletePatientGroupIcon: {
    color: sColor.mainRed,
    width: 34
  },
  patientGroupIcon: {
    color: sColor.color888
  },
  addPatientGroup: {
    height: 50
  },
  addPatientGroupBtn: {
    color: sColor.mainRed,
    marginRight: 5
  },
  addPatientGroupTitle: {
    color: sColor.color666
  }
});
