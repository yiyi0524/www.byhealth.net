import global from "@/assets/styles/global"
import pathMap from "@/routes/pathMap"
import { windowHeight, windowWidth } from "@/services/api"
import { Icon } from "@ant-design/react-native"
import sColor from "@styles/color"
import React, { Component } from "react"
import { PixelRatio, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { NavigationScreenProp } from "react-navigation"
import { drugItem } from "@/pages/advisory/SquareRoot"
export interface CategoryItem {
  id: number
  name: string
}
interface Props {
  navigation: NavigationScreenProp<State>
  categoryList: CategoryItem[]
  activeId: number
  chooseDrugInfo: Record<number, { count: number; info: drugItem }>
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
        <ScrollView>
          <View style={[styles.list, global.flex, global.justifyContentSpaceBetween]}>
            <View style={styles.listLeft}>
              {this.props.categoryList.map(category => {
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={this.props.activeId === category.id ? styles.itemActive : styles.item}
                    onPress={() => this.props.chooseCategory(category.id)}>
                    <Text style={[styles.title, global.fontSize14]} key={category.id}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
            <View style={styles.listRight}>
              <TouchableOpacity
                style={styles.listRightItem}
                onPress={() => {
                  this.props.navigation.push(pathMap.DrugSelect, {
                    categoryList: this.props.categoryList,
                    activeId: this.props.activeId,
                    chooseDrugInfo: this.props.chooseDrugInfo,
                  })
                  this.props.closeChooseCategory()
                }}>
                <Text style={[styles.listRightTitle, global.fontSize14]}>精选药房</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  },
  listRightTitle: {
    color: sColor.color666,
    height: 50,
    lineHeight: 50,
    paddingLeft: 15,
    backgroundColor: sColor.colorEee,
  },
})
