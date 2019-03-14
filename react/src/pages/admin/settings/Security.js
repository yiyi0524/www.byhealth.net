import React from "react";
import {
  Form, Input, Button, message, Modal, Spin,
} from 'antd';
import userApi from '../../../services/user';
import gSass from '../../../utils/sass';
import { trim } from 'jsbdk';
const style = gSass.admin.settings.base;

const confirm = Modal.confirm;
class Security extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spinning: true,
      oriPwd: "",
      newPwd: "",
      rePwd: "",
      email: "",
      secutiy: [
        {
          title: "密码强度",
          description: "当前密码强度",
          class: "green",
          detail: "强",
          clickEvt: this.openModifyPwdModal
        },
        {
          title: "密保手机",
          description: "已绑定手机号码",
          class: "",
          detail: "188****8888",
          clickEvt: null,
        },
        {
          title: "备用邮箱",
          description: "已绑定邮箱",
          class: "",
          detail: "ant***sign.com",
          clickEvt: null,
        },
      ],
    }
  }
  componentDidMount() {
    this.init();
  }
  init = async _ => {
    let security = this.state.secutiy;
    security[1].detail = '18011112222'.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
    security[2].detail = '1111@qq.com'.replace(/(\w{2})[^@]*/, '$1****');
    this.setState({
      security,
      spinning: false,
    })
  }
  onEmailChange = evt => {
    this.setState({
      email: evt.target.value,
    })
  }
  modifyPwd = _ => {
    if (this.state.oriPwd === "") {
      return message.error("请输入原密码", 1);
    }
    if (this.state.newPwd === "") {
      return message.error("请输入新密码", 1);
    }
    if (this.state.rePwd === "") {
      return message.error("请输入确认密码", 1);
    }
    let data = {
      oriPwd: this.state.oriPwd,
      newPwd: this.state.newPwd,
      rePwd: this.state.rePwd,
    }
    userApi.modifyPwd(data).then(json => {
      message.success("修改成功", 1);
    }).catch(err => {
      message.error("修改失败,失败原因为 : " + err.msg, 3);
    })
  }
  //打开修改密码modal
  openModifyPwdModal = _ => {
    let that = this;
    confirm({
      title: "修改密码",
      content: (
        <div>
          原密码: <Input.Password style={{ margin: '10px 0' }} min={4} max={32} placeholder="请输入原密码"
            onChange={evt => {
              this.setState({
                oriPwd: trim(evt.target.value),
              })
            }}
          />
          新密码: <Input.Password style={{ margin: '10px 0' }} min={4} max={32} placeholder="请输入新密码"
            onChange={evt => {
              this.setState({
                newPwd: trim(evt.target.value),
              })
            }}
          />
          确认密码: <Input.Password style={{ margin: '10px 0' }} min={4} max={32} placeholder="请确认新密码"
            onChange={evt => {
              this.setState({
                rePwd: trim(evt.target.value),
              })
            }}
            onPressEnter={that.modifyPwd}
          />
        </div>
      ),
      onOk() {
        that.modifyPwd()
      },
      onCancel() { },
      okText: "确认",
      cancelText: "取消",
    });
  }
  render() {
    return (
      <Spin tip="Loading..." spinning={this.state.spinning} size="large">
        <div className={style.title}>安全设置</div>
        <div className={style.security}>
          {this.state.secutiy.map((v, k) => {
            return (<div className={style.box} key={k}>
              <div className={style.securityLeft}>
                <div className={style.securityTitle}>{v.title}</div>
                <div className={style.securityDetail}>{v.description} : <span >{v.detail}</span></div>
              </div>
              <div className={style.securityRight}>
                <Button disabled={!v.clickEvt} onClick={v.clickEvt}>修改</Button>
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
