import Empty from '@/components/Empty'
import * as userAction from '@/redux/actions/user'
import { AppState } from '@/redux/stores/store'
import pathMap from '@/routes/pathMap'
import doctor, { GENDER, InvisiblePatient } from '@/services/doctor'
import { getPicCdnUrl } from '@/utils/utils'
import { Toast } from '@ant-design/react-native'
import { AllScreenParam } from '@/routes/bottomNav'
import { RouteProp } from '@react-navigation/native'
import sColor from '@styles/color'
import gImg from '@utils/img'
import gStyle from '@utils/style'
import React, { Component } from 'react'
import {
  DeviceEventEmitter,
  Image,
  PixelRatio,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
const style = gStyle.personalCenter.InvisiblePatients
const global = gStyle.global
interface Props {
  navigation: StackNavigationProp<AllScreenParam, 'InvisiblePatients'>
  route: RouteProp<AllScreenParam, 'InvisiblePatients'>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  list: InvisiblePatient[]
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
@connect(mapStateToProps, mapDispatchToProps)
export default class Index extends Component<
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
      list: [],
    }
  }
  async componentDidMount() {
    await this.init()
  }
  init = async () => {
    try {
      let {
        data: { list },
      } = await doctor.listInvisiblePatient({ page: -1, limit: -1 })
      this.setState({
        hasLoad: true,
        list,
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
  setInvisiblePatients = async (id: number) => {
    try {
      await doctor.setInvisiblePatients({ patientUid: id })
      Toast.success('设置成功', 2)
      DeviceEventEmitter.emit(pathMap.AddressBookIndex + 'Reload', null)
      DeviceEventEmitter.emit(pathMap.AdvisoryIndex + 'Reload', null)
      this.init()
    } catch (err) {
      Toast.success('设置失败, 错误原因: ' + err.msg, 3)
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
    let { list } = this.state
    return (
      <>
        <ScrollView
          style={style.main}
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
        >
          {list.length === 0 ? (
            <Empty />
          ) : (
            <View style={style.list}>
              {list.map((v, k) => {
                return (
                  <View key={k} style={[style.item, global.flex, global.alignItemsCenter]}>
                    <View style={style.avatar}>
                      <Image
                        style={style.avatarImg}
                        source={
                          v.avatar.url ? { uri: getPicCdnUrl(v.avatar.url, 'avatar') } : gImg.common.defaultAvatar
                        }
                      />
                    </View>
                    <View style={style.itemCenter}>
                      <Text style={[style.name, global.fontSize16]}>{v.name || '未命名'}</Text>
                      <View style={[global.flex, global.alignItemsCenter]}>
                        <Text style={[style.time, global.fontSize14]}>{v.time.substr(0, 10)} </Text>
                        <Image
                          style={style.genderAge}
                          source={
                            v.gender === GENDER.MAN
                              ? gImg.common.man
                              : v.gender === GENDER.WOMAN
                              ? gImg.common.woman
                              : gImg.common.genderNull
                          }
                        />
                        <Text style={[style.age, global.fontSize14]}>
                          {v.yearAge >= 3 ? v.yearAge + '岁' : v.yearAge + '岁' + v.monthAge + '月'}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => this.setInvisiblePatients(v.uid)}>
                      <Text style={[style.setVisible, global.fontSize14]}>取消不可见</Text>
                    </TouchableOpacity>
                  </View>
                )
              })}
            </View>
          )}
        </ScrollView>
      </>
    )
  }
}
