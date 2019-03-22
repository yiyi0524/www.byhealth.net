import React, { Component } from "react";
import { AppState } from "@/redux/stores/store";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as userAction from "@/redux/actions/user";
import {
  ScrollView, Text, View, Image, TouchableOpacity, RefreshControl,
} from "react-native";
import { Icon, Toast, } from "@ant-design/react-native";
import gStyle from "@utils/style";
import gImg from "@utils/img";
import api from "@api/api";
const style = gStyle.advisory.advisoryIndex;
const globalStyle = gStyle.global;
interface Props {
  navigation: any,
}
interface State {
  hasLoad: boolean,
  refreshing: boolean,
  informationList: any,
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
export default class Index extends Component<
Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
State
>  {
  constructor(props: any) {
    super(props);
    this.state = this.getInitState();
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      informationList: [],
    };
  };
  async componentDidMount() {
    await this.init();
  }
  init = async () => {
    // let json = await api.getInformationList();
    let informationList = [
      {
        id: 4,
        avatar: gImg.common.logo,
        age: "30",
        gender: 2,//1:男;2:女'0:未知
        name: "博一医生助理",
        description: "欢迎来到博一, 我是您的私人助理, 如果您有任何问题可以问我",
        ctime: "2019-03-22 10:10:10",
      },
      {
        id: 1,
        avatar: gImg.common.defaultAvatar,
        age: "24",
        gender: 1,//1:男;2:女'0:未知
        name: "吴亦凡",
        description: "医生, 头还有点晕咋整?",
        ctime: "2019-03-22 10:10:10",
      },
      {
        id: 2,
        avatar: gImg.common.defaultAvatar,
        age: "24",
        gender: 2,
        name: "张柏芝",
        description: "在吗?",
        ctime: "2019-03-12 10:10:10",
      },
      {
        id: 3,
        avatar: gImg.common.defaultAvatar,
        age: "24",
        gender: 0,
        name: "张芸京",
        description: "hello?",
        ctime: "2019-03-30 10:10:10",
      },
      {
        id: 4,
        avatar: gImg.common.defaultAvatar,
        age: "24",
        gender: 1,
        name: "包贝尔",
        description: "在吗?",
        ctime: "2019-03-12 10:10:10",
      },
    ];
    this.setState({
      hasLoad: true,
      informationList,
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
      return (<View style={style.loading}>
        <Text style={[style.loadingTitle, globalStyle.fontSize14, globalStyle.fontStyle]}>
          加载中...</Text>
      </View>);
    }
    return (
      <>
        <ScrollView style={style.main} refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }>
          <View style={[style.headerList, globalStyle.flex, globalStyle.alignItemsCenter,
          globalStyle.justifyContentSpaceBetween]}>
            <TouchableOpacity style={[style.headerItem, globalStyle.flex, globalStyle.alignItemsCenter]}>
              <Image style={style.headerIcon} source={gImg.advisory.reply}></Image>
              <Text style={[style.headerItemTitle, globalStyle.fontSize14, globalStyle.fontStyle]}>
                待回复</Text>
            </TouchableOpacity>
            <View style={style.separationLine}></View>
            <TouchableOpacity style={[style.headerItem, globalStyle.flex, globalStyle.alignItemsCenter]}>
              <Image style={style.headerIcon} source={gImg.advisory.pillPurchase}></Image>
              <Text style={[style.headerItemTitle, globalStyle.fontSize14, globalStyle.fontStyle]}>
                代购药</Text>
            </TouchableOpacity>
          </View>
          <View style={style.msgList}>
            {this.state.informationList.map((v: any, k: number) => {
              return (<TouchableOpacity key={k} style={[style.msgItem, globalStyle.flex,
              globalStyle.justifyContentSpaceBetween, globalStyle.alignItemsCenter]}>
                <View style={style.baseInformation}>
                  <Image style={style.avatar} source={v.avatar}></Image>
                  <View style={[style.baseInformationBottom, globalStyle.flex,
                  globalStyle.justifyContentSpaceAround, globalStyle.alignItemsCenter]}>
                    <Image style={style.gender} source={v.gender === 1 ? gImg.common.man :
                      v.gender === 2 ? gImg.common.woman : gImg.common.genderNull}></Image>
                    <Text style={[style.age, globalStyle.fontSize13, globalStyle.fontStyle]}>
                      {v.age}岁</Text>
                  </View>
                </View>
                <View style={style.msgCenter}>
                  <View style={[globalStyle.flex, globalStyle.justifyContentSpaceBetween,
                  globalStyle.alignItemsCenter]}>
                    <Text style={[style.msgName, globalStyle.fontSize15, globalStyle.fontStyle]}
                      numberOfLines={1}>{v.name}</Text>
                    <Text style={[style.msgTime, globalStyle.fontSize13, globalStyle.fontStyle]}>
                      2019-3-22</Text>
                  </View>
                  <Text style={[style.msgDescription, globalStyle.fontSize14, globalStyle.fontStyle]}
                    numberOfLines={1}>{v.description}</Text>
                </View>
              </TouchableOpacity>);
            })}
          </View>
        </ScrollView>
      </>
    );
  }
}
