import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
  Form, Input, Icon, InputNumber, Radio, Button, Checkbox, Switch, Tooltip,
  Breadcrumb, DatePicker, Select, Cascader,
} from 'antd';
import gSass from '../../utils/sass';
import { FormComponentProps } from 'antd/lib/form';
import moment, { Moment } from 'moment';
import { RangePickerPresetRange, RangePickerValue } from 'antd/lib/date-picker/interface';
import { RadioChangeEvent } from 'antd/lib/radio';
const style = gSass.common.basicForm;

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
interface Props { }
interface State {
  confirmDirty: boolean,
  isHrefTargetDisclosureOption: boolean,
  isAddress: boolean,
}

class RegistrationForm extends Component<Props & FormComponentProps, State> {
  state = {
    confirmDirty: false,
    isHrefTargetDisclosureOption: false,
    isAddress: false,
  };
  //提交
  handleSubmit = (evt: React.FormEvent<HTMLElement>) => {
    evt.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      } else {
        console.log(err);
      }
    });
  }
  //时间
  onAloneOk = (selectedTime: moment.Moment) => {
    console.log('onOk: ', selectedTime);
  }
  onAloneChange = (date: Moment, dateStrings: string) => {
    console.log(date)
    console.log(dateStrings)
  }
  //起止时间
  onDateOk = (selectedTime: RangePickerPresetRange) => {
    console.log('onOk: ', selectedTime);
  }
  onDateChange = (dates: RangePickerValue, dateStrings: [string, string]) => {
    console.log(dates)
    console.log(dateStrings)
  }
  //目标共开选择部分公开时显示选择器
  targetDisclosureChange = (e: RadioChangeEvent) => {
    this.setState({
      isHrefTargetDisclosureOption: e.target.value === 2,
    })
  }
  //地址变化出现详细地址
  addressChange = (value: string[]) => {
    this.setState({
      isAddress: value.length === 0,
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    //地址
    const residences = [{
      value: '1',
      label: '上海',
      children: [{
        value: '11',
        label: '上海市',
      }],
    }, {
      value: '2',
      label: '北京',
      children: [{
        value: '21',
        label: '北京市',
        children: [{
          value: '211',
          label: '官渡区',
        }],
      }],
    }];
    //复选框
    const plainOptions = ['JS', 'PHP', 'JAVA'];
    //网站
    const selectBefore = getFieldDecorator('websit', { initialValue: 'http://', })(
      <Select style={{ width: 90, paddingLeft: 15, }}>
        <Option value="http://">http://</Option>
        <Option value="https://">https://</Option>
      </Select>
    );
    const selectAfter = (
      <Select defaultValue=".com">
        <Option value=".com">.com</Option>
        <Option value=".jp">.jp</Option>
        <Option value=".cn">.cn</Option>
        <Option value=".org">.org</Option>
      </Select>
    );
    return (
      <div className={style.basicForm}>
        <div className={style.header}>
          <Breadcrumb>
            <Breadcrumb.Item><Link to="/">首页</Link></Breadcrumb.Item>
            <Breadcrumb.Item>表单页</Breadcrumb.Item>
            <Breadcrumb.Item>基础表单</Breadcrumb.Item>
          </Breadcrumb>
          <div className={style.description}>
            <div className={style.title}>基础表单</div>
            <div className={style.detail}>基础表单用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。</div>
          </div>
        </div>
        <div className={style.content + "  flex center"}>
          <Form style={{ width: '100%', }} onSubmit={this.handleSubmit}>
            <Form.Item
              labelCol={{
                xs: {
                  span: 3,
                  offset: 5,
                },
              }}
              wrapperCol={{
                xs: {
                  span: 7,
                  offset: 0,
                },
              }}
              label="标题"
            >
              {getFieldDecorator('title', {
                rules: [{ min: 1, max: 15, required: true, message: '请输入正确格式的标题' }],
              })(
                <Input placeholder="请输入1-15个字符的标题" />
              )}
            </Form.Item>
            <Form.Item
              labelCol={{
                xs: {
                  span: 3,
                  offset: 5,
                },
              }}
              wrapperCol={{
                xs: {
                  span: 7,
                  offset: 0,
                },
              }}
              label="时间"
            >
              {getFieldDecorator('aloneDate', {
                rules: [{ type: 'object', required: true, message: '请选择时间' }],
              })(
                <DatePicker
                  showTime
                  format="YYYY-MM-DD"
                  onChange={this.onAloneChange}
                  onOk={this.onAloneOk}
                  className={style.datePicker}
                />
              )}
            </Form.Item>
            <Form.Item
              labelCol={{
                xs: {
                  span: 3,
                  offset: 5,
                },
              }}
              wrapperCol={{
                xs: {
                  span: 7,
                  offset: 0,
                },
              }}
              label="起止日期"
            >
              {getFieldDecorator('date', {
                rules: [{ type: 'array', required: true, message: '请选择时间' }],
              })(
                <RangePicker
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  onChange={this.onDateChange}
                  onOk={this.onDateOk}
                  className={style.datePicker}
                />
              )}
            </Form.Item>
            <Form.Item
              labelCol={{
                xs: {
                  span: 3,
                  offset: 5,
                },
              }}
              wrapperCol={{
                xs: {
                  span: 7,
                  offset: 0,
                },
              }}
              label="目标描述"
            >
              {getFieldDecorator('targetDescription', {
                rules: [{ max: 500, required: true, message: '请输入目标描述' }],
              })(
                <TextArea rows={4} placeholder="目标描述" />
              )}
            </Form.Item>
            <Form.Item
              labelCol={{
                xs: {
                  span: 3,
                  offset: 5,
                },
              }}
              wrapperCol={{
                xs: {
                  span: 7,
                  offset: 0,
                },
              }}
              label={(
                <span>客户 <span className={style.secondaryColor}>( 选填 )</span>
                  <Tooltip title="客户/姓名">
                    <Icon className={style.secondaryColor} type="info-circle" />
                  </Tooltip>
                </span>
              )}
            >
              {getFieldDecorator('customer', {
              })(
                <Input placeholder="请输入客户" />
              )}
            </Form.Item>
            <Form.Item
              labelCol={{
                xs: {
                  span: 3,
                  offset: 5,
                },
              }}
              wrapperCol={{
                xs: {
                  span: 7,
                  offset: 0,
                },
              }}
              label="地址"
            >
              {getFieldDecorator('address', {
                rules: [{ type: 'array', required: true, message: '请选择地址' }],
              })(
                <Cascader placeholder="请选择地址" options={residences} onChange={this.addressChange} />
              )}
            </Form.Item>
            <Form.Item
              labelCol={{
                xs: {
                  span: 3,
                  offset: 6,
                },
              }}
              wrapperCol={{
                xs: {
                  span: 6,
                  offset: 0,
                },
              }}
              label="详细地址"
              className={this.state.isAddress ? "" : style.hidden}
            >
              {getFieldDecorator('addressDescription', {
              })(
                <Input placeholder="请输入详细地址" />
              )}
            </Form.Item>
            <Form.Item
              labelCol={{
                xs: {
                  span: 3,
                  offset: 5,
                },
              }}
              wrapperCol={{
                xs: {
                  span: 7,
                  offset: 0,
                },
              }}
              label="邮箱"
            >
              {getFieldDecorator('email', {
                rules: [{
                  type: 'email', message: '请输入正确的邮箱',
                }, {
                  required: true, message: '请输入邮箱',
                }],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item
              labelCol={{
                xs: {
                  span: 3,
                  offset: 5,
                },
              }}
              wrapperCol={{
                xs: {
                  span: 7,
                  offset: 0,
                },
              }}
              label="手机号码"
            >
              {getFieldDecorator('phone', {
                rules: [{ required: true, message: '请输入正确手机号码', pattern: /^1(3|4|5|7|8)\d{9}$/ }],
              })(
                <Input style={{ width: '100%' }} />
              )}
            </Form.Item>
            <Form.Item
              labelCol={{
                xs: {
                  span: 3,
                  offset: 5,
                },
              }}
              wrapperCol={{
                xs: {
                  span: 7,
                  offset: 0,
                },
              }}
              label="语言"
            >
              {getFieldDecorator('checkbox', {
                rules: [{ type: "array", }],
              })(
                <CheckboxGroup options={plainOptions} />
              )}
            </Form.Item>
            <Form.Item
              labelCol={{
                xs: {
                  span: 3,
                  offset: 5,
                },
              }}
              wrapperCol={{
                xs: {
                  span: 7,
                  offset: 0,
                },
              }}
              label="开关"
            >
              {getFieldDecorator('switch', { valuePropName: 'checked' })(
                <Switch />
              )}
            </Form.Item>
            <Form.Item
              labelCol={{
                xs: {
                  span: 3,
                  offset: 5,
                },
              }}
              wrapperCol={{
                xs: {
                  span: 7,
                  offset: 0,
                },
              }}
              label="网址"
            >
              {getFieldDecorator('website', {
              })(
                <Input addonBefore={selectBefore} addonAfter={selectAfter} placeholder="请输入网址" />
              )}
            </Form.Item>
            <Form.Item
              labelCol={{
                xs: {
                  span: 3,
                  offset: 5,
                },
              }}
              wrapperCol={{
                xs: {
                  span: 7,
                  offset: 0,
                },
              }}
              label={(
                <span>权重 <span className={style.secondaryColor}>( 选填 )</span></span>
              )}
            >
              {getFieldDecorator('weights', {
              })(
                <InputNumber min={1} max={10} />
              )}
              <span> %</span>
            </Form.Item>
            <Form.Item
              labelCol={{
                xs: {
                  span: 3,
                  offset: 5,
                },
              }}
              wrapperCol={{
                xs: {
                  span: 7,
                  offset: 0,
                },
              }}
              className={style.noneMarginBottom}
              label="目标公开"
            >
              {getFieldDecorator('targetDisclosure', {
              })(
                <RadioGroup onChange={this.targetDisclosureChange}>
                  <Radio value={1}>公开</Radio>
                  <Radio value={2}>部分公开</Radio>
                  <Radio value={3}>不公开</Radio>
                </RadioGroup>
              )}
            </Form.Item>
            <Form.Item
              labelCol={{
                xs: {
                  span: 3,
                  offset: 5,
                },
              }}
              wrapperCol={{
                xs: {
                  span: 7,
                  offset: 8,
                },
              }}
              className={style.noneMarginBottom}>
              {getFieldDecorator('targetDisclosureOption', {
              })(
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="请选择"
                  className={!this.state.isHrefTargetDisclosureOption ? style.hidden : ""}
                >
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="tom">Tom</Option>
                </Select>
              )}

            </Form.Item>
            <Form.Item
              labelCol={{
                xs: {
                  span: 3,
                  offset: 5,
                },
              }}
              wrapperCol={{
                xs: {
                  span: 7,
                  offset: 8,
                },
              }}>
              <div>客户、邀评人默认被分享</div>
            </Form.Item>
            <Form.Item
              labelCol={{
                xs: {
                  span: 3,
                  offset: 5,
                },
              }}
              wrapperCol={{
                xs: {
                  span: 7,
                  offset: 8,
                },
              }}>
              {getFieldDecorator('agreement', {
                valuePropName: 'checked',
              })(
                <Checkbox>我已经同意<a href="/admin/protocol">《xxx服务协议》</a></Checkbox>
              )}
            </Form.Item>
            <Form.Item labelCol={{
              xs: {
                span: 3,
                offset: 5,
              },
            }}
              wrapperCol={{
                xs: {
                  span: 7,
                  offset: 8,
                },
              }}>
              <Button className={style.btn} type="primary" htmlType="submit">提交</Button>
              <Button className={style.btn} type="primary" htmlType="reset">重置</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);
export default WrappedRegistrationForm;
