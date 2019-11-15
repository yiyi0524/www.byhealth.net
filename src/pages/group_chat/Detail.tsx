import global from "@/assets/styles/global"
import { AppState } from "@/redux/stores/store"
import pathMap from "@/routes/pathMap"
import { delGroupChatmember, GroupChatMember, listGroupChat } from "@/services/groupChat"
import { TYPE } from "@/utils/constant"
import { getPicFullUrl } from "@/utils/utils"
import { Icon, Toast } from "@ant-design/react-native"
import gImg from "@utils/img"
import gSass from "@utils/style"
import React, { Component } from "react"
import { Image, Text, TouchableOpacity, View } from "react-native"
import { NavigationScreenProp, ScrollView } from "react-navigation"
import { connect } from "react-redux"
import { Assign } from "utility-types"
const style = gSass.groupChat.detail

interface NavParams {
  groupId: number
  groupName: string
  navigatePress: () => void
  mode: "delete" | "done"
  isAdmin: boolean
}

interface Props {
  navigation: NavigationScreenProp<State, NavParams>
}
interface State {
  isAdmin: boolean
  isSelectMember: boolean
  groupId: number //群聊id
  groupName: string //群聊名称
  delMemberIds: number[] //删除列表
  applyMemberList: Omit<GroupChatMember, "isAdmin">[]
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
  static navigationOptions = ({
    navigation,
  }: {
    navigation: NavigationScreenProp<State, NavParams>
  }) => {
    let title = ""
    if (navigation.state.params) {
      title = navigation.state.params.groupName
    }
    const isAdmin = navigation.getParam("isAdmin") || false
    console.log("isAdmin ", isAdmin)
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
      headerRight: !isAdmin ? (
        <TouchableOpacity
          onPress={() => {
            let oriMode = navigation.getParam("mode")
            navigation.setParams({
              mode: oriMode === "done" ? "delete" : "done",
            })
            navigation.state.params!.navigatePress()
          }}>
          <Text style={style.icon}>
            {navigation.state.params && navigation.state.params!.mode === "done" ? "选择" : "删除"}
          </Text>
        </TouchableOpacity>
      ) : null,
    }
  }
  constructor(props: any) {
    super(props)
    this.state = this.getInitState(props)
  }
  getInitState = (props: Props): State => {
    let groupId = 0,
      groupName = ""
    if (props.navigation.state.params) {
      groupId = props.navigation.state.params!.groupId
      groupName = props.navigation.state.params!.groupName
    }
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
      mode: "done",
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
          Toast.success("删除成功", 1, this.init)
        })
        .catch(err => {
          Toast.success("删除失败,错误信息: " + err.msg, 3)
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
          memberList = v.userList.map((v: any) => {
            v.active = false
            return v
          })
          isAdmin = !!v.userList.find(v => v.uid === uid && v.isAdmin)
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
              onPress={this.applyJoinMember}>
              <View style={[style.applyImg, global.flex, global.aCenter]}>
                {applyMemberList.map((member, k) => {
                  return (
                    <View style={style.applyAvatarPar} key={k}>
                      <Image
                        style={[style.applyAvatar]}
                        source={
                          member.avatar.url
                            ? { uri: getPicFullUrl(member.avatar.url) }
                            : gImg.common.defaultAvatar
                        }></Image>
                    </View>
                  )
                })}
              </View>
              <View style={style.applyCountPar}>
                <Text style={style.applyCount}>{applyMemberList.length}条加入申请</Text>
              </View>
              <Icon style={style.applyIcon} name="right"></Icon>
            </TouchableOpacity>
          ) : null}
          <View style={style.list}>
            {memberList.length > 0
              ? memberList.map((member, k) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={isSelectMember ? 0.3 : 1}
                      onPress={() => {
                        let { memberList, delMemberIds, isSelectMember } = this.state
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
                      key={k}>
                      {isAdmin && isSelectMember ? (
                        <View>
                          {member.active ? (
                            <View style={[style.selectActive]}>
                              <Text style={style.selectTitle}>√</Text>
                            </View>
                          ) : (
                            <View style={[style.select]}></View>
                          )}
                        </View>
                      ) : null}

                      <View style={style.avatarPar}>
                        <Image
                          style={style.avatar}
                          source={
                            member.avatar.url
                              ? { uri: getPicFullUrl(member.avatar.url) }
                              : gImg.common.defaultAvatar
                          }></Image>
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
    this.props.navigation.push(pathMap.ApplyList, { id: groupId, name: groupName })
  }
}
