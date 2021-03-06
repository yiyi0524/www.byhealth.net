import { AllScreenParam } from '@/routes/bottomNav'
import {
  getInviteDoctorOrderInfo,
  getInviteDoctorOrderMoneyInfo,
  getInviteDoctorStatistics,
  InviteDoctorOrderInfo,
  InviteDoctorOrderMoneyInfo,
  InviteDoctorStatistics,
} from '@/services/myInvite'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import global from '@styles/global'
import gImg from '@utils/img'
import gSass from '@utils/style'
import moment from 'moment'
import React, { Component } from 'react'
import { Image, Text, View } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
const style = gSass.myInvite.myInviteIndex
interface Props {
  navigation: StackNavigationProp<AllScreenParam, 'MyInvite'>
  route: RouteProp<AllScreenParam, 'MyInvite'>
}
interface State {
  hasLoad: boolean
  statistics: InviteDoctorStatistics | null //医生统计
  orderMoneyInfo: InviteDoctorOrderMoneyInfo | null //订单金额统计
  orderInfo: InviteDoctorOrderInfo | null //订单数量统计
}

export default class Index extends Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      statistics: null,
      orderInfo: null,
      orderMoneyInfo: null,
    }
  }
  componentDidMount() {
    this.init()
  }
  init = async () => {
    try {
      let getInviteDoctorStatisticsTask = getInviteDoctorStatistics()
      let getInviteDoctorOrderMoneyInfoTask = getInviteDoctorOrderMoneyInfo({
        year: parseInt(moment().format('YYYY')),
        month: parseInt(moment().format('M')),
      })
      let getInviteDoctorOrderInfoTask = getInviteDoctorOrderInfo({
        year: parseInt(moment().format('YYYY')),
        month: parseInt(moment().format('M')),
      })
      let { data: statistics } = await getInviteDoctorStatisticsTask
      let { data: orderMoneyInfo } = await getInviteDoctorOrderMoneyInfoTask
      let { data: orderInfo } = await getInviteDoctorOrderInfoTask
      this.setState({
        hasLoad: true,
        statistics,
        orderMoneyInfo,
        orderInfo,
      })
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    let { statistics, orderInfo, orderMoneyInfo } = this.state
    if (!this.state.hasLoad || statistics === null || orderMoneyInfo === null || orderInfo === null) {
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
        <ScrollView style={style.main}>
          <View style={style.list}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.push('InviteDoctorList')
              }}
            >
              <View style={style.item}>
                <View style={[style.header, { backgroundColor: '#06BABB' }]}>
                  <Text style={style.theme}>我邀请的医师</Text>
                </View>
                <View style={[style.detail, global.flex, global.aCenter, global.jBetween]}>
                  <View style={style.detail}>
                    <View>
                      <Text style={style.desc}>{statistics.totalInviteCount}</Text>
                      <Text style={style.title}>医师数</Text>
                    </View>
                  </View>
                  <View style={style.detail}>
                    <Text style={style.desc}>{statistics.firstLevelInviteCount}</Text>
                    <Text style={style.title}>一级</Text>
                  </View>
                  <View style={style.detail}>
                    <Text style={style.desc}>{statistics.secondLevelInviteCount}</Text>
                    <Text style={style.title}>二级</Text>
                  </View>
                  <View style={style.detail}>
                    <Text style={style.desc}>{statistics.thirdLevelInviteCount}</Text>
                    <Text style={style.title}>三级</Text>
                  </View>
                  <View style={style.detail}>
                    <Text style={style.desc}>{statistics.fourthLevelInviteCount}</Text>
                    <Text style={style.title}>四级</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.push('OrderMoney')
              }}
            >
              <View style={orderInfo.isFinance ? [style.item] : [global.hidden]}>
                <View style={[style.header, { backgroundColor: '#058687' }, global.flex, global.jBetween]}>
                  <Text style={style.theme}>我邀请的订单金额 (元)</Text>
                  <Text style={style.time}>{moment().format('YYYY年MM月')}</Text>
                </View>
                <View style={[style.detail, global.flex, global.aCenter, global.jBetween]}>
                  <View style={style.detail}>
                    <View>
                      <Text style={style.desc}>{(orderMoneyInfo.total / 100).toFixed(0)}</Text>
                      <Text style={style.title}>金额</Text>
                    </View>
                  </View>
                  <View style={style.detail}>
                    <Text style={style.desc}>{(orderMoneyInfo.firstLevelMoney / 100).toFixed(0)}</Text>
                    <Text style={style.title}>一级</Text>
                  </View>
                  <View style={style.detail}>
                    <Text style={style.desc}>{(orderMoneyInfo.secondLevelMoney / 100).toFixed(0)}</Text>
                    <Text style={style.title}>二级</Text>
                  </View>
                  <View style={style.detail}>
                    <Text style={style.desc}>{(orderMoneyInfo.thirdLevelMoney / 100).toFixed(0)}</Text>
                    <Text style={style.title}>三级</Text>
                  </View>
                  <View style={style.detail}>
                    <Text style={style.desc}>{(orderMoneyInfo.fourthLevelMoney / 100).toFixed(0)}</Text>
                    <Text style={style.title}>四级</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.push('OrderCount')
              }}
            >
              <View style={orderInfo.isFinance ? [style.item] : [global.hidden]}>
                <View style={[style.header, { backgroundColor: '#058A88' }, global.flex, global.jBetween]}>
                  <Text style={style.theme}>我邀请的订单</Text>
                  <Text style={style.time}>{moment().format('YYYY年MM月')}</Text>
                </View>
                <View style={[style.detail, global.flex, global.aCenter, global.jBetween]}>
                  <View style={style.detail}>
                    <View>
                      <Text style={style.desc}>{orderInfo.total}</Text>
                      <Text style={style.title}>订单数</Text>
                    </View>
                  </View>
                  <View style={style.detail}>
                    <Text style={style.desc}>{orderInfo.firstLevelCount}</Text>
                    <Text style={style.title}>一级</Text>
                  </View>
                  <View style={style.detail}>
                    <Text style={style.desc}>{orderInfo.secondLevelCount}</Text>
                    <Text style={style.title}>二级</Text>
                  </View>
                  <View style={style.detail}>
                    <Text style={style.desc}>{orderInfo.thirdLevelCount}</Text>
                    <Text style={style.title}>三级</Text>
                  </View>
                  <View style={style.detail}>
                    <Text style={style.desc}>{orderInfo.fourthLevelCount}</Text>
                    <Text style={style.title}>四级</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </>
    )
  }
}
