import React, { Component, } from "react";
import {
  Form, Input, Button, message, Breadcrumb, Checkbox,
} from 'antd';
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
class AddOperationApiGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    let operationGroupListPromise = operationApi.getGroupList({ page: -1, limit: -1 }),
      operationListPromise = operationApi.getOperationList({ page: -1, limit: -1 }),
      operationGroupList = (await operationGroupListPromise).data.list,
      operationList = (await operationListPromise).data.list;
    let idMapOperationGroup = new Map(), idMapOperation = new Map();
    for (let operationGroupItem of operationGroupList) {
      idMapOperationGroup.set(operationGroupItem.id, operationGroupItem);
      operationGroupItem.indeterminate = false;
      operationGroupItem.checked = false;
    }
    //获取操作组的所有继承操作
    let getOperationGroupExtendOperationList = operationGroupItem => {
      let operationExtendList = [];
      let childGroupIdArr = operationGroupItem.operation_group_list;
      for (let groupId of childGroupIdArr) {
        let childOperationGroupItem = this.clone(idMapOperationGroup.get(groupId));
        if (childOperationGroupItem) {
          operationExtendList.push(getOperationGroupExtendOperationList(childOperationGroupItem))
          operationExtendList.push(childOperationGroupItem.operation_list)
        }
      }
      return operationExtendList;
    }
    for (let operationItem of operationList) {
      idMapOperation.set(operationItem.id, operationItem);
      operationItem.checked = false;
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
      operationGroupList,
      operationList,
    })
  }
  //提交
  addOperationGroup = evt => {
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
        name: fieldsValue.name,
        operationList: Array.from(new Set(operationList)),
        operationGroupList: Array.from(new Set(operationGroupList)),
        description: fieldsValue.description,
      }
      operationApi.addOperationGroup(data).then(json => {
        message.success('添加成功', 2, _ => window.location.reload());
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
          <Breadcrumb.Item>添加操作组</Breadcrumb.Item>
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
                        checked={v2.checked}
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
                        checked={v2.checked}
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
            <Button size="large" className={style.btn} type="primary" onClick={this.addOperationGroup}>添加</Button>
          </Form.Item>
        </Form>
      </div >
    );
  }
}

const WrappedLogin = Form.create()(AddOperationApiGroup);

export default WrappedLogin;
