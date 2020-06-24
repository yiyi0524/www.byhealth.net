import * as userAction from '@/redux/actions/user'
import { AppState } from '@/redux/stores/store'
import pathMap from '@/routes/pathMap'
import storage from '@/utils/storage'
import { Icon, Toast } from '@ant-design/react-native'
import api from '@api/api'
import gStyle from '@utils/style'
import React, { Component } from 'react'
import gImg from '@utils/img'
import userApi from '@api/user'
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
  DeviceEventEmitter,
  EmitterSubscription,
} from 'react-native'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { AllScreenParam } from '@/routes/bottomNav'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
const style = gStyle.personalCenter.personalCenterIndex
const global = gStyle.global
interface Props {
  navigation: StackNavigationProp<AllScreenParam, 'PersonalCenter'>
  route: RouteProp<AllScreenParam, 'PersonalCenter'>
}
interface State {
  hasLoad: boolean
  hasRealNameAuth: boolean
  refreshing: boolean
  version: {
    current: string
    new: string
  }
  isAssistant: boolean
}
interface functionItem {
  name: string
  link: string
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
@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class Index extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  functionList: functionItem[] = []
  subscription?: EmitterSubscription
  constructor(props: any) {
    super(props)
    this.functionList = [
      {
        name: '账户',
        link: pathMap.Account,
      },
      {
        name: '编辑资料',
        link: pathMap.EditInformation,
      },
      {
        name: '修改密码',
        link: pathMap.ChangePwd,
      },
      {
        name: '医助管理',
        link: pathMap.AssistantDoctorList,
      },
      {
        name: '患者不可见',
        link: pathMap.InvisiblePatients,
      },
      // {
      //   name: "邀请医生",
      //   link: pathMap.InviteDoctors,
      // },
      {
        name: '我的邀请',
        link: pathMap.MyInvite,
      },
      {
        name: '关于我们v1',
        link: pathMap.About,
      },
      {
        name: '联系客服',
        link: pathMap.CustomerService,
      },
      {
        name: '医生注册协议',
        link: pathMap.RegisterAgreement,
      },
      {
        name: '法律声明与隐私政策',
        link: pathMap.LawAgreement,
      },
      {
        name: '退出登录',
        link: '',
      },
    ]
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      hasRealNameAuth: false,
      refreshing: false,
      version: {
        current: '1.0.0',
        new: '',
      },
      isAssistant: false,
    }
  }
  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener(pathMap.PersonalCenter + 'Reload', this.init)
    this.init()
  }
  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.remove()
    }
  }
  init = async () => {
    let isAssistant = await storage.get('isAssistant')
    this.setState({
      isAssistant,
    })
    try {
      let isLogin = await api.isLogin()
      if (!isLogin) {
        this.props.navigation.navigate('Login')
      }
      let {
        data: { doctorInfo },
      } = await userApi.getPersonalInfo()
      let version = {
        current: String(Platform.Version),
        new: '1.0.1',
      }
      this.setState({
        hasLoad: true,
        hasRealNameAuth: doctorInfo.hasRealNameAuth,
        version,
      })
    } catch (err) {
      console.log(err)
    }
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
  logout = async () => {
    const { navigation } = this.props
    Toast.loading('正在退出', 1)
    try {
      await Promise.all([api.logout(), new Promise(s => setTimeout(s, 300))])
      await storage.remove('session')
      this.props.login({
        uid: 0,
        name: '未命名',
        avatar: {
          id: 0,
          title: '',
          url: '',
        },
      })
      navigation.navigate('Login')
      DeviceEventEmitter.emit(pathMap.PersonalCenter + 'Reload', null)
      DeviceEventEmitter.emit('wsReload', null)
    } catch (err) {
      console.log(err)
      Toast.info('退出失败,错误信息: ' + err.msg, 2)
      DeviceEventEmitter.emit(pathMap.PersonalCenter + 'Reload', null)
    }
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
      <>
        <ScrollView
          style={style.main}
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
        >
          <View style={style.separationModule} />
          <View style={style.list}>
            {this.functionList.map((v: any, k: number) => {
              if (v.name === '账户') {
                return this.state.isAssistant ? null : (
                  <View key={k}>
                    <TouchableOpacity
                      onPress={() => {
                        if (!this.state.hasRealNameAuth) {
                          return Toast.info('您未认证完成', 1)
                        }
                        this.props.navigation.push(v.link)
                      }}
                      style={[style.item, global.flex, global.justifyContentSpaceBetween, global.alignItemsCenter]}
                    >
                      <Text style={[style.title, global.fontStyle, global.fontSize15]}>{v.name}</Text>
                      <Icon style={[style.icon, global.fontSize14]} name='right' />
                    </TouchableOpacity>
                    <View style={style.separationModule} />
                  </View>
                )
              }
              if (v.name === '退出登录') {
                return (
                  <View key={k}>
                    <View style={style.separationModule} />
                    <TouchableOpacity
                      onPress={this.logout}
                      style={[style.item, global.flex, global.justifyContentCenter, global.alignItemsCenter]}
                    >
                      <Text style={[style.logout, global.fontStyle, global.fontSize15]}>{v.name}</Text>
                    </TouchableOpacity>
                  </View>
                )
              }
              return (
                <TouchableOpacity
                  onPress={() => {
                    if (v.name === '编辑资料' || v.name === '患者不可见' || v.name === '我的邀请') {
                      if (!this.state.hasRealNameAuth) {
                        return Toast.info('您未认证完成', 1)
                      }
                    }
                    this.props.navigation.push(v.link)
                  }}
                  key={k}
                  style={
                    (v.name === '医助管理' || v.name === '修改密码') && this.state.isAssistant
                      ? [global.hidden]
                      : [style.item, global.flex, global.justifyContentSpaceBetween, global.alignItemsCenter]
                  }
                >
                  <Text style={[style.title, global.fontStyle, global.fontSize15]}>{v.name}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </ScrollView>
      </>
    )
  }
}
