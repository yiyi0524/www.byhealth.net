import { Breadcrumb } from 'antd';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import gSass from '@utils/sass';
const style = gSass.common.nav.breadCrumb;

export interface breadCrumbItem {
  name: string,
  to?: string,
}
interface Props {
  breadCrumbList: breadCrumbItem[],
}
export default class MyBreadCrumb extends Component<Props> {
  render() {
    return (
      <Breadcrumb className={style.nav}>
        {this.props.breadCrumbList.map((breadCrumb, k) => {
          return <Breadcrumb.Item key={k}>
            {breadCrumb.to ? <Link to={breadCrumb.to}>{breadCrumb.name}</Link>
              : breadCrumb.name}
          </Breadcrumb.Item>
        })}
      </Breadcrumb>)
  }
}
