import * as userAction from "@/redux/actions/user";
import { AppState } from "@/redux/stores/store";
import gStyle from "@utils/style";
import React, { Component } from "react";
import {
  ScrollView, Text, View, Image, TouchableOpacity,
} from "react-native";
import { Icon, } from "@ant-design/react-native";
import gImg from "@utils/img";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import pathMap from "@/routes/pathMap";
const style = gStyle.home;
const globalStyle = gStyle.global;
interface Props {
  navigation: any,
}
interface State { }
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
        icon: gImg.common.home,
        title: "邀请患者",
        link: "",
      },
      {
        icon: gImg.common.personalCenter,
        title: "邀请患者",
        link: "",
      },
      {
        icon: gImg.common.home,
        title: "选择患者",
        link: "",
      },
      {
        icon: gImg.common.home,
        title: "上传处方",
        link: "",
      },
      {
        icon: gImg.common.home,
        title: "处方模板",
        link: "",
      },
      {
        icon: gImg.common.home,
        title: "发起随访",
        link: "",
      },
      {
        icon: gImg.common.home,
        title: "编辑公告",
        link: "",
      },
      {
        icon: gImg.common.home,
        title: "换教文章",
        link: "",
      },
    ];
  }
  getInitState = (): State => {
    return {};
  };
  render() {
    return (
      <>
        <ScrollView style={style.main}>
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
        </ScrollView>
      </>
    );
  }
}
