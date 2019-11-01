import global from "@/assets/styles/global"
import { GroupChatMember, listGroupChatApplyMember } from "@/services/groupChat"
import { TYPE } from "@/utils/constant"
import { getPicFullUrl } from "@/utils/utils"
import gImg from "@utils/img"
import gSass from "@utils/style"
import React, { Component } from "react"
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { NavigationScreenProp } from "react-navigation"
const style = gSass.groupChat.applyList
interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  groupChatId: number
  groupChatName: string
  list: GroupChatMember[]
}
type DefaultProps = {}

export default class ApplyList extends Component<Props & DefaultProps, State> {
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
        <TouchableOpacity>
          <Text> </Text>
        </TouchableOpacity>
      ),
    }
  }
  constructor(props: any) {
    super(props)
    this.state = this.getInitState(props)
  }
  getInitState = (props: Props): State => {
    let groupChatId = 0,
      groupChatName = ""
    if (props.navigation.state.params) {
      groupChatId = props.navigation.state.params.id
      groupChatName = props.navigation.state.params.name
    }
    return {
      groupChatId,
      groupChatName,
      list: [],
    }
  }
  componentDidMount() {
    this.init()
  }
  init = async () => {
    try {
      let { groupChatId } = this.state
      let listMode = listGroupChatApplyMember({
        page: -1,
        limit: -1,
        filter: { condition: TYPE.eq, val: groupChatId },
      })
      let {
        data: { list },
      } = await listMode
      this.setState({
        list,
      })
    } catch (err) {
      console.log(err)
    }
  }
  render() {
    let { list, groupChatName } = this.state
    return (
      <ScrollView style={style.main}>
        <View style={style.list}>
          {list.map((v, k) => {
            return (
              <View style={style.item} key={k}>
                <View style={[style.info, global.flex, global.aCenter]}>
                  <View style={style.avatarPar}>
                    <Image
                      style={style.avatar}
                      source={
                        v.avatar.url
                          ? { uri: getPicFullUrl(v.avatar.url) }
                          : gImg.common.defaultAvatar
                      }></Image>
                  </View>
                  <View style={style.right}>
                    <Text style={style.name} numberOfLines={1}>
                      {v.name}
                    </Text>
                    <Text style={style.desc} numberOfLines={1}>
                      希望能加入{groupChatName}。
                    </Text>
                  </View>
                </View>
                <View style={[style.btnPar, global.flex, global.aCenter, global.jBetween]}>
                  <TouchableOpacity onPress={() => this.reject(v.id)}>
                    <Text style={[style.btn, style.reject]}>拒绝</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.agree(v.id)}>
                    <Text style={[style.btn, style.agree]}>拒绝</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView>
    )
  }
  reject = (id: number) => {
    console.log("拒绝id" + id)
  }
  agree = (id: number) => {
    console.log("同意id" + id)
  }
}
