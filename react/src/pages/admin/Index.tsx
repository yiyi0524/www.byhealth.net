import React, { Component } from 'react';
import { Layout, } from 'antd';
import Sidebar from '@components/common/Sidebar';
import Header from '@components/common/Header';
import Content from '@components/common/Content';
interface State {
  sideBarIsCollapsed: boolean,
}
class Index extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      sideBarIsCollapsed: false,
    };
  }
  changeCollapse = (sideBarIsCollapsed: boolean) => {
    this.setState({
      sideBarIsCollapsed,
    })
  }
  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar collapsed={this.state.sideBarIsCollapsed} changeCollapse={this.changeCollapse} />
        <Layout>
          <Header collapsed={this.state.sideBarIsCollapsed} changeCollapse={this.changeCollapse} />
          <Content />
        </Layout>
      </Layout>
    )
  }
}
export default Index;
