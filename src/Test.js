import React from 'react';
import { ScrollView, StatusBar } from 'react-native';
import {
  SafeAreaView,
  createStackNavigator,
  createBottomTabNavigator,
  getActiveChildNavigationOptions,
} from 'react-navigation';

import Ionicons from 'react-native-vector-icons/Ionicons';
import SampleText from './SampleText';
import { Button } from './commonComponents/ButtonWithMargin';

const MyNavScreen = ({ navigation, banner }) => (
  <ScrollView>
    <SafeAreaView forceInset={{ horizontal: 'always', vertical: 'never' }}>
      <SampleText>{banner}</SampleText>
      <Button
        onPress={() => navigation.navigate('Profile', { name: 'Jordan' })}
        title="Open profile screen"
      />
      <Button
        onPress={() => navigation.navigate('NotifSettings')}
        title="Open notifications screen"
      />
      <Button
        onPress={() => navigation.navigate('SettingsTab')}
        title="Go to settings tab"
      />
      <Button onPress={() => navigation.goBack(null)} title="Go back" />
    </SafeAreaView>
    <StatusBar barStyle="default" />
  </ScrollView>
);

const MyHomeScreen = ({ navigation }) => (
  <MyNavScreen banner="Home Screen" navigation={navigation} />
);

const MyProfileScreen = ({ navigation }) => (
  <MyNavScreen
    banner={`${navigation.state.params.name}s Profile`}
    navigation={navigation}
  />
);

const MyNotificationsSettingsScreen = ({ navigation }) => (
  <MyNavScreen banner="Notifications Screen" navigation={navigation} />
);

const MySettingsScreen = ({ navigation }) => (
  <MyNavScreen banner="Settings Screen" navigation={navigation} />
);

const TabNav = createBottomTabNavigator(
  {
    MainTab: {
      screen: MyHomeScreen,
      path: '/',
      navigationOptions: {
        title: 'Welcome',
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? 'ios-home' : 'ios-home-outline'}
            size={26}
            style={{ color: tintColor }}
          />
        ),
      },
    },
    SettingsTab: {
      screen: MySettingsScreen,
      path: '/settings',
      navigationOptions: {
        title: 'Settings',
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? 'ios-settings' : 'ios-settings-outline'}
            size={26}
            style={{ color: tintColor }}
          />
        ),
      },
    },
  },
  {
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);

TabNav.navigationOptions = ({ navigation, screenProps }) => {
  const childOptions = getActiveChildNavigationOptions(navigation, screenProps);
  return {
    title: childOptions.title,
  };
};

const StacksOverTabs = createStackNavigator({
  Root: {
    screen: TabNav,
  },
  NotifSettings: {
    screen: MyNotificationsSettingsScreen,
    navigationOptions: {
      title: 'Notifications',
    },
  },
  Profile: {
    screen: MyProfileScreen,
    path: '/people/:name',
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params.name}'s Profile!`,
    }),
  },
});

export default StacksOverTabs;


import React, { PropTypes, } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, ScrollView, Image, Component, AppRegistry } from "react-native";

class mainview extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <View style={styles.mainviewStyle}>
        <ContainerView />
        <View style={styles.footer}>
          <TouchableHighlight style={styles.bottomButtons}>
            <Text style={styles.footerText}>A</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.bottomButtons}>
            <Text style={styles.footerText}>B</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

class ContainerView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScrollView style={styles.scrollViewStyle}>
        <View>
          <Text style={styles.textStyle}> Example for ScrollView and Fixed Footer</Text>
        </View>
      </ScrollView>
    );
  }
}

var styles = StyleSheet.create({
  mainviewStyle: {
    flex: 1,
    flexDirection: 'column',
  },
  footer: {
    position: 'absolute',
    flex: 0.1,
    left: 0,
    right: 0,
    bottom: -10,
    backgroundColor: 'green',
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
  },
  bottomButtons: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  footerText: {
    color: 'white',
    fontWeight: 'bold',
    alignItems: 'center',
    fontSize: 18,
  },
  textStyle: {
    alignSelf: 'center',
    color: 'orange'
  },
  scrollViewStyle: {
    borderWidth: 2,
    borderColor: 'blue'
  }
});
