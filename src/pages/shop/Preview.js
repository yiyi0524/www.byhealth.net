import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, ImageBackground, Alert } from "react-native";
import pathMap from "../../routes/pathMap"
import styles from "../../styles/shop/Preview";
import gStyle from "../../styles/global";
import LinearGradient from "react-native-linear-gradient";
import { Toast } from "antd-mobile-rn";
import { windowHeight } from "../../utils/utils";
import Icons from "react-native-vector-icons/Entypo";
import { juiceApi } from "../../utils/api";

export default class Product extends Component {
  static navigationOptions = {
    headerTitle: <View style={gStyle.linearGradient}>
      <Text style={gStyle.headerText}>预览微店</Text></View>,
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
      this: [],
    }
  }
  componentDidMount() {
    this.init();
  }
  init = async _ => {
    const { navigation } = this.props;
    Toast.loading("加载中", 1, _ => { }, true)
    let json = await this.getPageData();
    this.setState({
      hasLoad: true,
      list: json.data,
    })
    Toast.hide()
  }
  getPageData = async () => {
    return juiceApi.getPreviewDetail();
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
    const avatar = { uri: this.state.list.avatar_url } ||
      require("../../images/common/default_avatar.png");
    return (
      <ScrollView>
        <ImageBackground
          style={styles.bg}
          source={require('../../images/shop/preview_bg.png')}
        >
          <View style={styles.header}>
            <View style={styles.imgBox}>
              <Image style={styles.headerImg} source={avatar}></Image>
            </View>
            <Text style={styles.headerTitle}>{this.state.list.nick || "未命名"}</Text>
            <Text style={styles.headerDetail}>专业从事信用贷款服务</Text>
          </View>
          <View style={styles.list}>
            <View style={styles.item}>
              <Image style={styles.itemIcon} source={require("../../images/shop/preview_user.png")}></Image>
              <TextInput
                style={styles.input}
                onChangeText={(text) => this.setState({ text })}
                value={this.state.text}
                placeholder="请输入您的姓名"
                placeholderTextColor="#fff"
                editable={false}
              />
            </View>
            <View style={styles.item}>
              <Image style={styles.itemIcon} source={require("../../images/shop/preview_phone.png")}></Image>
              <TextInput
                style={styles.input}
                onChangeText={(text) => this.setState({ text })}
                value={this.state.text}
                placeholder="请输入您的手机号"
                placeholderTextColor="#fff"
                editable={false}
              />
            </View>
            <View style={styles.item}>
              <Image style={styles.itemIcon} source={require("../../images/shop/prewiew_code.png")}></Image>
              <TextInput
                style={styles.input}
                onChangeText={(text) => this.setState({ text })}
                value={this.state.text}
                placeholder="请输入您的验证码"
                placeholderTextColor="#fff"
                editable={false}
              />
              <Text style={styles.code} >获取验证码</Text>
            </View>
          </View>
          <LinearGradient
            colors={["#f53f68", "#e92b32"]}
            start={{ x: 0, y: 0, }}
            end={{ x: 1, y: 1, }}
            style={styles.btnBox}
          >
            <View>
              <Text style={styles.btn}>立即贷款</Text>
            </View>
          </LinearGradient>
          <View style={styles.bottom}>
            <View style={styles.bottomItem}>
              <Image style={styles.bottomImg} source={require("../../images/shop/preview_id_card.png")}></Image>
              <Text style={styles.bottomTitle}>身份证就能贷</Text>
            </View>
            <View style={styles.bottomItem}>
              <Image style={styles.bottomImg} source={require("../../images/shop/preview_apply.png")}></Image>
              <Text style={styles.bottomTitle}>一份钟完成申请</Text>
            </View>
            <View style={styles.bottomItem}>
              <Image style={styles.bottomImg} source={require("../../images/shop/preview_product.png")}></Image>
              <Text style={styles.bottomTitle}>只能匹配产品</Text>
            </View>
          </View>
          <View style={{ height: 35, }}></View>
        </ImageBackground>
      </ScrollView>
    );
  }
}
