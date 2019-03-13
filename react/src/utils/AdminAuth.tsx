import React, { Component } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { Spin } from "antd";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { LocalStorage as storage } from "jsbdk";
import * as adminAction from "@/redux/actions/admin";
import { AppState } from "@/redux/stores/store";
interface Props {
  component: React.ComponentClass;
  login: (preload: adminAction.AdminLoginPreload) => void;
  logout: () => void;
  isLogin: boolean;
}
interface State {
  isPending: boolean;
  isLogin: boolean;
}
const mapStateToProps = (state: AppState) => ({
  isLogin: state.admin.isLogin
});
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    login: (preload: adminAction.AdminLoginPreload) => {
      dispatch(adminAction.login(preload));
    },
    logout: () => {
      dispatch(adminAction.logout());
    }
  };
};
@connect(
  mapStateToProps,
  mapDispatchToProps
)
class AdminAuth extends Component<Props & RouteProps, State> {
  checkTimer?: NodeJS.Timeout;
  static defaultProps = {
    login: () => {},
    logout: () => {},
    isLogin: false
  };
  constructor(props: any) {
    super(props);
    this.state = {
      isPending: true,
      isLogin: false
    };
  }
  componentDidMount() {
    this.checkIsLogin();
    this.checkTimer = setInterval(() => {
      let isLogin = storage.has("adminIsLogin");
      if (isLogin && !this.props.isLogin) {
        this.props.login({
          uid: storage.get("uid"),
          nick: storage.get("nick")
        });
      }
      if (!isLogin && this.props.isLogin) {
        this.props.logout();
        storage.remove("uid");
        storage.remove("nick");
      }
      if (isLogin !== this.state.isLogin) {
        this.setState({
          isLogin
        });
      }
    }, 100);
  }
  checkIsLogin = () => {
    this.setState({
      isPending: false,
      isLogin: storage.has("adminIsLogin")
    });
  };
  componentWillUnmount() {
    clearInterval(this.checkTimer as NodeJS.Timeout);
  }
  render() {
    const { component: Component, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={() => {
          if (this.state.isPending) {
            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh"
                }}
              >
                <Spin size="large" />
              </div>
            );
          }
          return this.state.isLogin ? (
            <Component {...this.props} />
          ) : (
            <Redirect to="/admin/login" />
          );
        }}
      />
    );
  }
}
export default AdminAuth;
