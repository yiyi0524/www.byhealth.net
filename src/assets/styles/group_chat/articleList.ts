import { windowWidth } from "@/services/api"
import { StyleSheet } from "react-native"
export default StyleSheet.create({
  main: {
    flex: 1,
    position: "relative",
    backgroundColor: "#fff",
  },
  search: {
    flex: 1,
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 19,
  },
  input: {
    fontSize: 14,
    color: "#999",
    textAlign: "left",
  },
  searchIcon: {
    color: "rgba(0,0,0,.45)",
    fontSize: 20,
  },
  theme: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  themeTitlePar: {
    marginRight: 20,
  },
  themeIcon: {
    width: 3,
    height: 9,
    marginRight: 5,
  },
  themeIconActive: {
    backgroundColor: "#ED5736",
  },
  themeTitle: {
    fontSize: 14,
    color: "#666",
  },
  themeTitleActive: {
    fontSize: 15,
    color: "#333",
    fontWeight: "700",
  },
  list: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  item: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EDEDED",
  },
  titlePar: {
    marginBottom: 9,
  },
  title: {
    fontSize: 15,
    color: "#3A3A3A",
    flex: 1,
    fontWeight: "700",
  },
  icon: {
    color: "#D3D3D3",
    fontSize: 18,
  },
  desc: {
    marginBottom: 9,
    fontSize: 14,
    color: "#7F7F7F",
  },
  time: {
    fontSize: 12,
    color: "#D4D2D2",
  },
  loading: {
    textAlign: "center",
    lineHeight: 80,
  },
})
