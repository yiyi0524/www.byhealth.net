import React, { Component, FormEvent, } from "react";
import { Form, Input, Button, message, Breadcrumb, } from 'antd';
import qs from "qs";
import { Link, RouteProps } from "react-router-dom";
import operationApi from "@api/operation";
import gSass from '@utils/sass';
import { FormComponentProps } from "antd/lib/form";
const style = gSass.admin.operation.add;
const { TextArea } = Input;
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
interface Props { }
interface State {
  id: number
}
export interface DbOperationDetail {
  id: number
  name: string,
  action: string,
  description: string,
  cuid: number,
  ctime: string,
}
export interface OperationDetail {
  id: number
  name: string,
  action: string,
  description: string,
  checked: boolean,
}
class Edit extends Component<Props & RouteProps & FormComponentProps, State> {
  constructor(props: Props & RouteProps & FormComponentProps) {
    super(props);
    if (this.props.location) {
      let search = qs.parse(this.props.location.search, { ignoreQueryPrefix: true, })
      let id: number = search.id;
      this.state = {
        id,
      }
    }
  }
  componentDidMount() {
    operationApi.getDetail(this.state.id).then(json => {
      this.props.form.setFieldsValue({
        name: json.data.detail.name,
        action: json.data.detail.action,
        description: json.data.detail.description,
      })
    }).catch(err => {
      message.error('获取操作详情失败,错误信息: ' + err.msg)
    })
  }
  //登录
  editSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      let data = {
        id: this.state.id,
        name: fieldsValue.name,
        action: fieldsValue.action,
        description: fieldsValue.description || "",
      }
      operationApi.editOperation(data).then(_ => {
        message.success('编辑成功', 1);
      }).catch(err => {
        message.error('编辑失败,失败原因: ' + err.msg, 3);
      })
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={style.permission}>
        <Breadcrumb className={style.title}>
          <Breadcrumb.Item><Link to="/">首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to="/admin/operation/list">权限列表</Link></Breadcrumb.Item>
          <Breadcrumb.Item>编辑</Breadcrumb.Item>
        </Breadcrumb>
        <Form className={style.form}>
          <Form.Item
            {...formItemLayout}
            label="操作名"
          >
            {getFieldDecorator('name', {
              rules: [{ min: 2, max: 32, required: true, message: '请输入2-32的操作名' }],
            })(
              <Input size="large" placeholder="请输入操作名" />
            )}
          </Form.Item >
          <Form.Item
            {...formItemLayout}
            label="操作方法"
          >
            {getFieldDecorator('action', {
              rules: [{ required: true, message: '请输入操作方法' }],
            })(
              <Input size="large" placeholder="请输入操作方法" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="操作描述"
          >
            {getFieldDecorator('description', {
            })(
              <TextArea rows={4} placeholder="请输入操作描述" />
            )}
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: {
                span: 7,
                offset: 8,
              },
            }}
          >
            <Button size="large" className={style.btn} type="primary" onClick={this.editSubmit}>确定</Button>
          </Form.Item>
        </Form>
      </div >
    );
  }
}

export default Form.create()(Edit)
