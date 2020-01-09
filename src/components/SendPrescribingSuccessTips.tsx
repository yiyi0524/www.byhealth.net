import global from "@/assets/styles/global"
import { windowWidth } from "@/utils/utils"
import { Icon } from "@ant-design/react-native"
import React, { Component } from "react"
import { StyleSheet, Text, View } from "react-native"
import DashLine from "./DashLine"
interface Props {}
interface State {}
type DefaultProps = {}

export default class SendPrescribingSuccessTips extends Component<Props & DefaultProps, State> {
  static defaultProps: DefaultProps
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {}
  }
  render() {
    return (
      <View style={style.tips}>
        <View style={[style.tipsTitlePar, global.flex, global.aCenter, global.jCenter]}>
          <Icon style={style.tipsIcon} name="check-circle"></Icon>
          <Text style={style.tipsTitle}>已将整体治疗方案发送给药房</Text>
        </View>
        <Text style={style.tipsDesc}>请提醒患者接听药房电话</Text>
        <Text style={[style.tipsDesc, style.marginBottom]}>
          博一健康会指导患者完成支付并安排药品配送
        </Text>
        <DashLine
          len={45}
          width={windowWidth - 40}
          backgroundColor={"rgba(219, 219, 219, 0.4)"}></DashLine>
      </View>
    )
  }
}
const style = StyleSheet.create({
  tips: {
    position: "relative",
    paddingTop: 20,
  },
  tipsTitlePar: {
    marginBottom: 10,
  },
  tipsTitle: {
    fontSize: 17,
    color: "#333",
  },
  tipsIcon: {
    fontSize: 20,
    color: "#EE6E42",
    marginRight: 5,
  },
  tipsDesc: {
    textAlign: "center",
    fontSize: 14,
    color: "#EE6E42",
    marginBottom: 5,
  },
  marginBottom: {
    paddingBottom: 20,
  },
})
