import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { createStackNavigator } from "react-navigation";
import pathMap from "../../routes/pathMap";
import gStyle from "../../styles/global";
import styles from "../../styles/personal/MyAppeal";
import { Picker, Toast, TextareaItem } from "antd-mobile-rn";
import Icons from "react-native-vector-icons/Entypo";

export default class MyAppeal extends Component {
    static navigationOptions = {
        headerTitle: <View style={gStyle.linearGradient}>
            <Text style={gStyle.headerText}>我的申诉</Text></View>,
        headerStyle: {
            backgroundColor: '#f53f68',
            height: 45,
            elevation: 0,
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
            list: [],
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
            list: [
                {
                    id: 1,
                    name: "无言",
                    phone: "15765484454",
                    time: "2018-12-12 12:00:00",
                    reason: "无贷款需求",
                    approval_status: 1,//0:审核中,1:审核成功,2:审核失败
                    price: 30,
                    link: pathMap.MyAppealDetail,
                },
                {
                    id: 2,
                    name: "西楼",
                    phone: "15765484454",
                    time: "2018-12-12 12:00:00",
                    reason: "无贷款需求",
                    approval_status: 2,//0:审核中,1:审核成功,2:审核失败
                    price: 30,
                    link: pathMap.MyAppealDetail,
                },
                {
                    id: 3,
                    name: "银月",
                    phone: "15765484454",
                    time: "2018-12-12 12:00:00",
                    reason: "无贷款需求",
                    approval_status: 0,//0:审核中,1:审核成功,2:审核失败
                    price: 30,
                    link: pathMap.MyAppealDetail,
                },
                {
                    id: 5,
                    name: "梧桐",
                    phone: "15765484454",
                    time: "2018-12-12 12:00:00",
                    reason: "无贷款需求无贷款需求无贷款需求",
                    approval_status: 0,//0:审核中,1:审核成功,2:审核失败
                    price: 30,
                    link: pathMap.MyAppealDetail,
                },
            ],
        })
    }
    render() {
        const { navigation } = this.props;
        return (
            <ScrollView style={styles.myAppeal}>
                <View style={styles.list}>
                    {this.state.list ? this.state.list.map((v, k) => {
                        return (<TouchableOpacity style={styles.item} key={k}
                            onPress={() => {
                                navigation.navigate(v.link)
                            }}
                        >
                            <View style={styles.header}>
                                <Text style={styles.headerName}>{v.name}</Text>
                                <Text style={styles.headerPhone}>{v.phone}</Text>
                                <Text style={styles.headerTime}>{v.time.substr(0, 10)}</Text>
                            </View>
                            <View style={styles.content}>
                                <Text style={styles.contentTitle} numberOfLines={1}>{v.reason}</Text>
                                <Text style={styles.contentApproval}>{v.approval_status === 0 ? "审核中" : v.approval_status === 1 ? "审核成功" : "审核失败"}</Text>
                                <Text style={styles.contentMoney}>{v.approval_status === 1 ? "退还" + v.price + "金币" : "   "}</Text>
                            </View>
                        </TouchableOpacity>);
                    }) : <Text style={{ textAlign: "center" }}>暂无数据</Text>}

                </View>
            </ScrollView>
        );
    }
}


