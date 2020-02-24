import * as userAction from '@/redux/actions/user'
import { AppState } from '@/redux/stores/store'
import { AllScreenParam } from '@/routes/bottomNav'
import pathMap from '@/routes/pathMap'
import doctor, { SittingHospital } from '@/services/doctor'
import hospital from '@/services/hospital'
import { Icon, Modal, Toast } from '@ant-design/react-native'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import gImg from '@utils/img'
import gStyle from '@utils/style'
import React, { Component } from 'react'
import { DeviceEventEmitter, EmitterSubscription, Image, RefreshControl, Text, View } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
const style = gStyle.index.SittingHospitalList
const global = gStyle.global

interface Props {
  navigation: StackNavigationProp<AllScreenParam, 'SittingHospitalList'>
  route: RouteProp<AllScreenParam, 'SittingHospitalList'>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  list: SittingHospital[]
  hospitalList: Hospital[]
}
interface Hospital {
  id: number
  name: string
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
export default class DiagnosisSettings extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  medicalInstitutionMapColor: string[]
  subscription?: EmitterSubscription
  constructor(props: any) {
    super(props)
    this.medicalInstitutionMapColor = ['#f2878d', '#d68db5', '#ac84bf', '#9b9fc5', '#8fb2d4', '#82c6c9', '#71c797']
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      list: [],
      hospitalList: [],
    }
  }
  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener(pathMap.SittingHospitalList + 'Reload', this.init)
    this.init()
  }
  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.remove()
    }
  }
  init = async () => {
    try {
      let {
        data: { list: hospitalList },
      } = await hospital.getList({ page: -1, limit: -1, filter: {} })
      let {
        data: { list },
      } = await doctor.listSittingHospital({ page: -1, limit: -1, filter: {} })
      this.setState({
        hasLoad: true,
        list,
        hospitalList,
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
    let color = this.medicalInstitutionMapColor
    return (
      <>
        <ScrollView
          style={style.main}
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
        >
          <View style={style.list}>
            {this.state.list.map((v, k) => {
              let hospitalName = v.hospitalName
              for (let v1 of this.state.hospitalList) {
                if (v1.id === v.hospitalId) {
                  hospitalName = v1.name
                }
              }
              return (
                <View style={style.item} key={k}>
                  <View style={[global.flex, global.alignItemsCenter]}>
                    <Icon style={[style.itemImg, global.fontSize20]} name='home' />
                    <Text style={[style.itemTitle, global.fontSize14]}>{hospitalName}</Text>
                  </View>
                  <View style={[global.flex, global.alignItemsCenter]}>
                    <Icon style={[style.itemImg, global.fontSize20]} name='environment' />
                    <Text style={[style.itemTitle, global.fontSize14]}>{v.address.detail}</Text>
                  </View>
                  <View style={[style.operation, global.flex, global.alignItemsCenter, global.justifyContentEnd]}>
                    <TouchableOpacity
                      onPress={() => {
                        Modal.alert('提示', '确定删除该医疗机构?', [
                          {
                            text: '取消',
                          },
                          {
                            text: '确定',
                            onPress: async () => {
                              try {
                                await doctor.deleteSittingHospital({ id: v.id })
                                await this.init()
                                Toast.success('删除成功', 2)
                                DeviceEventEmitter.emit(pathMap.SittingHospital + 'Reload', null)
                              } catch (err) {
                                Toast.fail('删除失败, 错误信息: ' + err.msg, 3)
                                console.log(err)
                              }
                            },
                          },
                        ])
                      }}
                    >
                      <Text style={[style.itemBtnTitle, global.fontSize15]}>删除</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.push('EditSittingHospital', { id: v.id })
                      }}
                    >
                      <Text style={[style.itemBtnTitle, global.fontSize15]}>编辑</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={style.itemRight}>
                    <View style={[style.itemIcon, { borderTopColor: color[k], borderRightColor: color[k] }]} />
                  </View>
                </View>
              )
            })}
          </View>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.push('AddSittingHospital')
            }}
          >
            <View style={[style.btn, global.flex, global.alignItemsCenter]}>
              <Icon name='plus-circle' style={[style.btnIcon, global.fontSize20]} />
              <Text style={[style.btnTitle, global.fontSize14]}>添加医疗机构</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </>
    )
  }
}
