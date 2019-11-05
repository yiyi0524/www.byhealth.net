import React, { Component } from "react"
import { View, StyleSheet, TouchableOpacity, Image, Text } from "react-native"
import gImg from "@utils/img"
import global from "@/assets/styles/global"
interface Props {}
interface State {}
type DefaultProps = {}

export default class SendPrescribing extends Component<Props & DefaultProps, State> {
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
      <View style={style.selectTypeList}>
        <Text style={[style.selectTypeTitle]}>请选择以下的方式给患者处方</Text>
        <View style={[global.flex, global.aCenter, global.jAround]}>
          <TouchableOpacity>
            <View style={style.selectTypeItem}>
              <Image style={style.selectImg} source={gImg.common.weChat}></Image>
              <Text style={style.selectTitle}>发送到患者微信</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={style.selectTypeItem}>
              <Image style={style.selectImg} source={gImg.common.qr}></Image>
              <Text style={style.selectTitle}>患者扫码支付</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
const style = StyleSheet.create({
  selectTypeList: {
    flex: 1,
    position: "relative",
    padding: 20,
  },
  selectTypeTitle: {
    fontSize: 15,
    color: "#333",
    textAlign: "center",
    marginBottom: 26,
  },
  selectTypeItem: {},
  selectImg: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginLeft: "auto",
    marginRight: "auto",
  },
  selectTitle: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginTop: 14,
  },
})
