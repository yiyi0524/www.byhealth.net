import global from '@/assets/styles/global'
import { AppState } from '@/redux/stores/store'
import { AllScreenParam } from '@/routes/bottomNav'
import { Icon, Modal, Toast } from '@ant-design/react-native'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import gImg from '@utils/img'
import gSass from '@utils/style'
import React, { Component } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
const style = gSass.index.prescribing

interface Props {}
interface State {
  page: number
  limit: number
  count: number
  filter: Record<string, any>
  search: string
  patientList: []
}
type DefaultProps = {
  navigation: StackNavigationProp<AllScreenParam, 'Prescribing'>
  route: RouteProp<AllScreenParam, 'Prescribing'>
} & ReturnType<typeof mapStateToProps>
const mapStateToProps = (state: AppState) => {
  return {
    name: state.user.name,
    uid: state.user.uid,
  }
}
//@ts-ignore
@connect(mapStateToProps)
export default class Prescribing extends Component<Props & DefaultProps, State> {
  static defaultProps: DefaultProps
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      page: 1,
      limit: 10,
      count: 0,
      filter: {},
      search: '',
      patientList: [],
    }
  }
  componentDidMount() {
    this.init()
  }
  init = () => {
    this.listPatient()
  }
  listPatient = () => {
    let { page, limit, filter } = this.state
    console.log(page, limit, filter)
  }

  render() {
    return (
      <ScrollView style={style.main}>
        <View style={style.searchPar}>
          <TouchableOpacity
            style={[style.item, global.flex, global.aCenter]}
            onPress={() => {
              Modal.prompt(
                '手机号开方',
                '',
                (phone: string) => {
                  if (!/1\d{10}/.test(phone)) {
                    return Toast.fail('手机号格式不正确')
                  }
                  this.props.navigation.navigate('SquareRoot', {
                    mode: 'phone',
                    phone,
                  })
                },
                'default',
                '',
                ['请输入用户手机号'],
              )
            }}
          >
            <Image style={style.img} source={gImg.home.prescribingPhone} />
            <Text style={style.title}>手机号邀请患者</Text>
            <Text style={style.desc}>去填手机号</Text>
            <Icon style={style.icon} name='right' />
          </TouchableOpacity>
          <TouchableOpacity
            style={[style.item, global.flex, global.aCenter]}
            onPress={() => {
              this.props.navigation.navigate('SquareRoot', {
                mode: 'wx',
              })
            }}
          >
            <Image style={style.img} source={gImg.home.prescribingWeChat} />
            <Text style={style.title}>微信邀请患者</Text>
            <Text style={style.desc}>发送患者微信</Text>
            <Icon style={style.icon} name='right' />
          </TouchableOpacity>
          <TouchableOpacity
            style={[style.item, global.flex, global.aCenter]}
            onPress={() => {
              this.props.navigation.navigate('UploadPrescription')
            }}
          >
            <Image style={style.img} source={gImg.home.prescribingPhotograph} />
            <Text style={style.title}>直接拍方</Text>
            <Text style={style.desc}>拍方后药房会联系患者添加微信</Text>
            <Icon style={style.icon} name='right' />
          </TouchableOpacity>
          <TouchableOpacity
            style={[style.item, global.flex, global.aCenter]}
            onPress={() => {
              this.props.navigation.navigate('PrescriptionTpl')
            }}
          >
            <Image style={style.img} source={gImg.home.prescribingPhotograph} />
            <Text style={style.title}>模板开方</Text>
            <Text style={style.desc}>选择模板立即开方发送给微信患者</Text>
            <Icon style={style.icon} name='right' />
          </TouchableOpacity>
        </View>
        <View style={style.tips}>
          <Text style={style.tipsTitle}>
            互联网诊疗仅适用常见病、慢性病复诊、且您须掌握患者病历，确定其在实体医疗机构有过同诊断。请勿为首诊、急重症患者在线诊疗。
          </Text>
        </View>
      </ScrollView>
    )
  }
}
