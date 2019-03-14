import React, { Component, } from 'react';
import { Card, Table, } from 'antd';
import ShortCutCarousel from '@/components/common/ShortCutCarousel';
import ConsoleView from "../../components/common/ConsoleView";
import DashBoard from "../../components/common/DashBoard";
import gSass from '../../utils/sass';
const style = gSass.common.workPlace;

export interface ShortcutItem {
  icon: string,
  title: string,
  link: string,
}
const shortCutList: ShortcutItem[] = [
  {
    icon: 'laptop-code',
    title: '错误日志',
    link: '/admin/logs/all',
  },
  {
    icon: 'laptop-code',
    title: '错误日志',
    link: '/admin/logs/all',
  },
  {
    icon: 'laptop-code',
    title: '错误日志',
    link: '/admin/logs/all',
  },
  {
    icon: 'laptop-code',
    title: '错误日志',
    link: '/admin/logs/all',
  },
  {
    icon: 'laptop-code',
    title: '错误日志',
    link: '/admin/logs/all',
  },

  {
    icon: 'laptop-code',
    title: '错误日志',
    link: '/admin/logs/all',
  },
  {
    icon: 'laptop-code',
    title: '错误日志',
    link: '/admin/logs/all',
  },
  {
    icon: 'laptop-code',
    title: '错误日志',
    link: '/admin/logs/all',
  },
  {
    icon: 'laptop-code',
    title: '错误日志',
    link: '/admin/logs/all',
  },
  {
    icon: 'laptop-code',
    title: '错误日志',
    link: '/admin/logs/all',
  },

  {
    icon: 'laptop-code',
    title: '错误日志',
    link: '/admin/logs/all',
  },
  {
    icon: 'laptop-code',
    title: '错误日志',
    link: '/admin/logs/all',
  },
  {
    icon: 'laptop-code',
    title: '错误日志',
    link: '/admin/logs/all',
  },
  {
    icon: 'laptop-code',
    title: '错误日志',
    link: '/admin/logs/all',
  },
  {
    icon: 'laptop-code',
    title: '错误日志',
    link: '/admin/logs/all',
  },
  {
    icon: 'laptop-code',
    title: '错误日志',
    link: '/admin/logs/all',
  },
  {
    icon: 'laptop-code',
    title: '错误日志',
    link: '/admin/logs/all',
  },
  {
    icon: 'laptop-code',
    title: '错误日志',
    link: '/admin/logs/all',
  },
  {
    icon: 'laptop-code',
    title: '错误日志',
    link: '/admin/logs/all',
  },
  {
    icon: 'laptop-code',
    title: '错误日志',
    link: '/admin/logs/all',
  },
];
export interface UserStatistics {
  title: string,
  value: number,
}
const userStatisticsList: UserStatistics[] = [
  {
    title: '错误日志',
    value: 1222,
  },
  {
    title: '错误日志',
    value: 1222,
  },
  {
    title: '错误日志',
    value: 1222,
  },
  {
    title: '错误日志',
    value: 1222,
  },
  {
    title: '错误日志',
    value: 1222,
  },
  {
    title: '错误日志',
    value: 1222,
  },
  {
    title: '错误日志',
    value: 1222,
  },
];

interface Props { }
interface State { }

export default class Workplace extends Component<Props, State> {
  componentDidMount() {
    this.init();
  }
  init = () => {
  }
  render() {
    const columns = [{
      title: 'Name',
      dataIndex: 'name',
    }, {
      title: 'Cash Assets',
      className: 'column-money',
      dataIndex: 'detail',
    },];

    const data = [{
      key: '1',
      name: '当前版本',
      detail: 'v1.0.0',
      link: "/",
    }, {
      key: '2',
      name: '基于框架',
      detail: '邻米cms',
      link: "/",
    }, {
      key: '3',
      name: '网址',
      detail: 'www.ilinme.com',
      link: "/",
    }, {
      key: '4',
      name: '来源',
      detail: '邻米网络',
      link: "/",
    }];
    return (
      <div className={style.content}>
        <div className={style.left}>
          <ShortCutCarousel menuList={[shortCutList, userStatisticsList]} pagination={false} />
          <ConsoleView />
        </div>
        <div className={style.right}>
          <Card title="版本信息" bordered={false} className={style.card}>
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
              bordered
            />
          </Card>
          <Card title="实时监控" bordered={false} className={style.card}>
            <div className={style.dashboardBox}>
              <DashBoard value={45} title={"cpu 使用率"} />
              <DashBoard value={20} title={"内存 使用率"} />
            </div>
          </Card>
        </div>
      </div>
    )
  }
}
