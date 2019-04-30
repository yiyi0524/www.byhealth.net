import global from "@/assets/styles/global"
import pathMap from "@/routes/pathMap"
import { Icon, Toast } from "@ant-design/react-native"
import sColor from "@styles/color"
import gStyle from "@utils/style"
import React, { Component } from "react"
import {
  DeviceEventEmitter,
  PixelRatio,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { NavigationScreenProp } from "react-navigation"
import doctor, { QuickReply, QUICKE_REPLY_TYPE, QUICKE_REPLY_TYPE_ZH } from "@/services/doctor"
const style = gStyle.advisory.QuickReply
interface Props {
  navigation: NavigationScreenProp<State>
  msg: string
}
interface State {
  quickReplyList: QuickReply[]
}
export default class Pharmacy extends Component<Props, State> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<State> }) => {
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
        <TouchableOpacity>
          <Text style={style.headerRight}>管理</Text>
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
      quickReplyList: [
        {
          type: 1,
          isChecked: false,
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
  }
  init = async () => {
    try {
      let {
        data: { list: quickReplyList },
      } = await doctor.ListQuickReply({ page: -1, limit: -1 })
      quickReplyList[0].isChecked = true
      this.setState({
        // quickReplyList,
      })
    } catch (err) {
      console.log(err)
    }
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
  addMsg = (type: number) => {
    Toast.info(type + "", 1)
  }
  deleteMsg = (type: number) => {
    Toast.info(type + "", 1)
  }
  selectMsg = (msg: string) => {
    Toast.info(msg, 1)
  }
  render() {
    return (
      <>
        <ScrollView style={style.main}>
          <View style={[global.flex]}>
            <View>
              {this.state.quickReplyList.map((v, k) => {
                let type = ""
                switch (v.type) {
                  case QUICKE_REPLY_TYPE.text:
                    type = QUICKE_REPLY_TYPE_ZH[QUICKE_REPLY_TYPE.text]
                    break
                  case QUICKE_REPLY_TYPE.common:
                    type = QUICKE_REPLY_TYPE_ZH[QUICKE_REPLY_TYPE.common]
                    break
                  case QUICKE_REPLY_TYPE.inquiry:
                    type = QUICKE_REPLY_TYPE_ZH[QUICKE_REPLY_TYPE.inquiry]
                    break
                  case QUICKE_REPLY_TYPE.drugAndShipping:
                    type = QUICKE_REPLY_TYPE_ZH[QUICKE_REPLY_TYPE.drugAndShipping]
                    break
                  case QUICKE_REPLY_TYPE.advice:
                    type = QUICKE_REPLY_TYPE_ZH[QUICKE_REPLY_TYPE.advice]
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
                  <TouchableOpacity onPress={() => this.addMsg(v.type)}>
                    <View style={[style.msgAdd, global.flex, global.alignItemsCenter]}>
                      <Icon style={[style.msgIcon, global.fontSize16]} name="plus" />
                      <Text style={[style.addTitle, global.fontSize14]}>添加随访时说的话</Text>
                    </View>
                  </TouchableOpacity>
                  {v.list.map((v1, k1) => {
                    return (
                      <View style={[style.msgItem, global.flex, global.alignItemsCenter]}>
                        <TouchableOpacity>
                          <Icon style={[style.msgItemIcon, global.fontSize15]} name="plus" />
                        </TouchableOpacity>
                        <TouchableOpacity key={k1} onPress={() => this.selectMsg(v1.msg)}>
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
      </>
    )
  }
}
