import React from 'react';
import { Redirect, Switch, } from 'react-router-dom';
import { Layout, } from 'antd';
import gSass from '@/utils/sass';

import Workplace from '@pages/common/Workplace';
import BasicList from '@pages/common/BasicList';
import BasicForm from "@pages/common/BasicForm";
import OperationWrap from "@components/admin/operation/Wrap";
// import UserWrap from "@components/admin/user/Wrap";
import Settings from "@pages/admin/settings/Base";
import AdminAuthRoute from '@utils/AdminAuth';
const style = gSass.common.content;

const { Content: AntdContent, } = Layout;

export default class Content extends AntdContent {
  render() {
    return (
      <AntdContent>
        <div className={style.content}>
          <Switch>
            <AdminAuthRoute exact path="/admin" component={Workplace} />
            <AdminAuthRoute exact path="/admin/BasicList" component={BasicList} />
            <AdminAuthRoute exact path="/admin/basicForm" component={BasicForm} />
            <AdminAuthRoute path="/admin/operation" component={OperationWrap} />
            {/* <AdminAuthRoute path="/admin/user" component={UserWrap} /> */}
            <AdminAuthRoute path="/settings" component={Settings} />
            <Redirect to="/admin" />
          </Switch>
        </div>
      </AntdContent>
    );
  }

}
