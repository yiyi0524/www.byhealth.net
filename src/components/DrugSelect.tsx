import global from "@/assets/styles/global"
import { Icon } from "@ant-design/react-native"
import sColor from "@styles/color"
import React, { Component } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, PixelRatio } from "react-native"
import { windowHeight, windowWidth } from "@/services/api"
import { activeDrugItem, drugItem } from "@/pages/advisory/OnlineOpening"
export interface CategoryItem {
  id: number
  title: string
}
interface Props {
  drugList: drugItem[]
  activeDrugList: activeDrugItem[]
  chooseDrug: (id: number) => void
  closeChooseDrug: () => void
}
interface State {}

export default class Pharmacy extends Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {}
  }
  render() {
    return (
      <View style={styles.main}>
        <TouchableOpacity onPress={this.props.closeChooseDrug}>
          <Icon style={styles.close} name="close" />
        </TouchableOpacity>
        <Text style={[styles.theme, global.fontSize14]}>请选择药房</Text>
        <View style={[styles.list, global.flex, global.justifyContentSpaceBetween]}>
          <ScrollView>
            <Text>asdfasdf</Text>
          </ScrollView>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  close: {
    color: sColor.white,
    fontSize: 22,
    height: 45,
    lineHeight: 45,
    paddingLeft: 15,
  },
  list: {
    backgroundColor: sColor.white,
    height: windowHeight,
    paddingBottom: 15,
  },
  theme: {
    height: 50,
    lineHeight: 50,
    textAlign: "center",
    color: sColor.color333,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorDdd,
    backgroundColor: sColor.white,
  },

  item: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  itemActive: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: sColor.white,
  },
  title: {
    color: sColor.color666,
  },
})
