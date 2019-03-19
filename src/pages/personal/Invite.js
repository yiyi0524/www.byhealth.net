import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, TextInput } from "react-native";
import { Picker, Toast, TextareaItem } from "antd-mobile-rn";
import DatePicker from "react-native-datepicker";
import styles from "../../styles/personal/Invite";
import pathMap from "../../routes/pathMap";
import gStyle from '../../styles/global';
import api from '../../utils/api';

export default class Invite extends Component {
    static navigationOptions = {
        headerTitle: <View style={gStyle.linearGradient}>
            <Text style={gStyle.headerText}>邀请好友</Text></View>,
        headerStyle: {
            backgroundColor: '#f53f68',
            height: 45,
            elevation: 0,
            borderBottomColor: "#f53f68",
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        headerRight: (
            <Text> </Text>
        ),
    };
    constructor(props) {
        super(props);
        this.state = {
            invite_code: "",
        }
    }
    componentDidMount() {
        this.init();
    }
    init = async _ => {
        let json = await this.getPageData();
        this.setState({
            invote_code: json.data.code,
            invote_img: { uri: json.data.url, },
            hasLoad: true,
        })
        Toast.hide()
    }
    getPageData = async _ => {
        return api.getMyInvoteInfo();
    }
    render() {
        return (
            <ScrollView style={styles.invite}>
                <View style={styles.myCode}>
                    <Text style={styles.code}>我的邀请码: {this.state.invote_code}</Text>
                </View>
                <View style={styles.qRcode}>
                    <Image style={styles.rqCode} source={this.state.invote_img}></Image>
                </View>
                <Text style={styles.description}>用户注册推广二维码</Text>
            </ScrollView>
        );
    }
}

