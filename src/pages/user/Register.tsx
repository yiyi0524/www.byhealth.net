import * as userAction from "@/redux/actions/user";
import { AppState } from "@/redux/stores/store";
import gStyle from "@utils/style";
import React, { Component, } from "react";
import {
  TouchableOpacity, View, Text, Image, ScrollView,
} from "react-native";
import {
  InputItem, Toast, Picker, Icon,
} from "@ant-design/react-native";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import global from "@/assets/styles/global";
import pathMap from "@routes/pathMap";
import api from "@api/api";
import gImg from "@utils/img";
const style = gStyle.user.register;
interface Props {
  navigation: any,
}
interface State {
  name: string,
  phone: string,
  verificationCode: string,
  verificationCodeUuid: string,
  verificationCodeMsg: string,
  addressId: any,
  hospitalId: any,
  region: any,
  cityId: any,
  regionCidMapAreaName: any,
}
interface RegionCidMapAreaName extends Record<string, string> { }
interface CityItem {
  value: string,
  label: string,
  children: CityItem[]
}
const mapStateToProps = (state: AppState) => {
  return {
    isLogin: state.user.isLogin,
    name: state.user.name,
    uid: state.user.uid,
  };
};
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    login: (preload: userAction.UserInfo) => {
      dispatch(userAction.userLogin(preload));
    },
  };
};
@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class Register extends Component<
Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
State> {
  constructor(props: any) {
    super(props);
    this.state = this.getInitState();
  }
  getInitState = (): State => {
    return {
      hospitalId: 0,
      name: "",
      phone: "",
      verificationCode: "",
      verificationCodeUuid: "",
      verificationCodeMsg: "",
      addressId: [],
      region: [],
      cityId: [],
      regionCidMapAreaName: [],
    };
  }
  componentDidMount() {
    this.init();
  }
  init = async () => {
    try {
      let regionCidMapAreaName: RegionCidMapAreaName = {}, region = [];
      let json = await api.getRegion();
      console.log("地址")
      console.log(json.data.region)
      let oriRegion = json.data.region;
      regionCidMapAreaName = this.getChildCidMapAreaName(oriRegion, regionCidMapAreaName);
      region = this.generateFormatRegion(oriRegion);
      this.setState({
        region,
        regionCidMapAreaName,
      })
    } catch (err) {
      console.log(err.msg)
    }
  }
  getChildCidMapAreaName = (arr: any, regionCidMapAreaName: any) => {
    for (let i = 0, len = arr.length; i < len; i++) {
      if (arr[i].child && arr[i].child.length > 0) {
        this.getChildCidMapAreaName(arr[i].child, regionCidMapAreaName);
      }
      regionCidMapAreaName[arr[i].cid] = arr[i].areaName;
    }
    return regionCidMapAreaName;
  }
  generateFormatRegion = (arr: any) => {
    let cityList: CityItem[] = [];
    for (let i = 0, len = arr.length; i < len; i++) {
      let children: CityItem[] = [];
      if (arr[i].child && arr[i].child.length > 0) {
        children = this.generateFormatRegion(arr[i].child);
      }
      let item = {
        value: arr[i].cid,
        label: arr[i].areaName,
        children,
      };
      cityList.push(item)
    }
    return cityList;
  }
  chooseCityId = async (cityId: any) => {
    this.setState({
      cityId,
    })
    try {
      let medicalInstitutions = await api.getMedicalInstitutions({ cityId, })
      console.log("医疗机构")
      console.log(medicalInstitutions)
    } catch (err) {
      console.log(err.msg)
    }
  }
  sendVerificationCode = () => {
    if (this.state.phone === "") {
      return Toast.fail('请输入手机号码', 1)
    }
    if (!/^1[3456789]\d{9}$/.test(this.state.phone)) {
      return Toast.fail('请输入正确的手机号码', 1)
    }
    api.sendPhoneRegisterVerifyCode({ phone: this.state.phone }).then(json => {
      Toast.info('发送成功', 1)
      let timeout = 60;
      this.setState({
        verificationCodeMsg: timeout-- + '秒后重新发送'
      })
      let timer = setInterval(_ => {
        this.setState({
          verificationCodeMsg: timeout-- + '秒后重新发送'
        })
      }, 1000)
      this.setState({
        verificationCodeUuid: json.data.uuid,
      })
      setTimeout(_ => {
        clearInterval(timer)
        this.setState({
          verificationCodeMsg: '获取验证码'
        })
      }, timeout * 1000);
    }).catch(err => {
      Toast.info('发送失败 错误信息: ' + err.msg, 2);
    })
  }
  render() {
    return (
      <>
        <View style={style.main}>
          <ScrollView style={style.content}>
            <View style={[style.header, global.flex, global.justifyContentSpaceBetween, global.alignItemsCenter]}>
              <TouchableOpacity style={style.headerLeft}
                onPress={() => this.props.navigation.navigate(pathMap.Login)}>
                <Text style={[style.headerLeftTitle, global.fontStyle, global.fontSize14]}>关闭</Text>
              </TouchableOpacity>
              <Text style={[style.headerTitle, global.fontStyle, global.fontSize14]}>注册</Text>
              <Text style={style.headerLeft}></Text>
            </View>
            <View style={style.logo}>
              <Image style={style.logoImg} source={gImg.common.logo}></Image>
            </View>
            <View style={style.form}>
              <View style={style.formItem}>
                <InputItem clear style={[style.input, global.fontStyle, global.fontSize14]}
                  value={this.state.name} placeholder="姓名"
                  onChange={name => {
                    this.setState({ name, })
                  }} />
              </View>
              <View style={style.formItem}>
                <InputItem clear style={[style.input, global.fontStyle, global.fontSize14]}
                  value={this.state.phone} placeholder="手机号码" type="digit"
                  onChange={phone => {
                    this.setState({ phone, })
                  }} />
              </View>
              <View style={style.formItem}>
                <InputItem style={[style.input, global.fontStyle, global.fontSize14]}
                  value={this.state.verificationCode} placeholder="验证码"
                  onChange={verificationCode => {
                    this.setState({ verificationCode, })
                  }} />
                <TouchableOpacity style={style.getVerificationCodeBtn}
                  onPress={() => { this.sendVerificationCode() }}>
                  <Text style={[style.verificationCode, global.fontStyle, global.fontSize14]}>
                    获取验证码</Text>
                </TouchableOpacity>
              </View>
              <View style={[style.formItem, style.pickerItem, global.flex,
              global.justifyContentSpaceBetween, global.alignItemsCenter]}>
                <Text style={style.formItemTitle}>地区</Text>
                <Picker data={this.state.region} style={style.picker}
                  cols={1} value={this.state.cityId} triggerType="onPress"
                  onChange={cityId => this.chooseCityId(cityId)}
                >
                  <TouchableOpacity style={[style.pickerTitle, global.flex,
                  global.justifyContentEnd, global.alignItemsCenter,]} >
                    <Text style={[style.topItemTitle, global.fontStyle, global.fontSize14]}>
                      {this.state.cityId.length === 0 ? '请选择' :
                        this.state.regionCidMapAreaName[this.state.cityId[0]]}</Text>
                    <Icon name="right" style={[style.inputIcon, global.fontSize16]} />
                  </TouchableOpacity>
                </Picker>
              </View>
              <View style={[style.formItem, style.pickerItem, global.flex,
              global.justifyContentSpaceBetween, global.alignItemsCenter]}>
                <Text style={style.formItemTitle}>医疗机构</Text>
                <Picker data={this.state.region} style={style.picker}
                  cols={1} value={this.state.cityId} triggerType="onPress"
                  onChange={cityId => {
                    this.setState({
                      cityId,
                    })
                  }}
                >
                  <TouchableOpacity style={[style.pickerTitle, global.flex,
                  global.justifyContentEnd, global.alignItemsCenter,]} >
                    <Text style={[style.topItemTitle, global.fontStyle, global.fontSize14]}>
                      {this.state.cityId.length === 0 ? '请选择' :
                        this.state.regionCidMapAreaName[this.state.cityId[0]]}</Text>
                    <Icon name="right" style={[style.inputIcon, global.fontSize16]} />
                  </TouchableOpacity>
                </Picker>
              </View>
            </View>
            <View style={[style.agreement, global.flex, global.alignItemsCenter]}>
              <Text style={[style.theme, global.fontStyle, global.fontSize14]}>注册即同意</Text>
              <TouchableOpacity>
                <Text style={[style.agreementName, global.fontStyle, global.fontSize14]}>
                  医生注册协议</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={[style.agreementName, global.fontStyle, global.fontSize14]}>
                  法律声明与隐私政策</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <TouchableOpacity style={style.subBtn}>
            <Text style={[style.subTitle, global.fontStyle, global.fontSize15]}>完成医生版注册</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }
}
