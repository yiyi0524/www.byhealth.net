import React from "react";
import {
  Form, Input, Button, message, Upload, Icon, Modal, Cascader, Spin,
} from 'antd';
import userApi from "../../../services/user";
import { getUploadImgUrl } from '../../../services/api';
import gSass from '../../../utils/sass';
import { getRegion } from '../../../utils/utils';
import { BASE_URL, } from '../../../config/prod';

const style = gSass.admin.settings.base;
const { TextArea } = Input;
//地址
const uploadButton = (
  <div>
    <Icon type="plus" />
    <div className="ant-upload-text">上传图片</div>
  </div>
);
const formItemLayout = {
  labelCol: {
    sm: {
      span: 24,
      offset: 0,
    },
  },
  wrapperCol: {
    sm: {
      span: 24,
      offset: 0,
    },
  },
};
class BaseSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spinning: true,
      previewVisible: false,
      previewImage: '',
      fileList: [],
      currNick: '',
      userInfo: {},
      region: [],
      address: [],
      addressDetail: '',
    }
  }
  componentDidMount() {
    this.init();
  }
  init = async _ => {
    const regionPromise = getRegion();
    try {
      const region = await regionPromise;
      await this.getUserInfo();
      this.setState({
        region,
        spinning: false,
      })
    } catch (e) {
      console.log(e)
      this.setState({
        region: [],
        spinning: false,
      })
    }
  }
  //个人信息获取
  getUserInfo = async _ => {
    let json = await userApi.getUserInfo();
    let fileList = this.state.fileList;
    if (json.data.avatar) {
      fileList.push({
        picId: json.data.avatar.id,
        url: BASE_URL + json.data.avatar.url,
        uid: json.data.avatar,
      })
    }
    let address = [];
    if (json.data.address.province) {
      address.push(json.data.address.province)
    }
    if (json.data.address.city) {
      address.push(json.data.address.city)
    }
    if (json.data.address.county) {
      address.push(json.data.address.county)
    }
    console.log(json.data)
    this.setState({
      currNick: json.data.nick,
      userInfo: json.data,
      fileList,
      address,
      addressDetail: json.data.address.detail,
    })
  }
  //提交
  updateUserInfo = evt => {
    evt.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err !== null) {
        console.log(err)
        return message.warn(err[0].error, 1)
      }
      let address = {
        province: null,
        city: null,
        county: null,
        detail: fieldsValue.addressDetail || '',
      };
      if (this.state.address.length > 0) {
        address.province = this.state.address[0];
      }
      if (this.state.address.length > 1) {
        address.city = this.state.address[1];
      }
      if (this.state.address.length > 2) {
        address.county = this.state.address[2];
      }
      let data = {
        nick: fieldsValue.nick,
        avatar: this.state.fileList.length > 0 ? this.state.fileList[0].picId || 0 : 0,
        email: fieldsValue.email || "",
        phone: fieldsValue.phone || "",
        address: address,
        profile: fieldsValue.profile || "",
      };
      userApi.editUserInfo(data).then(json => {
        message.success('修改成功', 1);
      }).catch(err => {
        message.error('修改失败,失败原因: ' + err.msg, 1);
        console.log(err);
      })
    });
  }
  //上传头像
  onAvatarChange = ({ file, fileList }) => {
    if (file.status === 'done') {
      fileList = [];
      let json = file.response;
      if (typeof json === 'object') {
        if (json.code === 0) {
          file.url = json.data.url;
          file.picId = json.data.picId;
          fileList.push(file)
        } else {
          message.error("上传图片失败,错误信息: " + json.data.msg, 3)
        }
      } else {
        message.error("上传图片失败,服务器错误", 3)
      }
    }
    this.setState({
      fileList,
    })
  }
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  handleCancel = _ => this.setState({ previewVisible: false })
  //地址变化出现详细地址
  changeAddress = addressArr => {
    this.setState({
      address: addressArr,
    })
  }
  checkNickIsExist = async nick => {
    return await userApi.checkNickIsExist(nick)
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    //头像上传按钮
    const { previewVisible, previewImage, fileList } = this.state;
    return (
      <Spin tip="Loading..." spinning={this.state.spinning} size="large">
        <div>
          <div className={style.title}>基本信息</div>
          <Form className={style.form}>
            <Form.Item {...formItemLayout} label="昵称" > {getFieldDecorator('nick',
              {
                initialValue: this.state.userInfo.nick, rules: [{
                  validator: async (rule, val, cb) => {
                    let errors = [];
                    if (this.state.currNick !== val) {
                      let isExist = await this.checkNickIsExist(val);
                      if (isExist) {
                        errors.push(new Error('昵称已存在'));
                      }
                    }
                    cb(errors);
                  },
                }],
              })(<Input placeholder="请输入昵称" />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="头像">
              {getFieldDecorator('avatar', {})(
                <div className="clearfix">
                  <Upload action={getUploadImgUrl()}
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.onAvatarChange}
                    accept="image/*"
                    name="file"
                    data={{ name: 'file' }}
                  >
                    {fileList.length > 0 ? null : uploadButton}
                  </Upload>
                  <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="头像" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </div>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="邮箱"  >
              {getFieldDecorator('email', {
                initialValue: this.state.userInfo.email,
                rules: [{ type: "email", message: '请输入正确的邮箱', }],
              })(
                <Input placeholder="请输入邮箱" />)}
            </Form.Item>
            <Form.Item  {...formItemLayout} label="手机号码" >
              {getFieldDecorator('phone', {
                initialValue: this.state.userInfo.phone,
                rules: [{ message: '请输入正确的手机号码', pattern: /^1[3456789]\d{9}$/ }],
              })(
                <Input placeholder="手机号码" />)}
            </Form.Item>
            <Form.Item  {...formItemLayout} label="地址"  >
              {getFieldDecorator('address', {})(
                <div>
                  <Cascader value={this.state.address} placeholder="请选择地址" options={this.state.region} onChange={this.changeAddress} />
                </div>
              )}
            </Form.Item>
            <Form.Item
              {...formItemLayout} label="详细地址" className={this.state.address.length === 0 ? style.hidden : ''} >
              {getFieldDecorator('addressDetail', {
                initialValue: this.state.addressDetail,
              })(<Input placeholder="请输入详细地址" />)}
            </Form.Item>
            <Form.Item  {...formItemLayout} label="个人介绍"   >
              {getFieldDecorator('profile', { initialValue: this.state.userInfo.profile, })(
                <TextArea rows={4} maxLength={500} placeholder="请输入个人介绍" />)}
            </Form.Item>
            <Form.Item wrapperCol={
              {
                xs: {
                  span: 7,
                  offset: 0,
                },
              }}>
              <Button className={style.btn} type="primary" onClick={this.updateUserInfo}>更新基本信息</Button>
            </Form.Item>
          </Form>
        </div>
      </Spin >
    );
  }
}
export default Form.create()(BaseSettings);
