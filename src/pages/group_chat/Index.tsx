import global from "@/assets/styles/global"
import gImg from "@utils/img"
import gSass from "@utils/style"
import React, { Component } from "react"
import { Image, ScrollView, Text, View, RefreshControl } from "react-native"
import { Toast, InputItem, Icon, Modal } from "@ant-design/react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { TAB, TAB_ZH, listGroupChat, STATUS, GroupChat, addGroupChat } from "@/services/groupChat"
import { TYPE } from "@/utils/constant"
import Empty from "@/components/Empty"
import moment from "moment"
import { NavigationScreenProp } from "react-navigation"
import pathMap from "@/routes/pathMap"
import { getPicFullUrl } from "@/utils/utils"
const style = gSass.groupChat.index

interface Props {
  navigation: NavigationScreenProp<any>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  isAddGroupChat: boolean
  groupChatId: number
  page: number
  limit: number
  groupChatName: string
  filter: Record<string, any>
  currentPage: number
  search: string
  list: GroupChat[]
}
type DefaultProps = {}

export default class Index extends Component<Props & DefaultProps, State> {
  static defaultProps: DefaultProps
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      isAddGroupChat: false,
      currentPage: TAB.MY_GROUP_CHAT,
      groupChatId: 0,
      groupChatName: "",
      page: -1,
      limit: -1,
      filter: {},
      search: "",
      list: [],
    }
  }
  componentDidMount() {
    this.init()
  }
  init = async () => {
    try {
      this.listGroupChat()
      this.setState({
        hasLoad: true,
      })
    } catch (err) {
      console.log(err)
    }
  }
  listGroupChat = async () => {
    let { page, limit, currentPage, filter, search } = this.state
    try {
      if (currentPage === TAB.GROUP_CHAT) {
        filter = {
          status: {
            condition: TYPE.eq,
            val: STATUS.NOT_JOINED,
          },
          search: {
            condition: TYPE.eqString,
            val: search,
          },
        }
      } else {
        filter = {
          status: {
            condition: TYPE.eq,
            val: STATUS.JOINED,
          },
          search: {
            condition: TYPE.eqString,
            val: search,
          },
        }
      }
      let listGroupChatMode = listGroupChat({ page, limit, filter })
      let {
        data: { list },
      } = await listGroupChatMode
      this.setState({
        list,
      })
    } catch (err) {
      console.log(err)
    }
  }
  onRefresh = () => {
    this.setState({ refreshing: true })
    Promise.all([this.init(), new Promise(s => setTimeout(s, 500))])
      .then(_ => {
        this.setState({ refreshing: false })
      })
      .catch(err => {
        Toast.fail("刷新失败,错误信息: " + err.msg)
      })
  }
  render() {
    let { hasLoad, currentPage } = this.state
    if (!hasLoad) {
      return (
        <View style={style.loading}>
          <View style={style.loadingPic}>
            <Image style={style.loadingImg} source={gImg.common.loading} />
          </View>
        </View>
      )
    }
    return (
      <View style={style.main}>
        <View style={[style.tabs, global.flex, global.jCenter]}>
          <TouchableOpacity style={[style.tabChild]} onPress={() => this.changeTab(0)}>
            <Text
              style={[style.tabChildTitle, currentPage === TAB.GROUP_CHAT ? style.active : null]}>
              {TAB_ZH[TAB.GROUP_CHAT]}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[style.tabChild]} onPress={() => this.changeTab(1)}>
            <Text
              style={[
                style.tabChildTitle,
                currentPage === TAB.MY_GROUP_CHAT ? style.active : null,
              ]}>
              {TAB_ZH[TAB.MY_GROUP_CHAT]}
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          keyboardShouldPersistTaps="always"
          style={style.tab}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }>
          {this.groupChat()}
        </ScrollView>
      </View>
    )
  }
  //改变tab
  changeTab = (currentPage: number) => {
    this.setState(
      {
        currentPage,
      },
      this.listGroupChat,
    )
  }
  groupChat = () => {
    let { search, list, currentPage, isAddGroupChat } = this.state
    return (
      <View style={style.group}>
        <View
          style={[
            currentPage === TAB.GROUP_CHAT ? style.search : global.hidden,
            global.flex,
            global.aCenter,
            global.jCenter,
          ]}>
          <Icon style={style.searchIcon} size="sm" name="search" />
          <View style={style.searchInputPar}>
            <InputItem
              clear
              last
              style={style.searchInput}
              value={search}
              onChange={search => {
                this.setState(
                  {
                    search,
                  },
                  this.listGroupChat,
                )
              }}
              placeholder='大家都在搜 " 口腔医疗 "'
            />
          </View>
        </View>
        <View style={style.list}>
          {list.length > 0 ? (
            list.map((v, k) => {
              let joinedTime = v.joinedTime ? this.getTime(v.joinedTime) : ""
              return (
                <TouchableOpacity
                  style={[style.item, global.flex, global.aCenter]}
                  key={k}
                  onPress={() => this.addOrDetail(v.id, v.title)}>
                  <View style={style.avatarPar}>
                    <Image
                      style={style.avatar}
                      source={
                        v.pic.url ? { uri: getPicFullUrl(v.pic.url) } : gImg.common.defaultAvatar
                      }></Image>
                    {/* <Image style={style.avatar} source={gImg.common.defaultAvatar}></Image> */}
                  </View>
                  <View style={style.info}>
                    <View style={[style.title, global.flex, global.jBetween]}>
                      <Text style={style.name} numberOfLines={1}>
                        {v.title}
                      </Text>
                      {currentPage === TAB.GROUP_CHAT ? (
                        <Text style={style.add}>立即加入</Text>
                      ) : (
                        <Text style={style.addTime}>{joinedTime}</Text>
                      )}
                    </View>
                    <View style={[style.descPar, global.flex, global.aCenter]}>
                      <Text style={style.desc} numberOfLines={1}>
                        {v.desc}
                      </Text>
                      {currentPage === TAB.MY_GROUP_CHAT && v.msgCount && v.msgCount !== 0 ? (
                        <Text style={[style.tags]}>{v.msgCount > 10 ? "..." : v.msgCount}</Text>
                      ) : null}
                    </View>
                  </View>
                </TouchableOpacity>
              )
            })
          ) : (
            <Empty />
          )}
        </View>
        <Modal style={style.modal} visible={isAddGroupChat} footer={[]} maskClosable>
          <View style={style.picPar}>
            <Image style={style.pic} source={gImg.common.defaultAvatar}></Image>
          </View>
          <View style={style.groupTitlePar}>
            <Text style={style.groupTitle} numberOfLines={1}>
              广东省中西医结合学会肾病委员会
            </Text>
          </View>
          <View style={style.groupDescPar}>
            <Text style={style.groupDesc} numberOfLines={3}>
              本聊天室用于中医学术交流，学术论文查看于 中医学术交流，学术论文查看于中医学术交流
              学术论文查看
            </Text>
          </View>
          <TouchableOpacity onPress={this.addGroup}>
            <Text style={style.btn}>立即加入</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.leave}>
            <Text style={[style.btn, style.leave]}>马上离开</Text>
          </TouchableOpacity>
        </Modal>
      </View>
    )
  }
  //获取时间
  getTime = (time: string) => {
    let { currentPage } = this.state
    let joinedTime = "",
      currentTime = moment().dayOfYear()
    if (currentPage === TAB.MY_GROUP_CHAT && time) {
      let day: number = currentTime - moment(time).dayOfYear()
      if (day > 2) {
        joinedTime = time.substr(0, 10)
      } else if (day === 2) {
        joinedTime = "前天"
      } else if (day === 1) {
        joinedTime = "昨天"
      } else if (day < 1) {
        let minute: number = moment().minute() - moment(time).minute()
        if (minute > 10) {
          let hour: number = parseInt(time.substr(11, 2))
          if (hour <= 12) {
            joinedTime = "上午" + time.substr(11, 5)
          } else {
            let amHour = hour - 12
            joinedTime = "下午" + amHour + time.substr(13, 3)
          }
        } else {
          if (minute <= 10 && minute > 5) {
            joinedTime = minute + "分钟前"
          } else {
            joinedTime = "刚刚"
          }
        }
      }
    }
    return joinedTime
  }
  addOrDetail = (groupChatId: number, groupChatName: string) => {
    let { currentPage } = this.state
    if (currentPage === TAB.GROUP_CHAT) {
      this.setState({
        isAddGroupChat: true,
        groupChatId,
        groupChatName,
      })
    } else {
      this.props.navigation.push(pathMap.EnteringGroupChat, {
        groupChatId: groupChatId,
        groupChatName: groupChatName,
      })
    }
  }
  //加入群聊
  addGroup = () => {
    let { groupChatId: id, groupChatName: name } = this.state
    addGroupChat({ id })
      .then(() => {
        Toast.success("加入成功", 1, () => {
          this.props.navigation.push(pathMap.EnteringGroupChat, { id, name })
        })
      })
      .catch((err: any) => {
        Toast.fail("加入失败, 错误信息: " + err.msg, 3)
        console.log(err)
      })
  }
  leave = () => {
    this.setState({
      isAddGroupChat: false,
    })
  }
}