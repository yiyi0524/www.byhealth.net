import React, { Component } from 'react';
import {
  Layout, Menu, Icon, Dropdown, Badge, Tooltip, Input,
} from 'antd';
import { Link, } from 'react-router-dom';
import gImg from '@utils/img';
import gSass from '@utils/sass';
import { connect } from 'react-redux';
import { AppState } from '@/redux/stores/store';
const style = gSass.common.header;
const { Header: AntdHeader, } = Layout;

interface Props {
  changeCollapse: (isCollapsed: boolean) => void
  collapsed: boolean,
  nick: string
}
interface State {
  isSearching: boolean,
  searchValue: string,
}
const mapStateToProps = (state: AppState) => {
  return {
    nick: state.admin.nick,
    uid: state.admin.uid,
  };
};
@connect(mapStateToProps)
export default class Header extends Component<Props, State> {
  static defaultProps = {
    uid: 0,
    nick: '',
  }
  textInput: Input | null = null;
  constructor(props: any) {
    super(props);
    this.state = {
      isSearching: false,
      searchValue: "",
    }
  }
  componentDidMount() {
  }
  focus = () => {
    if (this.textInput) {
      this.textInput.focus();
    }
  }
  render() {
    return (
      <AntdHeader className={style.header}>
        <div>
          <Icon onClick={_ => this.props.changeCollapse(!this.props.collapsed)}
            className={style['menu-fold']} type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'} />
          <Tooltip placement="top" title="首页">
            <Link to="/admin"><Icon className={style.home} type="home"></Icon></Link>
          </Tooltip>
        </div>
        <div className={style['right-tools'] + " flex v-center"}>
          <div className={style['search']}>
            <Icon className={style.icon} type='search' onClick={_ => {
              this.focus();
              this.setState({
                isSearching: !this.state.isSearching,
              })
            }} />
            <div className={this.state.isSearching ? style["search-input"] : style['search-input-hidden']} >
              <Input className={style["input"]} placeholder="站内搜索"
                ref={(input) => { this.textInput = input; }}
                value={this.state.searchValue}
                onBlur={_ => {
                  this.setState({
                    isSearching: false,
                  })
                }}
                onChange={(e) => {
                  this.setState({
                    searchValue: e.target.value,
                  })
                }}
                onPressEnter={_ => {
                  console.log(this.state.searchValue);
                }}
              />
            </div>
          </div>
          <Tooltip title="使用文档">
            <span className={style['question']}>
              <Icon className={style['icon']} type='question-circle' />
            </span>
          </Tooltip>
          <span className={style['bell']}>
            <Badge count={12}>
              <Icon className={style['icon']} type='bell' />
            </Badge>
          </span>
          <Dropdown overlay={<Menu>
            {/* <Menu.Item key="0">
              <Link to="/admin/information">
                <div className={style['right-tools-dropdown-item']}>
                  <Icon className={style.icon} type='user' />
                  个人中心</div>
              </Link>
            </Menu.Item> */}
            <Menu.Item key="1">
              <Link to="/settings/base">
                <div className={style['right-tools-dropdown-item']}>
                  <Icon className={style.icon} type='setting' />个人设置
              </div>
              </Link>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="3">
              <Link to="/logout">
                <div className={style['right-tools-dropdown-item']}>
                  <Icon className={style.icon} type='lougout' />退出登录
              </div>
              </Link>
            </Menu.Item>
          </Menu>} trigger={['hover']}>
            <span className={style['person-info']}>
              <img className={style.avatar} src={gImg.common.defaultAvatar} alt="" />
              <span className={style.uname}>{this.props.nick}</span>
            </span>
          </Dropdown>
          <Dropdown overlay={<Menu>
            <Menu.Item key="4">
              <div className={style['right-tools-dropdown-item']}>
                <span>CN</span>简体中文 </div>
            </Menu.Item>
            <Menu.Item key="5">
              <div className={style['right-tools-dropdown-item']}>
                <span>HK</span> 繁体中文 </div>
            </Menu.Item>
            <Menu.Item key="6">
              <div className={style['right-tools-dropdown-item']}>
                <span>EN</span> English </div>
            </Menu.Item>
          </Menu>} trigger={['hover']}>
            <span className={style['global']}>
              <Icon className={style['icon']} type='global' />
            </span>
          </Dropdown>
        </div>
      </AntdHeader >
    )
  }
}
