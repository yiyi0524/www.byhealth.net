import * as wsAction from '@/redux/actions/ws'
import routeConfig from '@/routes/route'
import Ws from '@pages/Ws'
import React, { Component } from 'react'
import { NavigationContainer, NavigationContainerRef, NavigationState, PartialState } from '@react-navigation/native'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { AppState as RnAppState, AppStateStatus, SafeAreaView } from 'react-native'
import { isLogin, updateAppStateStatus } from '@/services/api'
import CodePush from 'react-native-code-push'
import SplashScreen from 'react-native-splash-screen'
import { wxAppId } from '@/config/api'
import * as WeChat from 'react-native-wechat'
import * as Sentry from '@sentry/react-native'
import { enableScreens } from 'react-native-screens'
import { createStackNavigator } from '@react-navigation/stack'
enableScreens()
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
export type Props = {}
export type DefaultProps = {} & ReturnType<typeof mapDispatchToProps>

// 在组件根节点的地方设置热更新。
@CodePush(codePushOptions)
// @ts-ignore
@connect(null, mapDispatchToProps)
export default class App extends Component<Props & DefaultProps> {
  static defaultProps: DefaultProps
  containerRef = React.createRef<NavigationContainerRef>()
  getActiveRouteName = (state: NavigationState): string => {
    let currscreen = state.routes[state.index].name,
      currState: NavigationState | PartialState<NavigationState> | undefined = state
    while (currState && currState.index !== undefined) {
      currState = currState.routes[currState.index].state
      if (currState && currState.index !== undefined) {
        currscreen = currState.routes[currState.index].name
      }
    }
    return currscreen
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
        <NavigationContainer
          ref={this.containerRef}
          onStateChange={state => {
            if (state) {
              let currRouteName = this.getActiveRouteName(state)
              this.props.changeScreen(currRouteName)
            }
          }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <Stack.Navigator {...routeConfig.stackNavConfig}>
              {Object.keys(routeConfig.screens).map(screenName => {
                const props = routeConfig.screens[screenName]
                return <Stack.Screen key={screenName} {...props} />
              })}
            </Stack.Navigator>
          </SafeAreaView>
        </NavigationContainer>
      </Ws>
    )
  }
}
