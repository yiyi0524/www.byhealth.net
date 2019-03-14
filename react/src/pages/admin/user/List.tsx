import { BASE_URL } from '@/config/prod';
import { Picture } from '@/services/api';
import userApi from "@api/user";
import MyBreadCrumb, { breadCrumbItem } from '@components/common/nav/BreadCrumb';
import MyTable, { TableOperation } from '@components/common/Table';
import gImg from "@utils/img";
import gSass from "@utils/sass";
import { Form, message, Modal, Popconfirm, Switch, Tooltip } from "antd";
import { FormComponentProps } from "antd/lib/form";
import React, { Component } from "react";
import { Link, RouteProps } from "react-router-dom";
const style = gSass.admin.user.list;
const tableStyle = gSass.common.table;
interface Props { }

interface State {
  breadCrumbList: breadCrumbItem[],
  userList: UserRecord[],
  tableIsLoading: boolean,
  defaultAvatar: string,
  selectedRows: UserRecord[],
}
interface UserRecord {
  id: number,
  account: string,
}
class UserList extends Component<Props & FormComponentProps & RouteProps, State> {
  tableColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '账号',
      dataIndex: 'account',
    },
    {
      title: '昵称',
      dataIndex: 'nick',
      render: (text: string) => {
        return (<Tooltip placement="right" title={() => {
          return (<div>
            <div>{text}</div>
            <div>{text}</div>
          </div>)
        }}>
          <span style={{ color: '#1890ff' }}>{text}</span>
        </Tooltip>)
      }
    },
    {
      title: '性别',
      dataIndex: 'gender',
      filters: [
        { text: '男', value: "1 " },
        { text: '女', value: "2" },
        { text: '未知', value: "0" },
      ],
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      render: (avatar: Picture) => {
        return (
          <img className={tableStyle.avatar} src={avatar ? BASE_URL + avatar.url : this.state.defaultAvatar} alt="头像" />
        )
      }
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
    },
    {
      title: '是否为管理员',
      dataIndex: 'isAdmin',
      render: (isAdmin: boolean) => {
        return (
          <Switch checkedChildren="是" unCheckedChildren="否"
            checked={isAdmin} disabled />
        );
      }
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '地址',
      dataIndex: "address['whole']",
      render: (wholeAddress: string) => {
        return (
          wholeAddress ? <div>
            <div style={{ marginBottom: 10, }}>{wholeAddress.substr(0, 10)}...</div>
            <div className={style.btn} onClick={() => {
              Modal.info({
                title: '详细地址',
                okText: "关闭",
                maskClosable: true,
                content: (
                  <div>
                    {wholeAddress}
                  </div>
                )
              })
            }}>更多</div>
          </div> : <div>-</div>
        );
      }
    },
    {
      title: '注册时间',
      dataIndex: 'ctime',
      render: (text: string) => {
        return (<div>{text.substr(0, 10)}</div>)
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 300,
      render: (_: string, record: UserRecord) => (
        this.state.userList.length >= 1
          ? (
            <div>
              <Link className={style.btn} to={"/admin/user/detail?id=" + record.id}>查看</Link>
              <div className="separate-line"></div>
              <span className={style.btn}>
                <Popconfirm title={<div>你确定要删除用户{record.account}吗?</div>}
                  onConfirm={() => this.deleteUser([record.id])}>
                  <span >删除</span>
                </Popconfirm>
              </span>
            </div>
          ) : null
      ),
    }
  ];
  constructor(props: Props & FormComponentProps & RouteProps) {
    super(props);
    this.state = {
      breadCrumbList: [
        { name: '首页', to: '/' },
        { name: '用户管理', to: '/admin/user' },
        { name: '用户列表', },
      ],
      userList: [],
      tableIsLoading: true,
      defaultAvatar: gImg.user.defaultAvatar,
      selectedRows: [],
    };
  }

  componentDidMount() {
    this.init();
  }
  deleteUser = (idArr: number[]) => {
    const list = this.state.userList,
      selectedRows = this.state.selectedRows;
    userApi.deleteUsers(idArr).then(() => {
      message.success('删除成功', 1)
      this.setState({
        userList: list.filter(item => !idArr.includes(item.id)),
        selectedRows: selectedRows.filter(item => !idArr.includes(item.id))
      });
    }).catch(err => {
      message.error("删除失败,错误原因: " + err.msg, 3)
    })
  }
  init = async () => {
    try {
      let json = await userApi.getList({ page: -1, limit: -1 });
      // let region = await getRegion();
      this.setState({
        tableIsLoading: false,
        userList: json.data.list,
      })
    } catch (e) {
      this.setState({
        tableIsLoading: false,
      })
    }
  };

  render() {
    const operationList: TableOperation[] = [
      {
        title: '新增', btnProps: {
          type: "primary", icon: 'plus',
        }
      },
      {
        title: '更多操作', dropdown: {
          menuList: [
            { title: '删除', onClick: () => { } },
          ]
        }, btnProps: {
          rightIconType: 'down',
        },
      },
      {
        title: '筛选',
        btnProps: { icon: 'filter', type: "primary" }
      },
    ];
    return (
      <div className={style.userList}>
        <MyBreadCrumb breadCrumbList={this.state.breadCrumbList} />
        <MyTable componentsProps={{
          search: {
            placeholder: "请输入姓名|手机号|身份证号码...",
            enterButton: "搜索",
          },
          table: {
            columns: this.tableColumns,
            dataSource: this.state.userList,
            loading: this.state.tableIsLoading,
            rowKey: "id",
          },
          modal: {},
        }}
          operationList={operationList} />
      </div>
    );
  }
}
export default Form.create()(UserList);
