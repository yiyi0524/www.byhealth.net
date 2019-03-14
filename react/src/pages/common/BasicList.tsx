import React, { Component } from 'react';
import {
  Table, Button, Breadcrumb, Input, Icon, Menu, Dropdown, Popconfirm, Tooltip,
  DatePicker, Modal,
} from 'antd';
import { Link } from "react-router-dom";
import userApi from "../../services/user";
import gSass from '../../utils/sass';
import gImg from '../../utils/img';
import { PaginationProps, PaginationConfig } from 'antd/lib/pagination';
import { SorterResult, TableRowSelection } from 'antd/lib/table';
import { RangePickerValue } from 'antd/lib/date-picker/interface';

const style = gSass.admin.user.list;

const Search = Input.Search;
const { RangePicker, } = DatePicker;
//复选框
const rowSelection: TableRowSelection<any> = {
  onChange: (selectedRowKeys: string[] | number[], selectedRows: string[]) => {
    console.log(`选择用户id: ${selectedRowKeys}`, '选择用户信息: ', selectedRows);
  },
};
const menu = (<Menu>
  <Menu.Item>
    <a target="_blank" rel="noopener noreferrer" href="/">删除</a>
  </Menu.Item>
</Menu>);
interface Record {
  id: number,
  name: string,
  gender: number,
  age: number,
  avatar: string,
  phone: string,
  email: string,
  address: {
    provinceCid: string,
    cityCid: string,
    countyCid: string,
    detail: string,
    whole: string,
  },
}
interface Props { }
interface State {
  list: Record[],
  filter: {},
  pagination: PaginationProps,
  defaultAvatar: string,
}
class UserList extends Component<Props, State> {
  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '名字',
      dataIndex: 'name',
      render: (text: string) => {
        return (<Tooltip placement="right" title={() => {
          return (<div>
            <div>{text}</div>
            <div>{text}</div>
          </div>)
        }}>
          {text}
        </Tooltip>)
      }
    },
    {
      title: '性别',
      dataIndex: 'gender',
      render: (gender: number) =>
        <div>{gender === 1 ? "男" : gender === 2 ? "女" : "未知"}</div>,
      filters: [
        { text: '男', value: "1 " },
        { text: '女', value: "2" },
        { text: '未知', value: "0" },
      ],
      // filteredValue: filteredInfo.gender || null,
      // onFilter: (val, record) => record.gender === parseInt(val),
    },
    {
      title: '年龄',
      dataIndex: 'age',
      // sorter: (a, b) => a.age - b.age,
      // sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      render: (avt: string) => {
        return (
          <div className={style.avatarBox} onClick={() => {
            Modal.info({
              title: '头像查看',
              okText: "关闭",
              content: (
                <div>
                  <img style={{ width: 270, }} src={avt || this.state.defaultAvatar} alt="头像" />
                </div>
              )
            })
          }}>
            <img className={style.avatar} src={avt || this.state.defaultAvatar} alt="头像" />
          </div>
        )
      }
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '地址',
      dataIndex: "address['whole']",
      render: (text: string) => {
        let textOverflow = text.substr(0, 10);
        return (
          text ? <div>
            <div style={{ marginBottom: 10, }}>{textOverflow}...</div>
            <div className={style.btn} onClick={() => {
              Modal.info({
                title: '查看更多',
                okText: "关闭",
                content: (
                  <div>
                    {text}
                  </div>
                )
              })
            }}>更多</div>
          </div> : <div>-</div>
        );
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 300,
      render: (_: string, record: Record) => (
        this.state.list.length >= 1
          ? (
            <div>
              <span className={style.btn}>查看</span>
              <div className="separate-line"></div>
              <span className={style.btn} >编辑</span>
              <div className="separate-line"></div>
              <span className={style.btn}>
                <Popconfirm title={<div>你确定要删除id为{record.id}的用户吗?</div>} onConfirm={() => { }}>
                  <a href="/">删除</a>
                </Popconfirm>
              </span>
            </div>
          ) : null
      ),
    }
  ];
  constructor(props: any) {
    super(props)
    this.state = {
      // filteredInfo: null,
      // sortedInfo: null,
      list: [],
      filter: {},
      pagination: {
        current: 1,
        total: 0,
        pageSize: 8,
        onChange: async (page: number, pageSize?: number) => {
          const pagination = this.state.pagination;
          pagination.current = page;
          pagination.pageSize = pageSize;
          try {
            let page = pagination.current,
              limit = pagination.pageSize,
              filter = this.state.filter;
            const { count, data: { list } } =
              await userApi.getList({ page, limit, filter });
            pagination.total = count as number;
            list
            this.setState({
              list,
              pagination,
            })
          } catch (err) {
            console.log(err)
          }
        }
      },
      defaultAvatar: gImg.user.defaultAvatar,
    };
  }

  componentDidMount() {
    this.init();
  }

  init = async () => {
    try {
      let page = this.state.pagination.current,
        limit = this.state.pagination.pageSize,
        filter = this.state.filter;
      let json = await userApi.getList({ page, limit, filter });
      this.setState({
        list: json.data,
      })
    } catch (e) {

    }


  }

  handleChange = (pagination: PaginationConfig, filters: any, sorter: SorterResult<any>) => {//筛选(排序,页码)
    console.log('Various parameters', pagination, filters, sorter);
  }
  dataChange = (dates: RangePickerValue, dateStrings: [string, string]) => {
    console.log(dates, dateStrings)
  }
  render() {
    return (
      <div className={style.userList}>
        <Breadcrumb className={style.title}>
          <Breadcrumb.Item><Link to="/admin">首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item>用户管理</Breadcrumb.Item>
          <Breadcrumb.Item>用户列表</Breadcrumb.Item>
        </Breadcrumb>
        <div className={style.filters}>
          <div className={style.item}>
            <Button type="primary" icon="plus">新增</Button>
            <Dropdown overlay={menu} className={style.drown} placement="bottomLeft">
              <Button>更多操作 <Icon type="down" /></Button>
            </Dropdown>
          </div>
          <RangePicker onChange={this.dataChange} className={style.selectDate} />
          <Search
            placeholder="请输入姓名|手机号|身份证号码..."
            enterButton="搜索"
            onSearch={value => console.log(value)}
            className={style.search}
          />
        </div>
        <Table className={style.table}
          columns={this.columns}
          dataSource={this.state.list}
          rowSelection={rowSelection}
          onChange={this.handleChange}
          rowKey="id"

        />
      </div>
    );
  }
}
export default UserList;
