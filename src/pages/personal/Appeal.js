import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert, TextInput } from "react-native";
import styles from "../../styles/personal/Appeal";
import gStyle from "../../styles/global";
import Icons from "react-native-vector-icons/Entypo";
import { createStackNavigator } from "react-navigation";
import pathMap from "../../routes/pathMap";
import DatePicker from "react-native-datepicker";
import { Picker, Toast, TextareaItem } from "antd-mobile-rn";
import { windowHeight, windowWidth } from "../../utils/utils";

const appeal_resoan_data = [
    {
        label: "信息有误",
        value: "信息有误",
    },
    {
        label: "手机号不存在",
        value: "手机号不存在",
    },
    {
        label: "无贷款需求",
        value: "无贷款需求",
    },
    {
        label: "其他",
        value: "其他",
    },
];
export default class Appeal extends Component {
    static navigationOptions = {
        headerTitle: <View style={gStyle.linearGradient}>
            <Text style={gStyle.headerText}>填写申诉</Text></View>,
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
            <TouchableOpacity>
                <Text style={styles.finish}>完成</Text>
            </TouchableOpacity>
        ),
    };

    constructor(props) {
        super(props);
        this.state = {
            appeal_resoan_date: [],
            appeal_resoan: [],
            appeal_description: "",
            list: {},
            datetime: "",
        }
    }
    componentDidMount() {
        (async _ => {
            Toast.loading("加载中", 1, _ => { }, true)
            let json = await this.getPageData();
            this.setState({
                appeal_resoan_data,
                list: json.list,
                hasLoad: true,
            })
            Toast.hide()
        })()
    }
    getPageData = async () => {
        return Promise.resolve({
            appeal_resoan_data,
            list: {
                name: "中天微",
                phone: "1598688454",
                money: 30,
            },
        })
    }
    sendData = () => {
        Alert.alert("正在提交信息: " + this.state.val);
    }

    render() {
        if (!this.state.hasLoad) {
            return <View style={{
                width: 3000,
                height: 1000,
                backgroundColor: 'white',
            }}></View>
        }
        return (
            <ScrollView style={styles.appeal}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>客户信息</Text>
                    <View style={styles.headerContent}>
                        <Text style={styles.headerContentName}>{this.state.list.name}</Text>
                        <Text style={styles.headerContentPhone}>{this.state.list.phone}</Text>
                        <Text style={styles.headerContentMoney}>金币数: {this.state.list.money}</Text>
                    </View>
                </View>
                <View style={styles.content}>
                    <Text style={styles.headerTitle}>申诉信息</Text>
                    <View style={styles.list}>
                        <View style={styles.item}>
                            <Text style={styles.itemTitle}>申诉时间:</Text>
                            <DatePicker
                                style={styles.appealDetail}
                                date={this.state.datetime}
                                mode="datetime"
                                format="YYYY-MM-DD HH:mm"
                                confirmBtnText="确定"
                                cancelBtnText="取消"
                                showIcon={false}
                                onDateChange={(datetime) => { this.setState({ datetime: datetime }); }}
                            />
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.itemTitle}>申诉原因:</Text>
                            <Picker
                                data={this.state.appeal_resoan_data}
                                cols={1}
                                value={this.state.appeal_resoan}
                                onChange={appeal_resoan => {
                                    this.setState({
                                        appeal_resoan,
                                    })
                                }}
                                style={styles.appealDetail}
                                triggerType="onPress"
                            >
                                <Text>{this.state.appeal_resoan.length === 0 ? "请选择" : this.state.appeal_resoan[0]}</Text>
                            </Picker>
                        </View>
                        <View style={styles.itemTextareaDescription}>
                            <Text style={styles.itemTitle}>申诉说明:</Text>
                            <View style={styles.appealDetail}>
                                <TextareaItem rows={4} placeholder="请输入" count={50}
                                    style={styles.appealDetail}
                                    value={this.state.appeal_description}
                                    onChange={appeal_description => {
                                        this.setState({
                                            appeal_description
                                        })
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}


