import React, { Component, } from 'react';
import { Switch, } from 'react-router-dom';
import AdminAuthRoute from '@utils/AdminAuth';
import OperationList from "@pages/admin/operation/List";
import AddOperation from "@pages/admin/operation/Add";
import EditOperation from "@pages/admin/operation/Edit";
import OperationGroupList from "@pages/admin/operation/GroupList";
import AddOperationGroup from "@pages/admin/operation/AddGroup";
import EditOperationGroup from "@pages/admin/operation/EditGroup";
export default class Wrap extends Component {
  render() {
    return (
      <Switch>
        <AdminAuthRoute exact path="/admin/operation/list" component={OperationList} />
        <AdminAuthRoute exact path="/admin/operation/add" component={AddOperation} />
        <AdminAuthRoute exact path="/admin/operation/edit" component={EditOperation} />
        <AdminAuthRoute exact path="/admin/operation/groupList" component={OperationGroupList} />
        <AdminAuthRoute exact path="/admin/operation/addGroup" component={AddOperationGroup} />
        <AdminAuthRoute exact path="/admin/operation/editGroup" component={EditOperationGroup} />
      </Switch>
    );
  }

}
