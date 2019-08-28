import global from "@/assets/styles/global"
import { PrescriptionDrugCategory } from "@/pages/advisory/SquareRoot"
import pathMap from "@/routes/pathMap"
import { windowHeight, windowWidth } from "@/services/api"
import { Icon } from "@ant-design/react-native"
import sColor from "@styles/color"
import React, { Component } from "react"
import { PixelRatio, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { NavigationScreenProp } from "react-navigation"
export interface CategoryItem {
  id: number
  name: string
}
interface Props {
  navigation: NavigationScreenProp<State>
  categoryList: CategoryItem[]
  activeId: number
  isInSession?: boolean
  prescriptionDrugCategoryList: PrescriptionDrugCategory[]
  chooseCategory: (id: number) => void
  closeChooseCategory: () => void
}
interface State {}
export default class Pharmacy extends Component<Props, State> {
  static defaultProps = {
    isInSession: false,
  }
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
        <Text style={[styles.theme, global.fontSize14]}>请选择药品分类</Text>
        <ScrollView>
          <View style={[styles.list, global.flex, global.justifyContentSpaceBetween]}>
            <View style={styles.listLeft}>
              {this.props.categoryList.map(category => {
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={this.props.activeId === category.id ? styles.item : styles.item}
                    onPress={async () => {
                      const {
                        chooseCategory,
                        navigation,
                        activeId,
                        categoryList,
                        prescriptionDrugCategoryList,
                        isInSession,
                      } = this.props
                      await chooseCategory(category.id)
                      await navigation.push(pathMap.DrugSelect, {
                        categoryList,
                        activeId: category.id,
                        isInSession,
                        prescriptionDrugCategoryList,
                      })
                      await this.props.closeChooseCategory()
                    }}>
                    <Text style={[styles.title, global.fontSize14]} key={category.id}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                )
              })}
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
    // width: 100,
    flex: 1,
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
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorEee,
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
