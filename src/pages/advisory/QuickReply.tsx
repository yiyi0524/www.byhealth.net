import global from "@/assets/styles/global"
import doctor, { QUICK_REPLY_TYPE, QUICK_REPLY_TYPE_ZH, QuickReply } from "@/services/doctor"
import { Icon, Toast, TextareaItem } from "@ant-design/react-native"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
import {
  Image,
  PixelRatio,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  DeviceEventEmitter,
} from "react-native"
import { NavigationScreenProp } from "react-navigation"
import pathMap from "@/routes/pathMap"
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
export default class Pharmacy extends Component<Props, State> {
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
      quickReplyList: [
        {
          type: 1,
          isChecked: true,
          list: [
            {
              id: 1,
              msg: "1上次纠正后身体状况怎么样了? 用药效果如何?",
            },
            {
              id: 2,
              msg: "2上次纠正后身体状况怎么样了? 用药效果如何?",
            },
          ],
        },
        {
          type: 2,
          isChecked: false,
          list: [
            {
              id: 3,
              msg: "3上次纠正后身体状况怎么样了? 用药效果如何?",
            },
            {
              id: 4,
              msg: "4上次纠正后身体状况怎么样了? 用药效果如何?",
            },
          ],
        },
      ],
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
      // let {
      //   data: { list: quickReplyList },
      // } = await doctor.ListQuickReply({ page: -1, limit: -1 })
      // for (let v of quickReplyList) {
      //   v.isChecked = false
      // }
      // quickReplyList[0].isChecked = true
      this.setState({
        // quickReplyList,
        hasLoad: true,
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
                let type = ""
                switch (v.type) {
                  case QUICK_REPLY_TYPE.text:
                    type = QUICK_REPLY_TYPE_ZH[QUICK_REPLY_TYPE.text]
                    break
                  case QUICK_REPLY_TYPE.common:
                    type = QUICK_REPLY_TYPE_ZH[QUICK_REPLY_TYPE.common]
                    break
                  case QUICK_REPLY_TYPE.inquiry:
                    type = QUICK_REPLY_TYPE_ZH[QUICK_REPLY_TYPE.inquiry]
                    break
                  case QUICK_REPLY_TYPE.drugAndShipping:
                    type = QUICK_REPLY_TYPE_ZH[QUICK_REPLY_TYPE.drugAndShipping]
                    break
                  case QUICK_REPLY_TYPE.advice:
                    type = QUICK_REPLY_TYPE_ZH[QUICK_REPLY_TYPE.advice]
                    break
                }
                return (
                  <View style={style.type} key={k}>
                    <TouchableOpacity onPress={() => this.selectType(k)}>
                      <Text
                        style={[
                          v.isChecked ? style.typeTitleActive : style.typeTitle,
                          global.fontSize14,
                        ]}>
                        {type}
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
