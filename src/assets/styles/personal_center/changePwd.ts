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
    flex: 1,
  },
  loadingTitle: {
    textAlign: "center",
  },
  main: {
    backgroundColor: sColor.mainBgColor,
  },
})
