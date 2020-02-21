import * as userAction from '@/redux/actions/user'
import { AppState } from '@/redux/stores/store'
import pathMap from '@/routes/pathMap'
import doctor from '@/services/doctor'
import { Icon, Modal, Toast } from '@ant-design/react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import gImg from '@utils/img'
import gStyle from '@utils/style'
import React, { Component } from 'react'
// prettier-ignore
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Picture } from '../advisory/Chat'
import { AllScreenParam } from '@routes/bottomNav'
import { RouteProp } from '@react-navigation/native'
const style = gStyle.addressBook.AddressBookGroup
const global = gStyle.global
export interface NavParams {
  navigatePress: () => void
  mode: 'delete' | 'done'
}
interface Props {
  navigation: StackNavigationProp<any>
  route: RouteProp<AllScreenParam, 'AddressBookGroup'>
}
export interface patientGroupItem {
  id: number
  name: string
  patientList: patientItem[]
}
export interface patientItem {
  id?: number
  uid: number
  avatar: Picture
  name: string
  gender: number
  year_age: number
  month_age: number
  isChecked: boolean
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  isDeleteMode: boolean
  patientGroupList: patientGroupItem[]
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
      isDeleteMode: false,
      patientGroupList: [],
    }
  }
  componentDidMount() {
    this.props.navigation.setParams({
      // mode: 'done',
      navigatePress: this.changeMode,
    })
    this.init()
  }
  changeMode = () => {
    this.setState({
      isDeleteMode: !this.state.isDeleteMode,
    })
  }
  init = async () => {
    const res = await doctor.getPatientGroupList({ page: -1, limit: -1, filter: {} })
    console.log(res)
    let {
      data: { list: patientGroupList },
    } = res
    this.setState({
      hasLoad: true,
      patientGroupList,
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
  deleteGroup = (id: number) => {
    doctor
      .deletePatientGroup({ id })
      .then(() => {
        Toast.success('删除成功', 1)
        this.init()
      })
      .catch(err => {
        Toast.fail('删除失败, 错误原因: ' + err.msg, 1)
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
          <View style={style.patientGroupList}>
            {this.state.patientGroupList.map((v, k) => {
              return (
                <TouchableOpacity
                  key={k}
                  style={[
                    style.patientGroupItem,
                    global.flex,
                    global.justifyContentSpaceBetween,
                    global.alignItemsCenter,
                  ]}
                  onPress={() => {
                    this.props.navigation.push(pathMap.AddressBookGroupDetail, {
                      id: v.id,
                      title: v.name,
                    })
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      Modal.alert('提示', `您确定删除${v.name}分组吗?`, [
                        {
                          text: '取消',
                          onPress: () => console.log('cancel'),
                          style: 'cancel',
                        },
                        { text: '确定', onPress: () => this.deleteGroup(v.id) },
                      ])
                    }}
                    style={this.state.isDeleteMode ? null : global.hidden}
                  >
                    <Icon name='minus-circle' style={[style.deletePatientGroupIcon, global.fontSize22]} />
                  </TouchableOpacity>
                  <View style={[style.patientGroupItemTitle]}>
                    <View style={[style.patientGroupTitle, global.flex, global.alignItemsCenter]}>
                      <Text style={[style.patientGroupTitle, global.fontSize15, global.fontStyle]}>{v.name}</Text>
                      <Text style={[style.patientGroupCount, global.fontSize15, global.fontStyle]}>
                        ( {v.patientList.length} 人)
                      </Text>
                    </View>
                    <View style={[style.patientGroupDescription, global.flex, global.alignItemsCenter]}>
                      {v.patientList.length === 0 ? (
                        <Text style={[style.patientGroupNames, global.fontSize12, global.fontStyle]}>暂无患者</Text>
                      ) : (
                        <Text style={[style.patientGroupNames, global.fontSize12, global.fontStyle]} numberOfLines={1}>
                          {v.patientList.map((v1: any) => {
                            return v1.name + '、'
                          })}
                        </Text>
                      )}
                    </View>
                  </View>
                  <Icon name='right' style={[style.patientGroupIcon, global.fontSize14]} />
                </TouchableOpacity>
              )
            })}
            <TouchableOpacity
              style={[style.addPatientGroup, global.flex, global.alignItemsCenter, global.justifyContentCenter]}
              onPress={() => this.props.navigation.push(pathMap.AddressBookAddGroup)}
            >
              <Icon name='plus-circle' style={style.addPatientGroupBtn} />
              <Text style={[style.addPatientGroupTitle, global.fontSize14, global.fontStyle]}>添加新分组</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </>
    )
  }
}
