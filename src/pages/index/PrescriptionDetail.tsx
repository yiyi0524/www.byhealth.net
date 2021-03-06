import global from '@/assets/styles/global'
import SendPrescribing from '@/components/SendPrescribing'
import SendPrescribingSuccessTips from '@/components/SendPrescribingSuccessTips'
import * as userAction from '@/redux/actions/user'
import { AppState } from '@/redux/stores/store'
import { AllScreenParam } from '@/routes/bottomNav'
import { windowWidth } from '@/services/api'
import doctor, { GENDER_ZH, PRESCRIPTION_STATUS } from '@/services/doctor'
import { EXTERN_CHINESE_DRUG_ID, ORAL_CHINESE_DRUG_ID, TOPICAL_CHINESE_DRUG_ID } from '@/services/drug'
import hospital from '@/services/hospital'
import { Drug, DrugInfo } from '@/services/patient'
import { Toast } from '@ant-design/react-native'
import DashLine from '@components/DashLine'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import sColor from '@styles/color'
import gImg from '@utils/img'
import gStyle from '@utils/style'
import pathMap from '@/routes/pathMap'
import React, { Component } from 'react'
import { Image, RefreshControl, ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Dispatch } from 'redux'
const style = gStyle.index.PrescriptionDetail
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
interface drugCategory {
  id: number
  name: string
  child: drugCategory[]
}
interface prescriptionDetail {
  type: 'wx' | 'phone' | 'common'
  doctor: {
    name: string
  }
  patient: {
    name: string
    phone: string
    gender: number
    yearAge: number
    monthAge: number
  }
  discrimination: string //辨病
  syndromeDifferentiation: string //辨证
  advice: string //医嘱
  drugList: Drug[]
  cost: {
    drugCost: number
    machiningCost: number
    doctorServiceCost: number
    expressCost: number
  }
  time: string
  status: number
  shippingNo: string
  storeName: string
  stateName: string
}
interface Props {
  navigation: StackNavigationProp<any>
  route: RouteProp<AllScreenParam, 'PrescriptionDetail'>
}

interface State {
  mode: 'wx' | 'phone' | 'common'
  hasLoad: boolean
  refreshing: boolean
  prescriptionId: number
  detail: prescriptionDetail
  drugCategoryList: drugCategory[]
  drugList: DrugInfo[]
}
@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class SquareRoot extends Component<
Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
State
> {
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      mode: this.props.route.params.mode,
      hasLoad: true,
      refreshing: false,
      prescriptionId: this.props.route.params.prescriptionId,
      detail: {
        doctor: {
          name: '',
        },
        patient: {
          name: '',
          phone: '',
          gender: 0,
          yearAge: 0,
          monthAge: 0,
        },
        type: 'common',
        discrimination: '', //辨病
        syndromeDifferentiation: '', //辨证
        advice: '', //医嘱
        drugList: [],
        cost: {
          drugCost: 0,
          machiningCost: 0,
          doctorServiceCost: 0,
          expressCost: 0,
        },
        time: '',
        status: 0,
        shippingNo: '',
        storeName: '',
        stateName: '',
      },
      drugCategoryList: [],
      drugList: [],
    }
  }
  componentDidMount() {
    this.init()
  }

  init = async () => {
    this.setState({
      hasLoad: false,
    })
    try {
      
      let {
        data: { detail },
      } = await doctor.getPrescriptionDetail({ prescriptionId: this.state.prescriptionId})
      console.log(detail)
      let {
        data: { list: drugCategoryList },
      } = await hospital.getDrugCategoryList({ page: -1, limit: -1 })
      let {
        data: { list: drugList },
      } = await hospital.getDrugList({ page: -1, limit: -1 })
      
      this.setState({
        hasLoad: true,
        detail,
        mode: detail.type,
        drugCategoryList,
        drugList,
      })
      
    } catch (err) {
      this.setState({
        hasLoad: true,
      })
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
    let { detail, mode } = this.state,
      status = detail.status,
      typeZh = '问诊开方',
      patientName = detail.patient.name,
      phone = detail.patient.phone
    if (detail.type === 'wx') {
      typeZh = '微信开方'
      if (patientName === '') {
        patientName = '未命名微信用户'
      }
    } else if (detail.type === 'phone') {
      typeZh = '手机开方'
      if (patientName === '') {
        patientName = '未命名手机用户'
      }
    }
    console.log(detail)
    return (
      <>
        <ScrollView
          style={style.main}
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
        >
          <View style={[style.steps, global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}>
            <View style={style.step}>
              <View style={style.activeNum}>
                <Text style={[style.activeNumDetail, global.fontSize12]}>1</Text>
              </View>
              <Text style={[style.activeStepTitle, global.fontSize12]}>已发送</Text>
            </View>
            <View style={style.activeLine} />
            <View style={style.step}>
              <View style={style.activeNum}>
                <Text style={[style.activeNumDetail, global.fontSize12]}>2</Text>
              </View>
              <Text style={[style.activeStepTitle, global.fontSize12]}>已划价</Text>
            </View>
            <View style={status === PRESCRIPTION_STATUS.completePay ? style.activeLine : style.line} />
            <View style={style.step}>
              <View style={[status === PRESCRIPTION_STATUS.completePay ? style.activeNum : style.num]}>
                <Text
                  style={[
                    status === PRESCRIPTION_STATUS.completePay ? style.activeNumDetail : style.numDetail,
                    global.fontSize12,
                  ]}
                >
                  3
                </Text>
              </View>
              <Text
                style={[
                  status === PRESCRIPTION_STATUS.completePay ? style.activeStepTitle : style.stepTitle,
                  global.fontSize12,
                ]}
              >
                已支付
              </Text>
            </View>
          </View>
          {/* 诊断 */}
          <View style={style.diagnosis}>
            <View style={[style.theme, global.flex, global.alignItemsCenter, global.justifyContentCenter]}>
              <View style={style.titleSpot} />
              <Text style={[style.title, global.fontSize14]}> 诊断 </Text>
              <View style={style.titleSpot} />
            </View>
            <View style={[style.diagnosisItem, global.flex, global.alignItemsCenter]}>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>[ 类型 ] </Text>
              <Text style={[style.diagnosisItemLineTitle, global.fontSize14]}>{typeZh}</Text>
            </View>
            <View style={[style.diagnosisItem, global.flex, global.alignItemsCenter]}>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>[ 患者姓名 ] </Text>
              <Text style={[style.diagnosisItemLineTitle, global.fontSize14]}>{patientName}</Text>
            </View>
            <View style={[style.diagnosisItem, global.flex, global.alignItemsCenter]}>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>[ 手机号 ] </Text>
              <Text style={[style.diagnosisItemLineTitle, global.fontSize14]}>{phone}</Text>
            </View>
            {detail.type === 'common' && (
              <View style={[style.diagnosisItem, global.flex, global.alignItemsCenter]}>
                <Text style={[style.diagnosisItemTitle, global.fontSize14]}>[ 年龄&性别 ]</Text>
                <Text style={[style.diagnosisItemLineTitle, global.fontSize14]}>
                  性别: {GENDER_ZH[detail.patient.gender]}
                </Text>
                <Text style={[style.diagnosisItemLineTitle, global.fontSize14]}>
                  {detail.patient.yearAge >= 3
                    ? detail.patient.yearAge + '岁'
                    : detail.patient.yearAge + '岁' + detail.patient.monthAge + '月'}
                </Text>
              </View>
            )}
            <View style={[style.diagnosisItem, global.flex, global.alignItemsCenter]}>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>[ 诊断 ] </Text>
              <Text style={[style.diagnosisItemLineTitle, global.fontSize14]}>
                {detail.discrimination}; {detail.syndromeDifferentiation}
              </Text>
            </View>
          </View>
          {mode === 'phone' && <SendPrescribingSuccessTips />}
          {mode === 'wx' && (
            <SendPrescribing
              doctorName={this.state.detail.doctor.name || ''}
              prescriptionId={this.state.prescriptionId}
            />
          )}
          {/* 开方 */}
          <View style={style.diagnosis}>
            <View style={[style.theme, global.flex, global.alignItemsCenter, global.justifyContentCenter]}>
              <View style={style.titleSpot} />
              <Text style={[style.title, global.fontSize14]}> 开方 </Text>
              <View style={style.titleSpot} />
            </View>
            <DashLine len={45} width={windowWidth - 46} backgroundColor={sColor.colorEee} />
            <View style={style.drugList}>
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
                  v.categoryId === TOPICAL_CHINESE_DRUG_ID ||
                  v.categoryId === EXTERN_CHINESE_DRUG_ID
                ) {
                  // 中药
                  return (
                    <View style={style.drugCategory} key={k}>
                      <Text style={[style.drugCategoryTitle, global.fontSize14]}>
                        {categoryName}-{detail.stateName}-{detail.storeName} 共{v.list.length}味
                      </Text>
                      <View style={[global.flex, global.alignItemsCenter, global.flexWrap]}>
                        {v.list.map((v1, k1) => {
                          let drugName = '',
                            unit = ''
                          for (let drug of this.state.drugList) {
                            if (drug.id === v1.id) {
                              drugName = drug.name as string
                              unit = drug.unit as string
                            }
                          }
                          return (
                            <View style={[style.traditionalChineseMedicineItem, { marginLeft: 15 }]} key={k1}>
                              <Text style={[style.drugName, global.fontSize14]}>
                                {drugName}
                                {v1.type ? '(' + v1.type + ')' : ''} {v1.count} * {unit}
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
                  // 西药
                  <View style={style.drugCategoryItem} key={k}>
                    <View style={[]}>
                      <Text style={[style.drugItemLeftTitle, global.fontSize16]} numberOfLines={1}>
                        {categoryName} 共{v.list.length}味
                      </Text>
                      <View style={style.drugListFa}>
                        {/* // eslint-disable-next-line no-shadow // eslint-disable-next-line no-shadow */}
                        {v.list.map((v, k) => {
                          let drugItem = '',
                            unit = '',
                            standard = '',
                            price = 0,
                            manufacturer = ''
                          for (let v1 of this.state.drugList) {
                            if (v.id === v1.id) {
                              drugItem = v1.name || '未命名'
                              unit = v1.unit || '盒'
                              standard = v1.standard || '暂无地址'
                              price = v1.price || 0
                              manufacturer = v1.manufacturer || '暂无规格'
                            }
                          }
                          return (
                            <View key={k} style={style.drugItem}>
                              <View
                                style={[
                                  style.drugItemFa,
                                  global.flex,
                                  global.alignItemsCenter,
                                  global.justifyContentSpaceBetween,
                                ]}
                              >
                                <Text style={[style.drugItemTitle, global.fontSize14]} numberOfLines={1}>
                                  {drugItem}
                                </Text>
                                <Text style={[style.drugItemTitle, global.fontSize12]} numberOfLines={1}>
                                  {v.count} {unit}
                                </Text>
                              </View>
                              <View
                                style={[
                                  style.drugItemFa,
                                  global.flex,
                                  global.alignItemsCenter,
                                  global.justifyContentSpaceBetween,
                                ]}
                              >
                                <Text style={[style.drugItemDetail, global.fontSize14]} numberOfLines={1}>
                                  {standard}
                                </Text>
                                <Text style={[style.drugItemDetail, global.fontSize12]} numberOfLines={1}>
                                  {(price / 1000).toFixed(2)}元
                                </Text>
                              </View>
                              <Text style={[style.drugItemDetail, global.fontSize12]} numberOfLines={1}>
                                {manufacturer}
                              </Text>
                              <View style={[style.usageDosage, global.flex]}>
                                <Text style={[style.diagnosisItemTitle, global.fontSize14]}>用法用量</Text>
                                <Text style={[style.diagnosisItemDetail, global.fontSize14]}>{v.usage}</Text>
                              </View>
                            </View>
                          )
                        })}
                      </View>
                    </View>
                  </View>
                )
              })}
            </View>
          </View>
          {/* 选填 */}
          <View style={style.diagnosis}>
            <View style={[style.theme, global.flex, global.alignItemsCenter, global.justifyContentCenter]}>
              <View style={style.titleSpot} />
              <Text style={[style.title, global.fontSize14]}> 选填 </Text>
              <View style={style.titleSpot} />
            </View>
            <View style={[style.diagnosisItem, global.flex, global.alignItemsCenter]}>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>[ 医嘱提醒 ]</Text>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>{detail.advice}</Text>
              
            </View>
            <TouchableOpacity  
                style={style.paddRight}
                onPress={()=>{
                  this.props.navigation.navigate(pathMap.SquareRoot, {
                    mode: detail.type,
                    prescriptionId: this.state.prescriptionId,
                    status: true,
                  })
                }}
                >
                 <Text style={style.red}>再开一单</Text> 
                </TouchableOpacity >
          </View>
          {/* 明细 */}
          <View style={style.diagnosis}>
            <View style={[style.theme, global.flex, global.alignItemsCenter, global.justifyContentCenter]}>
              <View style={style.titleSpot} />
              <Text style={[style.title, global.fontSize14]}> 明细 </Text>
              <View style={style.titleSpot} />
            </View>
            <View
              style={[
                detail.status === PRESCRIPTION_STATUS.completePay ? style.diagnosisItem : global.hidden,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentSpaceBetween,
              ]}
            >
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>物流单号</Text>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>{detail.shippingNo}</Text>
            </View>
            <View
              style={[style.diagnosisItem, global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}
            >
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>药费</Text>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>
                ¥ {(detail.cost.drugCost / 100).toFixed(2)}
              </Text>
            </View>
            <View
              style={[style.diagnosisItem, global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}
            >
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>诊后管理费</Text>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>
                ¥ {(detail.cost.doctorServiceCost / 100).toFixed(2)}
              </Text>
            </View>
            {detail.cost.machiningCost > 0 && <View
              style={[style.diagnosisItem, global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}
            >
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>药品加工费</Text>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>
                ¥ {(detail.cost.machiningCost / 100).toFixed(2)}
              </Text>
            </View>}
            <View
              style={[style.diagnosisItem, global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}
            >
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>邮费</Text>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>
                ¥ {(detail.cost.expressCost / 100).toFixed(2)}
              </Text>
            </View>
            <DashLine len={45} width={windowWidth - 46} backgroundColor={sColor.colorEee} />
            <View
              style={[style.diagnosisItem, global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}
            >
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>总计</Text>
              <Text style={[style.diagnosisItemAll, global.fontSize15]}>
                ¥ {((detail.cost.doctorServiceCost + detail.cost.drugCost + detail.cost.machiningCost + detail.cost.expressCost) / 100).toFixed(2)}
              </Text>
            </View>
          </View>
        </ScrollView>
      </>
    )
  }
}
