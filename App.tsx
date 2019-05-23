import * as wsAction from "@/redux/actions/ws"
import { AppState } from "@/redux/stores/store"
import routeConfig from "@/routes/route"
import Ws from "@pages/Ws"
import React, { Component } from "react"
import { createAppContainer, createStackNavigator } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"

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
