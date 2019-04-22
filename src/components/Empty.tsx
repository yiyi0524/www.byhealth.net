import React, { Component } from "react"
import { StyleSheet, View, Image } from "react-native"
import gImg from "@utils/img"

interface Props {}
interface State {}
export default class Empty extends Component<Props, State> {
  render() {
    return (
      <View style={styles.main}>
        <Image style={styles.img} source={gImg.home.empty} />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  main: {
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    flex: 1,
  },
  img: {
    width: 120,
    resizeMode: "center",
  },
})
