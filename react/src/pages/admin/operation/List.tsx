import React, { Component } from 'react';
import {
  Table, Button, Breadcrumb, Input, Icon, Menu, Dropdown, Popconfirm, message,
} from 'antd';
import { Link, Redirect, } from "react-router-dom";
import operationApi from "@api/operation";
import gSass from '@utils/sass';
import { PaginationConfig } from 'antd/lib/table';
const style = gSass.admin.operation.list;
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
export default class OperationList extends Component<Props, State> {
  columns = [
    {
      title: '操作ID',
      dataIndex: 'id',
    },
    {
      title: '操作名',
      dataIndex: 'name',
    },
    {
      title: '方法',
      dataIndex: 'action',
    },
    {
      title: '描述',
      dataIndex: 'description',
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
          <Button type="primary" className={style.btn} onClick={() => this.editOperation(record.id)}>编辑</Button>
          <Button type="danger" className={style.btn}>
            <Popconfirm title="确定删除此操作吗?" onConfirm={() => this.deleteOperation(record.id)}>
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
      list: [],
      filter: {},
      pagination: {
        current: 1,
        pageSize: 8,
        showTotal: (total: number) => `共 ${total} 条记录`,
      },
      isLoadingTableData: true,
      redirect: null,
    };
  }
  editOperation = (id: number) => {
    this.setState({
      redirect: '/admin/operation/edit?id=' + id,
    })
  }
  deleteOperation = async (id: number) => {
    try {
      await operationApi.deleteOperation({ id });
      let list: Record[] = this.state.list;
      list = list.filter(v => v.id !== id)
      console.log(list)
      this.setState({
        list,
      })
      message.success('删除成功', 1)
    } catch (err) {
      message.error('删除失败,错误原因: ' + err.msg, 3)
    }
  }
  componentDidMount() {
    this.init();
  }
  init = async () => {
    try {
      await this.getOperationList();
    } catch (err) {
      console.log(err.msg);
    }
  }
  getOperationList = async () => {
    this.setState({
      isLoadingTableData: true,
    })
    let json = await operationApi.getOperationList({
      page: this.state.pagination.current,
      limit: this.state.pagination.pageSize
    });
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
        this.getOperationList();
      } catch (e) {
        console.log(e)
      }
    });

  }
  render() {
    if (this.state.redirect !== null) {
      return <Redirect to={this.state.redirect} />
    }
    return (
      <div className={style.userList}>
        <Breadcrumb className={style.title}>
          <Breadcrumb.Item><Link to="/admin">首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to="/admin/operation/list">权限管理</Link></Breadcrumb.Item>
          <Breadcrumb.Item>操作列表</Breadcrumb.Item>
        </Breadcrumb>
        <div className={style.filters}>
          <div className={style.item}>
            <Button type="primary" icon="plus"><Link to="/admin/operation/add" className={style.itemAdd}>新增</Link></Button>
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
            onSearch={value => console.log(value)}
            className={style.search}
          />
        </div>
        <Table className={style.table}
          columns={this.columns} dataSource={this.state.list}
          loading={this.state.isLoadingTableData}
          rowSelection={{
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
          }} onChange={this.onTableChange}
          rowKey="id" pagination={this.state.pagination} />
      </div>
    );
  }
}

