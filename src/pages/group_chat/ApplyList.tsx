import global from '@/assets/styles/global'
import { agreeJoin, GroupChat, listGroupChat, rejectJoin } from '@/services/groupChat'
import { getPicFullUrl } from '@/utils/utils'
import { Toast } from '@ant-design/react-native'
import gImg from '@utils/img'
import { RouteProp } from '@react-navigation/native'
import { AllScreenParam } from '@/routes/bottomNav'
import gSass from '@utils/style'
import React, { Component } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
const style = gSass.groupChat.applyList
interface Props {
  navigation: StackNavigationProp<AllScreenParam, 'ApplyList'>
  route: RouteProp<AllScreenParam, 'ApplyList'>
}
interface State {
  groupChatId: number
  groupChatName: string
  list: GroupChat['applyList']
}
type DefaultProps = {}

export default class ApplyList extends Component<Props & DefaultProps, State> {
  static defaultProps: DefaultProps
  constructor(props: any) {
    super(props)
    this.state = this.getInitState(props)
  }
  getInitState = (props: Props): State => {
    const { id: groupChatId, name: groupChatName } = props.route.params
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
      let { groupChatId, list } = this.state
      let memberListMode = listGroupChat({
        page: -1,
        limit: -1,
        filter: {},
      })
      let {
        data: { list: groupList },
      } = await memberListMode
      for (let v of groupList) {
        if (v.id === groupChatId) {
          list = v.applyList
        }
      }
      this.setState({
        list,
      })
    } catch (err) {
      console.log(err)
    }
  }
  render() {
    let { list } = this.state
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
                      source={v.avatar.url ? { uri: getPicFullUrl(v.avatar.url) } : gImg.common.defaultAvatar}
                    />
                  </View>
                  <View style={style.right}>
                    <Text style={style.name} numberOfLines={1}>
                      {v.nick}
                    </Text>
                    {/* <Text style={style.desc} numberOfLines={1}>
                      希望能加入{groupChatName}。
                    </Text> */}
                  </View>
                </View>
                <View style={[style.btnPar, global.flex, global.aCenter, global.jBetween]}>
                  <TouchableOpacity onPress={() => this.reject(v.id)}>
                    <Text style={[style.btn, style.reject]}>拒绝</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.agree(v.id)}>
                    <Text style={[style.btn, style.agree]}>同意</Text>
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
    let { groupChatId: groupId } = this.state
    rejectJoin({ id, groupId })
      .then(() => {
        Toast.success('操作成功', 1, this.init)
      })
      .catch(err => {
        Toast.fail('操作失败, 错误信息: ' + err.msg, 3)
      })
  }
  agree = (id: number) => {
    let { groupChatId: groupId } = this.state
    agreeJoin({ id, groupId })
      .then(() => {
        Toast.success('操作成功', 1, this.init)
      })
      .catch(err => {
        Toast.fail('操作失败, 错误信息: ' + err.msg, 3)
      })
  }
}
