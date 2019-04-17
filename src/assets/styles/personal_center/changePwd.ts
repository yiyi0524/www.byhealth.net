import { windowHeight } from "@/utils/utils"
import { windowWidth } from "@api/api"
import sColor from "@styles/color"
import { PixelRatio, StyleSheet } from "react-native"
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
  },
  list: {
    paddingRight: 15,
  },
  item: {
    position: "relative",
    height: 50,
  },
  input: {
    fontSize: 14,
    color: sColor.color666,
  },
  // verification: {
  //   position: "absolute",
  //   right: 10,
  //   top: 5,
  // },
  // verificationTitle: {
  //   borderRadius: 25,
  //   height: 30,
  //   lineHeight: 30,
  //   paddingLeft: 15,
  //   paddingRight: 15,
  //   backgroundColor: sColor.mainRed,
  //   color: sColor.white,
  // },
  btn: {
    marginLeft: 30,
    marginRight: 30,
    height: 45,
    lineHeight: 45,
    textAlign: "center",
    backgroundColor: sColor.mainRed,
    borderRadius: 5,
    color: sColor.white,
    marginTop: 30,
  },
})
