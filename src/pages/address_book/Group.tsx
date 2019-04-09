import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import sColor from "@styles/color"
import gStyle from "@utils/style"
import React, { Component } from "react"
import {
  PixelRatio,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native"
import { Icon, Toast, Modal } from "@ant-design/react-native"
import { NavigationScreenProp } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import userApi from "@api/user"
import pathMap from "@/routes/pathMap"
import gImg from "@utils/img"
const style = gStyle.addressBook.AddressBookGroup
const global = gStyle.global
interface NavParams {
  navigatePress: () => void
  mode: "delete" | "done"
}
interface Props {
  navigation: NavigationScreenProp<State, NavParams>
}
interface patientGroupItem {
  id: number
  name: string
  patientList?: patientGroupItem[]
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  isDeleteMode: boolean
  patientGroupList: patientGroupItem[]
}

const mapStateToProps = (state: AppState) => {
  return {
    isLogin: state.user.isLogin,
    name: state.user.name,
    uid: state.user.uid,
  }
}
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    login: (preload: userAction.UserInfo) => {
      dispatch(userAction.userLogin(preload))
    },
  }
}
@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class Index extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = ({
    navigation,
  }: {
    navigation: NavigationScreenProp<State, NavParams>
  }) => ({
    title: "患者分组",
    headerStyle: {
      backgroundColor: sColor.white,
      height: 50,
      elevation: 0,
      color: sColor.mainBlack,
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
        <Text style={[style.headerTitleLeft, global.fontSize14, global.fontStyle]}>
          {console.log(navigation.state)}
          {navigation.state.params && navigation.state.params!.mode === "done" ? "删除" : "完成"}
        </Text>
      </TouchableOpacity>
    ),
  })
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      isDeleteMode: false,
      patientGroupList: [],
    }
  }
  async componentDidMount() {
    await this.init()
    this.props.navigation.setParams({
      mode: "done",
      navigatePress: this.changeMode,
    })
  }
  changeMode = () => {
    this.setState({
      isDeleteMode: !this.state.isDeleteMode,
    })
  }
  init = async () => {
    // let {data} = await userApi.getPatientGroupList({page:-1,limit:-1,filter:{}})
    let patientGroupList = [
      {
        id: 1,
        name: "亲人",
        patientList: [
          {
            id: 1,
            name: "李伟",
          },
          {
            id: 2,
            name: "吴伟",
          },
          {
            id: 3,
            name: "孟磊",
          },
          {
            id: 4,
            name: "吴大伟",
          },
          {
            id: 5,
            name: "吴二伟",
          },
        ],
      },
      {
        id: 2,
        name: "朋友",
        patientList: [
          {
            id: 6,
            name: "孟磊",
          },
          {
            id: 7,
            name: "吴大伟",
          },
          {
            id: 8,
            name: "吴二伟",
          },
          {
            id: 9,
            name: "吴二伟",
          },
          {
            id: 10,
            name: "吴二伟",
          },
          {
            id: 11,
            name: "吴二伟",
          },
          {
            id: 12,
            name: "吴二伟",
          },
          {
            id: 13,
            name: "吴二伟",
          },
          {
            id: 14,
            name: "吴二伟",
          },
          {
            id: 15,
            name: "吴二伟",
          },
          {
            id: 16,
            name: "吴二伟",
          },
        ],
      },
    ]
    this.setState({
      hasLoad: true,
      patientGroupList,
    })
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
  deleteGroup = (id: number) => {
    userApi
      .deletePatientGroup({ id })
      .then(() => {
        Toast.success("删除成功", 3)
        this.init()
      })
      .catch(err => {
        Toast.fail("删除失败, 错误原因: " + err.msg, 3)
      })
  }
  render() {
    if (!this.state.hasLoad) {
      return (
        <View style={style.loading}>
          <View style={style.loadingPic}>
            <Image style={style.loadingImg} source={gImg.common.loading} />
          </View>
          <Text style={[style.loadingTitle, global.fontSize14, global.fontStyle]}>加载中...</Text>
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
          <View style={style.patientGroupList}>
            {this.state.patientGroupList.map((v: any, k: number) => {
              return (
                <TouchableOpacity
                  key={k}
                  style={[
                    style.patientGroupItem,
                    global.flex,
                    global.justifyContentSpaceBetween,
                    global.alignItemsCenter,
                  ]}
                  onPress={() => {
                    this.props.navigation.push(pathMap.AddressBookGroupDetail, {
                      id: v.id,
                      title: v.name,
                    })
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      Modal.alert("提示", `您确定删除${v.name}分组吗?`, [
                        {
                          text: "取消",
                          onPress: () => console.log("cancel"),
                          style: "cancel",
                        },
                        { text: "确定", onPress: () => this.deleteGroup(v.id) },
                      ])
                    }}
                    style={this.state.isDeleteMode ? null : global.hidden}>
                    <Icon
                      name="minus-circle"
                      style={[style.deletePatientGroupIcon, global.fontSize22]}
                    />
                  </TouchableOpacity>
                  <View style={[style.patientGroupItemTitle]}>
                    <View style={[style.patientGroupTitle, global.flex, global.alignItemsCenter]}>
                      <Text style={[style.patientGroupTitle, global.fontSize15, global.fontStyle]}>
                        {v.name}
                      </Text>
                      <Text style={[style.patientGroupCount, global.fontSize15, global.fontStyle]}>
                        ( {v.patientList.length} ) 人
                      </Text>
                    </View>
                    <View
                      style={[style.patientGroupDescription, global.flex, global.alignItemsCenter]}>
                      {v.patientList.length === 0 ? (
                        <Text
                          style={[style.patientGroupNames, global.fontSize12, global.fontStyle]}>
                          暂无患者
                        </Text>
                      ) : (
                        <Text
                          style={[style.patientGroupNames, global.fontSize12, global.fontStyle]}
                          numberOfLines={1}>
                          {v.patientList.map((v1: any) => {
                            return v1.name + "、"
                          })}
                        </Text>
                      )}
                    </View>
                  </View>
                  <Icon name="right" style={[style.patientGroupIcon, global.fontSize14]} />
                </TouchableOpacity>
              )
            })}
            <TouchableOpacity
              style={[
                style.addPatientGroup,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentCenter,
              ]}
              onPress={() => this.props.navigation.push(pathMap.AddressBookAddGroup)}>
              <Icon name="plus-circle" style={style.addPatientGroupBtn} />
              <Text style={[style.addPatientGroupTitle, global.fontSize14, global.fontStyle]}>
                添加新分组
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </>
    )
  }
}
