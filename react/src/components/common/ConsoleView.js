import React, { Component, } from 'react';
import { Card, Carousel, } from 'antd';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Legend,
} from "bizcharts";
import gSass from '../../utils/sass';

const style = gSass.common.workPlace;

export default class Workplace extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount() {
    this.init();
  }
  init = _ => {

  }
  render() {
    const histogramData = [
      {
        year: "1月",
        sales: 38
      },
      {
        year: "2月",
        sales: 52
      },
      {
        year: "3月",
        sales: 61
      },
      {
        year: "4月",
        sales: 145
      },
      {
        year: "5月",
        sales: 48
      },
      {
        year: "6月",
        sales: 38
      },
      {
        year: "7月",
        sales: 38
      },
      {
        year: "8月",
        sales: 38
      },
      {
        year: "9月",
        sales: 38
      },
      {
        year: "10月",
        sales: 38
      },
      {
        year: "11月",
        sales: 38
      },
      {
        year: "12月",
        sales: 38
      },
    ];
    const histogramCols = {
      sales: {
        tickInterval: 20
      }
    };
    const roundDatas = [
      {
        year: "2001",
        population: 41.8
      },
      {
        year: "2002",
        population: 38
      },
      {
        year: "2003",
        population: 33.7
      },
      {
        year: "2004",
        population: 30.7
      },
      {
        year: "2005",
        population: 25.8
      },
      {
        year: "2006",
        population: 31.7
      },
      {
        year: "2007",
        population: 33
      },
      {
        year: "2008",
        population: 46
      },
      {
        year: "2009",
        population: 38.3
      },
      {
        year: "2010",
        population: 28
      },
      {
        year: "2011",
        population: 42.5
      },
      {
        year: "2012",
        population: 30.3
      },
    ]
    const lineDatas = [
      {
        year: "1991",
        value: 3
      },
      {
        year: "1992",
        value: 4
      },
      {
        year: "1993",
        value: 3.5
      },
      {
        year: "1994",
        value: 5
      },
      {
        year: "1995",
        value: 4.9
      },
      {
        year: "1996",
        value: 6
      },
      {
        year: "1997",
        value: 7
      },
      {
        year: "1998",
        value: 9
      },
      {
        year: "1999",
        value: 13
      }
    ];
    const lineCols = {
      value: {
        min: 0
      },
      year: {
        range: [0, 1]
      }
    };
    return (
      <div className={style.leftBottom}>
        <Card title="数据概览" bordered={false} className={style.card}>
          <Carousel>
            <div className={style.leftBottomBox}>
              <div className={style.title}>用户本年月份统计(月)</div>
              <Chart height={400} width={1000} data={histogramData} scale={histogramCols}>
                <Axis name="year" />
                <Axis name="sales" />
                <Tooltip
                  crosshairs={{
                    type: "y"
                  }}
                />
                <Geom type="interval" position="year*sales" />
              </Chart>
            </div>
            <div className={style.leftBottomBox}>
              <div className={style.title}>用户数量统计(月)</div>
              <Chart height={350} width={1000} data={roundDatas} padding="auto" forceFit>
                <Coord type="polar" />
                <Tooltip />
                <Legend
                  position="right"
                  offsetY={-400 / 2 + 180}
                  offsetX={-160}
                />
                <Geom
                  type="interval"
                  color="year"
                  position="year*population"
                  style={{
                    lineWidth: 1,
                    stroke: "#fff"
                  }}
                />
              </Chart>
            </div>
            <div className={style.leftBottomBox}>
              <div className={style.title}>用户数量统计(月)</div>
              <Chart height={400} width={1000} data={lineDatas} scale={lineCols} forceFit>
                <Axis name="year" />
                <Axis name="value" />
                <Tooltip
                  crosshairs={{
                    type: "y"
                  }}
                />
                <Geom type="line" position="year*value" size={2} />
                <Geom
                  type="point"
                  position="year*value"
                  size={4}
                  shape={"circle"}
                  style={{
                    stroke: "#fff",
                    lineWidth: 1
                  }}
                />
              </Chart>
            </div>
          </Carousel>
        </Card>
      </div>
    )
  }
}
