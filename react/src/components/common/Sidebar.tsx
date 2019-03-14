import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link, } from "react-router-dom";
import gImg from "@utils/img";
import { getMenuList } from '@api/api';
import gSass from '@utils/sass';
import { MenuItem } from '@/config/menuList.jsx';

const style = gSass.common.sidebar;
const { SubMenu } = Menu;
const { Sider } = Layout;
let menuConfig =
{
  theme: 'dark',
  defaultSelectedKeys: ['1'],
  mode: 'inline',
  list: getMenuList(),
};
interface Props {
  collapsed: boolean,
  changeCollapse: (sideBarIsCollapsed: boolean) => void
}
interface State {
  width: number,
  openKeys: string[],
  inlineCollapsed: boolean,
  collapsed: boolean,
}
export default class Sidebar extends Component<Props, State> {
  menuKey: number = 0;
  rootSubmenuKeys: string[] = [];
  constructor(props: any) {
    super(props);
    this.state = {
      width: 250,
      openKeys: [],
      inlineCollapsed: false,
      collapsed: false,
    };

  }
  getMenuList = (menuList: MenuItem[], level = 0) => {
    let that = this;
    if (level === 0) {
      that.menuKey = 0;
    }
    return menuList.map((v) => {
      if (Array.isArray(v.child) && v.child.length > 0) {
        if (level === 0) {
          that.rootSubmenuKeys.push(`sub${that.menuKey}`);
        }
        return <SubMenu key={`sub${that.menuKey++}`}
          title={<span> {v.icon ? <Icon type={v.icon[0]} /> : ''}
            <span >{v.title}</span>
          </span>}>
          {that.getMenuList(v.child, level + 1)}
        </SubMenu>
      } else {
        return <Menu.Item
          key={`${that.menuKey++}`}>
          <Link to={v.href as string}>{v.icon ? <Icon type={v.icon as string} /> : ''}
            <span>{v.title}</span></Link>
        </Menu.Item>
      }
    })
  }
  //关闭其他的展开栏目
  onOpenChange = (openKeys: string[]) => {
    const latestOpenKey = openKeys.find((key: string) => this.state.openKeys.indexOf(key) === -1);
    if (latestOpenKey !== undefined && this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  render() {
    return (
      <Sider collapsible
        collapsed={this.props.collapsed}
        onCollapse={this.props.changeCollapse}//当前张开收起
        width={this.state.width}
      >
        <div className={this.props.collapsed ? style.collapsedLogo : style.logo + " flex center v-center"}>
          {
            this.props.collapsed ?
              <img className={style['collapsed-img']} src={gImg.common.adminCollapsedLogo} alt="" /> :
              <img className={style['img']} src={gImg.common.adminLogo} alt="" />
          }
        </div>
        {<Menu theme={menuConfig.theme === 'dark' ? 'dark' : 'light'}
          defaultSelectedKeys={menuConfig.defaultSelectedKeys}
          mode={
            menuConfig.mode === 'vertical' ? 'vertical' :
              menuConfig.mode === 'vertical-left' ? 'vertical-left' :
                menuConfig.mode === 'vertical-right' ? 'vertical-right' :
                  menuConfig.mode === 'horizontal' ? 'horizontal' : 'inline'
          }
          openKeys={this.state.openKeys}
          onOpenChange={this.onOpenChange}
          defaultOpenKeys={this.state.openKeys}
        >
          {this.getMenuList(menuConfig.list)}
        </Menu>}
      </Sider >
    )
  }
}
