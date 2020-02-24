import global from '@/assets/styles/global'
import gImg from '@utils/img'
import gSass from '@utils/style'
import React, { Component } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { AllScreenParam } from '@/routes/bottomNav'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import doctorApi, { UPLOAD_PRESCRIPTION_STATUS } from '@api/doctor'
import moment from 'moment'
const style = gSass.index.uploadPrescriptionList
interface Prescription {
  id: number
  name: string
  status: 'cancelOrder' | 'hasSend' | 'waitSend'
  ctime: string
}
interface Props {
  navigation: StackNavigationProp<AllScreenParam, 'UploadPrescriptionList'>
  route: RouteProp<AllScreenParam, 'UploadPrescriptionList'>
}
interface State {
  hasLoad: boolean
  prescriptionList: Prescription[]
}
type DefaultProps = {}

export default class UploadPrescriptionList extends Component<Props & DefaultProps, State> {
  static defaultProps: DefaultProps
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      prescriptionList: [],
    }
  }
  componentDidMount() {
    this.init()
  }
  init = async () => {
    try {
      let {
        data: { list: prescriptionList },
      } = await doctorApi.listUploadPrescription({ page: 1, limit: 100, filter: {} })
      this.setState({
        hasLoad: true,
        prescriptionList,
      })
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    let { hasLoad, prescriptionList } = this.state
    if (!hasLoad) {
      return (
        <View style={style.loading}>
          <View style={style.loadingPic}>
            <Image style={style.loadingImg} source={gImg.common.loading} />
          </View>
        </View>
      )
    }
    return (
      <ScrollView style={style.main} keyboardShouldPersistTaps='handled'>
        <View style={style.list}>
          {prescriptionList.map((v, k) => {
            return (
              <TouchableOpacity
                key={k}
                style={[style.item, global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}
                onPress={() => {
                  this.props.navigation.push('UploadPrescriptionDetail', { id: v.id })
                }}
              >
                <Text style={style.name}>{v.name || '未命名'}</Text>
                <Text style={style.ctime}>{moment(v.ctime).format('YYYY-MM-DD')}</Text>
                <Text
                  style={[
                    style.shipping,
                    v.status === UPLOAD_PRESCRIPTION_STATUS.cancelOrder && style.wait,
                    v.status === UPLOAD_PRESCRIPTION_STATUS.hasSend && style.success,
                  ]}
                >
                  {UPLOAD_PRESCRIPTION_STATUS[v.status]}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>
    )
  }
}
