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
  main: {
    flex: 0.9,
    backgroundColor: sColor.mainBgColor,
  },
  headerRight: {
    paddingRight: 15,
    color: sColor.mainRed,
  },
  list: {},
  item: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorDdd,
    backgroundColor: sColor.white,
  },
  title: {
    color: sColor.color666,
    fontSize: 14,
    width: 120,
    paddingLeft: 15,
    paddingRight: 15,
  },
  picker: {
    flex: 1,
  },
  pickerItem: {
    flex: 1,
    fontSize: 14,
    color: sColor.color666,
    textAlign: "right",
    paddingRight: 15,
  },
  input: {
    width: windowWidth - 120,
    fontSize: 14,
    color: sColor.color666,
  },
  name: {
    flex: 1,
    fontSize: 14,
    color: sColor.color666,
    paddingRight: 15,
    paddingLeft: 15,
  },
  pickerIcon: {
    paddingRight: 15,
    color: sColor.color888,
  },
  icon: {
    color: sColor.color888,
  },
  hospital: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: sColor.white,
  },
  close: {
    height: 45,
    lineHeight: 45,
    textAlign: "center",
    backgroundColor: sColor.color666,
    color: sColor.white,
  },
  hospitalCenter: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  search: {
    marginTop: 10,
    fontSize: 14,
    color: sColor.color666,
  },
  hospitalList: {},
  hospitalItem: {
    height: 50,
    lineHeight: 50,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorDdd,
  },
  addHospital: {
    height: 50,
    lineHeight: 50,
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: sColor.colorDdd,
  },
  addHospitalBtn: {
    padding: 5,
    paddingLeft: 8,
    paddingRight: 8,
    color: sColor.white,
    backgroundColor: sColor.mainRed,
    textAlign: "center",
    borderRadius: 5,
  },
  addHospitalName: {
    color: sColor.color666,
    marginLeft: 10,
  },
})
