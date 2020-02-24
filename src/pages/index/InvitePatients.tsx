import { BASE_URL } from '@/config/api'
import * as userAction from '@/redux/actions/user'
import { AppState } from '@/redux/stores/store'
import { AllScreenParam } from '@/routes/bottomNav'
import { getMyInvitePatientQrCode, TECHNICAL_TITLE_ZH } from '@/services/doctor'
import { Toast } from '@ant-design/react-native'
import userApi from '@api/user'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import gImg from '@utils/img'
import gStyle from '@utils/style'
import React, { Component } from 'react'
import { Image, RefreshControl, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import QRCode from 'react-native-qrcode-svg'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
const style = gStyle.index.InvitePatients
const global = gStyle.global
interface Props {
  navigation: StackNavigationProp<AllScreenParam, 'InvitePatients'>
  route: RouteProp<AllScreenParam, 'InvitePatients'>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  doctorId: number
  name: string
  technicalTitle: number
  inviteUrl: string
}
const mapStateToProps = (state: AppState) => {
  return {
    isLogin: state.user.isLogin,
    name: state.user.name,
    uid: state.user.uid,
  }
}
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    login: (preload: userAction.UserInfo) => {
      dispatch(userAction.userLogin(preload))
    },
  }
}
// @ts-ignore
@connect(mapStateToProps, mapDispatchToProps)
export default class InvitePatients extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      doctorId: 0,
      technicalTitle: 0,
      name: '',
      inviteUrl: BASE_URL + '/doctor',
    }
  }
  async componentDidMount() {
    await this.init()
    this.props.navigation.setParams({
      navigatePress: this.saveBusinessCard,
    })
  }
  /**
   * 样式:     姓名
   *          职称
   *         二维码
   *       微信扫描上方二维码, 随时复诊
   */
  saveBusinessCard = () => {
    Toast.info('保存成功', 1)
  }
  init = async () => {
    let getPersonalInfoPromise = userApi.getPersonalInfo(),
      getMyInvitePatientQrCodePromise = getMyInvitePatientQrCode()
    let { data } = await getPersonalInfoPromise,
      {
        data: { url },
      } = await getMyInvitePatientQrCodePromise
    this.setState({
      hasLoad: true,
      doctorId: data.doctorInfo.id,
      name: data.info.name,
      technicalTitle: data.doctorInfo.technicalTitle as number,
      inviteUrl: url,
    })
  }
  onRefresh = () => {
    this.setState({ refreshing: true })
    Promise.all([this.init(), new Promise(s => setTimeout(s, 500))])
      .then(_ => {
        this.setState({ refreshing: false })
      })
      .catch(err => {
        Toast.fail('刷新失败,错误信息: ' + err.msg)
      })
  }
  shareBusinessCard = async () => {
    Toast.info('分享', 1)
  }
  render() {
    if (!this.state.hasLoad) {
      return (
        <View style={style.loading}>
          <View style={style.loadingPic}>
            <Image style={style.loadingImg} source={gImg.common.loading} />
          </View>
        </View>
      )
    }
    return (
      <View style={style.invitePatient}>
        <ScrollView
          style={style.main}
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
        >
          <View style={style.invite}>
            <Text style={[style.title, global.fontSize16]}>{this.state.name}</Text>
            <Text style={[style.detail, global.fontSize12]}>{TECHNICAL_TITLE_ZH[this.state.technicalTitle]}</Text>
            <Text style={[style.detail, global.fontSize14]}>在家随时找我</Text>
            <Text style={[style.title, global.fontSize24]}>复诊调方</Text>
            <View style={style.qrCode}>
              <QRCode value={this.state.inviteUrl} logoSize={120} logoBackgroundColor='#252525' />
            </View>
            <Text style={[style.detail, global.fontSize12]}>微信扫描上方我的二维码</Text>
            <Text style={[style.detail, global.fontSize12]}>关注 | 博一健康管理 | 公众号</Text>
            <Text style={[style.detail, global.fontSize12]}>即可随时在微信与我沟通, 在家找我复诊、调理</Text>
            <View style={style.logo}>
              <Image style={style.logoImg} source={gImg.common.logo} />
              <Text style={[style.detail, global.fontSize12]}>医生的个人线上医馆</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}
