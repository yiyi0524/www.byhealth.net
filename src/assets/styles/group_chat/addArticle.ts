import { windowWidth } from "@/services/api"
import { StyleSheet } from "react-native"
export default StyleSheet.create({
  main: {
    flex: 1,
    position: "relative",
    backgroundColor: "#fff",
  },
  content: {
    flex: 0.9,
  },
  footer: {
    flex: 0.1,
    position: "relative",
  },
  btnPar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    paddingLeft: 35,
    paddingRight: 35,
  },
  btnContent: {
    height: 44,
    backgroundColor: "#ED5736",
    borderRadius: 22,
  },
  btn: {
    lineHeight: 44,
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
  },
  item: {},
  input: {},
  textarea: {},
})
