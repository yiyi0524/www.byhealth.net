import React, { Component } from 'react';
import {
    View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView, Alert,
    RefreshControl,
} from "react-native";
import { Toast, Tabs } from "antd-mobile-rn";
import pathMap from '../../routes/pathMap';
import styles from "../../styles/personal/Integral";
import { juiceApi } from "../../utils/api";

export default class Integral extends Component {
    static navigationOptions = {
        title: '我的积分',
        headerStyle: {
            backgroundColor: '#f53f68',
            height: 45,
            elevation: 0,
            borderBottomColor: "#f53f68",
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
            <Text> </Text>
        ),
    };
    constructor(props) {
        super(props);
        this.state = {
            level_score_list: [],
            consumption_score_list: [],
            level_score: 0,
            consumption_score: 0,
            refreshing: false,
        }
    }
    componentDidMount() {
        this.init();
    }
    init = async _ => {
        Toast.loading("加载中", 1, _ => { }, true)
        let json = await this.getPageData();
        console.log(json);
        this.setState({
            hasLoad: true,
            level_score_list: json.data.level_score_list,
            consumption_score_list: json.data.consumption_score_list,
            level_score: json.data.level_score,
            consumption_score: json.data.consumption_score,
        })
        Toast.hide()
    }
    getPageData = async _ => {
        return juiceApi.scoreRecord();
    }
    onRefresh = () => {
        this.setState({ refreshing: true });
        Promise.all([
            this.init(),
            new Promise(s => setTimeout(s, 500)),
        ]).then(_ => {
            this.setState({ refreshing: false });
        }).catch(err => {
            Toast.fail("刷新失败,错误信息: " + err.msg);
        });
    }
    render() {
        if (!this.state.hasLoad) {
            return <View style={{
                width: 3000,
                height: 1000,
                backgroundColor: 'white',
            }}></View>
        }
        const tabs = [
            { title: '消费积分' },
            { title: '等级积分' },
        ];
        const { navigation } = this.props;
        return (
            <View style={{ flex: 1, flexDirection: "row", }}>
                <ScrollView style={styles.integral}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />
                    }
                >
                    <Tabs tabs={tabs}
                        initialPage={0}
                        tabBarActiveTextColor="#f53f68"
                        tabBarUnderlineStyle={{
                            backgroundColor: "#f53f68"
                        }}
                    >
                        <View>
                            <View style={styles.top}>
                                <Text style={styles.topName}>积分余额(个)</Text>
                                <Text style={styles.topNum}>{this.state.consumption_score}</Text>
                            </View>
                            <View style={styles.pointsDetailsList}>
                                <View style={styles.pointsDetailsTitle}>
                                    <Image style={styles.titleImg} source={require("../../images/personalCenter/integral.png")}></Image>
                                    <Text style={styles.title}>积分明细</Text>
                                </View>
                                <View style={styles.list}>
                                    {this.state.consumption_score_list.map((v, k) => {
                                        return (
                                            <View style={styles.item} key={k}>
                                                <View style={styles.left}>
                                                    <Text style={styles.leftTitle}>{v.reason}</Text>
                                                    <Text>{v.ctime}</Text>
                                                </View>
                                                <View>
                                                    <Text style={styles.rightTitle}>+ {v.curr_val}</Text>
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        </View>
                        <View>
                            <View style={styles.top}>
                                <Text style={styles.topName}>积分余额(个)</Text>
                                <Text style={styles.topNum}>{this.state.level_score}</Text>
                            </View>
                            <View style={styles.pointsDetailsList}>
                                <View style={styles.pointsDetailsTitle}>
                                    <Image style={styles.titleImg} source={require("../../images/personalCenter/integral.png")}></Image>
                                    <Text style={styles.title}>积分明细</Text>
                                </View>
                                <View style={styles.list}>
                                    {this.state.level_score_list.map((v, k) => {
                                        return (
                                            <View style={styles.item} key={k}>
                                                <View style={styles.left}>
                                                    <Text style={styles.leftTitle}>{v.reason}</Text>
                                                    <Text>{v.ctime}</Text>
                                                </View>
                                                <View>
                                                    <Text style={styles.rightTitle}>+ {v.curr_val}</Text>
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        </View>
                    </Tabs>
                    <View style={{ height: 50, }}></View>
                </ScrollView>
                <TouchableOpacity
                    onPress={() => { navigation.navigate(pathMap.GoldRecharge) }}
                    style={styles.btnBox}
                >
                    <Text style={styles.btn}>充值金币</Text>
                </TouchableOpacity>
            </View>

        );
    }
}

