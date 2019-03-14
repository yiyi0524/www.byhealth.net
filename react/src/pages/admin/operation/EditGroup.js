import React, { Component, } from "react";
import {
  Form, Input, Button, message, Breadcrumb, Checkbox,
} from 'antd';
import qs from "qs";
import { Link } from "react-router-dom";
import operationApi from "../../../services/operation";
import gSass from '../../../utils/sass';
const style = gSass.admin.operation.addGroup;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    sm: {
      span: 2,
      offset: 0,
    },
  },
  wrapperCol: {
    sm: {
      span: 8,
      offset: 0,
    },
  },
};
class EditOperationApiGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      groupDetail: {},
      operationGroupList: [],
      operationList: [],
      operationChildGroupList: [],
    }
  }
  componentDidMount() {
    this.init();
  }
  clone = data => {
    return JSON.parse(JSON.stringify(data));
  }
  init = async _ => {
    let search = qs.parse(this.props.location.search, { ignoreQueryPrefix: true, })
    search.id = parseInt(search.id);
    try {
      let operationGroupListPromise = operationApi.getGroupList(),
        operationListPromise = operationApi.getOperationList(),
        groupDetailPromise = operationApi.getGroupDetail(search.id),
        groupDetail = (await groupDetailPromise).data.detail,
        operationGroupList = (await operationGroupListPromise).data.list,
        operationList = (await operationListPromise).data.list;
      operationGroupList = operationGroupList.filter(v => v.id !== parseInt(search.id));
      let idMapOperationGroup = new Map(), idMapOperation = new Map();
      this.props.form.setFieldsValue({
        name: groupDetail.name,
        description: groupDetail.description,
      })
      for (let operationGroupItem of operationGroupList) {
        idMapOperationGroup.set(operationGroupItem.id, operationGroupItem);
        let currGroupIsCheck = groupDetail.operation_group_list.includes(operationGroupItem.id);
        operationGroupItem.indeterminate = false;
        operationGroupItem.checked = currGroupIsCheck;
      }
      //获取操作组的所有继承操作
      let getOperationGroupExtendOperationList = operationGroupItem => {
        let operationExtendList = [];
        let childGroupIdArr = operationGroupItem.operation_group_list;
        for (let groupId of childGroupIdArr) {
          let childOperationGrouItem = this.clone(idMapOperationGroup.get(groupId));
          if (childOperationGrouItem) {
            operationExtendList.push(getOperationGroupExtendOperationList(childOperationGrouItem))
            operationExtendList.push(childOperationGrouItem.operation_list)
          }
        }
        return operationExtendList;
      }
      for (let operationItem of operationList) {
        idMapOperation.set(operationItem.id, operationItem);
        let currOperationIsCheck = groupDetail.operation_list.includes(operationItem.id);
        operationItem.checked = currOperationIsCheck;
      }
      for (let operationGroupItem of operationGroupList) {
        operationGroupItem.extend_operation_list = getOperationGroupExtendOperationList(operationGroupItem);
        for (let i = 0; i < operationGroupItem.operation_list.length; i++) {
          operationGroupItem.operation_list[i] = this.clone(idMapOperation.get(operationGroupItem.operation_list[i]));
        }
      }
      for (let operationGroupItem of operationGroupList) {
        for (let operationItem of operationGroupItem.extend_operation_list) {
          operationList = operationList.filter(v => v.id !== operationItem.id)
        }
        for (let operationItem of operationGroupItem.operation_list) {
          operationList = operationList.filter(v => v.id !== operationItem.id)
        }
      }
      this.setState({
        id: search.id,
        operationGroupList,
        operationList,
      })
    } catch (e) {
      message.error('获取操作组详情失败,错误信息: ' + (e instanceof Error ? e : e.msg))
    }
  }
  //提交
  editOperationGroup = evt => {
    evt.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      let operationGroupList = [], operationList = [];
      //获取所有的操作组
      for (let v of this.state.operationGroupList) {
        if (v.checked) {
          operationGroupList.push(v.id);
        } else {
          for (let v2 of v.extend_operation_list) {
            if (v2.checked) {
              operationList = operationList.filter(val => { return val !== v2.id })
              operationList.push(v2.id);
            }
          }
          for (let v3 of v.operation_list) {
            if (v3.checked) {
              operationList = operationList.filter(val => { return val !== v3.id })
              operationList.push(v3.id);
            }
          }
        }
      }
      //获取所有的操作方法
      for (let operationItem of this.state.operationList) {
        if (operationItem.checked) {
          operationList = operationList.filter(val => val !== operationItem.id)
          operationList.push(operationItem.id);
        }
      }
      let data = {
        id: this.state.id,
        name: fieldsValue.name,
        operationList: operationList,
        operationGroupList: operationGroupList,
        description: fieldsValue.description,
      }
      console.log(data);
      operationApi.editOperationGroup(data).then(json => {
        message.success('编辑成功', 2);
      }).catch(err => {
        message.error('添加失败,失败原因: ' + err.msg, 3);
        console.log(err);
      })
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={style.permission}>
        <Breadcrumb className={style.title}>
          <Breadcrumb.Item><Link to="/admin">首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to="/admin/operation/list">权限管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>编辑操作组</Breadcrumb.Item>
        </Breadcrumb>
        <Form className={style.form}>
          <Form.Item
            {...formItemLayout}
            label="操作组名"
          >
            {getFieldDecorator('name', {
              rules: [{ min: 2, max: 32, required: true, message: '请输入2-32的操作组名' }],
            })(
              <Input size="large" placeholder="请输入操作组名" />
            )}
          </Form.Item >
          <Form.Item
            labelCol={{
              sm: {
                span: 2,
                offset: 0,
              },
            }}
            wrapperCol={{
              sm: {
                span: 20,
                offset: 0,
              },
            }}
            label="子操作组列表"
          >
            {(
              this.state.operationGroupList.map((v, k) => {
                return (<div className={style.operationGroupItem} key={k}>
                  <div className={style.ogiTitle}>
                    <Checkbox
                      indeterminate={v.indeterminate}
                      onChange={_ => {
                        let operationGroupList = this.state.operationGroupList;
                        operationGroupList[k].checked = !v.checked;
                        if (operationGroupList[k].checked) {
                          operationGroupList[k].indeterminate = false;
                          let operationChildGroupList = this.state.operationChildGroupList;
                          operationChildGroupList.push(v.id);
                          this.setState({
                            operationChildGroupList,
                          })
                        } else {
                          let id = v.id, operationChildGroupList;
                          operationChildGroupList = this.state.operationChildGroupList.filter(val => { return val !== id });
                          this.setState({
                            operationChildGroupList,
                          })
                        }
                        for (let val of operationGroupList[k].extend_operation_list) {
                          val.checked = operationGroupList[k].checked;
                        }
                        for (let val of operationGroupList[k].operation_list) {
                          val.checked = operationGroupList[k].checked;
                        }
                        this.setState({
                          operationGroupList,
                        })
                      }}
                      checked={v.checked}
                    >
                      {v.name}
                    </Checkbox>
                  </div>
                  <div className={style.operationList}>
                    {v.extend_operation_list.map((v2, k2) => {
                      return <Checkbox key={`0-${k}-${k2}`}
                        onChange={_ => {
                          let operationGroupList = this.state.operationGroupList;
                          operationGroupList[k].extend_operation_list[k2].checked = !v2.checked;
                          let groupIndeterminate = false,
                            groupAllchecked = true;
                          for (let val of operationGroupList[k].extend_operation_list) {
                            if (val.checked) {
                              groupIndeterminate = true;
                            } else {
                              groupAllchecked = false;
                            }
                          }
                          for (let val of operationGroupList[k].operation_list) {
                            if (val.checked) {
                              groupIndeterminate = true;
                            } else {
                              groupAllchecked = false;
                            }
                          }
                          operationGroupList[k].checked = groupAllchecked;
                          operationGroupList[k].indeterminate = groupAllchecked ? false : groupIndeterminate;
                          this.setState({
                            operationGroupList,
                          })
                        }}
                        checked={v.checked || v2.checked}
                      >
                        {v2.name}
                      </Checkbox>
                    })}
                    {v.operation_list.map((v2, k2) => {
                      return <Checkbox key={`1-${k}-${k2}`}
                        onChange={_ => {
                          let operationGroupList = this.state.operationGroupList;
                          operationGroupList[k].operation_list[k2].checked = !v2.checked;
                          let groupIndeterminate = false,
                            groupAllchecked = true;
                          for (let val of operationGroupList[k].extend_operation_list) {
                            if (val.checked) {
                              groupIndeterminate = true;
                            } else {
                              groupAllchecked = false;
                            }
                          }
                          for (let val of operationGroupList[k].operation_list) {
                            if (val.checked) {
                              groupIndeterminate = true;
                            } else {
                              groupAllchecked = false;
                            }
                          }
                          operationGroupList[k].checked = groupAllchecked;
                          operationGroupList[k].indeterminate = groupAllchecked ? false : groupIndeterminate;
                          this.setState({
                            operationGroupList,
                          })
                        }}
                        checked={v.checked || v2.checked}
                      >
                        {v2.name}
                      </Checkbox>
                    })}
                  </div>
                </div>);
              })
            )}
          </Form.Item>
          <Form.Item
            labelCol={{
              sm: {
                span: 2,
                offset: 0,
              },
            }}
            wrapperCol={{
              sm: {
                span: 20,
                offset: 0,
              },
            }}
            label="操作方法列表"
          >
            {(
              <div className={style.operationMethodList}>
                {this.state.operationList.map((v, k) => {
                  return (<div className={style.operationMethodItem} key={k}>
                    <Checkbox key={`0-${k}-${k}`}
                      onChange={_ => {
                        let operationList = this.state.operationList;
                        operationList[k].checked = !v.checked;
                        this.setState({
                          operationList,
                        })
                      }}
                      checked={v.checked}
                    >
                      {v.name}
                    </Checkbox>
                  </div>);
                })}
              </div>
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="操作组描述"
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
                offset: 2,
              },
            }}
          >
            <Button size="large" className={style.btn} type="primary" onClick={this.editOperationGroup}>提交</Button>
          </Form.Item>
        </Form>
      </div >
    );
  }
}

const WrappedLogin = Form.create()(EditOperationApiGroup);
export default WrappedLogin;
