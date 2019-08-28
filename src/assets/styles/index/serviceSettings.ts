import { windowHeight } from "@/utils/utils"
import { windowWidth } from "@api/api"
import sColor from "@styles/color"
import { StyleSheet } from "react-native"
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
    resizeMode: "contain",
  },
  main: {
    flex: 0.9,
    backgroundColor: sColor.mainBgColor,
  },
  explain: {
    padding: 8,
    marginTop: 8,
    backgroundColor: sColor.white,
  },
  header: {
    marginBottom: 8,
  },
  headerIcon: {
    width: 4,
    height: 20,
    backgroundColor: sColor.mainRed,
  },
  headerTitle: {
    color: sColor.mainBlack,
  },
  detail: {
    color: sColor.color888,
  },
})
