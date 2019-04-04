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
  headerRight: {
    color: sColor.white,
    paddingRight: 15,
  },
  list: {
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: sColor.white,
  },
  item: {
    height: 60,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorDdd,
  },
  itemTitle: {
    flex: 1,
  },
  itemPic: {
    width: 40,
    height: 40,
    borderRadius: 100,
    overflow: "hidden",
    marginRight: 8,
  },
  itemImg: {
    width: 40,
    height: 40,
    resizeMode: "cover",
  },
  itemTheme: {
    color: sColor.color666,
  },
  itemIcon: {
    color: sColor.color888,
  },
})
