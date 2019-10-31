import sColor from "@styles/color"
import { StyleSheet } from "react-native"
import { windowWidth } from "@/services/api"
import { windowHeight } from "@/utils/utils"
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
    position: "relative",
    flex: 1,
  },
  tabs: {
    height: 50,
    borderBottomWidth: 1,
    borderColor: "#E3E3E3",
  },
  tabChild: {
    width: 60,
    marginLeft: 30,
    marginRight: 30,
    height: 50,
  },
  active: {
    borderBottomWidth: 1,
    borderColor: sColor.mainRed,
    color: "#354048",
    fontSize: 15,
  },
  tabChildTitle: {
    lineHeight: 48,
    textAlign: "center",
    fontSize: 14,
    color: "#909090",
  },
  tab: {
    flex: 1,
  },
  group: {
    height: "100%",
    padding: 15,
  },
  search: {
    backgroundColor: "#F5F5F5",
    height: 35,
    borderRadius: 19,
    marginBottom: 15,
    paddingLeft: 15,
  },
  searchInputPar: {
    width: 180,
    overflow: "hidden",
  },
  searchInput: {
    fontSize: 13,
    color: "#999999",
  },
  searchIcon: {
    color: "rgba(0, 0, 0, 0.45)",
  },
  list: {
    position: "relative",
  },
  item: {
    marginBottom: 20,
  },
  avatarPar: {
    width: 50,
    height: 50,
    borderRadius: 100,
    overflow: "hidden",
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  info: {
    flex: 1,
  },
  title: {},
  name: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    fontWeight: "600",
  },
  add: {
    fontSize: 12,
    color: "#ED5736",
    marginLeft: 8,
  },
  descPar: {
    marginTop: 3,
  },
  desc: {
    flex: 1,
    fontSize: 12,
    color: "#C7C7C7",
  },
  tags: {
    marginLeft: 8,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 13,
    backgroundColor: "#ED5736",
    fontSize: 10,
    color: "#fff",
  },
  addTime: {
    fontSize: 10,
    color: "#C1C1C1",
    marginLeft: 8,
  },
})
