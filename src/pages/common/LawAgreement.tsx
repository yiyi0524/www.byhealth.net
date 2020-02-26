import * as userAction from '@/redux/actions/user'
import { AppState } from '@/redux/stores/store'
import { AllScreenParam } from '@/routes/bottomNav'
import api from '@/services/api'
import { windowWidth } from '@/utils/utils'
import { Toast } from '@ant-design/react-native'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import gImg from '@utils/img'
import gStyle from '@utils/style'
import React, { Component } from 'react'
import { BackHandler, Image, NativeEventSubscription, View } from 'react-native'
import { WebView } from 'react-native-webview'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
const style = gStyle.common.LawAgreement
interface Props {
  navigation: StackNavigationProp<AllScreenParam, 'LawAgreement'>
  route: RouteProp<AllScreenParam, 'LawAgreement'>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  isLogin: boolean
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
  loginStatus?: NativeEventSubscription
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      isLogin: false,
    }
  }
  async componentDidMount() {
    this.init()
    // this.loginStatus = BackHandler.addEventListener('hardwareBackPress', this.addEventListenerBack)
  }
  componentWillUnmount() {
    if (this.loginStatus) {
      this.loginStatus.remove()
    }
  }
  // addEventListenerBack = () => {
  //   if (this.props.route.params.isLogin) {
  //     this.props.navigation.goBack()
  //   } else {
  //     this.props.navigation.navigate('Register')
  //   }
  //   return true
  // }
  init = async () => {
    try {
      let isLogin = await api.isLogin()
      this.props.navigation.setParams({
        isLogin,
      })
      this.setState({
        hasLoad: true,
        isLogin,
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
        <WebView
          androidHardwareAccelerationDisabled
          style={{
            flex: 1,
            width: windowWidth,
            padding: 15,
          }}
          source={{ uri: 'https://www.byhealth.net/lawAgreement.html' }}
        />
      </>
    )
  }
}
