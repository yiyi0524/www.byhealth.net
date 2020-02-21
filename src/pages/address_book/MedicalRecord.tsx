import * as userAction from '@/redux/actions/user'
import { AppState } from '@/redux/stores/store'
import { AllScreenParam } from '@/routes/bottomNav'
import { GENDER_ZH } from '@/services/doctor'
import { EXTERN_CHINESE_DRUG_ID, ORAL_CHINESE_DRUG_ID, TOPICAL_CHINESE_DRUG_ID } from '@/services/drug'
import hospital from '@/services/hospital'
import patient, { medicalRecord } from '@/services/patient'
import { getPicCdnUrl } from '@/utils/utils'
import { Toast } from '@ant-design/react-native'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import gImg from '@utils/img'
import gStyle from '@utils/style'
import moment from 'moment'
import React, { Component } from 'react'
import { Image, RefreshControl, ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
const style = gStyle.addressBook.MedicalRecord
const global = gStyle.global

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
interface drugInfo {
  id: number
  unit: string
  name: string
}
interface drugCategory {
  id: number
  name: string
  child: drugCategory[]
}
interface Props {
  navigation: StackNavigationProp<any>
  route: RouteProp<AllScreenParam, 'MedicalRecord'>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  prescriptionId: number
  patientUid: number
  detail: medicalRecord
  drugCategoryList: drugCategory[]
  drugList: drugInfo[]
}

@connect(mapStateToProps, mapDispatchToProps)
export default class InquirySheet extends Component<
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
      prescriptionId: this.props.route.params.prescriptionId,
      patientUid: this.props.route.params.patientUid,
      detail: {
        doctor: {
          name: '',
        },
        patient: {
          name: '',
          avatar: {
            id: 0,
            title: '',
            url: '',
          },
          gender: 0,
          yearAge: 0,
          monthAge: 0,
        },
        discrimination: '', //辨病
        syndromeDifferentiation: '', //辨证
        drugList: [],
        time: '',
        cost: {
          drugCost: 0,
          doctorServiceCost: 0,
          expressCost: 0,
        },
      },
      drugCategoryList: [],
      drugList: [],
    }
  }
  init = async () => {
    try {
      let {
        data: { detail },
      } = await patient.getMedicalRecord({
        patientUid: this.state.patientUid,
        prescriptionId: this.state.prescriptionId,
      })
      let {
        data: { list: drugCategoryList },
      } = await hospital.getDrugCategoryList({ page: -1, limit: -1 })
      let {
        data: { list: drugList },
      } = await hospital.getDrugList({ page: -1, limit: -1 })
      this.setState({
        hasLoad: true,
        detail,
        drugCategoryList,
        drugList,
      })
    } catch (err) {
      console.log(err)
    }
  }
  componentDidMount() {
    this.init()
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
    let { detail } = this.state
    return (
      <View style={style.detail}>
        <ScrollView
          style={style.main}
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
        >
          <View style={style.header}>
            <Text style={[style.doctorInfo, global.fontSize14]}>
              {moment(detail.time).format('YYYY年MM月DD日 HH:mm')} {detail.doctor.name}
              医生
            </Text>
            <View style={[style.patient, global.flex, global.alignItemsCenter]}>
              <View style={style.avatarFa}>
                <Image
                  style={style.avatar}
                  source={
                    detail.patient.avatar.url
                      ? { uri: getPicCdnUrl(detail.patient.avatar.url, 'avatar') }
                      : gImg.common.defaultAvatar
                  }
                />
              </View>
              <Text style={[style.patientName, global.fontSize14]}>{detail.patient.name}</Text>
              <Text style={[style.patientTitle, global.fontSize14]}>{GENDER_ZH[detail.patient.gender]}</Text>
              <Text style={[style.patientTitle, global.fontSize14]}>
                {detail.patient.yearAge >= 3
                  ? detail.patient.yearAge + '岁'
                  : detail.patient.yearAge + '岁' + detail.patient.monthAge + '月'}
              </Text>
            </View>
          </View>
          <View style={style.diagnosis}>
            <Text style={[style.diagnosisTitle, global.fontSize15]}>[ 诊断 ]</Text>
            <Text style={[style.diagnosisDetail, global.fontSize14]}>
              {detail.discrimination}; {detail.syndromeDifferentiation}
            </Text>
          </View>
          <View style={style.diagnosis}>
            <Text style={[style.diagnosisTitle, global.fontSize15]}>[ 治疗 ]</Text>
            <View style={style.drug}>
              {detail.drugList.map((v, k) => {
                let categoryName = ''
                for (let category of this.state.drugCategoryList) {
                  if (category.id === v.categoryId) {
                    categoryName = category.name
                  }
                  if (category.child.length > 0) {
                    for (let v1 of category.child) {
                      if (v1.id === v.categoryId) {
                        categoryName = v1.name
                      }
                    }
                  }
                }
                if (
                  v.categoryId === ORAL_CHINESE_DRUG_ID ||
                  v.categoryId === EXTERN_CHINESE_DRUG_ID ||
                  v.categoryId === TOPICAL_CHINESE_DRUG_ID
                ) {
                  return (
                    <View style={style.drugCategory} key={k}>
                      <Text style={[style.drugCategoryTitle, global.fontSize14]}>
                        {categoryName} 共{v.list.length}味
                      </Text>
                      <View style={[style.drugList, global.flex, global.alignItemsCenter, global.flexWrap]}>
                        {v.list.map((v1, k1) => {
                          let drugName = '',
                            unit = ''
                          for (let drug of this.state.drugList) {
                            if (drug.id === v1.id) {
                              drugName = drug.name
                              unit = drug.unit
                            }
                          }
                          return (
                            <View style={[style.drugItem, { marginLeft: 15 }]} key={k1}>
                              <Text style={[style.drugName, global.fontSize14]}>
                                {drugName} {v1.count} {unit}
                              </Text>
                            </View>
                          )
                        })}
                      </View>
                      <View style={[style.dose, global.flex, global.alignItemsCenter, global.flexWrap]}>
                        <Text style={[style.doseTitle, global.fontSize14]}>共计</Text>
                        <Text style={[style.doseDetail, global.fontSize14]}>{v.doseCount || 0}</Text>
                        <Text style={[style.doseTitle, global.fontSize14]}>剂</Text>
                        <Text style={[style.doseTitle, global.fontSize14]}>, 每日</Text>
                        <Text style={[style.doseDetail, global.fontSize14]}>{v.dailyDose || 0}</Text>
                        <Text style={[style.doseTitle, global.fontSize14]}>剂, 一剂分</Text>
                        <Text style={[style.doseDetail, global.fontSize14]}>{v.everyDoseUseCount || 0}</Text>
                        <Text style={[style.doseTitle, global.fontSize14]}>次使用</Text>
                      </View>
                    </View>
                  )
                }
                return (
                  <View style={style.drugCategory} key={k}>
                    <Text style={[style.drugCategoryTitle, global.fontSize14]}>
                      {categoryName} 共{v.list.length}味
                    </Text>
                    <View style={[style.drugList, { marginLeft: 15 }]}>
                      {v.list.map((v1, k1) => {
                        let drugName = '',
                          unit = ''
                        for (let drug of this.state.drugList) {
                          if (drug.id === v1.id) {
                            drugName = drug.name
                            unit = drug.unit
                          }
                        }
                        return (
                          <View style={style.drugItem} key={k1}>
                            <Text style={[style.drugName, global.fontSize14]}>
                              {drugName}: {v1.count}
                              {unit}
                            </Text>
                            <Text style={[style.drugDetail, global.fontSize14]}>用法用量: {v1.usage}</Text>
                          </View>
                        )
                      })}
                    </View>
                  </View>
                )
              })}
            </View>
          </View>
          <View style={style.cost}>
            <Text style={[style.costTheme, global.fontSize15]}>[ 费用明细 ]</Text>
            <View style={[style.costItem, global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}>
              <Text style={[style.costTitle, global.fontSize14]}>药费</Text>
              <Text style={[style.costTitle, global.fontSize14]}>¥ {(detail.cost.drugCost / 100).toFixed(2)}</Text>
            </View>
            <View style={[style.costItem, global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}>
              <Text style={[style.costTitle, global.fontSize14]}>诊后管理费</Text>
              <Text style={[style.costTitle, global.fontSize14]}>
                ¥ {(detail.cost.doctorServiceCost / 100).toFixed(2)}
              </Text>
            </View>
            <View style={[style.costItem, global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}>
              <Text style={[style.costTitle, global.fontSize14]}>邮费</Text>
              <Text style={[style.costTitle, global.fontSize14]}>¥ {(detail.cost.expressCost / 100).toFixed(2)}</Text>
            </View>
            <View style={[style.costItem, global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}>
              <Text style={[style.costTitle, global.fontSize14]}>
                总计<Text style={[style.costDetail, global.fontSize12]}>(不含代煎)</Text>
              </Text>
              <Text style={[style.costTitle, global.fontSize14]}>
                ¥ {((detail.cost.drugCost + detail.cost.doctorServiceCost + detail.cost.expressCost) / 100).toFixed(2)}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}
