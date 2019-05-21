import React, { Component } from "react"
import { createAppContainer, createStackNavigator } from "react-navigation"
import routeConfig from "@/routes/route"
import Ws from "@pages/Ws"
import { AppState } from "@/redux/stores/store"
import * as wsAction from "@/redux/actions/ws"
import { Dispatch } from "redux"
import { connect } from "react-redux"

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

const AppNavigator = createAppContainer(createStackNavigator(routeConfig[0], routeConfig[1]))
const AppNavigatorRedux: typeof AppNavigator & {
  props: {
    changeScreen: (screenName: string) => void
  }
} = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppNavigator)
export default class App extends Component {
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
        <AppNavigatorRedux
          onNavigationStateChange={(prevState, currentState) => {
            const currentScreen = this.getActiveRouteName(currentState)
            const prevScreen = this.getActiveRouteName(prevState)
            if (prevScreen !== currentScreen) {
              if (currentScreen !== null) {
                if ("changeScreen" in this.props) {
                  let props: any = this.props
                  props.changeScreen(currentScreen)
                }
              }
            }
          }}
        />
      </Ws>
    )
  }
}
