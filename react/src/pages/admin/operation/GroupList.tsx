import React, { Component } from 'react';
import {
  Table, Button, Breadcrumb, Input, Icon, Menu, Dropdown, Popconfirm, message,
} from 'antd';
import { Link, Redirect, } from "react-router-dom";
import { PaginationConfig } from 'antd/lib/table';
import operationApi from "@api/operation";
import gSass from '@utils/sass';
const style = gSass.admin.operation.groupList;
const Search = Input.Search;
interface Props { }
interface State {
  list: Record[],
  filter: {},
  pagination: PaginationConfig,
  isLoadingTableData: boolean,
  redirect: null | string,
}
interface Record {
  id: number,
  name: string,
  action: string,
  cuid: number,
}
export default class PermissionGroupList extends Component<Props, State>{
  columns = [{
    title: '操作ID',
    dataIndex: 'id',
  },
  {
    title: '操作组名',
    dataIndex: 'name',
  },
  {
    title: '操作列表',
    dataIndex: 'operation_list',
    render: (val: number[]) => {
      // console.log(val)
      return val.join(',')
    }
  },
  {
    title: '子操作组列表',
    dataIndex: 'operation_group_list',
    render: (val: number[]) => {
      return val.join(',') || '-';
    }
  },
  {
    title: '描述',
    dataIndex: "description",
  },
  {
    title: '创建用户ID',
    dataIndex: "cuid",
  },
  {
    title: '操作',
    dataIndex: 'operation',
    render: (_: string, record: Record) => (
      <div>
        <Button type="primary" className={style.btn} onClick={() => this.editOperationGroup(record.id)}>编辑</Button>
        <Button type="danger" className={style.btn}>
          <Popconfirm title="确定删除此操作吗?" onConfirm={() => this.deleteOperationGroup(record.id)}>
            <div>删除</div>
          </Popconfirm>
        </Button>
      </div>
    ),
  }
  ];

  constructor(props: any) {
    super(props)
    this.state = {
      redirect: null,
      list: [],
      filter: {},
      isLoadingTableData: true,
      pagination: {
        showTotal: total => `共 ${total} 条记录`,
        pageSize: 8,
        current: 1,
      },
    };
  }
  componentDidMount() {
    this.init();
  }
  init = async () => {
    try {
      await this.getOperationGroupList();
    } catch (err) {
      message.error('获取操作组失败,错误信息: ' + err.msg)
      console.log(err);
    }
  }
  editOperationGroup = (id: number) => {
    this.setState({
      redirect: '/admin/operation/editGroup?id=' + id,
    })
  }
  deleteOperationGroup = async (id: number) => {
    try {
      await operationApi.deleteOperationGroup(id);
      let list = this.state.list;
      list = list.filter(v => v.id !== id)
      this.setState({
        list,
      })
      message.success('删除成功', 1)
    } catch (err) {
      message.error('删除失败,错误原因: ' + err.msg, 3)
    }
  }

  getOperationGroupList = async () => {
    this.setState({
      isLoadingTableData: true,
    })
    let json = await operationApi.getGroupList({ page: this.state.pagination.current, limit: this.state.pagination.pageSize });
    let pagination = this.state.pagination;
    pagination.total = json.count;
    this.setState({
      list: json.data.list,
      pagination,
      isLoadingTableData: false,
    })
  }
  onTableChange = (pagination: PaginationConfig) => {//筛选(排序,页码)
    const pager = this.state.pagination;
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    }, () => {
      try {
        this.getOperationGroupList();
      } catch (e) {
        console.log(e)
      }
    });
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    return (
      <div className={style.userList}>
        <Breadcrumb className={style.title}>
          <Breadcrumb.Item><Link to="/">首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to="/admin/operation/list">权限管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>操作组列表</Breadcrumb.Item>
        </Breadcrumb>
        <div className={style.filters}>
          <div className={style.item}>
            <Button type="primary" icon="plus"><Link to="/admin/operation/addGroup" className={style.itemAdd}>新增</Link></Button>
            <Dropdown overlay={<Menu>
              <Menu.Item>
                <div>删除</div>
              </Menu.Item>
            </Menu>} className={style.drown} placement="bottomLeft">
              <Button>更多操作 <Icon type="down" /></Button>
            </Dropdown>
          </div>
          <Search
            placeholder="请输入姓名 | 手机号 | 身份证号码..."
            enterButton="搜索"
            onSearch={val => console.log(val)}
            className={style.search}
          />
        </div>
        <Table className={style.table}
          columns={this.columns}
          dataSource={this.state.list}
          rowSelection={{
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
          }}
          onChange={this.onTableChange}
          rowKey="id"
          pagination={this.state.pagination}
        />
      </div>
    );
  }
}

