import React, { Component } from 'react';
import {
  View, StyleSheet, Text, Image, ScrollView, FlatList,
  TouchableOpacity, ImageBackground, TextInput, RefreshControl,
} from "react-native";
import gStyle from "../../styles/global";
import { Toast, Picker, List, Modal, } from "antd-mobile-rn";
import pathMap from '../../routes/pathMap';
import { windowHeight, windowWidth } from '../../utils/utils';
import styles from "../../styles/personal/Message";
import api from "../../utils/api";


export default class MessageScreen extends Component {
  static navigationOptions = {
    headerTitle: <View style={gStyle.linearGradient}>
      <Text style={gStyle.headerText}>我的消息</Text></View>,
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
      <TouchableOpacity
        onPress={async _ => {
          try {
            await api.request('/user/comfirmMessageRead', {
              allRead: 1,
            })

          } catch (e) {
          }
        }}
      >
        <Text style={styles.headerRight}>全部已读</Text>
      </TouchableOpacity>

    ),
  };
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      limit: 50,
      count: 0,
      msgList: [],
      refreshing: false,
    }
  }
  componentDidMount() {
    this.init();
  }
  init = async _ => {
    Toast.info("加载中", 0, null, true);
    let msgList = this.state.msgList;
    try {
      let json = await this.getPageData(this.state.page, this.state.limit);
      msgList = json.data.list || msgList;
    } catch (e) { }
    this.setState({
      msgList,
      hasLoad: true,
    })
    Toast.hide();
  }
  getPageData = async (page, limit) => {
    return api.request('/user/messageListJson', {
      page,
      limit,
    })
  }

  comfirmMessageRead = async id => {
    try {
      await api.request('/user/comfirmMessageRead', {
        idArr: [id],
      })
      this.init();
    } catch (e) {
    }
  }

  onRefresh = _ => {
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
        width: windowWidth,
        height: windowHeight,
        backgroundColor: 'white',
      }}></View>
    }
    return (
      <View style={styles.message}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          {this.state.msgList.map((item, val) => {
            return (<View style={styles.item} key={val}>
              <View style={styles.itemImagBox}>
                <Image style={styles.itemImg} source={require("../../images/personalCenter/default_msg.jpg")}></Image>
              </View>
              <View style={styles.itemRight}>
                <View style={styles.itemRightTitle}>
                  <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.itemTime}>{typeof item.time === "string" ? item.time.substr(0, 10) : "未知"}</Text>
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.itemContentTitle} numberOfLines={4}>{item.content}</Text>
                </View>
                <View style={item.read_status === 0 ? styles.control : styles.hidden}>
                  <Text style={styles.controlTitle}>未读</Text>
                  <TouchableOpacity
                    onPress={_ => this.comfirmMessageRead(item.id)}
                  >
                    <Text style={styles.controlNoRead}>标记已读</Text>
                  </TouchableOpacity>
                </View>
                <View style={item.read_status === 1 ? styles.control : styles.hidden}>
                  <Text style={styles.controlTitle}>已读</Text>
                </View>
              </View>
            </View>);
          })}
        </ScrollView>
      </View>
    );
  }

}

