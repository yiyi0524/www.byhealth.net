import React, { Component } from "react"
import { View, StyleSheet, TouchableOpacity, Image, Text, Alert } from "react-native"
import gImg from "@utils/img"
import global from "@/assets/styles/global"
import * as WeChat from "react-native-wechat"
import { getWxPrescriptionGuideUrl, getDoctorAvatarUrl } from "@/services/doctor"
import { Toast } from "@ant-design/react-native"
interface Props {
  doctorName: string
  prescriptionId: number
}
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
          <TouchableOpacity
            onPress={() => {
              WeChat.isWXAppInstalled()
                .then(isInstalled => {
                  if (isInstalled) {
                    getWxPrescriptionGuideUrl({ id: this.props.prescriptionId })
                      .then(async json => {
                        console.log("wxShareUrl: ", json)
                        const {
                          data: { url: avatarUrl },
                        } = await getDoctorAvatarUrl()
                        WeChat.shareToSession({
                          // @ts-ignore
                          title: (this.props.doctorName || "") + "医师处方|博一健康",
                          description: "医师为您开具了处方请尽快支付,支付后博一健康将安排药品配送",
                          type: "news",
                          imageUrl: avatarUrl,
                          thumbImage: avatarUrl,
                          webpageUrl: json.data.url,
                        }).catch((error: any) => {
                          Alert.alert(error.message)
                        })
                      })
                      .catch(err => {
                        Toast.fail(err)
                      })
                  } else {
                    Alert.alert("请安装微信")
                  }
                })
                .catch(err => {
                  console.log("buffge: 获取微信是否已安装状态失败", err)
                })
            }}>
            <View style={style.selectTypeItem}>
              <Image style={style.selectImg} source={gImg.common.weChat}></Image>
              <Text style={style.selectTitle}>发送到患者微信</Text>
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity>
            <View style={style.selectTypeItem}>
              <Image style={style.selectImg} source={gImg.common.qr}></Image>
              <Text style={style.selectTitle}>患者扫码支付</Text>
            </View>
          </TouchableOpacity> */}
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
