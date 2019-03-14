import React from "react";
import {
  Form, Input, Button, message, Upload, Icon, Modal, Spin, Select, Radio,
} from 'antd';
import { getUploadImgUrl } from '../../../services/api';
import userApi from "../../../services/user";
import gSass from '../../../utils/sass';


const style = gSass.admin.settings.base;
const RadioGroup = Radio.Group;
const Option = Select.Option;
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
let date = new Date().getFullYear(), gradeList = [];
for (let i = 0; i <= (date - 1990); i++) {
  gradeList.push({ value: i, label: (1990 + i) })
}
class CampusInformation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spinning: true,
      previewVisible: false,
      previewImage: '',
      idCardNoValidation: true,
      collegeList: [],
      specialityList: [],
      educationList: [],
      grades: gradeList,
      isGraduation: null,//不能删除
      //date
      one_card_pass_pic: [],
      degree_pic: [],
      schoolInfo: {},
    }
  }
  componentDidMount() {
    this.init();
  }
  init = async _ => {
    this.getSchoolInfo()
  }
  //信息获取
  getSchoolInfo = async _ => {
    return new Promise(s => {
      s({
        collegeList: [
          {
            value: 1,
            label: "信息科学与技术学院",
          },
          {
            value: 2,
            label: "文学语学院",
          },
          {
            value: 3,
            label: "外语学院",
          },
          {
            value: 4,
            label: "化生学院",
          },
          {
            value: 5,
            label: "艺术学院",
          },
        ],
        specialityList: [
          {
            value: 1,
            label: "多媒体技术",
          },
          {
            value: 2,
            label: "网络工程",
          },
          {
            value: 3,
            label: "计算机科学与技术",
          },
        ],
        educationList: [
          {
            value: 1,
            label: "本科在读",
          },
          {
            value: 2,
            label: "硕士在读",
          },
          {
            value: 3,
            label: "博士在读",
          },
          {
            value: 4,
            label: "本科毕业",
          },
          {
            value: 5,
            label: "硕士毕业",
          },
          {
            value: 6,
            label: "博士毕业",
          },
        ],

      })
    }).then(json => {
      this.setState({
        spinning: false,
        collegeList: json.collegeList,
        specialityList: json.specialityList,
        educationList: json.educationList,
      })
    })
  }

  //提交
  updateUserIfno = evt => {
    evt.preventDefault();
    this.props.form.validateFields((err, fields) => {
      if (err !== null) {
        return message.error(err[0].errors[0].message, 3);
      }
      let name = fields.name,
        college = fields.college,
        speciality = fields.speciality,
        grade = fields.grade,
        education = fields.education,
        graduation = parseInt(fields.graduation),
        one_card_pass_pic = this.state.isGraduation === 0 ? fields.one_card_pass_pic : "",
        degree_pic = this.state.isGraduation === 1 ? fields.degree_pic : "";
      console.log({ name, college, speciality, grade, education, graduation, one_card_pass_pic, degree_pic, });

      message.info('自己写接口', 1);
      userApi.editCampushInformation({ name, college, speciality, grade, education, graduation, one_card_pass_pic, degree_pic, }).then(json => {
        message.success('修改成功', 1);
      }).catch(err => {
        message.error('修改失败,失败原因: ' + err.msg, 1);
        console.log(err);
      })
    });
  }
  //上传图片
  one_card_pass_picChange = ({ fileList }) => this.setState({ one_card_pass_pic: fileList })
  degree_picChange = ({ fileList }) => this.setState({ degree_pic: fileList })
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  handleCancel = _ => this.setState({ previewVisible: false })


  render() {
    const { getFieldDecorator } = this.props.form;
    const { one_card_pass_pic, previewVisible, previewImage, degree_pic, } = this.state;
    //头像上传按钮
    return (
      <Spin tip="Loading..." spinning={this.state.spinning} size="large">
        <div>
          <div className={style.title}>学校信息</div>
          <Form className={style.form}>
            <Form.Item {...formItemLayout} label="姓名" >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入姓名' }],
              })(<Input placeholder="请输入姓名" />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="学院"  >
              {getFieldDecorator('college', {

                rules: [{ required: true, message: '请选择学院' }],
              })(
                <Select placeholder="请选择学院">
                  {this.state.collegeList.map((v, k) => {
                    return (<Option key={`${k}`} value={v.value}>{v.label}</Option>);
                  })}
                </Select>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="专业"  >
              {getFieldDecorator('speciality', {
                rules: [{ required: true, message: '请选择专业' }],
              })(
                <Select placeholder="请选择专业">
                  {this.state.specialityList.map((v, k) => {
                    return (<Option key={`${k}`} value={v.value}>{v.label}</Option>);
                  })}
                </Select>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="年级"  >
              {getFieldDecorator('grade', {
                rules: [{ required: true, message: '请选择年级' }],
              })(
                <Select placeholder="请选择年级">
                  {this.state.grades.map((v, k) => {
                    return (<Option key={`${k}`} value={v.value}>{v.label}</Option>);
                  })}
                </Select>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="学历"  >
              {getFieldDecorator('education', {
                rules: [{ required: true, message: '请选择学历' }],
              })(
                <Select placeholder="请选择学历">
                  {this.state.educationList.map((v, k) => {
                    return (<Option key={`${k}`} value={v.value}>{v.label}</Option>);
                  })}
                </Select>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="是否为毕业生"  >
              {getFieldDecorator('graduation', {
                rules: [{ required: true, message: '请选择是否为毕业生' }],
              })(
                <RadioGroup onChange={evt => {
                  this.setState({
                    isGraduation: parseInt(evt.target.value),
                  })
                }}>
                  <Radio value="0">否</Radio>
                  <Radio value="1">是</Radio>
                </RadioGroup>
              )}
            </Form.Item>

            <Form.Item {...formItemLayout} label="一卡通证件照"
              className={this.state.isGraduation === 0 ? "" : style.hidden}>
              {getFieldDecorator('one_card_pass_pic', {
              })(
                <div className="clearfix">
                  <Upload action={getUploadImgUrl()} listType="picture-card" fileList={one_card_pass_pic}
                    onPreview={this.handlePreview} onChange={this.one_card_pass_picChange}>
                    {one_card_pass_pic.length > 0 ? null : uploadButton}
                  </Upload>
                  <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </div>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="学位证证件照"
              className={this.state.isGraduation === 1 ? "" : style.hidden}>
              {getFieldDecorator('degree_pic', {
              })(
                <div className="clearfix">
                  <Upload action={getUploadImgUrl()} listType="picture-card" fileList={degree_pic}
                    onPreview={this.handlePreview} onChange={this.degree_picChange}>
                    {degree_pic.length > 0 ? null : uploadButton}
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
export default Form.create()(CampusInformation);
