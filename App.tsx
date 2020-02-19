import * as wsAction from '@/redux/actions/ws'
import { AppState } from '@/redux/stores/store'
import routeConfig from '@/routes/route'
import Ws from '@pages/Ws'
import React, { Component } from 'react'
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { AppState as RnAppState, AppStateStatus } from 'react-native'
import { isLogin, updateAppStateStatus } from '@/services/api'
import CodePush from 'react-native-code-push'
import SplashScreen from 'react-native-splash-screen'
import { wxAppId } from '@/config/api'
import * as WeChat from 'react-native-wechat'
import * as Sentry from '@sentry/react-native'
import { enableScreens } from 'react-native-screens'
import { createStackNavigator } from '@react-navigation/stack'
enableScreens()
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

const Stack = createStackNavigator()
const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  installMode: CodePush.InstallMode.ON_NEXT_RESUME,
}
// 在组件根节点的地方设置热更新。
@CodePush(codePushOptions)
// @ts-ignore
@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component<any> {
  containerRef = React.createRef<NavigationContainerRef>()
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
    WeChat.registerApp(wxAppId)
    CodePush.getUpdateMetadata().then(update => {
      if (update) {
        Sentry.setRelease(update.appVersion + '-codepush:' + update.label)
      }
    })
    SplashScreen.hide()
    RnAppState.addEventListener('change', this.onAppStateChange)
  }
  componentWillUnmount() {
    RnAppState.removeEventListener('change', this.onAppStateChange)
  }
  onAppStateChange = async (status: AppStateStatus) => {
    if (!(await isLogin())) {
      return
    }
    if (status === 'background' || status === 'active') {
      updateAppStateStatus({ status })
    }
  }
  render() {
    return (
      <Ws>
        <NavigationContainer ref={this.containerRef}>
          <Stack.Navigator {...routeConfig.stackNavConfig}>
            {Object.keys(routeConfig.screens).map(screenName => {
              const props = routeConfig.screens[screenName]
              return <Stack.Screen key={screenName} {...props} />
            })}
          </Stack.Navigator>
        </NavigationContainer>
      </Ws>
    )
  }
}
