import React, { Component } from "react";
import {
  Form,
  Tabs,
  Input,
  Icon,
  Checkbox,
  Button,
  Row,
  Col,
  Tooltip,
  message
} from "antd";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { Dispatch } from "redux";
import { LocalStorage as storage } from "jsbdk";
import { FormComponentProps } from "antd/lib/form/Form";
import { connect } from "react-redux";
import { AppState } from "@redux/stores/store";
import gImg from "@utils/img";
import userApi, { LOGIN_TYPE } from "@api/user";
import * as adminAction from "@/redux/actions/admin";
import gSass from "@utils/sass";
import { BASE_URL } from "@/config/prod";
const style = gSass.admin.user.login;
const TabPane = Tabs.TabPane;
interface Props {
  isLogin: boolean;
  login: (preload: adminAction.AdminLoginPreload) => void;
  logout: () => void;
}

interface State {
  loginType: number;
  sendPhoneVerifyCodeTitle: string;
  canSendPhoneVerifyCode: boolean;
  accountLoginVerifyCodePicUrl: string;
  verificationCodePicNum: number;
}

const mapStateToProps = (state: AppState) => {
  return {
    isLogin: state.admin.isLogin
  };
};
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    login: (preload: adminAction.AdminLoginPreload) => {
      dispatch(adminAction.login(preload));
    },
    logout: () => {
      dispatch(adminAction.logout());
    }
  };
};
class Login extends Component<
  Props & RouteComponentProps & FormComponentProps,
  State
> {
  constructor(props: any) {
    super(props);
    this.state = {
      loginType: LOGIN_TYPE.ACCOUNT_LOGIN,
      sendPhoneVerifyCodeTitle: "发送验证码",
      canSendPhoneVerifyCode: false,
      accountLoginVerifyCodePicUrl: BASE_URL + "/getVerifyCode",
      verificationCodePicNum: 0
    };
  }
  componentDidMount() {
    this.init();
  }
  init = async () => {
    // if (storage.has('adminIsLogin')) {
    //   this.setState({
    //     isLogin: true,
    //   })
    // }
  };
  //登录
  login = (evt: React.FormEvent<HTMLElement>) => {
    evt && evt.preventDefault();
    let fieldNames = [];
    switch (this.state.loginType) {
      case LOGIN_TYPE.ACCOUNT_LOGIN:
        fieldNames = [
          "account",
          "pwd",
          "accountVerifyCode",
          "rememberAccountPwd"
        ];
        break;
      case LOGIN_TYPE.EMAIL_VERIFY_CODE_LOGIN:
        fieldNames = ["email", "emailVerifyCode", "rememberEmailPwd"];
        break;
      case LOGIN_TYPE.PHONE_VERIFY_CODE_LOGIN:
        fieldNames = ["phone", "phoneVerifyCode", "rememberPhonePwd"];
        break;
      default:
        console.log("不正确的登录方式");
        return;
    }
    this.props.form.validateFields(fieldNames, (err, fieldsValue) => {
      if (err !== null) {
        return;
      }
      userApi
        .adminLogin({
          type: this.state.loginType,
          account: fieldsValue.account,
          pwd: fieldsValue.pwd,
          accountVerifyCode: fieldsValue.accountVerifyCode,
          rememberAccountPwd: !!fieldsValue.rememberAccountPwd,
          email: fieldsValue.email,
          emailVerifyCode: fieldsValue.emailVerifyCode,
          rememberEmailPwd: !!fieldsValue.rememberEmailPwd,
          phone: fieldsValue.phone,
          phoneVerifyCode: fieldsValue.phoneVerifyCode,
          rememberPhonePwd: !!fieldsValue.rememberPhonePwd
        })
        .then(json => {
          message.success("登录成功", 1, () => {
            storage.set("adminIsLogin", true, 15 * 60);
            storage.set("uid", json.data.uid, 15 * 60);
            storage.set("nick", json.data.nick, 15 * 60);
            this.props.login({
              uid: json.data.uid,
              nick: json.data.nick
            });
          });
        })
        .catch(err => {
          message.error("登录失败,失败原因: " + err.msg);
          console.log(err);
          this.refreshAccountLoginVerifyCode();
        });
    });
  };
  //
  selectloginType = (tabIdx: string) => {
    let loginType =
      parseInt(tabIdx) === LOGIN_TYPE.ACCOUNT_LOGIN
        ? LOGIN_TYPE.ACCOUNT_LOGIN
        : LOGIN_TYPE.PHONE_VERIFY_CODE_LOGIN;
    this.setState({
      loginType
    });
  };
  /**
   * 发送手机验证码
   */
  sendPhoneVerifyCode = () => {
    // let sendPhoneVerifyCodeDelay = 60;
    // api.sendPhoneLoginVerifyCode().then(() => {
    //   this.setState({
    //     sendPhoneVerifyCodeTitle: sendPhoneVerifyCodeDelay + "秒后重发",
    //     canSendPhoneVerifyCode: false,
    //   })
    //   let timer = setInterval(() => {
    //     sendPhoneVerifyCodeDelay--;
    //     if (sendPhoneVerifyCodeDelay > 0) {
    //       this.setState({
    //         sendPhoneVerifyCodeTitle: sendPhoneVerifyCodeDelay + "秒后重发",
    //         canSendPhoneVerifyCode: false,
    //       })
    //     } else {
    //       clearInterval(timer);
    //       this.setState({
    //         sendPhoneVerifyCodeTitle: "发送验证码",
    //         canSendPhoneVerifyCode: true,
    //       })
    //     }
    //   }, 1000);
    // }).catch((err: Error) => {
    //   message.error("发送手机验证码失败,错误信息: " + err, 3)
    // })
  };
  refreshAccountLoginVerifyCode = () => {
    this.setState({
      accountLoginVerifyCodePicUrl:
        BASE_URL + "/getVerifyCode?" + new Date().getTime()
    });
  };
  render() {
    if (this.props.isLogin) {
      return <Redirect to="/admin" />;
    }
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      wrapperCol: {
        xs: { span: 20, offset: 2 },
        sm: { span: 20, offset: 2 },
        md: { span: 5, offset: 10 }
      }
    };

    return (
      <div className={style.login}>
        <div className={style.loginBox}>
          <div className={style.logo}>
            <img
              src={`${gImg.login.loginLogo}`}
              alt="logo"
              className={style.logoImg}
            />
          </div>
          {/*<div className={style.title}>邻米cms--后台</div>*/}
          <Tabs
            defaultActiveKey={LOGIN_TYPE.ACCOUNT_LOGIN.toString()}
            animated={false}
            className={style.tabs}
            onChange={this.selectloginType}
          >
            <TabPane
              tab={<span>账户密码登录</span>}
              key={LOGIN_TYPE.ACCOUNT_LOGIN.toString()}
            >
              <Form className={style.form}>
                <Form.Item {...formItemLayout}>
                  {getFieldDecorator("account", {
                    rules: [
                      {
                        min: 2,
                        max: 32,
                        required: true,
                        message: "请输入2-32的账号"
                      }
                    ]
                  })(
                    <Input
                      size="large"
                      prefix={
                        <Icon
                          type="user"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      placeholder="请输入账号"
                    />
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout}>
                  {getFieldDecorator("pwd", {
                    rules: [
                      {
                        min: 4,
                        max: 32,
                        required: true,
                        message: "请输入4-32位密码"
                      }
                    ]
                  })(
                    <Input
                      size="large"
                      prefix={
                        <Icon
                          type="lock"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      type="password"
                      placeholder="请输入密码"
                    />
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout}>
                  {getFieldDecorator("accountVerifyCode", {
                    rules: [
                      {
                        min: 4,
                        max: 32,
                        required: true,
                        message: "请输入验证码"
                      }
                    ]
                  })(
                    <div className={style.verificationCodePic}>
                      <Input
                        size="large"
                        className={style.input}
                        onPressEnter={this.login}
                        prefix={
                          <Icon
                            type="lock"
                            style={{ color: "rgba(0,0,0,.25)" }}
                          />
                        }
                        placeholder="请输入验证码"
                      />
                      <Tooltip title="点击刷新">
                        <img
                          src={this.state.accountLoginVerifyCodePicUrl}
                          onClick={this.refreshAccountLoginVerifyCode}
                          className={style.img}
                          alt="点击刷新"
                        />
                      </Tooltip>
                    </div>
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout}>
                  {getFieldDecorator("rememberAccountPwd", {})(
                    <div className={style.autoLogin}>
                      <Checkbox className={style.autoLoginTitle}>
                        自动登录
                        <Tooltip title="3天免登录">
                          <Icon type="info-circle" className={style.tooltip} />
                        </Tooltip>
                      </Checkbox>
                      <a
                        href="/forgetPassword"
                        className={style.forgetPassword}
                      >
                        忘记密码?
                      </a>
                    </div>
                  )}
                </Form.Item>
              </Form>
            </TabPane>
            <TabPane
              tab={<span>手机号登录</span>}
              key={LOGIN_TYPE.PHONE_VERIFY_CODE_LOGIN.toString()}
            >
              <Form className={style.form}>
                <Form.Item {...formItemLayout}>
                  {getFieldDecorator("phone", {
                    rules: [
                      {
                        required: true,
                        message: "请输入正确手机号",
                        pattern: /^1[3456789]\d{9}$/
                      }
                    ]
                  })(
                    <Input
                      size="large"
                      prefix={
                        <Icon
                          type="user"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      placeholder="请输入手机号"
                    />
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout}>
                  {getFieldDecorator("phoneVerifyCode", {
                    rules: [{ required: true, message: "请输入验证码" }]
                  })(
                    <div className={style.verificationCode}>
                      <Input
                        size="large"
                        placeholder="请输入验证码"
                        className={style.verificationCodeInput}
                        onPressEnter={this.login}
                      />
                      <Button
                        className={style.verificationCodeBtn}
                        size="large"
                        onClick={this.sendPhoneVerifyCode}
                        disabled={this.state.canSendPhoneVerifyCode}
                      >
                        {this.state.sendPhoneVerifyCodeTitle}
                      </Button>
                    </div>
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout}>
                  {getFieldDecorator("RememberPhonePwd", {})(
                    <div className={style.autoLogin}>
                      <Checkbox className={style.checkBox}>
                        {" "}
                        自动登录
                        <Tooltip title="3天免登录">
                          <Icon type="info-circle" className={style.tooltip} />
                        </Tooltip>
                      </Checkbox>
                      <a
                        href="/forgetPassword"
                        className={style.checkBoxForget}
                      >
                        忘记密码?
                      </a>
                    </div>
                  )}
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>
          <div className={style.submit}>
            <Row>
              <Col
                xs={{ span: 20, offset: 2 }}
                sm={{ span: 20, offset: 2 }}
                md={{ span: 5, offset: 10 }}
              >
                <Button
                  size="large"
                  className={style.btn}
                  type="primary"
                  onClick={this.login}
                >
                  登录
                </Button>
              </Col>
              <Col
                xs={{ span: 20, offset: 2 }}
                sm={{ span: 20, offset: 2 }}
                md={{ span: 5, offset: 10 }}
              >
                <div className={style.otherLoginStyle}>
                  <span>其他登录方式 </span>
                  <div className={style.iconBox}>
                    <a href="/qq">
                      <Icon type="qq" className={style.icon} />
                    </a>
                    <a href="/weixin">
                      <Icon type="wechat" className={style.icon} />
                    </a>
                  </div>
                  <a href="/register">注册账户</a>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div className={style.footer}>
          Copyright &copy; 2019 上海邻米网络出品
        </div>
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(Login));
