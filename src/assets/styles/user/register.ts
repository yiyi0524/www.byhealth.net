import { StyleSheet, PixelRatio } from "react-native";
import sColor from "@styles/color";
import { windowHeight } from "@api/api";
export default StyleSheet.create({
  main: {
    backgroundColor: sColor.white,
    margin: 0,
    padding: 0,
    flex: 1,
  },
  content: {
    flex: 0.9,
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
  logo: {
    alignItems: "center",
  },
  logoImg: {
    width: 160,
    height: 40,
    resizeMode: "contain",
    marginTop: 20,
  },
  form: {
    padding: 15,
    paddingRight: 30,
  },
  formItem: {
    height: 55,
    position: "relative",
    justifyContent: "center",
  },
  input: {
    color: sColor.color666,
  },
  getVerificationCodeBtn: {
    position: "absolute",
    right: 10,
  },
  verificationCode: {
    width: 100,
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
  },
  topItemTitle: {
    color: sColor.color999,
  },
  inputIcon: {
    color: sColor.color999,
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
    paddingLeft: 15,
    paddingRight: 15,
  },
  subTitle: {
    height: 50,
    color: sColor.white,
    backgroundColor: sColor.mainRed,
    borderRadius: 5,
    lineHeight: 50,
    textAlign: "center",
  },
});
