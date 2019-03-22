import * as userAction from "@/redux/actions/user";
import { AppState } from "@/redux/stores/store";
import gStyle from "@utils/style";
import React, { Component } from "react";
import {
  TouchableOpacity, View, Text,
} from "react-native";
import sColor from "@styles/color";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import global from "@/assets/styles/global";
import api from "@api/api";
const style = gStyle.user.register;
interface Props {
  navigation: any,
}
interface State {

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
  static navigationOptions = {
    title: '注册',
    headerStyle: {
      backgroundColor: sColor.mainRed,
      height: 45,
      elevation: 0,
      borderBottomColor: sColor.mainRed,
    },
    headerTintColor: sColor.white,
    headerTitleStyle: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      textAlign: 'center',
    },
    headerRight: (
      <View></View>
    ),
  };
  constructor(props: any) {
    super(props);

    this.state = this.getInitState();
  }
  getInitState = (): State => {
    return {

    };
  }

  render() {
    return (
      <View style={style.main}>

      </View>
    );
  }
}
