import React, { Component, } from 'react';
import { Redirect } from 'react-router-dom';
import { logout } from '../../services/user';
import storage from '../../utils/storage';

class Logout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasLogout: false,
      isAdminLogout: false,
    }
  }
  componentDidMount() {
    new Promise(s => {
      this.setState({
        isAdminLogout: storage.has('adminIsLogin'),
      }, s)
    })
    logout().then(_ => {
      storage.remove('userIsLogin')
      storage.remove('adminIsLogin')
      storage.remove('isLogin')
      storage.remove('uid')
      storage.remove('nick')
      this.setState({
        hasLogout: true,
      })
    }).catch(err => {
      console.log(err)
    })
  }
  render() {
    if (this.state.hasLogout) {
      return <Redirect to={this.state.isAdminLogout ? '/admin' : '/'} />
    }
    return (
      <div></div>
    )
  }
}
export default Logout;
