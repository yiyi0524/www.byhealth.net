/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * 
 * Generated with the TypeScript template
 * https://github.com/emin93/react-native-template-typescript
 * 
 * @format
 */

import React, { Component } from 'react';
import routeConfig from './src/routes/route';
import { createAppContainer, createStackNavigator } from 'react-navigation';
const AppNavigator = createAppContainer(
  createStackNavigator(
    routeConfig[0],
    routeConfig[1],
  )
);
interface Props { }
export default class App extends Component<Props> {
  render() {
    return <AppNavigator />;
  }
}

