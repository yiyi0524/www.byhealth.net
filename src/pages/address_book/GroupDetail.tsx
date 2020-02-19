import * as userAction from '@/redux/actions/user'
import { AppState } from '@/redux/stores/store'
import pathMap from '@/routes/pathMap'
import { getPicCdnUrl } from '@/utils/utils'
import { Toast } from '@ant-design/react-native'
import doctor, { GENDER } from '@api/doctor'
import sColor from '@styles/color'
import gImg from '@utils/img'
import gStyle from '@utils/style'
import React, { Component } from 'react'
import { Image, PixelRatio, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Picture } from '../advisory/Chat'
const style = gStyle.addressBook.AddressBookGroupDetail
const global = gStyle.global
interface Props {
  navigation: StackNavigationProp<any>
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
  groupName: string
  groupId: number
  patientList: patientItem[]
  patientIdList: number[]
  selectPatientList: string[]
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
  static navigationOptions = ({ navigation }: { navigation: StackNavigationProp<any> }) => ({
    title: navigation.state.params!.title,
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
    headerRight: (
      <TouchableOpacity
        onPress={() => {
          // navigation.push(pathMap.AddressBookGroupManage, {
          //   id: navigation.state.params.id
          // });
        }}
      >
        <Text style={[style.headerTitleLeft, global.fontSize14, global.fontStyle]}>管理</Text>
      </TouchableOpacity>
    ),
  })
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      groupId: 0,
      groupName: '',
      patientList: [],
      patientIdList: [],
      selectPatientList: [],
    }
  }
  componentDidMount() {
    this.init()
  }
  init = async () => {
    let groupId = this.props.navigation.getParam('id')
    this.setState({
      groupId,
    })
    let {
      data: {
        detail: { patientList },
      },
    } = await doctor.getPatientGroupDetail({
      id: groupId,
    })
    for (let patient of patientList) {
      patient.isChecked = false //管理:是否选中
    }
    this.setState({
      hasLoad: true,
      patientList,
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
      return <View style={style.loading} />
    }
    return (
      <>
        <ScrollView
          style={style.main}
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
        >
          <View style={style.patientList}>
            {this.state.patientList.map((v: patientItem, k: number) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={k}
                  style={[style.patientItem, global.flex, global.alignItemsCenter]}
                  onPress={() =>
                    this.props.navigation.push(pathMap.PatientDetail, {
                      title: v.name,
                      patientUid: v.uid,
                    })
                  }
                >
                  <View style={style.patientItemAvatar}>
                    <Image
                      style={style.patientAvatar}
                      source={
                        v.avatar.url !== '' ? { uri: getPicCdnUrl(v.avatar.url, 'avatar') } : gImg.common.defaultAvatar
                      }
                    />
                  </View>
                  <View style={[style.patientItemDescription, global.flex, global.alignItemsCenter]}>
                    <Text style={style.patientName}>{v.name}</Text>
                    <View style={[style.patientDescription, global.flex, global.alignItemsCenter]}>
                      <Image
                        style={style.patientGender}
                        source={
                          v.gender === GENDER.MAN
                            ? gImg.common.man
                            : v.gender === GENDER.WOMAN
                            ? gImg.common.woman
                            : gImg.common.genderNull
                        }
                      />
                      <Text style={[style.patientAge, global.fontSize12, global.fontStyle]}>
                        {v.year_age}岁{v.month_age !== 0 ? v.month_age + '月' : null}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        </ScrollView>
      </>
    )
  }
}
