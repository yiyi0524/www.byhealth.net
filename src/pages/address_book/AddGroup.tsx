import * as userAction from "@/redux/actions/user";
import { AppState } from "@/redux/stores/store";
import { InputItem, Toast, Icon } from "@ant-design/react-native";
import sColor from "@styles/color";
import gStyle from "@utils/style";
import React, { Component } from "react";
import {
  PixelRatio,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image
} from "react-native";
import { NavigationScreenProp } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import gImg from "@utils/img";
import { GENDER } from "@api/doctor";
import userApi from "@api/user";
const style = gStyle.addressBook.AddressBookAddGroup;
const global = gStyle.global;

interface Props {
  navigation: NavigationScreenProp<State>;
}
interface patientItem {
  id: number;
  avatar: string;
  name: string;
  gender: number;
  age: string;
  isChecked: boolean;
}
interface State {
  hasLoad: boolean;
  refreshing: boolean;
  groupName: string;
  name: string;
  patientList: patientItem[];
  patientIdList: number[];
  selectPatientList: string[];
}

const mapStateToProps = (state: AppState) => {
  return {
    isLogin: state.user.isLogin,
    name: state.user.name,
    uid: state.user.uid
  };
};
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    login: (preload: userAction.UserInfo) => {
      dispatch(userAction.userLogin(preload));
    }
  };
};
@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class Index extends Component<
  Props &
    ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = () => ({
    title: "添加新分组",
    headerStyle: {
      backgroundColor: sColor.white,
      height: 50,
      elevation: 0,
      color: sColor.mainBlack,
      borderBottomWidth: 1 / PixelRatio.get(),
      borderBottomColor: sColor.colorEee
    },
    headerTintColor: sColor.color333,
    headerTitleStyle: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      fontSize: 14,
      textAlign: "center"
    },
    headerRight: <TouchableOpacity />
  });
  constructor(props: any) {
    super(props);
    this.state = this.getInitState();
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      name: "",
      groupName: "",
      patientList: [],
      patientIdList: [],
      selectPatientList: []
    };
  };
  async componentDidMount() {
    await this.init();
  }
  init = async () => {
    // let patientList = await this.getPageData();
    let patientList = [
      {
        id: 1,
        avatar:
          "https://www.byhealth.net/uploads/20190322/e049282da2c90aa6e0866e66d42ad110.png",
        name: "吳大伟",
        gender: 1,
        age: "28岁",
        isChecked: false
      },
      {
        id: 2,
        avatar:
          "https://www.byhealth.net/uploads/20190322/e049282da2c90aa6e0866e66d42ad110.png",
        name: "吳二伟",
        gender: 0,
        age: "2个月大",
        isChecked: false
      },
      {
        id: 3,
        avatar: "",
        name: "吳三伟",
        gender: 2,
        age: "28岁",
        isChecked: false
      },
      {
        id: 4,
        avatar:
          "https://www.byhealth.net/uploads/20190322/e049282da2c90aa6e0866e66d42ad110.png",
        name: "吳思伟",
        gender: 1,
        age: "1岁11个月",
        isChecked: false
      }
    ];
    this.setState({
      hasLoad: true,
      patientList
    });
  };
  getPageData = async () => {
    let filter = {
      name: this.state.name
    };
    let {
      data: { list }
    } = await userApi.getPatientList({
      page: -1,
      limit: -1,
      filter
    });
    return list;
  };
  onRefresh = () => {
    this.setState({ refreshing: true });
    Promise.all([this.init(), new Promise(s => setTimeout(s, 500))])
      .then(_ => {
        this.setState({ refreshing: false });
      })
      .catch(err => {
        Toast.fail("刷新失败,错误信息: " + err.msg);
      });
  };
  filterPatientList = async () => {
    let patientList = await this.getPageData();
    this.setState({
      patientList
    });
  };
  submit = () => {
    if (this.state.groupName === "") {
      return Toast.info("请输入分组名", 3);
    }
    userApi
      .addPatientGroup({
        name: this.state.groupName,
        patientIdList: this.state.patientIdList
      })
      .then(() => {
        Toast.success("添加成功", 3);
      })
      .catch(err => {
        Toast.fail("添加分组失败, 错误信息: " + err.msg, 3);
      });
  };
  render() {
    if (!this.state.hasLoad) {
      return (
        <View style={style.loading}>
          <Text
            style={[style.loadingTitle, global.fontSize14, global.fontStyle]}
          >
            加载中...
          </Text>
        </View>
      );
    }
    return (
      <View style={style.group}>
        <ScrollView
          style={style.main}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          <View style={style.header}>
            <InputItem
              clear
              value={this.state.groupName}
              onChange={groupName => {
                this.setState({
                  groupName
                });
              }}
              style={[style.headerInput, global.fontSize14, global.fontStyle]}
              placeholder="输入分组名称"
            >
              名称
            </InputItem>
          </View>
          <View
            style={[style.patientTitle, global.flex, global.alignItemsCenter]}
          >
            <View style={global.titleIcon} />
            <Text style={[global.fontSize14, global.fontStyle]}>选择患者</Text>
          </View>
          <View style={style.selectHeader}>
            <InputItem
              clear
              value={this.state.name}
              onChange={name => {
                this.setState({
                  name
                });
                this.filterPatientList();
              }}
              style={[style.headerInput, global.fontSize14, global.fontStyle]}
              placeholder="搜索患者姓名、备注"
            >
              <Icon
                name="search"
                style={[style.searchIcon, global.fontSize18]}
              />
            </InputItem>
          </View>
          <Text
            style={[
              this.state.patientIdList.length !== 0
                ? style.selectPatient
                : global.hidden,
              global.fontSize14,
              global.fontStyle
            ]}
            numberOfLines={1}
          >
            所选患者
          </Text>
          <Text
            style={[
              this.state.selectPatientList.length !== 0
                ? style.selectpatientTitle
                : global.hidden,
              global.fontSize12,
              global.fontStyle
            ]}
            numberOfLines={1}
          >
            {this.state.selectPatientList.map((v: string) => {
              return v + "、";
            })}
          </Text>
          <Text
            style={[
              this.state.name !== "" ? style.selectPatient : global.hidden,
              global.fontSize14,
              global.fontStyle
            ]}
            numberOfLines={1}
          >
            " {this.state.name} " 的搜索结果
          </Text>
          <View style={style.patientList}>
            {this.state.patientList.map((v: any, k: number) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={k}
                  style={[
                    style.patientItem,
                    global.flex,
                    global.alignItemsCenter
                  ]}
                  onPress={() => {
                    let patientList = this.state.patientList,
                      patientIdList = this.state.patientIdList,
                      selectPatientList = this.state.selectPatientList;
                    patientList[k].isChecked = !patientList[k].isChecked;
                    if (v.isChecked) {
                      patientIdList.push(v.id);
                      selectPatientList.push(v.name);
                    } else {
                      patientIdList = patientIdList.filter(item => {
                        return item !== v.id;
                      });
                      selectPatientList = selectPatientList.filter(item => {
                        return item !== v.name;
                      });
                    }
                    this.setState({
                      patientList,
                      patientIdList,
                      selectPatientList
                    });
                  }}
                >
                  <View style={style.patientItemAvatar}>
                    <Image
                      style={style.patientAvatar}
                      source={
                        v.avatar !== ""
                          ? { uri: v.avatar }
                          : gImg.common.defaultAvatar
                      }
                    />
                  </View>
                  <View
                    style={[
                      style.patientItemDescription,
                      global.flex,
                      global.alignItemsCenter
                    ]}
                  >
                    <Text style={style.patientName}>{v.name}</Text>
                    <View
                      style={[
                        style.patientDescription,
                        global.flex,
                        global.alignItemsCenter
                      ]}
                    >
                      <Image
                        style={style.patientGender}
                        source={
                          v.gender === GENDER.MAN
                            ? gImg.common.man
                            : v.gender === GENDER.WOMAN
                            ? gImg.common.woman
                            : gImg.common.genderNull
                        }
                      />
                      <Text
                        style={[
                          style.patientAge,
                          global.fontSize12,
                          global.fontStyle
                        ]}
                      >
                        {v.age}
                      </Text>
                    </View>
                  </View>
                  <Icon
                    name="check-circle"
                    style={[
                      v.isChecked ? style.selectIconActive : style.selectIcon,
                      global.fontSize18
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
        <TouchableOpacity style={style.submitBtn} onPress={() => this.submit()}>
          <Text style={[style.submit, global.fontStyle, global.fontSize15]}>
            完成
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
