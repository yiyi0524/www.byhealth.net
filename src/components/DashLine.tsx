import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'

/*水平方向的虚线
 * len 虚线个数
 * width 总长度
 * backgroundColor 背景颜色
 * */
interface Props {
  len: number
  width: number
  backgroundColor: string
}
interface State {}
export default class DashLine extends Component<Props, State> {
  render() {
    let len = this.props.len
    let arr = []
    for (let i = 0; i < len; i++) {
      arr.push(i)
    }
    return (
      <View style={[styles.dashLine, { width: this.props.width }]}>
        {arr.map((_, index) => {
          return (
            <Text style={[styles.dashItem, { backgroundColor: this.props.backgroundColor }]} key={'dash' + index}>
              {' '}
            </Text>
          )
        })}
      </View>
    )
  }
}
const styles = StyleSheet.create({
  dashLine: {
    flexDirection: 'row',
  },
  dashItem: {
    height: 1,
    width: 2,
    marginRight: 2,
    flex: 1,
  },
})
