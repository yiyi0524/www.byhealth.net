import * as userAction from '@/redux/actions/user'
import { AppState } from '@/redux/stores/store'
import pathMap from '@/routes/pathMap'
import { GENDER_ZH, PRESCRIPTION_STATUS, PRESCRIPTION_STATUS_ZH } from '@/services/doctor'
import { Icon, Toast } from '@ant-design/react-native'
import userApi from '@api/user'
import sColor from '@styles/color'
import gImg from '@utils/img'
import gStyle from '@utils/style'
import moment from 'moment'
import React, { Component } from 'react'
import { Image, PixelRatio, Text, View } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { StackNavigationProp } from '@react-navigation/stack'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
const style = gStyle.index.Prescription
const global = gStyle.global
interface Props {
  navigation: StackNavigationProp<any>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  selectTab: string
  page: number
  limit: number
  filter: {}
  prescriptionList: prescriptionItem[]
}
export interface prescriptionItem {
  id: number
  name: string
  gender: number
  yearAge: number
  monthAge: number
  discrimination: string //辨病
  syndromeDifferentiation: string //辨证
  status: number
  ctime: string
  type: 'wx' | 'common' | 'phone'
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
export default class Prescription extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = () => ({
    title: '已开处方',
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
    headerRight: <Text />,
  })
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      selectTab: 'all',
      prescriptionList: [],
      page: -1,
      limit: -1,
      filter: {},
    }
  }
  async componentDidMount() {
    await this.init()
  }
  init = async () => {
    let {
      data: { list: prescriptionList },
    } = await userApi.getPrescriptionList({
      page: this.state.page,
      limit: this.state.limit,
      filter: this.state.filter,
    })
    this.setState({
      hasLoad: true,
      prescriptionList,
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

  buildPrescriptionDom = (v: prescriptionItem, k: number, showPayStatus = true): React.ReactChild => {
    return (
      <TouchableOpacity
        key={k}
        style={style.prescriptionItem}
        onPress={() => this.props.navigation.push(pathMap.PrescriptionDetail, { prescriptionId: v.id })}
      >
        <View
          style={[
            style.prescriptionItemHeader,
            global.flex,
            global.alignItemsCenter,
            global.justifyContentSpaceBetween,
          ]}
        >
          <View style={[style.prescriptionItemHeaderLeft, global.flex, global.alignItemsCenter]}>
            <View style={style.prescriptionItemHeaderLeftIcon} />
            <Text style={[style.prescriptionItemHeaderLeftTitle, global.fontSize14]}>{v.name}</Text>
            {v.type === 'common' && (
              <Text style={[style.prescriptionItemHeaderLeftDetail, global.fontSize14]}>
                {GENDER_ZH[v.gender]}
                {v.yearAge >= 3 ? v.yearAge + '岁' : v.yearAge + '岁' + v.monthAge + '月'}
              </Text>
            )}
          </View>
          <View style={[style.prescriptionItemHeaderRight, global.flex, global.alignItemsCenter]}>
            <Text style={[style.prescriptionItemHeaderRightTitle, global.fontSize14]}>查看详情</Text>
            <Icon name='right' style={[style.prescriptionItemHeaderRightIcon, global.fontSize14]} />
          </View>
        </View>
        <View style={style.prescriptionItemDescription}>
          <Text style={[style.prescriptionItemDescriptionDiagnosis, global.fontSize14]} numberOfLines={1}>
            [ 诊断 ] {v.discrimination}; {v.syndromeDifferentiation}
          </Text>
          <View
            style={[
              style.prescriptionItemDescriptionDetail,
              global.flex,
              global.alignItemsCenter,
              global.justifyContentSpaceBetween,
            ]}
          >
            <Text style={[style.prescriptionItemDescriptionTime, global.fontSize14]} numberOfLines={1}>
              {moment(v.ctime).format('YYYY年MM月DD日 HH:mm')}
            </Text>
            {showPayStatus ? (
              <Text style={[style.prescriptionItemDescriptionStatus, global.fontSize14]} numberOfLines={1}>
                {PRESCRIPTION_STATUS_ZH[v.status]}
              </Text>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    )
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
        <View style={style.main}>
          <View style={style.prescription}>
            <View style={[style.header, global.flex, global.alignItemsCenter, global.justifyContentSpaceAround]}>
              <TouchableOpacity
                style={style.headerItem}
                onPress={() => {
                  this.setState({
                    selectTab: 'all',
                  })
                }}
              >
                <Text
                  style={[
                    this.state.selectTab === 'all' ? style.headerTitleActive : style.headerTitle,
                    global.fontSize14,
                  ]}
                >
                  全部 ( {this.state.prescriptionList.length} )
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={style.headerItem}
                onPress={() => {
                  this.setState({
                    selectTab: 'pay',
                  })
                }}
              >
                <Text
                  style={[
                    this.state.selectTab === 'pay' ? style.headerTitleActive : style.headerTitle,
                    global.fontSize14,
                  ]}
                >
                  已支付( {this.state.prescriptionList.filter(v => v.status === PRESCRIPTION_STATUS.completePay).length}{' '}
                  )
                </Text>
              </TouchableOpacity>
            </View>
            <View style={this.state.selectTab === 'all' ? style.prescriptionList : global.hidden}>
              <ScrollView style={style.tabScroll}>
                {this.state.prescriptionList.map((v: prescriptionItem, k: number) => this.buildPrescriptionDom(v, k))}
              </ScrollView>
            </View>
            <View style={this.state.selectTab === 'pay' ? style.prescriptionList : global.hidden}>
              <ScrollView style={style.tabScroll}>
                {this.state.prescriptionList
                  .filter(v => v.status === PRESCRIPTION_STATUS.completePay)
                  .map((v: prescriptionItem, k: number) => {
                    return this.buildPrescriptionDom(v, k, false)
                  })}
              </ScrollView>
            </View>
          </View>
        </View>
      </>
    )
  }
}
