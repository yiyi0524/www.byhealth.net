import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert } from "react-native";
import { List, TextareaItem, Toast, } from "antd-mobile-rn";
import LinearGradient from "react-native-linear-gradient";
import { trim } from "jsbdk";

import styles from "../../styles/personal/Feedback";
import gStyle from "../../styles/global";
import api from "../../utils/api";

export default class Feedback extends Component {
  static navigationOptions = {
    headerTitle: <View style={gStyle.linearGradient}>
      <Text style={gStyle.headerText}>意见反馈</Text></View>,
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
      feedback: "",
    }
  }
  sendFeedback = feedback => {
    const { navigation } = this.props;
    Toast.loading('提交中', 0, null, true)
    if (feedback === '') {
      Toast.fail("请输入您的意见建议", 1);
      return false;
    }
    api.sendFeedback(feedback).then(_ => {
      Toast.hide();
      Toast.info('提交成功', 1, _ => {
        this.setState({
          feedback: '',
        })
        navigation.goBack();
      }, true);
    }).catch(err => {
      Toast.hide();
      Toast.info('提交失败,错误信息: ' + err.msg, 1, _ => {
        this.setState({
          feedback: '',
        })
      }, true);
    })
  }
  render() {
    return (
      <ScrollView style={styles.feedback}>
        <List style={styles.area}>
          <TextareaItem
            rows={9}
            placeholder="请输入您的意见与反馈"
            value={this.state.feedback}
            onChange={val => {
              this.setState({
                feedback: trim(val),
              })
            }}
            count={200}
          />
        </List>
        <TouchableOpacity onPress={_ => {
          if (trim(this.state.feedback) === '') {
            Toast.info('请输入反馈信息');
          }
          this.sendFeedback(this.state.feedback)
        }}>
          <LinearGradient
            colors={['#f53f68', '#e92b32']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.btn}
          >
            <Text style={styles.btnTitle}>提交</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

