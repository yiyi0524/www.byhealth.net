import global from '@/assets/styles/global'
import { getDoctorAvatarUrl, getWxPrescriptionGuideUrl } from '@/services/doctor'
import { Modal, Toast } from '@ant-design/react-native'
import gImg from '@utils/img'
import React, { Component } from 'react'
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import * as WeChat from 'react-native-wechat'
interface Props {
  doctorName: string
  prescriptionId: number
}
interface State {
  isShowQr: boolean
  showQrImg: string
}
type DefaultProps = {}

export default class SendPrescribing extends Component<Props & DefaultProps, State> {
  static defaultProps: DefaultProps
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      isShowQr: false,
      showQrImg: '',
    }
  }
  render() {
    return (
      <View style={style.selectTypeList}>
        <Text style={[style.selectTypeTitle]}>请选择以下的方式给患者处方</Text>
        <View style={[global.flex, global.aCenter, global.jAround]}>
          <TouchableOpacity
            onPress={() => {
              WeChat.isWXAppInstalled().
                then(isInstalled => {
                  if (isInstalled) {
                    getWxPrescriptionGuideUrl({ id: this.props.prescriptionId }).
                      then(async json => {
                        console.log('wxShareUrl: ', json)
                        const {
                          data: { url: avatarUrl },
                        } = await getDoctorAvatarUrl()
                        WeChat.shareToSession({
                          // @ts-ignore
                          title: (this.props.doctorName || '') + '医师处方|博一健康',
                          description: '医师为您开具了处方请尽快支付,支付后博一健康将安排药品配送',
                          type: 'news',
                          imageUrl: avatarUrl,
                          thumbImage: avatarUrl,
                          webpageUrl: json.data.url,
                        }).catch((error: any) => {
                          Alert.alert(error.message)
                        })
                      }).
                      catch(err => {
                        Toast.fail(err)
                      })
                  } else {
                    Alert.alert('请安装微信')
                  }
                }).
                catch(err => {
                  console.log('buffge: 获取微信是否已安装状态失败', err)
                })
            }}
          >
            <View style={style.selectTypeItem}>
              <Image style={style.selectImg} source={gImg.common.weChat} />
              <Text style={style.selectTitle}>发送到患者微信</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              getWxPrescriptionGuideUrl({ id: this.props.prescriptionId }).
                then(json => {
                  console.log(json.data.url)
                  this.setState({
                    isShowQr: true,
                    showQrImg: json.data.url,
                  })
                }).
                catch(err => {
                  console.log(err)
                  Toast.info('获取二维码失败, 请重试', 3)
                })
            }}
          >
            <View style={style.selectTypeItem}>
              <Image style={style.selectImg} source={gImg.common.qr} />
              <Text style={style.selectTitle}>患者微信扫码支付</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Modal
          title=""
          transparent
          onClose={() => {
            this.setState({
              isShowQr: false,
            })
          }}
          maskClosable
          visible={this.state.isShowQr}
          closable
        >
          <View style={style.showQr}>
            <QRCode value={this.state.showQrImg} logoSize={200} logoBackgroundColor="#252525" />
            <Text style={style.desc}>患者请用微信扫码支付处方</Text>
          </View>
        </Modal>
      </View>
    )
  }
}
const style = StyleSheet.create({
  showQr: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  selectTypeList: {
    flex: 1,
    position: 'relative',
    padding: 20,
  },
  desc: {
    fontSize: 14,
    color: '#666',
    marginTop: 16,
  },
  selectTypeTitle: {
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
    marginBottom: 26,
  },
  selectTypeItem: {},
  selectImg: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  selectTitle: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginTop: 14,
  },
})
