import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import { Icon, Toast } from "@ant-design/react-native"
import sColor from "@styles/color"
import gStyle from "@utils/style"
import React, { Component } from "react"
import { RefreshControl, ScrollView, Text, TouchableOpacity, View, Image } from "react-native"
import { NavigationScreenProp } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import gImg from "@utils/img"
const style = gStyle.personalCenter.account
const global = gStyle.global
interface Props {
  navigation: any
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  isShowAccount: boolean
}
interface functionItem {
  name: string
  link: string
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
export default class Account extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<State> }) => {
    return {
      title: "账户",
      headerStyle: {
        backgroundColor: sColor.lightGreen,
        height: 45,
        elevation: 0,
      },
      headerTintColor: sColor.white,
      headerTitleStyle: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        textAlign: "center",
      },
      headerRight: (
        <TouchableOpacity
        // onPress={() =>
        //   navigation.push(pathMap.PatientDetail, {
        //     id: navigation.getParam("patientId"),
        //   })
        // }
        >
          <Text style={[style.headerRight, global.fontSize14, global.fontStyle]}>说明</Text>
        </TouchableOpacity>
      ),
    }
  }
  functionList: functionItem[] = []
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      isShowAccount: true,
    }
  }
  async componentDidMount() {
    await this.init()
  }
  init = async () => {
    this.setState({
      hasLoad: true,
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
          <View style={style.header}>
            <Text style={[style.headerDescription, global.fontSize14, global.fontStyle]}>
              余额已根据国家法律扣除个人所得税
            </Text>
            <View
              style={[
                style.headerCenter,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentSpaceBetween,
              ]}>
              <TouchableOpacity
                style={[style.headerCenterLeft, global.flex, global.alignItemsCenter]}>
                <Icon
                  name={this.state.isShowAccount ? "eye-invisible" : "eye"}
                  style={[style.headerCenterLeftIcon, global.fontSize14]}
                />
                <Text style={[style.headerCenterLeftTitle]}>
                  {this.state.isShowAccount ? "隐藏余额" : "显示余额"}
                </Text>
              </TouchableOpacity>
              <Text style={[style.headerCenterTitle]}>
                ¥ {this.state.isShowAccount ? "8888" : "****"}
              </Text>
              <TouchableOpacity>
                <Text style={[style.headerCenterRight, global.fontSize14, global.fontStyle]}>
                  去提现
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={style.bank}>
            <TouchableOpacity style={style.addBank}>
              <View
                style={[
                  style.addBankTitle,
                  global.flex,
                  global.alignItemsCenter,
                  global.justifyContentCenter,
                ]}>
                <Icon name="plus" style={[style.addBankIcon, global.fontSize14]} />
                <Text style={[style.addBankDescription, global.fontSize14, global.fontStyle]}>
                  绑定银行卡
                </Text>
              </View>
              <Text style={[style.addBankBtn, global.fontSize14]}>暂无绑定银行卡</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                style.bankDescription,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentSpaceBetween,
              ]}>
              <Text style={[style.bankDescriptionTitle, global.fontSize14]}>当前银行卡</Text>
              <Text style={[style.bankDescriptionTitle, global.fontSize14]}>
                2343434********4334
              </Text>
              <View style={[global.flex, global.alignItemsCenter]}>
                <Text style={[style.bankDescriptionTitle, global.fontSize14]}>去修改</Text>
                <Icon name="right" style={[style.bankDescriptionRight, global.fontSize14]} />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </>
    )
  }
}
