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
  categoryList: {
    marginTop: 8,
    backgroundColor: sColor.white,
  },
  categoryItem: {
    height: 45,
    lineHeight: 45,
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorEee,
  },
  categoryTitle: {
    color: sColor.color333,
    flex: 1,
  },
  contegoryIcon: {
    color: sColor.color999,
  },
})
