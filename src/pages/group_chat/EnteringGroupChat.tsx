import React, { Component } from "react"
import { View, TouchableOpacity } from "react-native"
import { NavigationScreenProp, ScrollView } from "react-navigation"
import { Icon } from "@ant-design/react-native"
import gSass from "@utils/style"
const style = gSass.groupChat.enter
interface Props {
  navigation: NavigationScreenProp<any>
}
interface State {
  groupChatId: number
}
type DefaultProps = {}

export default class EnteringGroupChat extends Component<Props & DefaultProps, State> {
  static defaultProps: DefaultProps
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<State> }) => {
    let title = ""
    if (navigation.state.params) {
      title = navigation.state.params.name
    }
    return {
      title,
      headerStyle: {
        backgroundColor: "#fff",
        height: 45,
        elevation: 0,
        borderColor: "#E3E3E3",
      },
      headerTintColor: "#333",
      headerTitleStyle: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        textAlign: "center",
      },
      headerRight: (
        <TouchableOpacity
          onPress={() => {
            // navigation.push(pathMap.GroupChatDetail, {
            //   id: navigation.getParam("id"),
            // })
          }}>
          <Icon size="md" style={style.icon} name="menu" />
        </TouchableOpacity>
      ),
    }
  }
  constructor(props: any) {
    super(props)
    this.state = this.getInitState(props)
  }
  getInitState = (props: Props): State => {
    let groupChatId = props.navigation.getParam("id")
    return {
      groupChatId,
    }
  }
  render() {
    return (
      <View style={style.main}>
        <ScrollView style={style.msgList}></ScrollView>
        <View style={style.footer}></View>
      </View>
    )
  }
}
