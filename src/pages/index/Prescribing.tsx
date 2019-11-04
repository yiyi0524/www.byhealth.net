import React, { Component } from "react"
import gSass from "@utils/style"
import { ScrollView, PixelRatio, TouchableOpacity, View } from "react-native"
import sColor from "@styles/color"
import { InputItem, Icon } from "@ant-design/react-native"
const style = gSass.index.prescribing
interface Props {}
interface State {
  page: number
  limit: number
  count: number
  filter: Record<string, any>
  search: string
}
type DefaultProps = {}

export default class Prescribing extends Component<Props & DefaultProps, State> {
  static defaultProps: DefaultProps
  static navigationOptions = () => ({
    title: "立即开方",
    headerStyle: {
      backgroundColor: sColor.white,
      height: 50,
      elevation: 0,
      color: sColor.mainBlack,
      borderBottomWidth: 1 / PixelRatio.get(),
      borderBottomColor: sColor.colorEee,
    },
    headerTintColor: sColor.color333,
    headerTitleStyle: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      fontSize: 14,
      textAlign: "center",
    },
    headerRight: <TouchableOpacity></TouchableOpacity>,
  })
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      page: 1,
      limit: 10,
      count: 0,
      filter: {},
      search: "",
    }
  }
  render() {
    let { search } = this.state
    return (
      <ScrollView style={style.main}>
        <View style={style.search}>
          <InputItem style={style.input} value={search}>
            <Icon name="search" />
          </InputItem>
        </View>
      </ScrollView>
    )
  }
}
