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
    resizeMode: "contain",
  },
  headerRight: {
    paddingRight: 15,
    color: sColor.mainRed,
  },
  headerTitle: {
    fontSize: 14,
    color: sColor.mainRed,
  },
  main: {
    backgroundColor: sColor.mainBgColor,
    position: "relative",
    height: windowHeight,
  },
  btn: {
    position: "relative",
    backgroundColor: sColor.mainBgColor,
    marginBottom: 10,
  },
  btnPar: {
    height: 40,
    paddingLeft: 8,
    paddingRight: 8,
  },
  btnBg: {
    backgroundColor: sColor.mainRed,
    borderRadius: 5,
  },
  btnTitle: {
    lineHeight: 40,
    textAlign: "center",
    fontSize: 14,
    color: "#fff",
  },
  content: {
    flex: 1,
    marginTop: 8,
    marginBottom: 8,
  },
  item: {
    backgroundColor: "#fff",
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: "#eee",
    padding: 12,
  },
  title: {
    fontSize: 14,
    color: "#666",
    width: 110,
  },
  titleCenter: {
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  list: {},
  picItem: {
    width: "33%",
    height: 110,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: "#eee",
  },
  pic: {
    width: 110,
    height: 110,
    resizeMode: "contain",
  },
  showMode: {
    position: "absolute",
    backgroundColor: sColor.color333,
    top: 0,
    left: 0,
    height: windowHeight,
  },
  showImg: {
    width: 350,
    height: 350,
    resizeMode: "contain",
  },
  showImgPar: {
    position: "relative",
    width: windowWidth,
    height: windowHeight,
    top: 15,
  },
  close: {
    padding: 15,
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 10,
  },
  closeIcon: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    borderWidth: 2,
    borderColor: "#fff",
    width: 30,
    height: 30,
    borderRadius: 100,
    lineHeight: 30,
  },
})
