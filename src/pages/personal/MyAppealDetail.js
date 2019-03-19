import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { createStackNavigator } from "react-navigation";
import pathMap from "../../routes/pathMap";
import styles from "../../styles/personal/MyAppealDetail";
import { Picker, Toast, TextareaItem } from "antd-mobile-rn";
import Icons from "react-native-vector-icons/Entypo";


export default class MyAppeal extends Component {
    static navigationOptions = {
        title: '申诉详情',
        headerStyle: {
            backgroundColor: '#f53f68',
            height: 45,
            elevation: 0,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            textAlign: 'center',
        },
        headerRight: (
            <TouchableOpacity
                onPress={() => {

                }}
            >
                <Text style={{ color: '#fff', marginRight: 15, }}></Text>
            </TouchableOpacity>
        ),
    };
    constructor(props) {
        super(props);
        this.state = {
            list: {},
        }
    }
    componentDidMount() {
        (async _ => {
            Toast.loading("加载中", 1, _ => { }, true)
            let json = await this.getPageData();
            this.setState({
                list: json.list,
                hasLoad: true,
            })
            Toast.hide()
        })()
    }
    getPageData = async () => {
        return Promise.resolve({
            list:
            {
                id: 1,
                name: "无言",
                phone: "15765484454",
                time: "2018-12-12 12:00:00",
                reason: "无贷款需求",
                price: 30,
                appeal_description: "我不要了我不要了我不要了我不要了我不要了我不要了我不要了我不要了我不要了我不要了",
            },
        })
    }
    render() {
        if (!this.state.hasLoad) {
            return <View style={{
                width: 3000,
                height: 1000,
                backgroundColor: 'white',
            }}></View>
        }
        const { navigation } = this.props;
        return (
            <ScrollView style={styles.appeal}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>客户信息</Text>
                    <View style={styles.headerContent}>
                        <Text style={styles.headerContentName}>{this.state.list.name}</Text>
                        <Text style={styles.headerContentPhone}>{this.state.list.phone}</Text>
                        <Text style={styles.headerContentName}>金币数: {this.state.list.price}</Text>
                    </View>
                </View>
                <View style={styles.content}>
                    <Text style={styles.headerTitle}>申诉信息</Text>
                    <View style={styles.list}>
                        <View style={styles.item}>
                            <Text style={styles.itemTitle}>申诉时间:</Text>
                            <Text style={styles.itemDetail}>{this.state.list.time}</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.itemTitle}>申诉原因:</Text>
                            <Text style={styles.itemDetail}>{this.state.list.reason}</Text>
                        </View>
                        <View style={styles.itemDescriptionItem}>
                            <Text style={styles.itemTitle}>申诉说明:</Text>
                            <Text style={styles.itemDescription} numberOfLines={3}>{this.state.list.appeal_description}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}


