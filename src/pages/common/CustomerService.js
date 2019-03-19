import React, { Component } from 'react';
import { View, Text, StyleSheet, Linking, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import { List, TextareaItem, } from "antd-mobile-rn";
import LinearGradient from "react-native-linear-gradient";
import styles from "../../styles/common/CustomerService";

export default class Manual extends Component {
    static navigationOptions = {
        title: '我的私人客服',
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
            <Text></Text>
        ),
    };
    constructor(props) {
        super(props);
        this.state = {
            content: "",
        }
    }
    render() {

        return (
            <View style={{ flex: 1, flexDirection: "row" }}>
                <ScrollView>
                    <View style={styles.customerService}>
                        <View style={styles.banner}>
                            <Image style={styles.bannerImg} source={require("../../images/common/customer_service.jpg")}></Image>
                        </View>
                        <View style={styles.list}>
                            <View style={styles.item}>
                                <View style={styles.avatarBox}>
                                    <Image style={styles.avatarImg} source={require("../../images/common/default_avatar.png")}></Image>
                                </View>
                                <View style={styles.itemBox}>
                                    <Text style={styles.name}>犇沪客服</Text>
                                    <Text style={styles.time}>服务时间: 周一到周六9:00 - 18:00</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.btnBox}>
                    <LinearGradient
                        colors={["#f53f68", "#e92b32"]}
                        start={{ x: 0, y: 0, }}
                        end={{ x: 1, y: 1, }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                Linking.openURL("tel:10086")
                            }}
                        >
                            <Text style={styles.btn}>电话咨询</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                    <LinearGradient
                        colors={["#f53f68", "#e92b32"]}
                        start={{ x: 0, y: 0, }}
                        end={{ x: 1, y: 1, }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                Linking.openURL("mqqwpa://im/chat?chat_type=wpa&uin=" + "585252555")
                            }}
                        >
                            <Text style={styles.btn}>QQ咨询</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </View>
        );
    }
}

