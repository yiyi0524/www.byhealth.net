import React, { Component } from "react"
import { createAppContainer, createStackNavigator } from "react-navigation"
import routeConfig from "@/routes/route"
import Ws from "@pages/Ws"
const AppNavigator = createAppContainer(createStackNavigator(routeConfig[0], routeConfig[1]))
export default class App extends Component {
  render() {
    return (
      <Ws>
        <AppNavigator />
      </Ws>
    )
  }
}
