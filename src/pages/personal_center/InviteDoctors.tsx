import { BASE_URL } from '@/config/api'
import * as userAction from '@/redux/actions/user'
import { AppState } from '@/redux/stores/store'
import { AllScreenParam } from '@/routes/bottomNav'
import { TECHNICAL_TITLE_ZH } from '@/services/doctor'
import { Button, Toast } from '@ant-design/react-native'
import userApi from '@api/user'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import gImg from '@utils/img'
import gStyle from '@utils/style'
import React, { Component } from 'react'
import { Alert, Image, RefreshControl, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import QRCode from 'react-native-qrcode-svg'
import * as WeChat from 'react-native-wechat'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Picture } from '../advisory/Chat'

const style = gStyle.index.InvitePatients
const global = gStyle.global
interface Props {
  navigation: StackNavigationProp<AllScreenParam, 'InviteDoctors'>
  route: RouteProp<AllScreenParam, 'InviteDoctors'>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  doctorId: number
  name: string
  technicalTitle: number
  inviteUrl: string
  avatar: Picture | null
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
      avatar: null,
      inviteUrl: BASE_URL + '/register',
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
    let getPersonalInfoPromise = userApi.getPersonalInfo()
    let { data } = await getPersonalInfoPromise

    this.setState({
      hasLoad: true,
      doctorId: data.doctorInfo.id,
      name: data.info.name,
      avatar: data.info.avatar,
      technicalTitle: data.doctorInfo.technicalTitle as number,
      inviteUrl: BASE_URL + '/register?id=' + data.doctorInfo.id,
    })
  }
  onRefresh = () => {
    this.setState({ refreshing: true })
    Promise.all([this.init(), new Promise(s => setTimeout(s, 300))])
      .then(_ => {
        this.setState({ refreshing: false })
      })
      .catch(err => {
        Toast.fail('刷新失败,错误信息: ' + err.msg)
      })
  }
  inviteDoctor = () => {
    WeChat.isWXAppInstalled()
      .then(isInstalled => {
        if (isInstalled) {
          const avatarUrl = (this.state.avatar && this.state.avatar.url) || ''
          WeChat.shareToSession({
            // @ts-ignore
            title: (this.state.name || '') + '医师邀请您加入博一健康',
            description: this.state.name + '医师正在邀请您加入博一健康,点击立即注册',
            type: 'news',
            imageUrl: BASE_URL + avatarUrl,
            thumbImage: BASE_URL + avatarUrl,
            webpageUrl: this.state.inviteUrl,
          }).catch((error: any) => {
            Alert.alert(error.message)
          })
        } else {
          Alert.alert('请安装微信')
        }
      })
      .catch(err => {
        console.log('buffge: 获取微信是否已安装状态失败', err)
      })
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
            <Text style={[style.title, global.fontSize24]}>博采众长,一生健康</Text>
            <View style={style.qrCode}>
              <QRCode value={this.state.inviteUrl} logoSize={120} logoBackgroundColor='#252525' />
            </View>
            <Text style={[style.detail, global.fontSize12]}>微信扫描上方我的二维码即可注册</Text>
            <Button style={{ backgroundColor: 'rgb(5,164,165)', marginTop: 30 }} onPress={this.inviteDoctor}>
              <Text style={{ color: '#fff' }}>微信邀请医生入驻</Text>
            </Button>
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
