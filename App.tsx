import React, { Component } from "react";
import { createAppContainer, createStackNavigator } from "react-navigation";
import routeConfig from "@/routes/route";

const AppNavigator = createAppContainer(
  createStackNavigator(routeConfig[0], routeConfig[1]));
export default class App extends Component {
  render() {
    return <AppNavigator />;
  }
}
