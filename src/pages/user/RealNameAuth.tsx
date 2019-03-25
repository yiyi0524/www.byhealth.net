import global from "@/assets/styles/global";
import * as userAction from "@/redux/actions/user";
import { AppState } from "@/redux/stores/store";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  Icon, InputItem, Picker, Toast, ImagePicker,
} from "@ant-design/react-native";
import api from "@api/api";
import hospitalApi from "@api/hospital";
import pathMap from "@routes/pathMap";
import gStyle from "@utils/style";
import React, { Component } from "react";
import { NavigationScreenProp } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import sColor from "@styles/color";
const style = gStyle.user.realNameAuth;
interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  selectHospitalActive: boolean,
  avatarSelectable: boolean,
  hasLoad: boolean,
  hospitalName: string,
  name: string,
  idCardNo: string,
  profile: string,
  gender: number,
  technicalTitle: number,
  page: number,
  limit: number,
  departmentId: any,
  adeptSymptomIdList: any,
  hospitalId: any,
  region: any,
  cityId: any,
  regionCidMapAreaName: any,
  filter: any,
  hospitalList: any,
  avatar: any,
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
export default class RealNameAuth extends Component<
Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
State> {
  static navigationOptions = {
    title: '认证',
    headerStyle: {
      backgroundColor: sColor.white,
      height: 45,
      elevation: 0,
      borderBottomColor: sColor.colorDdd,
    },
    headerTintColor: sColor.color333,
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
  constructor(props: any) {
    super(props);
    this.state = this.getInitState();
  }
  getInitState = (): State => {
    return {
      avatarSelectable: true,
      selectHospitalActive: false,
      hasLoad: false,
      hospitalId: 0,
      page: 0,
      limit: 0,
      hospitalName: "",
      name: "",
      idCardNo: "",
      profile: "",
      gender: 0,
      technicalTitle: 0,
      departmentId: [],
      adeptSymptomIdList: [],
      filter: {},
      region: [],
      cityId: [],
      regionCidMapAreaName: [],
      hospitalList: [],
      avatar: [],
    };
  }
  componentDidMount() {
    this.init();
  }
  init = async () => {
    try {
      let regionCidMapAreaName: RegionCidMapAreaName = {}, region = [];
      let { data: { region: oriRegion } } = await api.getRegion();
      regionCidMapAreaName = this.getChildCidMapAreaName(oriRegion, regionCidMapAreaName);
      region = this.generateFormatRegion(oriRegion);
      this.setState({
        region,
        regionCidMapAreaName,
      })
    } catch (err) {
      console.log(err.msg)
    }
    this.setState({
      hasLoad: true,
    })
  }
  getChildCidMapAreaName = (arr: any, regionCidMapAreaName: any) => {
    for (let i = 0, len = arr.length; i < len; i++) {
      if (arr[i].children && arr[i].children.length > 0) {
        this.getChildCidMapAreaName(arr[i].children, regionCidMapAreaName);
      }
      regionCidMapAreaName[arr[i].cid] = arr[i].areaName;
    }
    return regionCidMapAreaName;
  }
  generateFormatRegion = (arr: any) => {
    let cityList: CityItem[] = [];
    for (let i = 0, len = arr.length; i < len; i++) {
      let children: CityItem[] = [];
      if (arr[i].children && arr[i].children.length > 0) {
        children = this.generateFormatRegion(arr[i].children);
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
      let { data: { list: hospitalList } } = await hospitalApi.getList({
        page: this.state.page,
        limit: this.state.limit,
        filter: {
          countyCid: cityId[2],
        },
      })
      this.setState({
        hospitalList,
      })
    } catch (err) {
      console.log(err.msg)
    }
  }
  submit = async () => {
    if (this.state.name === "") {
      return Toast.fail("请输入姓名", 3)
    }
    if (this.state.cityId.length === 0) {
      return Toast.fail("请选择地区", 3)
    }
    if (this.state.hospitalId === 0 && this.state.hospitalName === "") {
      return Toast.fail("请选择医疗机构", 3)
    }

    try {
      // await api.register(param)
      Toast.fail("注册成功", 2, () => {
        this.props.navigation.navigate(pathMap.Login)
      })
    } catch (err) {
      console.log(err)
      Toast.fail("注册失败, 错误信息: " + err.msg, 3)
    }
  }
  handleFileChange = (avatar: any) => {
    let avatarSelectable = avatar.length < 1;
    this.setState({
      avatar,
      avatarSelectable,
    });
  }
  render() {
    if (!this.state.hasLoad) {
      return (<View style={style.loading}>
        <Text style={[style.loadingTitle, global.fontSize14, global.fontStyle]}>
          加载中...</Text>
      </View>);
    }
    return (
      <>
        <View style={style.main}>
          <ScrollView style={style.content} keyboardShouldPersistTaps="handled">
            <View style={style.Theme}>
              <Text style={[style.ThemeTitle, global.fontStyle, global.fontSize16]}>
                补充审核资料</Text>
            </View>
            <View style={style.form}>
              <View style={[style.formTitle, global.flex, global.alignItemsCenter]}>
                <Text style={style.formIcon}></Text>
                <Text style={[style.formThem, global.fontStyle, global.fontSize14]}>请上传
                  <Text style={[style.formImportant, global.fontStyle, global.fontSize14]}>
                    正面照片</Text> , 我们将为您制作漂亮的头像</Text>
              </View>
              <View style={[style.formItem, style.formAvatar, global.flex, global.alignItemsCenter, global.justifyContentStart]}>
                <Text>头像</Text>
                <ImagePicker
                  selectable={this.state.avatarSelectable}
                  onChange={this.handleFileChange}
                  files={this.state.avatar}
                />
              </View>
              <View style={style.formItem}>
                <InputItem clear style={[style.input, global.fontStyle, global.fontSize14]}
                  value={this.state.name} placeholder="姓名"
                  onChange={name => {
                    this.setState({ name, })
                  }} />
              </View>
              <View style={[style.formItem, style.pickerItem, global.flex,
              global.justifyContentSpaceBetween, global.alignItemsCenter]}>
                <Text style={style.formItemTitle}>地区</Text>
                <Picker data={this.state.region} style={style.picker}
                  value={this.state.cityId} triggerType="onPress"
                  onChange={cityId => this.chooseCityId(cityId)}
                >
                  <TouchableOpacity style={[style.pickerTitle, global.flex,
                  global.justifyContentEnd, global.alignItemsCenter,]} >
                    <Text style={[style.topItemTitle, global.fontStyle, global.fontSize14]}>
                      {this.state.cityId.length === 0 ? '请选择' :
                        this.state.regionCidMapAreaName[this.state.cityId[2]]}</Text>
                    <Icon name="right" style={[style.inputIcon, global.fontSize16]} />
                  </TouchableOpacity>
                </Picker>
              </View>
              <View style={[style.formItem, style.pickerItem, global.flex,
              global.justifyContentSpaceBetween, global.alignItemsCenter]}>
                <Text style={style.formItemTitle}>医疗机构</Text>
                <TouchableOpacity style={[style.hospital, global.flex,
                global.justifyContentSpaceBetween]} onPress={() => {
                  if (this.state.cityId.length === 0) {
                    return Toast.info("请先选择地区", 3)
                  }
                  this.setState({
                    selectHospitalActive: true,
                  })
                }}>
                  <Text style={[style.hospitalTitle, global.fontSize14, global.fontStyle]}>
                    {this.state.hospitalName === "" ? "请选择" : this.state.hospitalName}</Text>
                  <Icon name="right" style={[style.inputIcon, global.fontSize16]} />
                </TouchableOpacity>
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
          <TouchableOpacity style={style.subBtn} onPress={this.submit}>
            <Text style={[style.subTitle, global.fontStyle, global.fontSize15]}>完成医生版注册</Text>
          </TouchableOpacity>
          {/* 医疗机构选择 */}
          <View style={this.state.selectHospitalActive ? style.hospitalSelect :
            global.hidden}>
            <ScrollView style={style.hospitalContent} keyboardShouldPersistTaps="handled">
              <View style={[style.hospitalAdd, global.flex, global.alignItemsCenter,
              global.justifyContentSpaceBetween]}>
                <Icon style={style.hospitalSearchIcon} name="search" />
                <View style={style.hospitalSearch}>
                  <InputItem clear style={[style.hospitalInput, global.fontStyle,
                  global.fontSize14]}
                    value={this.state.hospitalName} placeholder="输入所在医疗机构"
                    onChange={hospitalName => {
                      this.setState({ hospitalName, })
                    }} />
                </View>
                <TouchableOpacity style={style.closeBtn} onPress={() => {
                  this.setState({
                    selectHospitalActive: false,
                    hospitalName: "",
                    hospitalId: 0,
                  })
                }}>
                  <Text style={[style.close, global.fontSize14, global.fontStyle]}>取消</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={[this.state.hospitalName !== "" ?
                style.addHospital : global.hidden, global.flex, global.alignItemsCenter,
              global.justifyContentCenter]} onPress={() => {
                this.setState({
                  selectHospitalActive: false,
                })
              }}>
                <Text style={[style.addHospitalBtn, global.fontSize14, global.fontStyle]}>
                  添加</Text>
                <Text numberOfLines={1} style={[style.addHospitalBtn, global.fontSize14,
                global.fontStyle]}>{this.state.hospitalName}</Text>
              </TouchableOpacity>
              <View style={style.hospitalList}>
                {this.state.hospitalList.map((v: any, k: number) => {
                  return (
                    <TouchableOpacity key={k} onPress={() => {
                      this.setState({
                        hospitalId: v.id,
                        hospitalName: v.name,
                      })
                    }}>
                      <Text style={style.hospitalItem}>{v.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </>
    );
  }
}
