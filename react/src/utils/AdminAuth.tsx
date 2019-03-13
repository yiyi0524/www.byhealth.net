import React, { Component } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { connect } from "react-redux";
import { AppState } from "@redux/stores/store";
interface Props extends RouteProps {
  component: React.ComponentClass;
  isLogin?: boolean;
  nick?: string;
}
const mapStateToProps = (state: AppState) => {
  return {
    isLogin: state.admin.isLogin,
    nick: state.admin.nick
  };
};

@connect(mapStateToProps)
export default class AdminAuth extends Component<Props> {
  render() {
    const { component: Component, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={() => {
          return this.props.isLogin ? (
            <Component {...this.props} />
          ) : (
            <Redirect to="/admin/login" />
          );
        }}
      />
    );
  }
}
