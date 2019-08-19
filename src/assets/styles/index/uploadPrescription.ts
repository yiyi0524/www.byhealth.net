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
    flex: 1,
    position: "relative",
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
  },
  item: {
    backgroundColor: "#fff",
    paddingLeft: 8,
    paddingRight: 8,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 14,
    color: "#666",
  },
  detail: {
    flex: 1,
  },
  input: {
    fontSize: 14,
    color: "#666",
  },
  titlePar: {
    width: 70,
  },
  titleCenter: {
    lineHeight: 40,
  },
  uploadImg: {
    paddingTop: 8,
  },
  example: {
    marginTop: 15,
  },
  imgPar: {
    marginLeft: 15,
  },
  img: {
    width: 80,
    height: 150,
    resizeMode: "contain",
    borderWidth: 1 / PixelRatio.get(),
    borderColor: "#eee",
  },
  tips: {
    padding: 20,
  },
  tipsTitle: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  important: {
    color: sColor.mainRed,
  },
  servicePhone: {
    marginTop: 8,
    marginBottom: 20,
  },
  icon: {
    fontSize: 18,
    color: sColor.mainRed,
    marginRight: 8,
  },
  phoneTitle: {
    fontSize: 15,
    color: "#333",
  },
  phone: {
    fontSize: 14,
    color: sColor.mainRed,
  },
  imPargShow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgb(0,0,0)",
  },
  imgShow: {
    width: windowWidth,
    height: windowHeight,
    resizeMode: "contain",
  },
})
