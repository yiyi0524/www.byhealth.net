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
const style = gStyle.home;
const globalStyle = gStyle.global;
interface Props { }
interface State { }
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
  constructor(props: any) {
    super(props);
    this.state = this.getInitState();
  }
  getInitState = (): State => {
    return {};
  };
  render() {
    return (
      <>
        <ScrollView style={style.main}>
          <View style={[style.header, globalStyle.flex, globalStyle.justifyContentSpaceBetween, globalStyle.alignItemsCenter]}>
            <View style={[style.headerAvatarCircle, globalStyle.flex, globalStyle.alignItemsCenter]}>
              <Image source={gImg.common.defaultAvatar} style={style.headerAvatar}></Image>
            </View>
            <View style={style.headerTitle}>
              <Text style={[style.headerName, globalStyle.fontSize16, globalStyle.fontStyle]}>
                吴大伟的医馆</Text>
              <View style={[globalStyle.flex, globalStyle.alignItemsCenter]}>
                <Text style={[style.headerVerifiedTitle, globalStyle.fontStyle,
                globalStyle.fontSize12]}>  医疗资质未认证</Text>
                <TouchableOpacity style={[style.headerMedicalQualification, globalStyle.flex, globalStyle.alignItemsCenter]}>
                  <Text style={[style.headerMedicalQualificationTitle, globalStyle.fontStyle, globalStyle.fontSize12]}> 去认证</Text>
                  <Icon name="apartment" style={[style.headerMedicalQualificationIcon,
                  globalStyle.fontSize20]}></Icon>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={style.headerHelp}>
              <Text style={[globalStyle.fontSize14, globalStyle.fontStyle, style.headerHelpTitle]}>帮助</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </>
    );
  }
}
