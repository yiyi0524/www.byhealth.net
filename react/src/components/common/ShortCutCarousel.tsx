import React, { Component, } from 'react';
import { Card, Carousel, } from 'antd';
import gSass from '../../utils/sass';
import AliIcon from '../../utils/iconfont';
import { ShortcutItem, UserStatistics } from '@/pages/common/Workplace';

const style = gSass.common.workPlace;

interface Props {
  menuList: [ShortcutItem[], UserStatistics[]]
  pagination: boolean
}
interface State {
  menuList: ShortcutItem[]
  userStatisticsList: UserStatistics[]
}
export default class ShortCutCarousel extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      menuList: props.menuList[0],
      userStatisticsList: props.menuList[1],
    };
  }
  render() {
    let shortCutList = this.state.menuList, shortCutMenuCount = shortCutList.length, shortCutMenuList: [ShortcutItem[]] = [[]];
    let userStatisticsList = this.state.userStatisticsList, userStatisticsListCount = userStatisticsList.length,
      userStatisticsListMenuList: [UserStatistics[]] = [[]];
    for (let i = 0, j = 0, k = 0; k < 9 && j < shortCutMenuCount; j++ , k++) {
      if (k === 8) {
        i++;
        k = 0;
        shortCutMenuList.push([])
      }
      shortCutMenuList[i].push(shortCutList[j]);
    }
    for (let i = 0, j = 0, k = 0; k < 5 && j < userStatisticsListCount; j++ , k++) {
      if (k === 4) {
        i++;
        k = 0;
        userStatisticsListMenuList.push([])
      }
      userStatisticsListMenuList[i].push(userStatisticsList[j]);
    }
    return (
      <div className={style.leftTop} id="leftTop">
        <Card title="快捷方式" bordered={false} className={style.card}>
          <Carousel>
            {shortCutMenuList.map((v, k) => {
              return <div key={k} className={style.box}>
                <div className={style.list}>
                  {v.map((v2, k2) => {
                    return <a key={k2} href={v2.link} className={style.item}>
                      <div className={style.imgBox}>
                        <AliIcon className={style.img} type={'icon-icon04'} />
                      </div>
                      <div className={style.itemTitle}>{v2.title}</div>
                    </a>
                  })}
                </div>
              </div>
            })}
          </Carousel>
        </Card>
        <Card title="用户统计" bordered={false} className={style.card}>
          <Carousel>
            {userStatisticsListMenuList.map((v1, k1) => {
              return <div key={k1} className={style.box}>
                <div className={style.list}>
                  {v1.map((v3, k3) => {
                    return <a key={k3} href="/" className={style.statistics}>
                      <div className={style.statisticsTitle}>{v3.title}</div>
                      <div className={style.statisticsCount}>{v3.value}</div>
                    </a>
                  })}
                </div>
              </div>
            })}
          </Carousel>
        </Card>
      </div>
    )
  }
}
