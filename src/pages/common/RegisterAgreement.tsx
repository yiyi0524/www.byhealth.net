import * as userAction from '@/redux/actions/user'
import { AppState } from '@/redux/stores/store'
import pathMap from '@/routes/pathMap'
import api from '@/services/api'
import { windowWidth } from '@/utils/utils'
import { Icon, Toast } from '@ant-design/react-native'
import sColor from '@styles/color'
import gImg from '@utils/img'
import gStyle from '@utils/style'
import React, { Component } from 'react'
import { BackHandler, Image, NativeEventSubscription, PixelRatio, Text, TouchableOpacity, View } from 'react-native'
import { WebView } from 'react-native-webview'
import { StackNavigationProp } from '@react-navigation/stack'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
const style = gStyle.common.RegisterAgreement
interface NavParams {
  isLogin: boolean
}
interface Props {
  navigation: NavigationScreenProp<State, NavParams>
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
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<State, NavParams> }) => ({
    title: '医生注册协议',
    headerStyle: {
      backgroundColor: sColor.white,
      height: 50,
      elevation: 0,
      color: sColor.mainBlack,
      borderBottomWidth: 1 / PixelRatio.get(),
      borderBottomColor: sColor.colorEee,
    },
    headerTintColor: sColor.color333,
    headerTitleStyle: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      textAlign: 'center',
    },
    headerLeft: (
      <TouchableOpacity
        onPress={() => {
          if (navigation.state.params!.isLogin) {
            navigation.goBack()
          } else {
            navigation.navigate(pathMap.Register)
          }
        }}
      >
        <Icon style={{ paddingLeft: 15, fontSize: 18, color: '#333' }} name='left' />
      </TouchableOpacity>
    ),
    headerRight: <Text />,
  })
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
    await this.init()
    this.props.navigation.setParams({
      isLogin: this.state.isLogin,
    })
    this.loginStatus = BackHandler.addEventListener('hardwareBackPress', this.addEventListenerBack)
  }
  componentWillUnmount() {
    if (this.loginStatus) {
      this.loginStatus.remove()
    }
  }
  addEventListenerBack = () => {
    if (this.props.navigation.state.params!.isLogin) {
      this.props.navigation.goBack()
    } else {
      this.props.navigation.navigate(pathMap.Register)
    }
    return true
  }
  init = async () => {
    try {
      let isLogin = await api.isLogin()
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
          style={{
            flex: 1,
            width: windowWidth,
            padding: 15,
          }}
          source={{ uri: 'https://www.byhealth.net/registerAgreement.html' }}
        />
      </>
    )
  }
}
