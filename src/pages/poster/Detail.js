import React, { Component, } from "react";
import {
    View, ScrollView, TouchableOpacity, Image, Text,
    Alert, Platform, CameraRoll, DeviceEventEmitter,
} from "react-native";
import styles from '../../styles/poster/Detail';
import { Toast, } from "antd-mobile-rn";
import pathMap from "../../routes/pathMap";
import gStyle from "../../styles/global";
import api from "../../utils/api";
import { windowWidth, windowHeight, } from "../../utils/utils";
import { BASE_URL, } from "../../utils/config";
import { juiceApi, } from "../../utils/api";

export default class Index extends Component {
    static navigationOptions = {
        headerTitle: <View style={gStyle.linearGradient}>
            <Text style={gStyle.headerText}>海报详情</Text></View>,
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
            posterUrl: null,
            posterWidth: 0,
            posterHeight: 0,
        }
    }
    componentDidMount() {
        this.init();
    }
    init = async _ => {
        Toast.loading("加载中", 1, null, true)
        try {
            let json = await this.getPageData(),
                posterId = json.data.id,
                url = BASE_URL + "/api/poster/img?id=" + posterId,
                id = parseInt(this.props.navigation.getParam('id'));
            Image.getSize(url, (width, height) => {
                console.log(width)
                console.log(height)
                height = windowWidth * height / width; //按照屏幕宽度进行等比缩放
                this.setState({ posterWidth: windowWidth - 30, posterHeight: height });
            }, null);
            this.setState({
                posterUrl: url,
                hasLoad: true,
                posterId: id,
            })
        } catch (err) {
            console.log(err)
        }
        Toast.hide()
    }
    getPageData = async _ => {
        let posterId = parseInt(this.props.navigation.getParam('id'));
        return api.getPoster(posterId)
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
            <ScrollView style={styles.main}>
                <View style={styles.poster}>
                    {this.state.posterUrl ? <Image style={{ width: this.state.posterWidth, height: this.state.posterHeight }}
                        resizeMode="cover" source={{ uri: this.state.posterUrl }} ></Image> : null}
                    <TouchableOpacity
                        style={styles.download}
                        onPress={() => {
                            let result = juiceApi.downLoadPicture(this.state.posterUrl);
                            if (result) {
                                juiceApi.addDownloadPosterCount(this.state.posterId).then(_ => {
                                    DeviceEventEmitter.emit(pathMap.PosterIndex + 'Reload', null);
                                })
                            }
                        }}
                    >
                        <Text style={styles.downLoadImg}>下载图片</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}
