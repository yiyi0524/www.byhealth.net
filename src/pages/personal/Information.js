import React, { Component, Fragment } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Toast, ImagePicker, InputItem, TextareaItem, List } from "antd-mobile-rn";
import styles from "../../styles/personal/Information";
import gStyle from "../../styles/global";
import { getUserImformation, } from "../../utils/api";
import pathMap from "../../routes/pathMap";
import api, { getRealNameAuthDetail, } from "../../utils/api";

let that;
export default class Information extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    headerTitle: <View style={gStyle.linearGradient}>
      <Text style={gStyle.headerText}>个人信息</Text></View>,
    headerStyle: {
      backgroundColor: '#f53f68',
      height: 45,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerRight: (
      <TouchableOpacity
        onPress={_ => that.sendData()}
      >
        <Text style={styles.headerRightTitle}>完成</Text>
      </TouchableOpacity>
    ),
  });
  constructor(props) {
    super(props);
    that = this;
    this.state = {
      avatar: require("../../images/common/default_avatar.png"),
      nick: "未知",
      phone: "未知",
      introduction: "无简介",
      isVerified: false,
      hasLoad: false,
    }
  }
  sendData = async _ => {
    let nick = this.state.nick,
      introduction = this.state.introduction,
      avatar = this.state.files,
      avatarPic;
    if (nick === "") {
      Toast.fail("昵称不能为空", 1);
      return false;
    }
    if (avatar.length === 0) {
      Toast.fail("头像未选择", 1);
      return false;
    }
    if (avatar[0].url.indexOf('http') !== 0) {
      try {
        let avatarPicInfo = await api.uploadImg(avatar[0]);
        avatarPic = avatarPicInfo.data.url;
      } catch (e) {

      }
    }
    let data = {
      avatar: avatarPic,
      nick: nick,
      introduction: introduction,
    }
    api.request('/user/updateInfo', data).then(json => {
      Toast.success("修改成功", 1);
    }).catch(err => {
      console.log(err);
    })
  }
  componentDidMount() {
    this.init();
  }
  init = async _ => {
    let json = await this.getPageData();
    let avatar, files = [], avatarSelectable = true;
    if (json.data.avatar) {
      avatar = { url: json.data.avatar }
      files.push(avatar);
      avatarSelectable = false;
    }
    this.setState({
      avatar,
      nick: json.data.nick,
      phone: json.data.phone,
      introduction: json.data.introduction,
      isRealNameAuthed: json.data.isRealNameAuthed,
      hasLoad: true,
      files,
      avatarSelectable,
    })
  }
  getPageData = async _ => {
    return await getUserImformation();
  }
  handleFileChange = files => {
    let avatarSelectable = files.length < 1;
    this.setState({
      files,
      avatarSelectable,
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
      <ScrollView>
        <View style={styles.informationList}>
          <View style={[styles.item, styles.avatarItem]}>
            <Text style={styles.title}>头像</Text>
            <ImagePicker
              selectable={this.state.avatarSelectable}
              onChange={this.handleFileChange}
              files={this.state.files}
            />
          </View>
          <View style={styles.item}>
            <Text style={styles.title}>昵称</Text>
            <TextInput
              value={this.state.nick}
              onChangeText={value => {
                this.setState({
                  nick: value,
                });
              }}
              style={styles.itemInput}
              placeholder="名称">
            </TextInput>
          </View>
          <View style={styles.item}>
            <Text style={styles.title}>联系电话</Text>
            <TextInput
              value={this.state.phone}
              onChangeText={value => {
                this.setState({
                  phone: value,
                });
              }}
              editable={false}
              style={styles.itemInput}
              placeholder="联系电话">
            </TextInput>
          </View>
          <View style={[styles.item, styles.introductionItem]}>
            <Text style={styles.title}>简介</Text>
            <TextInput
              value={this.state.introduction}
              onChangeText={value => {
                this.setState({
                  introduction: value,
                });
              }}
              multiline={true}
              style={styles.itemInput}
              placeholder="请输入您的简介">
            </TextInput>
          </View>
          <View style={[styles.item, styles.authenticationItem]}>
            <TouchableOpacity style={this.state.isRealNameAuthed ? styles.hidden : styles.authentication}
              onPress={_ => navigation.push(pathMap.MyRealNameAuth)}>
              <Image style={styles.authenticationImg} source={require("../../images/common/verified.png")}></Image>
              <View>
                <Text style={styles.authenticationTitle}>身份认证</Text>
                <View>
                  <Text style={styles.isVerified}>未认证</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={this.state.isRealNameAuthed ? styles.authentication : styles.hidden}
              onPress={_ => navigation.push(pathMap.MyRealNameAuth)}>
              <Image style={styles.authenticationImg} source={require("../../images/common/verified_active.png")}></Image>
              <View>
                <Text style={styles.authenticationTitle}>身份认证</Text>
                <View>
                  <Text style={styles.isVerified}>已认证</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView >
    );
  }
}
