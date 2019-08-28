import global from "@/assets/styles/global"
import pathMap from "@/routes/pathMap"
import doctor, { QuickReply, QUICK_REPLY_TYPE, QUICK_REPLY_TYPE_ZH } from "@/services/doctor"
import { Icon, TextareaItem, Toast } from "@ant-design/react-native"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
import {
  DeviceEventEmitter,
  Image,
  PixelRatio,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { NavigationScreenProp } from "react-navigation"
const style = gStyle.advisory.QuickReply
interface NavParams {
  navigatePress: () => void
  mode: "delete" | "done"
}
interface Props {
  navigation: NavigationScreenProp<State>
  msg: string
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  isChangeMode: boolean
  isEditMsg: boolean
  isAddMsg: boolean
  editId: number
  addType: number
  editMsg: string
  addMsg: string
  quickReplyList: QuickReply[]
}

export default class QuickReplyScreen extends Component<Props, State> {
  static navigationOptions = ({
    navigation,
  }: {
    navigation: NavigationScreenProp<State, NavParams>
  }) => {
    return {
      title: "快捷回复",
      headerStyle: {
        backgroundColor: sColor.white,
        height: 50,
        elevation: 0,
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
      headerRight: (
        <TouchableOpacity
          onPress={() => {
            let oriMode = navigation.getParam("mode")
            navigation.setParams({
              mode: oriMode === "done" ? "delete" : "done",
            })
            navigation.state.params!.navigatePress()
          }}>
          <Text style={style.headerRight}>
            {navigation.state.params && navigation.state.params!.mode === "done" ? "编辑" : "完成"}
          </Text>
        </TouchableOpacity>
      ),
    }
  }
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      isEditMsg: false,
      isChangeMode: false,
      isAddMsg: false,
      editId: 0,
      addType: 0,
      editMsg: "",
      addMsg: "",
      quickReplyList: [],
    }
  }
  componentDidMount() {
    this.init()
    this.props.navigation.setParams({
      mode: "done",
      navigatePress: this.editMsg,
    })
  }
  init = async () => {
    try {
      let {
        data: { list },
      } = await doctor.listQuickReply({ page: -1, limit: -1 })
      let { quickReplyList } = this.state
      quickReplyList = [
        {
          type: QUICK_REPLY_TYPE.text,
          name: QUICK_REPLY_TYPE_ZH[QUICK_REPLY_TYPE.text],
          isChecked: true,
          list: [],
        },
        {
          type: QUICK_REPLY_TYPE.common,
          name: QUICK_REPLY_TYPE_ZH[QUICK_REPLY_TYPE.common],
          isChecked: false,
          list: [],
        },
        {
          type: QUICK_REPLY_TYPE.inquiry,
          name: QUICK_REPLY_TYPE_ZH[QUICK_REPLY_TYPE.inquiry],
          isChecked: false,
          list: [],
        },
        {
          type: QUICK_REPLY_TYPE.drugAndShipping,
          name: QUICK_REPLY_TYPE_ZH[QUICK_REPLY_TYPE.drugAndShipping],
          isChecked: false,
          list: [],
        },
        {
          type: QUICK_REPLY_TYPE.advice,
          name: QUICK_REPLY_TYPE_ZH[QUICK_REPLY_TYPE.advice],
          isChecked: false,
          list: [],
        },
      ]
      for (let v of list) {
        for (let v1 of quickReplyList) {
          if (v.type === v1.type) {
            v1.list.push({
              id: v.id,
              type: v.type,
              msg: v.msg,
            })
          }
        }
      }
      this.setState({
        hasLoad: true,
        quickReplyList,
      })
    } catch (err) {
      console.log(err)
    }
  }
  editMsg = () => {
    this.setState({
      isChangeMode: !this.state.isChangeMode,
    })
  }
  selectType = (idx: number) => {
    let quickReplyList = this.state.quickReplyList
    for (let v of quickReplyList) {
      v.isChecked = false
    }
    quickReplyList[idx].isChecked = true
    this.setState({
      quickReplyList,
    })
  }
  deleteMsg = async (id: number) => {
    try {
      await doctor.deleteQuickReply({ id })
      Toast.success("删除成功", 1)
      this.init()
    } catch (err) {
      Toast.fail("删除失败, 错误信息: " + err.msg, 3)
    }
  }
  editQuickReplayMsg = async () => {
    this.setState({
      isEditMsg: false,
    })
    try {
      await doctor.editQuickReply({ id: this.state.editId, msg: this.state.editMsg })
      Toast.success("编辑成功", 1)
      this.init()
    } catch (err) {
      Toast.fail("编辑失败, 错误信息: " + err.msg, 3)
    }
  }

  addQuickReplayMsg = async () => {
    this.setState({
      isAddMsg: false,
    })
    try {
      await doctor.addQuickReply({ type: this.state.addType, msg: this.state.addMsg })
      Toast.success("添加成功", 1)
      this.init()
    } catch (err) {
      Toast.fail("添加失败, 错误信息: " + err.msg, 3)
    }
  }
  selectMsg = (msg: string, id: number) => {
    if (!this.state.isChangeMode) {
      DeviceEventEmitter.emit(pathMap.SquareRoot + "Reload", msg)
      this.props.navigation.goBack()
    } else {
      this.setState({
        isEditMsg: true,
        editId: id,
        editMsg: msg,
      })
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
    if (!this.state.hasLoad) {
      return (
        <View style={style.loading}>
          <View style={style.loadingPic}>
            <Image style={style.loadingImg} source={gImg.common.loading} />
          </View>
        </View>
      )
    }
    return (
      <>
        <ScrollView
          style={style.main}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }>
          <View style={[global.flex]}>
            <View>
              {this.state.quickReplyList.map((v, k) => {
                return (
                  <View style={style.type} key={k}>
                    <TouchableOpacity onPress={() => this.selectType(k)}>
                      <Text
                        style={[
                          v.isChecked ? style.typeTitleActive : style.typeTitle,
                          global.fontSize14,
                        ]}>
                        {v.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )
              })}
            </View>
            {this.state.quickReplyList.map((v, k) => {
              return (
                <View key={k} style={v.isChecked ? style.msgList : global.hidden}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        isAddMsg: true,
                        addType: v.type,
                      })
                    }}>
                    <View style={[style.msgAdd, global.flex, global.alignItemsCenter]}>
                      <Icon style={[style.msgIcon, global.fontSize18]} name="plus-circle" />
                      <Text style={[style.addTitle, global.fontSize14]}>添加随访时说的话</Text>
                    </View>
                  </TouchableOpacity>
                  {v.list.map((v1, k1) => {
                    return (
                      <View style={[style.msgItem, global.flex, global.alignItemsCenter]} key={k1}>
                        <TouchableOpacity
                          style={!this.state.isChangeMode ? global.hidden : null}
                          onPress={() => this.deleteMsg(v1.id)}>
                          <Icon
                            style={[style.msgItemIcon, global.fontSize18]}
                            name="minus-circle"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ flex: 1 }}
                          onPress={() => this.selectMsg(v1.msg, v1.id)}>
                          <Text style={[style.msgTitle, global.fontSize14]}>{v1.msg}</Text>
                        </TouchableOpacity>
                      </View>
                    )
                  })}
                </View>
              )
            })}
          </View>
        </ScrollView>
        {/* 编辑 */}
        <View style={this.state.isEditMsg ? style.edit : global.hidden}>
          <TextareaItem
            style={style.input}
            rows={6}
            value={this.state.editMsg}
            onChange={editMsg => {
              if (editMsg || editMsg === "") {
                this.setState({
                  editMsg,
                })
              }
            }}
          />
          <TouchableOpacity onPress={this.editQuickReplayMsg}>
            <Text style={[style.editBtn, global.fontSize14]}>完成</Text>
          </TouchableOpacity>
        </View>
        {/* 添加 */}
        <View style={this.state.isAddMsg ? style.edit : global.hidden}>
          <TextareaItem
            style={style.input}
            rows={6}
            placeholder="请输入您要添加的快捷回复内容"
            value={this.state.addMsg}
            onChange={addMsg => {
              if (addMsg || addMsg === "") {
                this.setState({
                  addMsg,
                })
              }
            }}
          />
          <TouchableOpacity onPress={this.addQuickReplayMsg}>
            <Text style={[style.editBtn, global.fontSize14]}>完成</Text>
          </TouchableOpacity>
        </View>
      </>
    )
  }
}
