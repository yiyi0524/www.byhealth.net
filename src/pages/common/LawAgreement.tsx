import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import { Toast, Icon } from "@ant-design/react-native"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
import { Image, PixelRatio, RefreshControl, Text, View, TouchableOpacity } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { NavigationScreenProp } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import api from "@/services/api"
import pathMap from "@/routes/pathMap"
const style = gStyle.common.LawAgreement
const global = gStyle.global
interface NavParams {
  isLogin: boolean
}
interface Props {
  navigation: NavigationScreenProp<State, NavParams>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  isLogin: boolean
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
export default class InvitePatients extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = ({
    navigation,
  }: {
    navigation: NavigationScreenProp<State, NavParams>
  }) => ({
    title: "法律申明与隐私政策",
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
    headerLeft: (
      <TouchableOpacity
        onPress={() => {
          navigation.state.params!.isLogin
            ? navigation.goBack()
            : navigation.navigate(pathMap.Register)
        }}>
        <Icon style={{ paddingLeft: 15, fontSize: 18, color: "#333" }} name="left" />
      </TouchableOpacity>
    ),
    headerRight: <Text />,
  })
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      isLogin: false,
    }
  }
  async componentDidMount() {
    await this.init()
    this.props.navigation.setParams({
      isLogin: this.state.isLogin,
    })
  }

  init = async () => {
    try {
      let isLogin = await api.isLogin()
      this.setState({
        hasLoad: true,
        isLogin,
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
          <View>
            <Text>注册协议</Text>
          </View>
        </ScrollView>
      </>
    )
  }
}
