import React from "react";
import {
  Form, Button, Icon, Spin,
} from 'antd';
import gSass from '../../../utils/sass';

const style = gSass.admin.settings.base;
//地址

class Security extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spinning: true,
      pwd: "",
      email: "",
      secutiy: [
        {
          icon: "taobao-o",
          title: "绑定淘宝",
          color: "#ff4000",
          description: "当前未绑定淘宝账号",
          click: "setTaobao",
          detail: "",
        },
        {
          icon: "alipay",
          title: "绑定支付宝",
          color: "#2eabff",
          description: "当前未绑定支付宝账号",
          detail: "",
          click: "setAlipay",
        },
        {
          icon: "dingding",
          title: "绑定钉钉",
          color: "#fff",
          description: "当前未绑定钉钉账号",
          detail: "",
          click: "setDing",
        },
      ],
    }
  }
  componentDidMount() {
    this.init();
  }
  init = _ => {
    this.setState({
      spinning: false,
    })
  }


  onPwdChange = evt => {
    this.setState({
      pwd: evt.target.value,
    })
  }
  onEmailChange = evt => {
    this.setState({
      email: evt.target.value,
    })
  }
  //点击事件
  setEvent = val => {
    if (val === "setTaobao") {
      console.log("绑定淘宝");
    } else if (val === "setAlipay") {
      console.log("绑定支付宝");
    } else if (val === "setDing") {
      console.log("绑定钉钉");
    }
  }

  render() {
    return (
      <Spin tip="Loading..." spinning={this.state.spinning} size="large">
        <div className={style.title}>安全设置</div>
        <div className={style.security}>
          {this.state.secutiy.map((v, k) => {
            return (<div className={style.box} key={k}>
              <div className={v.title === "绑定钉钉" ? style.securityDing : style.securityIcon}>
                <Icon className={style.icon} style={{ color: v.color }} type={v.icon}></Icon>
              </div>
              <div className={style.securityLeft}>
                <div className={style.securityTitle}>{v.title}</div>
                <div className={style.securityDetail}>{v.description}  <span >{v.detail}</span></div>
              </div>
              <div className={style.securityRight}>
                <Button disabled={v.click !== "" ? false : true} onClick={_ => {
                  this.setEvent(v.click);
                }}>修改</Button>
              </div>
            </div>);
          })}
        </div>
      </Spin>
    );
  }
}

const WrappedLogin = Form.create()(Security);

export default WrappedLogin;
