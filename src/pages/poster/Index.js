import React, { Component } from "react";
import {
    View, ScrollView, TouchableOpacity, Image, Text, Alert, DeviceEventEmitter,
    RefreshControl,
} from "react-native";
import styles from '../../styles/poster/Index';
import { Toast } from "antd-mobile-rn";
import pathMap from "../../routes/pathMap";
import gStyle from "../../styles/global";
import api, { juiceApi } from "../../utils/api";
import { windowWidth } from "../../utils/utils";

const classification = [
    {
        id: 0,
        filter: 'current',
        title: "全部",
        icon: require("../../images/poster/new.png"),
        url: null,
    },

    {
        id: 82,
        title: "明星",
        icon: require("../../images/poster/start.png"),
        url: null,
    },
    {
        id: 83,
        title: "节日",
        icon: require("../../images/poster/festival.png"),
        url: null,
    },
    {
        id: 84,
        title: "励志",
        icon: require("../../images/poster/inspirational.png"),
        url: null,
    },
    {
        id: 85,
        title: "热门",
        icon: require("../../images/poster/popular.png"),
        url: null,
    },
    {
        id: 86,
        title: "段子",
        icon: require("../../images/poster/paragraph.png"),
        url: null,
    },
    {
        id: 87,
        title: "美女",
        icon: require("../../images/poster/buty.png"),
        url: null,
    },
    {
        id: 0,
        filter: 'hot',
        title: "最热",
        icon: require("../../images/poster/hot.png"),
        url: null,
    },
];
export default class Index extends Component {
    static navigationOptions = {
        headerTitle: <View style={gStyle.linearGradient}>
            <Text style={gStyle.headerText}>展业海报</Text></View>,
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
            list: [],
            isLogin: false,
            title: "明星",
            refreshing: false,
        }
    }
    componentDidMount() {
        this.init();
        this.props.navigation.setParams({ init: _ => this.init() });
        this.subscription = DeviceEventEmitter.addListener(pathMap.PosterIndex + 'Reload', _ => {
            console.log('展业海报页被刷新');
            this.init()
        });
    }
    componentWillUnmount() {
        this.subscription.remove();
    }
    init = async _ => {
        let isLogin = await api.isLogin();
        Toast.loading("加载中", 0, null, true)
        let json = await this.getPageData();
        this.setState({
            list: json.data.list,
            hasLoad: true,
            title: "明星",
            isLogin,
        })
        Toast.hide()
    }
    getPageData = async _ => {
        return juiceApi.getPosterList(82);
    }
    filter = condtion => {
        return juiceApi.getPosterList(condtion).then(json => {
            console.log(json);
            this.setState({
                list: json.data.list,
            })
        })
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
        const { navigation } = this.props;
        return (
            <ScrollView style={styles.main}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                    />
                }
            >
                <View style={styles.headerList}>
                    {classification.map((v, k) => {
                        return (<TouchableOpacity key={k}
                            style={styles.headerItem}
                            onPress={_ => {
                                this.setState({
                                    title: v.title,
                                })
                                let condtion = v.filter ? v.filter : v.id;
                                this.filter(condtion);
                            }}
                        >
                            <Image style={styles.headerItemImg} source={v.icon}></Image>
                            <Text style={styles.headerItemTitle}>{v.title}</Text>
                        </TouchableOpacity>);
                    })}
                </View>
                <View style={styles.content}>
                    <View style={styles.title}>
                        <Text style={styles.titleIcon}></Text>
                        <Text style={styles.theme}>{this.state.title}</Text>
                    </View>
                    <View style={styles.list}>
                        {this.state.list.map((v, k) => {
                            return (<TouchableOpacity
                                style={styles.item}
                                key={k}
                                onPress={_ => {
                                    if (!this.state.isLogin) {
                                        return Toast.fail('请先登录', 1);
                                    }
                                    navigation.push(pathMap.PosterDetail, { id: v.id })
                                }}
                            >
                                <Image style={[styles.itemImg, { width: windowWidth / 3, height: windowWidth / 750 * 300, }]} source={{ uri: v.picture[0].url }}></Image>
                                <Text style={styles.itemDownNum}>{v.search_2 || 0}下载</Text>
                            </TouchableOpacity>);
                        })}
                    </View>
                </View>
            </ScrollView>
        );
    }
}
