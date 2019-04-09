import global from "@/assets/styles/global"
import { Icon } from "@ant-design/react-native"
import sColor from "@styles/color"
import React, { Component } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, PixelRatio } from "react-native"
import { windowHeight, windowWidth } from "@/services/api"
export interface CategoryItem {
  id: number
  title: string
}
interface Props {
  categoryList: CategoryItem[]
  activeId: number
  chooseCategory: (id: number) => void
  closeChooseCategory: () => void
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
        <TouchableOpacity onPress={this.props.closeChooseCategory}>
          <Icon style={styles.close} name="close" />
        </TouchableOpacity>
        <Text style={[styles.theme, global.fontSize14]}>请选择药房</Text>
        <View style={[styles.list, global.flex, global.justifyContentSpaceBetween]}>
          <ScrollView>
            <View style={styles.listLeft}>
              {this.props.categoryList.map(category => {
                return (
                  <TouchableOpacity
                    style={this.props.activeId === category.id ? styles.itemActive : styles.item}
                    onPress={() => this.props.chooseCategory(category.id)}>
                    <Text style={[styles.title, global.fontSize14]} key={category.id}>
                      {category.title}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </ScrollView>
          <ScrollView>
            <View style={styles.listRight}>
              <View style={styles.listRightItem}>
                <Text style={[styles.listRightTitle, global.fontSize14]}>优先药房</Text>
              </View>
            </View>
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
    marginTop: 100,
    color: sColor.white,
    fontSize: 22,
    paddingLeft: 15,
    paddingBottom: 15,
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
  listLeft: {
    width: 100,
    backgroundColor: sColor.mainBgColor,
  },
  listRight: {
    width: windowWidth - 100,
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
  listRightItem: {
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorEee,
    paddingLeft: 15,
  },
  listRightTitle: {
    color: sColor.color666,
    height: 50,
    lineHeight: 50,
  },
})
