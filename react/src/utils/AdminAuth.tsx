import React, { Component, } from 'react';
import { Route, Redirect, RouteProps, } from "react-router-dom";
import { Spin } from 'antd';
import { LocalStorage as storage } from 'jsbdk';


interface Props extends RouteProps {
  component: React.ComponentClass,
}
interface State {
  isPending: boolean,
  isLogin: boolean,
}
class AdminAuth extends Component<Props, State> {
  checkTimer?: NodeJS.Timeout;
  constructor(props: Props) {
    super(props)
    this.state = {
      isPending: true,
      isLogin: false,
    }
  }
  componentDidMount() {
    this.checkIsLogin()
    this.checkTimer = setInterval(() => {
      let isLogin = storage.has('adminIsLogin');
      if (isLogin !== this.state.isLogin) {
        this.setState({
          isLogin,
        })
        if (isLogin === false) {
          storage.remove('uid')
          storage.remove('nick')
        }
      }
    }, 1000)
  }
  checkIsLogin = () => {
    this.setState({
      isPending: false,
      isLogin: storage.has('adminIsLogin'),
    })
  }
  componentWillUnmount() {
    clearInterval(this.checkTimer as NodeJS.Timeout)
  }
  render() {
    const { component: Component, ...rest } = this.props
    return (
      <Route {...rest} render={() => {
        if (this.state.isPending) {
          return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <Spin size="large" />
            </div>
          )
        }
        return this.state.isLogin
          ? <Component {...this.props} />
          : <Redirect to="/admin/login" />
      }} />
    )
  }
}
export default AdminAuth;
