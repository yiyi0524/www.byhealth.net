import React from "react";
import {
  Form, Input, Button, message, Upload, Icon, Modal, Spin,
} from 'antd';
import { getUploadImgUrl } from '../../../services/api';
import userApi from "../../../services/user";
import gSass from '../../../utils/sass';
import { IdentityCodeValid } from "../../../utils/utils";

const style = gSass.admin.settings.base;
//地址
const uploadButton = (
  <div>
    <Icon type="plus" />
    <div className="ant-upload-text">上传图片</div>
  </div>
);
const formItemLayout = {
  labelCol: {
    lg: {
      span: 24,
      offset: 0,
    },
  },
  wrapperCol: {
    lg: {
      span: 24,
      offset: 0,
    },
  },
};
class RealNameAuthentication extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spinning: true,
      previewVisible: false,
      previewImage: '',
      idCardNoValidation: true,
      //date
      idcardFirstPic: [],
      idcardSecondtPic: [],
      userInfo: {},
    }
  }
  componentDidMount() {
    this.init();
  }
  init = async _ => {
    try {
      // await this.getUserInfo();
      this.setState({
        spinning: false,
      })
    } catch (e) {
      this.setState({
        spinning: false,
      })
    }
  }
  //个人信息获取
  getUserInfo = async _ => {

  }

  //提交
  updateUserIfno = evt => {
    evt.preventDefault();
    this.props.form.validateFields((err, fields) => {
      if (err) {
        message.error(err[Object.keys(err)[0]].errors[0].message, 1);
        return;
      }
      if (!this.state.idCardNoValidation) {
        message.error("身份证号码不正确", 1);
        return;
      }
      if (this.state.idcardFirstPic.length === 0 || !fields.idcardFirstPic) {
        message.error("请上传身份证正面照", 1);
        return;
      }
      if (this.state.idcardSecondtPic.length === 0 || !fields.idcardSecondtPic) {
        message.error("请上传身份证反面照", 1);
        return;
      }
      let
        name = fields.name,
        idCardNo = fields.idCardNo || "",
        idcardFirstPic = this.state.idcardFirstPic[0].url || fields.idcardFirstPic,
        idcardSecondtPic = this.state.idcardSecondtPic[0].url || fields.idcardSecondtPic;
      console.log({ name, idCardNo, idcardFirstPic, idcardSecondtPic, });

      message.info('自己写接口', 1);
      userApi.editRealNameAuthentication({ name, idCardNo, idcardFirstPic, idcardSecondtPic, }).then(json => {
        message.success('修改成功', 1);
      }).catch(err => {
        message.error('修改失败,失败原因: ' + err.msg, 1);
        console.log(err);
      })
    });
  }
  //上传图片
  idcardFirstPicChange = ({ fileList }) => this.setState({ idcardFirstPic: fileList })
  idcardSecondtPicChange = ({ fileList }) => this.setState({ idcardSecondtPic: fileList })
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
  //身份证号码验证
  idCardNoValidation = evt => {
    let val = evt.target.value;
    IdentityCodeValid(val).then(json => {
      this.setState({
        idCardNoValidation: json.pass,
      })
      if (!json.pass) {
        message.error("身份证号码错误: " + json.msg, 1)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    //头像上传按钮
    const { previewVisible, previewImage, idcardSecondtPic, idcardFirstPic } = this.state;
    return (
      <Spin tip="Loading..." spinning={this.state.spinning} size="large">
        <div>
          <div className={style.title}>实名认证</div>
          <Form className={style.form}>
            <Form.Item {...formItemLayout} label="姓名" >
              {getFieldDecorator('name', {
              })(<Input placeholder="请输入姓名" />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="身份证号码"  >
              {getFieldDecorator('idCardNo', {
                rules: [{ required: true, message: '请输入身份证号码' }],
              })(
                <Input placeholder="请输入身份证号码" onBlur={this.idCardNoValidation} />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="身份证正面">
              {getFieldDecorator('idcardFirstPic', {})(
                <div className="clearfix">
                  <Upload action={getUploadImgUrl()} listType="picture-card" fileList={idcardFirstPic}
                    onPreview={this.handlePreview} onChange={this.idcardFirstPicChange}>
                    {idcardFirstPic.length > 0 ? null : uploadButton}
                  </Upload>
                  <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </div>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="身份证反面">
              {getFieldDecorator('idcardSecondtPic', {})(
                <div className="clearfix">
                  <Upload action={getUploadImgUrl()} listType="picture-card" fileList={idcardSecondtPic}
                    onPreview={this.handlePreview} onChange={this.idcardSecondtPicChange}>
                    {idcardSecondtPic.length > 0 ? null : uploadButton}
                  </Upload>
                  <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </div>
              )}
            </Form.Item>

            <Form.Item wrapperCol={{ lg: { span: 7, offset: 0, }, }}>
              <Button className={style.btn} type="primary" onClick={this.updateUserIfno}>更新基本信息</Button>
            </Form.Item>
          </Form>
        </div>
      </Spin >
    );
  }
}
export default Form.create()(RealNameAuthentication);
