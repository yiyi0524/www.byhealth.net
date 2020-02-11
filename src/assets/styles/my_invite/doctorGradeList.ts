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
    flex: 1,
  },
  theme: {
    backgroundColor: "#05A4A5",
    height: 50,
    lineHeight: 50,
    paddingLeft: 16,
    paddingRight: 16,
  },
  themeTitle: {
    fontSize: 18,
    color: "#fff",
  },
  themeCount: {
    fontSize: 14,
    color: "#fff",
  },
  themeNum: {
    fontSize: 18,
    fontWeight: "700",
    paddingLeft: 10,
    color: "#fff",
  },
  header: {
    height: 79,
    paddingTop: 13,
    backgroundColor: "#05A4A5",
  },
  year: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  themeHeight: {
    height: 35,
  },
  iconPar: {
    width: 40,
  },
  iconLeft: {
    textAlign: "left",
  },
  icon: {
    textAlign: "right",
    fontSize: 16,
    color: "#fff",
  },
  time: {
    fontSize: 13,
    color: "#fff",
  },
  list: {
    padding: 16,
    paddingTop: 17,
  },
  item: {
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 15,
    paddingLeft: 16,
    paddingRight: 16,
  },
  title: {
    fontSize: 18,
    color: "#333",
    fontWeight: "700",
  },
  desc: {
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginRight: 10,
  },
  money: {},
  moneyLabel: {
    fontSize: 15,
    color: "#666",
    marginRight: 10,
  },
  moneyNum: {
    fontSize: 20,
    color: "#FF3B3B",
  },
})
