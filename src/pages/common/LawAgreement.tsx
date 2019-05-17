import { lawAgreementHtml } from "@/config/api"
import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import pathMap from "@/routes/pathMap"
import api from "@/services/api"
import { Icon, Toast } from "@ant-design/react-native"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
import {
  BackHandler,
  Image,
  NativeEventSubscription,
  PixelRatio,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  WebView,
} from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { NavigationScreenProp } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { windowWidth, windowHeight } from "@/utils/utils"
const style = gStyle.common.LawAgreement
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
  height: number
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
  loginStatus?: NativeEventSubscription
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      isLogin: false,
      height: windowHeight,
    }
  }
  async componentDidMount() {
    await this.init()
    this.props.navigation.setParams({
      isLogin: this.state.isLogin,
    })
    this.loginStatus = BackHandler.addEventListener("hardwareBackPress", this.addEventListenerBack)
  }
  componentWillUnmount() {
    if (this.loginStatus) {
      this.loginStatus.remove()
    }
  }
  addEventListenerBack = () => {
    this.props.navigation.state.params!.isLogin
      ? this.props.navigation.goBack()
      : this.props.navigation.navigate(pathMap.Register)
    return true
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
  onmessage = (event: any) => {
    try {
      const action = JSON.parse(event.nativeEvent.data)
      console.log(action.type === "setHeight" && action.height > 0)
      if (action.type === "setHeight" && action.height > 0) {
        this.setState({ height: action.height })
      }
    } catch (error) {
      // pass
    }
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
    const BaseScript = `
    (function () {
        var height = null;
        function changeHeight() {
          if (document.body.scrollHeight != height) {
            height = document.body.scrollHeight;
            if (window.postMessage) {
              window.postMessage(JSON.stringify({
                type: 'setHeight',
                height: height,
              }))
            }
          }
        }
        setTimeout(changeHeight, 300);
    } ())
    `
    return (
      <>
        <ScrollView
          style={style.main}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }>
          <View style={style.article}>
            <WebView
              style={{
                flex: 1,
                width: windowWidth - 30,
                height: this.state.height,
              }}
              injectedJavaScript={BaseScript}
              decelerationRate="normal"
              automaticallyAdjustContentInsets
              scalesPageToFit
              javaScriptEnabled // 仅限Android平台。iOS平台JavaScript是默认开启的。
              domStorageEnabled // 适用于安卓
              scrollEnabled={false}
              source={{ html: lawAgreementHtml, baseUrl: "" }}
              onMessage={this.onmessage}
            />
          </View>
        </ScrollView>
      </>
    )
  }
}
