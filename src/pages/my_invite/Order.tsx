import { listInviteDoctorOrder } from '@/services/myInvite'
import { Icon } from '@ant-design/react-native'
import sColor from '@styles/color'
import global from '@styles/global'
import gImg from '@utils/img'
import gSass from '@utils/style'
import moment from 'moment'
import React, { Component } from 'react'
import { Image, PixelRatio, Text, View } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { StackNavigationProp } from '@react-navigation/stack'
import Empty from '@/components/Empty'
const style = gSass.myInvite.order
interface Props {
  navigation: StackNavigationProp<any>
}
interface State {
  hasLoad: boolean
  date: string
  doctorId: number
  doctorName: string
  total: number
  list: any[]
}

export default class Order extends Component<Props, State> {
  static navigationOptions = () => ({
    title: '医师订单',
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
      <TouchableOpacity>{/* <Text style={[style.headerRight, global.fontSize14]}>保存</Text> */}</TouchableOpacity>
    ),
  })
  constructor(props: any) {
    super(props)
    this.state = this.getInitState(props)
  }
  getInitState = (props: Props): State => {
    let doctorId = 0,
      doctorName = '',
      date = moment().format('YYYY-MM')
    if (props.navigation.state.params) {
      doctorId = props.navigation.state.params.doctorId || 0
      doctorName = props.navigation.state.params.doctorName || ''
      date = props.navigation.state.params.date || moment().format('YYYY-MM')
    }
    return {
      hasLoad: false,
      total: 0,
      date,
      doctorId,
      doctorName,
      list: [],
    }
  }
  componentDidMount() {
    this.init()
  }
  init = async () => {
    try {
      let { date, doctorId } = this.state,
        total = 0
      let searchYear = parseInt(moment(date).format('YYYY'))
      let searchMonth = parseInt(moment(date).format('M'))
      let listInviteDoctorOrderTask = listInviteDoctorOrder({
        year: searchYear,
        month: searchMonth,
        doctorId,
      })
      let {
        data: { list },
      } = await listInviteDoctorOrderTask
      for (let item of list) {
        total += item.total_fee
      }
      total = parseFloat((total / 100).toFixed(0))
      console.log(searchYear, searchMonth, doctorId, list)
      this.setState({
        hasLoad: true,
        list,
        total,
      })
    } catch (err) {
      console.log(err)
    }
  }
  prevMonth = () => {
    let { date } = this.state
    date = moment(date)
      .subtract(1, 'month')
      .format('YYYY-MM')
    this.setState(
      {
        date,
      },
      this.init,
    )
  }
  nextMonth = () => {
    let { date } = this.state
    date = moment(date)
      .add(1, 'month')
      .format('YYYY-MM')
    let currDate = moment().format('YYYY-MM')
    if (date > currDate) {
      return false
    }
    this.setState(
      {
        date,
      },
      this.init,
    )
  }
  render() {
    let { list, total, doctorName, date } = this.state
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
        <ScrollView style={style.main}>
          <View style={style.header}>
            <View style={[style.yearPar, global.flex, global.aCenter, global.jBetween]}>
              <View style={[style.year, global.flex, global.aCenter]}>
                <TouchableOpacity style={[style.iconPar]} onPress={this.prevMonth}>
                  <Icon style={[style.icon, style.iconLeft]} name='left' />
                </TouchableOpacity>
                <Text style={style.time}>{moment(date).format('YYYY年MM月')}</Text>
                <TouchableOpacity style={style.iconPar} onPress={this.nextMonth}>
                  <Icon style={style.icon} name='right' />
                </TouchableOpacity>
              </View>
              <View style={[style.rightContent, global.flex, global.aCenter]}>
                <Text style={style.themeCount}>订单量</Text>
                <Text style={style.themeNum}>{list.length}</Text>
              </View>
            </View>
            <View style={[style.theme, style.themeHeight, global.flex, global.aCenter, global.jBetween]}>
              <Text style={style.themeTitle}>{doctorName}邀请的订单</Text>
              <View style={[style.rightContent, global.flex, global.aCenter]}>
                <Text style={style.themeCount}>总金额 (元)</Text>
                <Text style={style.themeNum}>{total}</Text>
              </View>
            </View>
          </View>
          <View style={style.list}>
            <View style={[style.item, style.itemGray, global.flex, global.aCenter, global.jBetween]}>
              <Text style={style.desc}>订单日期</Text>
              <Text style={style.desc}>订单编号</Text>
              <Text style={style.desc}>交易金额</Text>
            </View>
            {list.map((item, idx) => {
              return (
                <View style={[style.item, global.flex, global.aCenter, global.jBetween]} key={'item' + idx}>
                  <Text style={style.desc}>{moment(item.ctime).format('YYYY/MM/DD')}</Text>
                  <Text style={style.desc}>
                    {item.out_trade_no.length > 10 ? item.out_trade_no.substr(0, 10) + '...' : item.out_trade_no}
                  </Text>
                  <Text style={style.money}>￥{parseFloat((item.total_fee / 100).toFixed(0))}</Text>
                </View>
              )
            })}
            {list.length === 0 && <Empty />}
          </View>
        </ScrollView>
      </>
    )
  }
}
