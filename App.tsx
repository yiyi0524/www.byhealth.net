import * as wsAction from "@/redux/actions/ws"
import { AppState } from "@/redux/stores/store"
import routeConfig from "@/routes/route"
import Ws from "@pages/Ws"
import React, { Component } from "react"
import { createAppContainer, createStackNavigator } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { AppState as RnAppState, AppStateStatus } from "react-native"
import { isLogin, updateAppStateStatus } from "@/services/api"
import CodePush from "react-native-code-push"
import SplashScreen from "react-native-splash-screen"
const mapStateToProps = (state: AppState) => {
  return {
    isLogin: state.user.isLogin,
    name: state.user.name,
    uid: state.user.uid,
    ws: state.ws,
  }
}
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    changeScreen: (screenName: string) => {
      dispatch(wsAction.changeScreen({ screenName }))
    },
  }
}

const stackNavigator = createStackNavigator(routeConfig[0], routeConfig[1])
const AppNavigator = createAppContainer(stackNavigator)

const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  installMode: CodePush.InstallMode.ON_NEXT_RESUME,
}
// 在组件根节点的地方设置热更新。
@CodePush(codePushOptions)
// @ts-ignore
@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class App extends Component<any> {
  getActiveRouteName = (navigationState: any): any => {
    if (!navigationState) {
      return null
    }
    const route = navigationState.routes[navigationState.index]
    if (route.routes) {
      return this.getActiveRouteName(route)
    }
    return route.routeName
  }
  componentDidMount() {
    SplashScreen.hide()
    RnAppState.addEventListener("change", this.onAppStateChange)
  }
  componentWillUnmount() {
    RnAppState.removeEventListener("change", this.onAppStateChange)
  }
  onAppStateChange = async (status: AppStateStatus) => {
    if (!(await isLogin())) {
      return
    }
    if (status === "background" || status === "active") {
      updateAppStateStatus({ status })
    }
  }
  render() {
    return (
      <Ws>
        <AppNavigator
          onNavigationStateChange={(prevState, currentState) => {
            const currentScreen = this.getActiveRouteName(currentState)
            const prevScreen = this.getActiveRouteName(prevState)
            if (prevScreen !== currentScreen) {
              if (currentScreen !== null) {
                this.props.changeScreen(currentScreen)
              }
            }
          }}
        />
      </Ws>
    )
  }
}
