import * as userAction from '@/redux/actions/user'
import { AppState } from '@/redux/stores/store'
import { AllScreenParam } from '@/routes/bottomNav'
import pathMap from '@/routes/pathMap'
import doctor, { ALLOW_SEARCH_ME } from '@/services/doctor'
import { Switch, Toast } from '@ant-design/react-native'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import gImg from '@utils/img'
import gStyle from '@utils/style'
import React, { Component } from 'react'
import { DeviceEventEmitter, Image, RefreshControl, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
const style = gStyle.index.ServiceSettings
const global = gStyle.global

interface Props {
  navigation: StackNavigationProp<AllScreenParam, 'ServiceSettings'>
  route: RouteProp<AllScreenParam, 'ServiceSettings'>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  allowSearch: number
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
export default class DiagnosisSettings extends Component<
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
      allowSearch: ALLOW_SEARCH_ME.FALSE,
    }
  }
  componentDidMount() {
    this.init()
  }
  init = async () => {
    let {
      data: { allowSearch },
    } = await doctor.getServiceSettings()
    this.setState({
      hasLoad: true,
      allowSearch,
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
          <View style={style.explain}>
            <View style={[style.header, global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}>
              <View style={[global.flex, global.alignItemsCenter]}>
                <Text style={[style.headerTitle, global.fontSize14]}>在平台搜不到我</Text>
              </View>
              <Switch checked={this.state.allowSearch === ALLOW_SEARCH_ME.FALSE} onChange={this.changeAllowNoSearch} />
            </View>
            <Text style={[style.detail, global.fontSize12]}>开启后, 医生对外不可见, 患者只可通过扫码找到医生</Text>
          </View>
        </ScrollView>
      </>
    )
  }
  changeAllowNoSearch = () => {
    let allowSearch = this.state.allowSearch === ALLOW_SEARCH_ME.FALSE ? ALLOW_SEARCH_ME.TRUE : ALLOW_SEARCH_ME.FALSE
    this.setState({
      allowSearch,
    })
    doctor
      .setServiceSettings({ allowSearch })
      .then(async () => {
        await this.init()
        DeviceEventEmitter.emit(pathMap.Home + 'Reload')
        Toast.success('设置成功', 1)
      })
      .catch(err => {
        Toast.fail('设置失败, 错误信息: ' + err.msg, 3)
        console.log(err)
      })
  }
}
