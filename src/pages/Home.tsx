import { AppState } from "@/redux/stores/store";
import React, { Component } from "react";
import * as userAction from "@/redux/actions/user";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import {
  ScrollView, Text, View, Image, TouchableOpacity, RefreshControl,
} from "react-native";
import { Icon, Toast, } from "@ant-design/react-native";
import gImg from "@utils/img";
import gStyle from "@utils/style";
const style = gStyle.home;
const globalStyle = gStyle.global;
interface Props {
  navigation: any,
}
interface State {
  refreshing: boolean,
  hasLoad: boolean,
}
export interface ShortcutItem {
  icon: any,
  title: string,
  link: any,
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
const bannerList = [
  {
    img: gImg.home.banner_0,
    link: "",
  },
  {
    img: gImg.home.banner_1,
    link: "",
  },
  {
    img: gImg.home.banner_2,
    link: "",
  },
  {
    img: gImg.home.banner_3,
    link: "",
  },
]
const settingList = [
  {
    name: "复诊及诊后咨询",
    description: "未开启在线复诊",
    link: "",
  },
  {
    name: "处方及服务配置",
    description: "",
    link: "",
  },
  {
    name: "自定义问诊单设置",
    description: "已开启自动发送",
    link: "",
  },
  {
    name: "欢迎语设置",
    description: "已开启自动发送",
    link: "",
  },
]
@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class Home extends Component<
Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
State
> {
  shortcutList: ShortcutItem[] = [];
  constructor(props: any) {
    super(props);
    this.state = this.getInitState();
    this.shortcutList = [
      {
        icon: gImg.home.uploadPrescription,
        title: "邀请患者",
        link: "",
      },
      {
        icon: gImg.home.uploadPrescription,
        title: "选择患者",
        link: "",
      },
      {
        icon: gImg.home.uploadPrescription,
        title: "上传处方",
        link: "",
      },
      {
        icon: gImg.home.prescriptionTemplate,
        title: "处方模板",
        link: "",
      },
      {
        icon: gImg.home.uploadPrescription,
        title: "坐诊信息",
        link: "",
      },
    ];
  }
  getInitState = (): State => {
    return {
      refreshing: false,
      hasLoad: false,
    };
  };
  async componentDidMount() {
    await this.init();
  }
  init = () => {
    setTimeout(() => {
      this.setState({
        hasLoad: true,
      })
    }, 1000)
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
          {/* 头部 */}
          <View style={[style.header, globalStyle.flex, globalStyle.justifyContentSpaceBetween,
          globalStyle.alignItemsCenter]}>
            <View style={[style.headerAvatarCircle, globalStyle.flex, globalStyle.alignItemsCenter]}>
              <Image source={gImg.common.defaultAvatar} style={style.headerAvatar}></Image>
            </View>
            <View style={style.headerTitle}>
              <Text style={[style.headerName, globalStyle.fontSize16, globalStyle.fontStyle]}
                numberOfLines={1}>
                吴大伟的医馆</Text>
              <View style={[globalStyle.flex, globalStyle.alignItemsCenter]}>
                <Text style={[style.headerVerifiedTitle, globalStyle.fontStyle,
                globalStyle.fontSize12]}>  医疗资质未认证</Text>
                <TouchableOpacity style={[style.headerMedicalQualification, globalStyle.flex,
                globalStyle.alignItemsCenter]}>
                  <Text style={[style.headerMedicalQualificationTitle, globalStyle.fontStyle,
                  globalStyle.fontSize12]}> 去认证</Text>
                  <Icon name="right" style={[style.headerMedicalQualificationIcon,
                  globalStyle.fontSize12]}></Icon>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={style.headerHelp}>
              <Text style={[globalStyle.fontSize14, globalStyle.fontStyle, style.headerHelpTitle]}>帮助</Text>
            </TouchableOpacity>
          </View>
          {/* 认证 */}
          <TouchableOpacity style={[style.verified, globalStyle.flex,
          globalStyle.alignItemsCenter, globalStyle.justifyContentSpaceBetween]}>
            <View style={[globalStyle.flex, globalStyle.alignItemsCenter]}>
              <Text style={[style.verifiedTitle, globalStyle.fontStyle, globalStyle.fontSize12]}>
                认证</Text>
              <Text style={[style.verifiedDescription, globalStyle.fontStyle, globalStyle.fontSize12]}>
                您还未实名认证, 点此认证</Text>
            </View>
            <Icon name="right" style={[style.verifiedIcon, globalStyle.fontSize14]}></Icon>
          </TouchableOpacity>
          {/* 分类 */}
          <View style={[style.categoryList, globalStyle.flex, globalStyle.flexWrap]}>
            {this.shortcutList.map((item: any, k: any) => {
              return (<TouchableOpacity key={k} style={style.categoryItem} onPress={() => {
                this.props.navigation.push(item.link)
              }}>
                <Image style={style.categoryItemPic} source={item.icon}></Image>
                <Text style={[style.categoryItemTitle, globalStyle.fontSize14]}>
                  {item.title}</Text>
              </TouchableOpacity>)
            })}
          </View>
          {/* banner */}
          <ScrollView style={[style.bannerList, globalStyle.flex]} horizontal={true}
            showsHorizontalScrollIndicator={false}>
            {bannerList.map((v: any, k: number) => {
              return (<TouchableOpacity key={k} style={style.bannerItem} activeOpacity={0.8}
                onPress={() => this.props.navigation.push(v.link)}>
                <Image style={style.bannerImg} source={v.img}></Image>
              </TouchableOpacity>);
            })}
            <View style={style.scrollPaddingRight}></View>
          </ScrollView>
          {/* 设置列表 */}
          <View style={style.settingList}>
            {settingList.map((v: any, k: number) => {
              return (<TouchableOpacity key={k} style={[style.settingItem, globalStyle.flex,
              globalStyle.justifyContentSpaceBetween, globalStyle.alignItemsCenter]}>
                <Text style={[style.settingTitle, globalStyle.fontSize15, globalStyle.fontStyle]}
                  numberOfLines={1}>{v.name}</Text>
                <View style={[globalStyle.flex, globalStyle.alignItemsCenter]}>
                  <Text style={[style.settingDescription, globalStyle.fontSize15, globalStyle.fontStyle]}>{v.description}</Text>
                  <Icon name="right" style={[style.settingIcon, globalStyle.fontSize14]}></Icon>
                </View>
              </TouchableOpacity>);
            })}
          </View>
        </ScrollView>
      </>
    );
  }
}
