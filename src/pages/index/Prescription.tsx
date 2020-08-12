import * as userAction from '@/redux/actions/user'
import { AppState } from '@/redux/stores/store'
import pathMap from '@/routes/pathMap'
import { GENDER_ZH, PRESCRIPTION_STATUS, PRESCRIPTION_STATUS_ZH } from '@/services/doctor'
import { Icon, Toast, InputItem} from '@ant-design/react-native'
import userApi from '@api/user'
import { StackNavigationProp } from '@react-navigation/stack'
import gImg from '@utils/img'
import gStyle from '@utils/style'
import moment from 'moment'
import { Assign } from 'utility-types'
import React, { Component } from 'react'
import { Image, Text, View} from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
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
  prescriptionList: Assign<prescriptionItem, { hidden?: boolean }>[]
  search: string
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
  phone: string
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
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      search: '',
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
    console.log(1)
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
//   search=(val: string)=>{
//     if(!!val){
//       this.state.prescriptionList.map((item,index)=>{
//         if(item.phone.includes(val)){
// console.log(item.phone)
//         }
//       })
//       // this.setState({
//       //   prescriptionList: []
//       // })
//     }
//     else{
//       this.setState({
//         prescriptionList: 
//       })
//     }
//   }

  buildPrescriptionDom = (v:  Assign<prescriptionItem, { hidden?: boolean }>, k: number, showPayStatus = true): React.ReactChild => {
    if (v.hidden) {
      return null
    }
    return (
      <View
        key={k}
        style={style.prescriptionItem}
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
          <TouchableOpacity 
          style={[style.prescriptionItemHeaderRight, global.flex, global.alignItemsCenter]}
          onPress={() => this.props.navigation.push(pathMap.PrescriptionDetail, { prescriptionId: v.id })}
          >
            <Text style={[style.prescriptionItemHeaderRightTitle, global.fontSize14]}>查看详情</Text>
            <Icon name='right' style={[style.prescriptionItemHeaderRightIcon, global.fontSize14]} />
          </TouchableOpacity>
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
              <View style={global.flex}>
                <TouchableOpacity  
                style={style.paddRight}
                onPress={()=>{
                  this.props.navigation.navigate(pathMap.SquareRoot, {
                    mode: v.type,
                    prescriptionId: v.id,
                    status: true,
                  })
                }}
                >
                 <Text style={style.red}>再开一单</Text> 
                </TouchableOpacity >
                <Text style={[style.prescriptionItemDescriptionStatus, global.fontSize14]} numberOfLines={1}>
                  {PRESCRIPTION_STATUS_ZH[v.status]}
                </Text>
              </View>
              ) : null}
              
          </View>
        </View>
      </View>
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
            <InputItem
                  style={[style.searchTitle, global.fontSize14, global.fontStyle]}
                  clear
                  last
                  labelNumber={2}
                  value={this.state.search}
                  onChange={search => {
                    this.setState({
                      search,
                    })
                    let { prescriptionList } = this.state
                    if (search !== '') {
                      for (let patient of prescriptionList) {
                        if(!(patient.name.indexOf(search) < 0)){
                          patient.hidden = false
                        }else{
                          patient.hidden = patient.phone.indexOf(search) < 0
                        }
                      }
                    } else {
                      prescriptionList = prescriptionList.map(v => {
                        v.hidden = false
                        return v
                      })
                    }

                    this.setState({
                      prescriptionList,
                    })
                    
                  }}
                  placeholder='搜索'
                >
                  <Icon name='search' style={[style.searchIcon, global.fontSize20]} />
                </InputItem>
            <View style={this.state.selectTab === 'all' ? style.prescriptionList : global.hidden}>
              <ScrollView style={style.tabScroll}>
                {this.state.prescriptionList.map((v: Assign<prescriptionItem, { hidden?: boolean }>, k: number) => this.buildPrescriptionDom(v, k))}
              </ScrollView>
            </View>
            <View style={this.state.selectTab === 'pay' ? style.prescriptionList : global.hidden}>
              <ScrollView style={style.tabScroll}>
                {this.state.prescriptionList
                  .filter(v => v.status === PRESCRIPTION_STATUS.completePay)
                  .map((v: Assign<prescriptionItem, { hidden?: boolean }>, k: number) => {
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
