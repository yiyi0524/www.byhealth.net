import sColor from "@styles/color"
import { StyleSheet } from "react-native"
import { windowWidth } from "@/services/api"
import { windowHeight } from "@/utils/utils"
export default StyleSheet.create({
  icon: {
    color: "#E95937",
    paddingRight: 15,
  },
  main: {
    flex: 1,
    position: "relative",
  },
  msgList: {
    flex: 0.8,
    backgroundColor: "#F2F2F2",
  },
  footer: {
    flex: 0.2,
    position: "relative",
  },
})
