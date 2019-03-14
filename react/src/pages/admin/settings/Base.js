import React from "react";
import { Route, Link, } from "react-router-dom";
import {
  Form, Menu,
} from 'antd';
import { getUploadImgUrl } from '../../../services/api';
import BaseSettings from "./baseSettings";
import Security from "./Security";
import Binding from "./Binding";
// import RealNameAuthentication from "./RealNameAuthentication";
// import CampusInformation from "./CampusInformation";
import gSass from '../../../utils/sass';

const style = gSass.admin.settings.base;

class Base extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      uploadUrl: getUploadImgUrl,
      menuKey: 1,
    }
  }
  componentDidMount() {

  }
  menuOnSelect = evt => {
    this.setState({
      menuKey: parseInt(evt.key),
    })
  }
  render() {
    return (
      <div className={style.base}>
        <div className={style.baseBox}>
          <div className={style.left}>
            <Menu mode="inline" defaultSelectedKeys={["1"]}
              onSelect={this.menuOnSelect}>
              <Menu.Item key="1">
                <Link to="/settings/base"><span>基本信息</span></Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/settings/security"><span>安全设置</span></Link>
              </Menu.Item>
            </Menu>
          </div>
          <div className={style.right}>
            <Route path={"/settings/base"} component={BaseSettings} />
            <Route path={"/settings/security"} component={Security} />
            <Route path={"/settings/accountBinding"} component={Binding} />
          </div>
        </div>
      </div >
    );
  }
}

export default Form.create()(Base);

