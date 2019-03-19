import React, { Component, Fragment } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  ScrollView, Alert, TextInput, Platform, PermissionsAndroid,

} from "react-native";
import { Carousel, ImagePicker, Toast, } from "antd-mobile-rn";
import Icons from "react-native-vector-icons/Entypo";
import LinearGradient from "react-native-linear-gradient";
import { trim } from "jsbdk";
import styles from "../../styles/personal/RealNameAuth";
import api, { getRealNameAuthDetail, } from "../../utils/api";
/**
 * 实名认证 状态
 */
const REAL_NAME_STATUS = {
  default: 0x0,
  hasRealNameAuth: 0x1,
  RealNameAuthFaild: 0x2,
  RealNameAuthProcess: 0x3,
};
export default class Verified extends Component {
  static navigationOptions = {
    title: '实名认证',
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
      name: "",
      idCard: "",
      idCards: [],
      employeeCardPicList: [],
      idCardsSelectable: true,
      rejectReason: '',
      employeeCardPicListSelectable: true,
      realNameStatus: REAL_NAME_STATUS.default,

    }
  }
  async componentDidMount() {
    await this.requestReadExteralStorage();
    try {
      let json = await getRealNameAuthDetail(),
        idCards = [], employeeCardPicList = [],
        detail = json.data.detail;
      if (typeof detail.real_name_auth_id_card_pic_first === 'string') {
        idCards.push({ url: detail.real_name_auth_id_card_pic_first })
      }
      if (typeof detail.real_name_auth_id_card_pic_second === 'string') {
        idCards.push({ url: detail.real_name_auth_id_card_pic_second })
      }
      if (typeof detail.real_name_auth_employee_card_pic === 'string') {
        employeeCardPicList.push({ url: detail.real_name_auth_employee_card_pic })
      }
      let idCardsSelectable = idCards.length < 2;
      let employeeCardPicListSelectable = employeeCardPicList.length < 1;
      this.setState({
        name: detail.real_name_auth_name,
        rejectReason: detail.reject_reason || '',
        realNameStatus: detail.real_name_auth_status,
        idCard: detail.real_name_auth_id_card_no,
        idCards,
        employeeCardPicList,
        idCardsSelectable,
        employeeCardPicListSelectable,
      })
    } catch (err) {
      console.log(err);
    }

  }
  /**
   * 获取访问本地存储的权限
   */
  requestReadExteralStorage = async _ => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            'title': 'Permission To Load Photos From External Storage',
            'message': '需要获取本机存储权限',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log("READ_EXTERNAL_STORAGE permission denied!")
        }
      } catch (err) {
        console.warn(err)
      }
    }
  }
  handleFileChange = idCards => {
    let idCardsSelectable = idCards.length !== 2;
    this.setState({
      idCards,
      idCardsSelectable,
    });
  }
  workChange = employeeCardPicList => {
    let employeeCardPicListSelectable = employeeCardPicList.length !== 1;
    this.setState({
      employeeCardPicList,
      employeeCardPicListSelectable,
    });
  }
  submit = async _ => {
    if (this.state.idCard === '') {
      return Toast.fail('请输入身份证号', 1, null, true);
    }
    if (this.state.name === '') {
      return Toast.fail('请输入姓名', 1, null, true);
    }
    // if (this.state.phone === '') {
    //   return Toast.fail('请输入手机号', 1, null, true);
    // }
    if (this.state.idCards.length !== 2) {
      return Toast.fail('请上传身份证正反面图片', 1, null, true);
    }
    if (this.state.employeeCardPicList.length !== 1) {
      return Toast.fail('请上传工作证', 1, null, true);
    }
    let idCardImg0 = this.state.idCards[0].url,
      idCardImg1 = this.state.idCards[0].url,
      employeeCardPic = this.state.employeeCardPicList[0].url;
    Toast.loading("提交中,请稍等...", 0)
    try {
      if (this.state.idCards[0].url.indexOf('http') !== 0) {
        let idCardImg0Info = await api.uploadImg(this.state.idCards[0]);
        idCardImg0 = idCardImg0Info.data.url;
      }
      if (this.state.idCards[1].url.indexOf('http') !== 0) {
        let idCardImg1Info = await api.uploadImg(this.state.idCards[1]);
        idCardImg1 = idCardImg1Info.data.url;
      }
      if (this.state.employeeCardPicList[0].url.indexOf('http') !== 0) {
        let employeeCardPicInfo = await api.uploadImg(this.state.employeeCardPicList[0]);
        employeeCardPic = employeeCardPicInfo.data.url;
      }
      api.realNameAuth({
        name: this.state.name,
        idCard: this.state.idCard,
        idCardImg0,
        idCardImg1,
        employeeCardPic,
      }).then(_ => {
        const { navigation } = this.props;
        Toast.hide();
        Toast.info('提交成功,等待管理员审核', 1, _ => navigation.goBack());
      }).catch(err => {
        Toast.hide();
        Toast.fail('请求失败 错误信息: ' + err.msg, 1);
      })
    } catch (err) {
      Toast.hide();
      Toast.fail('实名认证错误 错误信息: ' + err.msg, 1);
    }
  }
  render() {
    return (
      <View style={styles.main}>
        <ScrollView style={styles.verified}>
          <View style={styles.list}>
            <View style={styles.item}>
              <Text style={styles.title}>姓名</Text>
              <TextInput
                style={styles.input}
                onChangeText={val => this.setState({ name: trim(val) })}
                value={this.state.name} placeholder="姓名" />
            </View>
            {/* <View style={styles.item}>
              <Text style={styles.title}>手机号</Text>
              <TextInput
                style={styles.input}
                onChangeText={val => this.setState({ phone: trim(val), })}
                value={this.state.phone} placeholder="手机号码"
              />
            </View> */}
            <View style={styles.item}>
              <Text style={styles.title}>身份证</Text>
              <TextInput
                style={styles.input}
                onChangeText={val => this.setState({ idCard: trim(val) })}
                value={this.state.idCard} placeholder="身份证号码"
              />
            </View>
            <View style={styles.photoItem}>
              <Text style={styles.photoTitle}>身份证正面/反面照</Text>
              <ImagePicker onChange={this.handleFileChange} files={this.state.idCards} selectable={this.state.idCardsSelectable} />
            </View>
            <View style={styles.photoItem}>
              <Text style={styles.photoTitle}>工作证</Text>
              <ImagePicker onChange={this.workChange} files={this.state.employeeCardPicList} selectable={this.state.employeeCardPicListSelectable} />
            </View>
            <View style={this.state.realNameStatus === REAL_NAME_STATUS.RealNameAuthFaild ? styles.reject : styles.hidden}>
              <Text style={styles.title}>您的申请被拒绝,拒绝原因: {this.state.rejectReason}</Text>
            </View>
          </View>
          <View style={{ height: 50, }}></View>
        </ScrollView>
        <LinearGradient
          colors={['#f53f68', '#e92b32']} start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }} style={styles.btnBox}
        >
          {this.state.realNameStatus === REAL_NAME_STATUS.default ? <TouchableOpacity onPress={this.submit}>
            <Text style={styles.btn}>提交</Text>
          </TouchableOpacity> : this.state.realNameStatus === REAL_NAME_STATUS.RealNameAuthProcess ?
              <TouchableOpacity>
                <Text style={styles.btn}>管理员审核中</Text>
              </TouchableOpacity> : this.state.realNameStatus === REAL_NAME_STATUS.RealNameAuthFaild ?
                <TouchableOpacity onPress={this.submit}>
                  <Text style={styles.btn}>重新提交</Text>
                </TouchableOpacity> : null}
        </LinearGradient>
      </View>
    );
  }
}
