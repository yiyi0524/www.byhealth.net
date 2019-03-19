// import React from 'react';
import { Platform } from 'react-native';
import { NavigationRouteConfigMap, StackNavigatorConfig } from "react-navigation";
// import pathMap from './pathMap';
import bottomNav from './bottomNav';
const routeConf: [
    NavigationRouteConfigMap, StackNavigatorConfig] = [
        {
            Index: {
                screen: bottomNav,
            },
        },
        {
            initialRouteName: 'Index',
            headerMode: 'none',
            /*
           * Use modal on iOS because the card mode comes from the right,
           * which conflicts with the drawer example gesture
           */
            mode: Platform.OS === 'ios' ? 'modal' : 'card',
        }
    ]
export default routeConf;
