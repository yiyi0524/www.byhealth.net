import global from '@/assets/styles/global'
import { AppState } from '@/redux/stores/store'
import { AllScreenParam } from '@/routes/bottomNav'
import { delGroupChatmember, GroupChatMember, listGroupChat } from '@/services/groupChat'
import { TYPE } from '@/utils/constant'
import { getPicFullUrl } from '@/utils/utils'
import { Icon, Toast } from '@ant-design/react-native'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import gImg from '@utils/img'
import gSass from '@utils/style'
import React, { Component } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { Assign } from 'utility-types'
const style = gSass.groupChat.detail

interface Props {
  navigation: StackNavigationProp<AllScreenParam, 'GroupChatDetail'>
  route: RouteProp<AllScreenParam, 'GroupChatDetail'>
}
interface State {
  isAdmin: boolean
  isSelectMember: boolean
  groupId: number //群聊id
  groupName: string //群聊名称
  delMemberIds: number[] //删除列表
  applyMemberList: Omit<GroupChatMember, 'isAdmin'>[]
  memberList: Assign<GroupChatMember, { active: boolean }>[]
}
type DefaultProps = {} & ReturnType<typeof mapStateToProps>
const mapStateToProps = (state: AppState) => {
  return {
    isLogin: state.user.isLogin,
    name: state.user.name,
    uid: state.user.uid,
  }
}
//@ts-ignore
@connect(mapStateToProps)
export default class Detail extends Component<Props & DefaultProps, State> {
  static defaultProps: DefaultProps
  constructor(props: any) {
    super(props)
    this.state = this.getInitState(props)
  }
  getInitState = (props: Props): State => {
    const { groupId, groupName } = props.route.params
    return {
      isAdmin: false,
      groupId,
      groupName,
      isSelectMember: false,
      delMemberIds: [],
      applyMemberList: [],
      memberList: [],
    }
  }
  componentDidMount() {
    this.init()
    this.props.navigation.setParams({
      mode: 'done',
      navigatePress: this.editMsg,
    })
  }
  editMsg = () => {
    let { isAdmin } = this.state
    if (isAdmin) {
      let isSelectMember = !this.state.isSelectMember
      this.setState({
        isSelectMember,
      })
      if (!isSelectMember) {
        this.delMember()
      }
    }
  }
  //删除成员
  delMember = () => {
    let { delMemberIds, groupId } = this.state
    delMemberIds = delMemberIds.filter((val, idx, self) => {
      return self.indexOf(val) === idx
    })
    if (delMemberIds.length > 0) {
      delGroupChatmember({ groupId, ids: delMemberIds })
        .then(() => {
          Toast.success('删除成功', 1, this.init)
        })
        .catch(err => {
          Toast.success('删除失败,错误信息: ' + err.msg, 3)
          console.log(err)
        })
    }
  }
  init = async () => {
    try {
      let { groupId, memberList, applyMemberList } = this.state
      let memberListMode = listGroupChat({
        page: -1,
        limit: -1,
        filter: {
          condition: TYPE.eq,
          val: groupId,
        },
      })
      let {
        data: { list },
      } = await memberListMode
      let isAdmin = false
      let { uid } = this.props
      for (let v of list) {
        if (v.id === groupId) {
          // eslint-disable-next-line no-shadow
          memberList = v.userList.map((v: any) => {
            v.active = false
            return v
          })
          isAdmin = Boolean(v.userList.find(user => user.uid === uid && user.isAdmin))
          applyMemberList = v.applyList
        }
      }
      this.props.navigation.setParams({ isAdmin })
      this.setState({
        isAdmin,
        memberList,
        applyMemberList,
      })
    } catch (err) {
      console.log(err)
    }
  }
  render() {
    let { memberList, applyMemberList, isAdmin, isSelectMember } = this.state
    return (
      <>
        <ScrollView style={style.main}>
          {isAdmin && applyMemberList.length > 0 ? (
            <TouchableOpacity
              style={[style.applyList, global.flex, global.aCenter, global.jBetween]}
              onPress={this.applyJoinMember}
            >
              <View style={[style.applyImg, global.flex, global.aCenter]}>
                {applyMemberList.map((member, k) => {
                  return (
                    <View style={style.applyAvatarPar} key={k}>
                      <Image
                        style={[style.applyAvatar]}
                        source={
                          member.avatar.url ? { uri: getPicFullUrl(member.avatar.url) } : gImg.common.defaultAvatar
                        }
                      />
                    </View>
                  )
                })}
              </View>
              <View style={style.applyCountPar}>
                <Text style={style.applyCount}>{applyMemberList.length}条加入申请</Text>
              </View>
              <Icon style={style.applyIcon} name='right' />
            </TouchableOpacity>
          ) : null}
          <View style={style.list}>
            {memberList.length > 0
              ? memberList.map((member, k) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={isSelectMember ? 0.3 : 1}
                      onPress={() => {
                        let { delMemberIds } = this.state
                        if (isSelectMember) {
                          if (!member.isAdmin) {
                            memberList[k].active = !memberList[k].active
                            if (memberList[k].active) {
                              delMemberIds.push(member.id)
                              delMemberIds.filter((val, idx, self) => {
                                return self.indexOf(val) === idx
                              })
                            }
                          } else {
                            delMemberIds = delMemberIds.filter(v => v !== member.id)
                          }
                          this.setState({
                            memberList,
                            delMemberIds,
                          })
                        }
                      }}
                      style={[style.item, global.flex, global.aCenter]}
                      key={k}
                    >
                      {isAdmin && isSelectMember ? (
                        <View>
                          {member.active ? (
                            <View style={[style.selectActive]}>
                              <Text style={style.selectTitle}>√</Text>
                            </View>
                          ) : (
                            <View style={[style.select]} />
                          )}
                        </View>
                      ) : null}

                      <View style={style.avatarPar}>
                        <Image
                          style={style.avatar}
                          source={
                            member.avatar.url ? { uri: getPicFullUrl(member.avatar.url) } : gImg.common.defaultAvatar
                          }
                        />
                      </View>
                      <Text style={style.name} numberOfLines={1}>
                        {member.nick}
                      </Text>
                      {member.isAdmin ? (
                        <View style={style.administratorsPar}>
                          <Text style={style.administrators}>管理员</Text>
                        </View>
                      ) : null}
                    </TouchableOpacity>
                  )
                })
              : null}
          </View>
        </ScrollView>
      </>
    )
  }
  applyJoinMember = () => {
    let { groupId, groupName } = this.state
    this.props.navigation.push('ApplyList', { id: groupId, name: groupName })
  }
}
