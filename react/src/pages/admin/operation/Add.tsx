import React, { FormEvent } from "react";
import { Form, Input, Button, message, Breadcrumb, } from 'antd';
import { FormComponentProps } from "antd/lib/form";
import { Link } from "react-router-dom";
import operationApi from "@api/operation";
import gSass from "@utils/sass";

const style = gSass.admin.operation.add;
const formItemLayout = {
  labelCol: {
    sm: {
      span: 4,
      offset: 4,
    },
  },
  wrapperCol: {
    sm: {
      span: 8,
      offset: 0,
    },
  },
};
const { TextArea } = Input;
class AddOperation extends React.Component<FormComponentProps> {
  //登录
  addSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      let data = {
        name: fieldsValue.name,
        action: fieldsValue.action,
        description: fieldsValue.description || "",
      }
      operationApi.addOperation(data).then(_ => {
        message.success('添加成功', 1);
      }).catch(err => {
        message.error('添加失败,失败原因: ' + err.msg, 3);
      })
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={style.permission} >
        <Breadcrumb className={style.title}>
          <Breadcrumb.Item><Link to="/admin" > 首页 </Link></Breadcrumb.Item >
          <Breadcrumb.Item>权限列表 </Breadcrumb.Item>
          <Breadcrumb.Item><Link to="/admin/operation/list" > 权限管理 </Link></Breadcrumb.Item >
        </Breadcrumb>
        <Form className={style.form} >
          <Form.Item  {...formItemLayout} label="操作名" >
            {getFieldDecorator('name', {
              rules: [{ min: 2, max: 32, required: true, message: '请输入2-32的操作名' }],
            })(
              <Input size="large" placeholder="请输入操作名" />
            )}
          </Form.Item >
          <Form.Item {...formItemLayout} label="操作方法" >
            {getFieldDecorator('action', {
              rules: [{ required: true, message: '请输入操作方法' }],
            })(
              <Input size="large" placeholder="请输入操作方法" />
            )}
          </Form.Item>
          <Form.Item  {...formItemLayout} label="操作描述">
            {getFieldDecorator('description', {})(
              <TextArea rows={4} placeholder="请输入操作描述" />
            )}
          </Form.Item>
          < Form.Item
            wrapperCol={{
              xs: {
                span: 7,
                offset: 8,
              },
            }}
          >
            <Button size="large" className={style.btn} type="primary" onClick={this.addSubmit} > 添加 </Button>
          </Form.Item>
        </Form>
      </div>);
  }
}
export default Form.create()(AddOperation);
