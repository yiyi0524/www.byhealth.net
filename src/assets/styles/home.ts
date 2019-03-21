import { StyleSheet } from "react-native";
import sColor from "@styles/color";
export default StyleSheet.create({
  main: {
    backgroundColor: sColor.white,
  },
  header: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,

  },
  headerAvatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  headerAvatar: {
    width: 60,
    height: 60,
    resizeMode: "cover",
  },
  headerTitle: {},
  headerName: {
    color: sColor.color333
  },
  headerVerifiedTitle: {
    color: sColor.color888,
  },
  headerMedicalQualification: {
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: sColor.mainYellow,
  },
  headerMedicalQualificationTitle: {
    color: sColor.color888,
  },
  headerMedicalQualificationIcon: {
    color: sColor.mainRed,
  },
  headerHelp: {},
  headerHelpTitle: {
    color: sColor.color333,
  },
});
