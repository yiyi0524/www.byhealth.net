import React, { Component, } from 'react';
import { Switch, } from 'react-router-dom';
import AdminAuthRoute from '@utils/AdminAuth';
// import AddUser from "@pages/admin/user/Add";
import UserList from '@pages/admin/user/List';
// import UserDetail from '@pages/admin/user/Detail';
export default class Wrap extends Component {
  render() {
    return (
      <Switch>
        {/* <AdminAuthRoute exact path="/admin/user/add" component={AddUser} /> */}
        <AdminAuthRoute exact path="/admin/user/list" component={UserList} />
        {/* <AdminAuthRoute path="/admin/user/detail" component={UserDetail} /> */}
      </Switch>
    );
  }

}
