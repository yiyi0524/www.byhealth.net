import Empty from '@/components/Empty'
import { AllScreenParam } from '@/routes/bottomNav'
import { InviteDoctorChildInfo, listChangeRecord, FundingType } from '@/services/myInvite'
import { TYPE } from '@/utils/constant'
import { Icon } from '@ant-design/react-native'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import global from '@styles/global'
import gImg from '@utils/img'
import gSass from '@utils/style'
import moment from 'moment'
import React, { Component } from 'react'
import { Image, Text, View } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
const style = gSass.myInvite.myInviteDoctorList
interface Props {
  navigation: StackNavigationProp<AllScreenParam, 'AddressBookGroup'>
  route: RouteProp<AllScreenParam, 'AddressBookGroup'>
}
interface State {
  // hasLoad: boolean
  date: string
  // total: number //总金额
  // list: InviteDoctorChildInfo[]
  list: FundingType[]
}
export default class FundingDetail extends Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      // hasLoad: false,
      date: moment().format('YYYY'),
      // total: 0,
      // list: [],
      list: [],
    }
  }
  componentDidMount() {
    this.init()
  }
  init = async () => {
    try {
      let { date } = this.state
      // total = 0
      let listInviteDoctorChildInfoTask = listChangeRecord({
        page: -1,
        limit: -1,
        filter: {
          ctime: {
            condition: TYPE.like,
            val: date,
          },
        },
      })
      let {
        data: { list },
      } = await listInviteDoctorChildInfoTask
      console.log(list)
      // for (let item of list) {
      //   total += item.firstLevelMoneyCount
      //   total += item.secondLevelMoneyCount
      //   total += item.thirdLevelMoneyCount
      // }
      // total = parseFloat((total / 100).toFixed(0))
      this.setState({
        // hasLoad: true,
        list,
        // total,
      })
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    let { list } = this.state
    // if (!this.state.hasLoad) {
    //   return (
    //     <View style={style.loading}>
    //       <View style={style.loadingPic}>
    //         <Image style={style.loadingImg} source={gImg.common.loading} />
    //       </View>
    //     </View>
    //   )
    // }
    return (
      <>
        <ScrollView style={style.main}>
          <View style={style.list}>
            {list.map((item, idx) => {
              return (
                <View
                  style={[
                    style.item,
                    idx % 2 !== 0 ? style.itemGray : style.item,
                    global.flex,
                    global.aCenter,
                    global.jBetween,
                  ]}
                  key={'item' + idx}
                >
                  <View style={style.title}>
                    <Text style={style.desc}>{item.category}</Text>
                  </View>
                  <Text
                    style={style.desc}
                    // onPress={() => {
                    //   this.props.navigation.push('InviteDoctorGradeList', {
                    //     doctorId: item.doctorId,
                    //     level: 1,
                    //     doctorName: item.name,
                    //   })
                    // }}
                  >
                    {moment(item.ctime).format('YYYY-MM-DD')}
                  </Text>
                  <Text
                    style={style.desc}
                    // onPress={() => {
                    //   this.props.navigation.push('InviteDoctorGradeList', {
                    //     doctorId: item.doctorId,
                    //     level: 2,
                    //     doctorName: item.name,
                    //   })
                    // }}
                  >
                    ￥{item.currBalance / 100}
                  </Text>
                  <Text
                    style={style.desc}
                    // onPress={() => {
                    //   this.props.navigation.push('InviteDoctorGradeList', {
                    //     doctorId: item.doctorId,
                    //     level: 3,
                    //     doctorName: item.name,
                    //   })
                    // }}
                  >
                    ￥{item.offset / 100}
                  </Text>
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
