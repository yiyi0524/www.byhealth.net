import React, { Component } from "react";
import { Text } from "react-native";
import { connect } from "react-redux";
import { AppState } from "@/redux/stores/store";
import * as userAction from "@/redux/actions/user";
import { Dispatch } from "redux";
interface Props {}
interface State {}
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
        <Text>this is home 用户名{this.props.name}</Text>
        <Text> 用户uid{this.props.uid}</Text>
      </>
    );
  }
}
