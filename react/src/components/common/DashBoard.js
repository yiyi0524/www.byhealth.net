import React from 'react';
import { Chart, Axis, Coord, Geom, Guide, Shape } from 'bizcharts';
import gSass from '../../utils/sass';

const style = gSass.common.workPlace;

const { Html, Arc } = Guide;



// 自定义Shape 部分
Shape.registerShape('point', 'pointer', {
  drawShape(cfg, group) {
    let point = cfg.points[0]; // 获取第一个标记点
    point = this.parsePoint(point);
    const center = this.parsePoint({ // 获取极坐标系下画布中心点
      x: 0,
      y: 0,
    });
    // 绘制指针
    group.addShape('line', {
      attrs: {
        x1: center.x,
        y1: center.y,
        x2: point.x,
        y2: point.y,
        stroke: cfg.color,
        lineWidth: 2.5,
        lineCap: 'round',
      },
    });
    return group.addShape('circle', {
      attrs: {
        x: center.x,
        y: center.y,
        r: 8,
        stroke: cfg.color,
        lineWidth: 2.5,
        fill: '#fff',
      },
    });
  },
});

const color = ['#0086FA', '#FFBF00', '#F5222D'];
const cols = {
  value: {
    min: 0,
    max: 10,
    tickInterval: 1,
    nice: false,
  },
};

class GaugeColor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [{ value: 0 }],
      lineWidth: 8,
      title: "",
    };
  }

  componentDidMount() {
    this.init();

  }
  init = _ => {
    // setInterval(() => {
    let data = [];
    data.push({ value: this.props.value / 10 * 1 });
    this.setState({
      data,
      title: this.props.title,
    });
    // }, 1000);
  }

  render() {
    const { lineWidth } = this.state;
    const val = this.state.data[0].value;
    return (
      <div className={style.dashboard}>
        <Chart height={350} width={300} data={this.state.data} scale={cols} padding={[0, 0, 200, 0]} forceFit>
          <Coord type="polar" startAngle={-9 / 8 * Math.PI} endAngle={1 / 8 * Math.PI} radius={0.75} />
          <Axis
            name="value" line={null}
            label={{
              offset: -12,
              textStyle: {
                fontSize: 16,
                fill: '#CBCBCB',
                textAlign: 'center',
                textBaseline: 'middle',
              },
            }}
            tickLine={{
              length: -24,
              stroke: '#fff',
              strokeOpacity: 1,
            }}
          />
          <Axis name="1" visible={false} />
          <Guide>
            <Arc
              start={[0, 0.965]}
              end={[10, 0.965]}
              style={{ // 底灰色
                stroke: 'rgba(0, 0, 0, 0.09)',
                lineWidth,
              }}
            />
            {val >= 2 && <Arc
              start={[0, 0.965]}
              end={[val, 0.965]}
              style={{ // 底灰色
                stroke: color[0],
                lineWidth,
              }}
            />}
            {val >= 4 &&
              <Arc
                start={[2, 0.965]}
                end={[4, 0.965]}
                style={{ // 底灰色
                  stroke: color[1],
                  lineWidth,
                }}
              />}
            {val >= 4 && val < 6 &&
              <Arc
                start={[4, 0.965]}
                end={[val, 0.965]}
                style={{ // 底灰色
                  stroke: color[2],
                  lineWidth,
                }}
              />}
            {val >= 2 && val < 4 &&
              <Arc
                start={[2, 0.965]}
                end={[val, 0.965]}
                style={{ // 底灰色
                  stroke: color[1],
                  lineWidth,
                }}
              />}
            {val < 2 &&
              <Arc
                start={[0, 0.965]}
                end={[val, 0.965]}
                style={{ // 底灰色
                  stroke: color[0],
                  lineWidth,
                }}
              />}
            <Html
              position={['50%', '95%']}
              html={() => (`<div style="width: 300px;text-align: center;font-size: 12px!important;"><p style="font-size: 1.75em; color: rgba(0,0,0,0.43);margin: 0;">${this.state.title}</p><p style="font-size: 3em;color: rgba(0,0,0,0.85);margin: 0;">${val * 10}%</p></div>`)}
            />
          </Guide>
          <Geom
            type="point"
            position="value*1"
            shape="pointer"
            color="#1890FF"
            active={false}
            style={{ stroke: '#fff', lineWidth: 1 }}
          />
        </Chart>
      </div>
    );
  }
}

// CDN END
export default GaugeColor;
