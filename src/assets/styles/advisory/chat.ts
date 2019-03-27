import { StyleSheet, PixelRatio } from "react-native";
import sColor from "@styles/color";
import { windowWidth } from "@api/api";
import { windowHeight } from "@/utils/utils";
export default StyleSheet.create({
  loading: {
    width: windowWidth,
    height: windowHeight,
    backgroundColor: sColor.white,
    justifyContent: "center",
    flex: 1
  },
  loadingTitle: {
    textAlign: "center"
  }
});
