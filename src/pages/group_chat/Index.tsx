import global from '@/assets/styles/global'
import Empty from '@/components/Empty'
import { AppState } from '@/redux/stores/store'
import pathMap from '@/routes/pathMap'
import { GroupChat, joinGroupChat, listGroupChat, STATUS, TAB, TAB_ZH } from '@/services/groupChat'
import { getPersonalInfo } from '@/services/user'
import { TYPE } from '@/utils/constant'
import { getPicCdnUrl } from '@/utils/utils'
import { Icon, InputItem, Modal, Toast, Badge } from '@ant-design/react-native'
import gImg from '@utils/img'
import gSass from '@utils/style'
import moment from 'moment'
import React, { Component } from 'react'
import { Image, RefreshControl, ScrollView, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { StackNavigationProp } from '@react-navigation/stack'
import { connect } from 'react-redux'
import { Picture } from '../advisory/Chat'
const style = gSass.groupChat.index

interface Props {
  navigation: NavigationScreenProp<any>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  isJoinGroupChat: boolean
  groupChatId: number
  page: number
  limit: number
  groupChatName: string
  hasRealNameAuth: boolean
  groupChatDesc: string
  groupChatPic: Picture
  filter: Record<string, any>
  currentPage: number
  search: string
  list: GroupChat[]
}
type DefaultProps = {} & ReturnType<typeof mapStateToProps>
const mapStateToProps = (state: AppState) => {
  return {
    isLogin: state.user.isLogin,
    name: state.user.name,
    uid: state.user.uid,
    ws: state.ws,
  }
}
//@ts-ignore
@connect(mapStateToProps)
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
      isJoinGroupChat: false,
      currentPage: TAB.MY_GROUP_CHAT,
      hasRealNameAuth: false,
      groupChatId: 0,
      groupChatName: '',
      groupChatDesc: '',
      groupChatPic: {
        id: 0,
        url: '',
        title: '',
      },
      page: -1,
      limit: -1,
      filter: {},
      search: '',
      list: [],
    }
  }
  componentDidMount() {
    this.init()
  }
  init = async () => {
    try {
      const {
        data: {
          doctorInfo: { hasRealNameAuth },
        },
      } = await getPersonalInfo()
      this.listGroupChat()
      this.setState({
        hasLoad: true,
        hasRealNameAuth,
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
            val: STATUS.notJoined,
          },
          search: {
            condition: TYPE.like,
            val: search,
          },
        }
      } else {
        filter = {
          status: {
            condition: TYPE.eq,
            val: STATUS.joined,
          },
          search: {
            condition: TYPE.eqString,
            val: search,
          },
        }
      }
      let listGroupChatTask = listGroupChat({ page, limit, filter })
      let {
        data: { list },
      } = await listGroupChatTask
      console.log('群聊列表', list)
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
        Toast.fail('刷新失败,错误信息: ' + err.msg)
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
            <Text style={[style.tabChildTitle, currentPage === TAB.GROUP_CHAT ? style.active : null]}>
              {TAB_ZH[TAB.GROUP_CHAT]}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[style.tabChild]} onPress={() => this.changeTab(1)}>
            <Text style={[style.tabChildTitle, currentPage === TAB.MY_GROUP_CHAT ? style.active : null]}>
              {TAB_ZH[TAB.MY_GROUP_CHAT]}
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          keyboardShouldPersistTaps='always'
          style={style.tab}
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
        >
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
    let { search, list, currentPage, isJoinGroupChat, hasRealNameAuth } = this.state
    let { unReadGroupMsgCountRecord } = this.props.ws
    return (
      <View style={style.group}>
        <View
          style={[
            currentPage === TAB.GROUP_CHAT ? style.search : global.hidden,
            global.flex,
            global.aCenter,
            global.jCenter,
          ]}
        >
          <Icon style={style.searchIcon} size='sm' name='search' />
          <View style={style.searchInputPar}>
            <InputItem
              clear
              last
              style={style.searchInput}
              value={search}
              onChange={editSearch => {
                this.setState(
                  {
                    search: editSearch,
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
            list.map((group, k) => {
              let ctime = group.ctime ? this.getTime(group.ctime) : ''
              let isJoined = group.userList.filter(user => user.uid === this.props.uid).length > 0
              let isApplyJoined = !isJoined && group.applyList.filter(user => user.uid === this.props.uid).length > 0
              return (
                <TouchableOpacity
                  style={[style.item, global.flex, global.aCenter]}
                  key={k}
                  onPress={() => {
                    if (isApplyJoined) {
                      return
                    }
                    if (!hasRealNameAuth) {
                      Toast.fail('请先实名认证', 1)
                      return
                    }
                    this.joinOrDetail(group.id, group.name, group.description, group.pic, isJoined)
                  }}
                >
                  <View style={style.avatarPar}>
                    <Image
                      style={style.avatar}
                      source={
                        group.pic.url ? { uri: getPicCdnUrl(group.pic.url, 'avatar') } : gImg.common.defaultAvatar
                      }
                    />
                    {/* <Image style={style.avatar} source={gImg.common.defaultAvatar}></Image> */}
                  </View>
                  <View style={style.info}>
                    <View style={[style.title, global.flex, global.jBetween, global.aCenter]}>
                      <Text style={style.name} numberOfLines={1}>
                        {group.name}
                      </Text>
                      {currentPage === TAB.GROUP_CHAT ? (
                        <View>
                          {!isJoined && !isApplyJoined && <Text style={style.add}>立即加入</Text>}
                          {isApplyJoined && <Text style={style.add}>申请中</Text>}
                          {isJoined && <Text style={style.add}>已加入</Text>}
                        </View>
                      ) : (
                        <View style={[global.flex, global.aCenter]}>
                          {group.id in unReadGroupMsgCountRecord && unReadGroupMsgCountRecord[group.id] > 0 ? (
                            <Badge
                              style={{ marginLeft: 20, marginRight: 20 }}
                              text={unReadGroupMsgCountRecord[group.id]}
                            />
                          ) : null}
                          <Text style={style.addTime}>{ctime}</Text>
                        </View>
                      )}
                    </View>
                    {/* <View style={[style.descPar, global.flex, global.aCenter]}>
                      <Text style={style.desc} numberOfLines={1}>
                        {group.description || "暂无描述"}
                      </Text>
                      {currentPage === TAB.MY_GROUP_CHAT && v.msgCount && v.msgCount !== 0 ? (
                        <Text style={[style.tags]}>{v.msgCount > 10 ? "..." : v.msgCount}</Text>
                      ) : null}
                    </View>*/}
                  </View>
                </TouchableOpacity>
              )
            })
          ) : (
            <Empty />
          )}
        </View>
        <Modal
          style={style.modal}
          visible={isJoinGroupChat}
          footer={[]}
          maskClosable
          onClose={() => {
            this.setState({ isJoinGroupChat: false })
          }}
        >
          <View style={style.picPar}>
            <Image style={style.pic} source={{ uri: getPicCdnUrl(this.state.groupChatPic.url, 'avatar') }} />
          </View>
          <View style={style.groupTitlePar}>
            <Text style={style.groupTitle} numberOfLines={1}>
              {this.state.groupChatName}
            </Text>
          </View>
          <View style={style.groupDescPar}>
            <Text style={style.groupDesc} numberOfLines={3}>
              {this.state.groupChatDesc}
            </Text>
          </View>
          <TouchableOpacity onPress={this.joinGroup}>
            <Text style={style.btn}>立即加入</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={this.leave}>
            <Text style={[style.btn, style.leave]}>马上离开</Text>
          </TouchableOpacity> */}
        </Modal>
      </View>
    )
  }
  //获取时间
  getTime = (time: string) => {
    let { currentPage } = this.state
    let ctime = '',
      currentTime = moment().dayOfYear()
    if (currentPage === TAB.MY_GROUP_CHAT && time) {
      let day: number = currentTime - moment(time).dayOfYear()
      if (day > 2) {
        ctime = time.substr(0, 10)
      } else if (day === 2) {
        ctime = '前天'
      } else if (day === 1) {
        ctime = '昨天'
      } else if (day < 1) {
        let minute: number = moment().minute() - moment(time).minute()
        if (minute > 10) {
          let hour: number = parseInt(time.substr(11, 2))
          if (hour <= 12) {
            ctime = '上午' + time.substr(11, 5)
          } else {
            let amHour = hour - 12
            ctime = '下午' + amHour + time.substr(13, 3)
          }
        } else {
          if (minute <= 10 && minute > 5) {
            ctime = minute + '分钟前'
          } else {
            ctime = '刚刚'
          }
        }
      }
    }
    return ctime
  }
  joinOrDetail = (
    groupChatId: number,
    groupChatName: string,
    groupChatDesc: string,
    groupChatPic: Picture,
    isJoined: boolean,
  ) => {
    let { currentPage } = this.state
    if (currentPage === TAB.GROUP_CHAT && !isJoined) {
      this.setState({
        isJoinGroupChat: true,
        groupChatId,
        groupChatName,
        groupChatDesc,
        groupChatPic,
      })
    } else {
      this.props.navigation.push(pathMap.AdvisoryChat, {
        mode: 'chatGroup',
        groupId: groupChatId,
        groupName: groupChatName,
      })
    }
  }
  //加入群聊
  joinGroup = () => {
    let { groupChatId: id, hasRealNameAuth } = this.state
    if (!hasRealNameAuth) {
      Toast.fail('申请失败 请先实名认证', 1)
      return
    }
    joinGroupChat({ id })
      .then(() => {
        Toast.success('申请成功', 1, this.onRefresh)
      })
      .catch((err: any) => {
        Toast.fail('申请失败, 错误信息: ' + err.msg, 3)
        console.log(err)
      })
  }
  leave = () => {
    this.setState({
      isJoinGroupChat: false,
    })
  }
}
