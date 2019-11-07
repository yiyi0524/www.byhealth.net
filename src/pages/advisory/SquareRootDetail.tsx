import global from "@/assets/styles/global"
import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import { windowWidth } from "@/services/api"
import doctor, { GENDER_ZH, squareRoot } from "@/services/doctor"
import hospital from "@/services/hospital"
import { DrugInfo } from "@/services/patient"
import { Toast } from "@ant-design/react-native"
import DashLine from "@components/DashLine"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import moment from "moment"
import React, { Component } from "react"
import { Image, PixelRatio, RefreshControl, Text, View } from "react-native"
import { NavigationScreenProp, ScrollView } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import {
  ORAL_CHINESE_DRUG_ID,
  EXTERN_CHINESE_DRUG_ID,
  TOPICAL_CHINESE_DRUG_ID,
} from "@/services/drug"
const style = gStyle.advisory.SquareRootDetail
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
interface Props {
  navigation: NavigationScreenProp<State>
}

interface State {
  hasLoad: boolean
  refreshing: boolean
  prescriptionId: number
  detail: squareRoot
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
  static navigationOptions = () => {
    return {
      title: "查看整体治疗方案",
      headerStyle: {
        backgroundColor: sColor.white,
        height: 45,
        elevation: 0,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: sColor.colorEee,
      },
      headerTintColor: sColor.color333,
      headerTitleStyle: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        textAlign: "center",
      },
      headerRight: <Text />,
    }
  }
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      prescriptionId: this.props.navigation.getParam("prescriptionId"),
      detail: {
        doctor: {
          name: "",
        },
        patient: {
          name: "",
          gender: 0,
          yearAge: 0,
          monthAge: 0,
        },
        discrimination: "", //辨病
        syndromeDifferentiation: "", //辨证
        advice: "", //医嘱
        drugList: [],
        cost: {
          drugCost: 0,
          doctorServiceCost: 0,
          expressCost: 0,
        },
        time: "",
      },
      drugCategoryList: [],
      drugList: [],
    }
  }
  componentDidMount() {
    this.init()
  }

  getDrugList = () => {}
  init = async () => {
    try {
      let {
        data: { detail },
      } = await doctor.getSquareRoot({ prescriptionId: this.state.prescriptionId })
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
  onRefresh = () => {
    this.setState({ refreshing: true })
    Promise.all([this.init(), new Promise(s => setTimeout(s, 500))])
      .then(_ => {
        this.setState({ refreshing: false })
      })
      .catch(err => {
        Toast.fail("刷新失败,错误信息: " + err.msg)
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
      <>
        <ScrollView
          style={style.main}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }>
          <View style={style.prompt}>
            <Text style={[style.promptTitle, global.fontSize14]}>
              {moment(detail.time).format("YYYY" + "年" + "MM" + "月" + "DD" + "日" + "HH:mm")}
            </Text>
          </View>
          {/* 诊断 */}
          <View style={style.diagnosis}>
            <View
              style={[
                style.theme,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentCenter,
              ]}>
              <View style={style.titleSpot} />
              <Text style={[style.title, global.fontSize14]}> 诊断 </Text>
              <View style={style.titleSpot} />
            </View>
            <View style={[style.diagnosisItem, global.flex, global.alignItemsCenter]}>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>[ 患者信息 ]</Text>
              <Text style={[style.diagnosisItemLineTitle, global.fontSize14]}>
                {detail.patient.name}
              </Text>
              <Text style={[style.diagnosisItemLineTitle, global.fontSize14]}>
                {GENDER_ZH[detail.patient.gender]}
              </Text>
              <Text style={[style.diagnosisItemLineTitle, global.fontSize14]}>
                {detail.patient.yearAge >= 3
                  ? detail.patient.yearAge + "岁"
                  : detail.patient.yearAge + "岁" + detail.patient.monthAge + "月"}
              </Text>
            </View>
            <View style={[style.diagnosisItem, global.flex]}>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>[ 诊断 ] </Text>
              <Text style={[style.diagnosisItemDescription, global.fontSize14]}>
                {detail.discrimination}; {detail.syndromeDifferentiation}
              </Text>
            </View>
          </View>
          {/* 开方 */}
          <View style={style.diagnosis}>
            <View
              style={[
                style.theme,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentCenter,
              ]}>
              <View style={style.titleSpot} />
              <Text style={[style.title, global.fontSize14]}> 开方 </Text>
              <View style={style.titleSpot} />
            </View>
            <DashLine len={45} width={windowWidth - 46} backgroundColor={sColor.colorEee} />
            <Text style={[style.drug, global.fontSize24]}>R:</Text>
            <View style={style.drugList}>
              {detail.drugList.map((v, k) => {
                let categoryName = ""
                for (let v1 of this.state.drugCategoryList) {
                  if (v.categoryId === v1.id) {
                    categoryName = v1.name
                  }
                  if (v1.child.length > 0) {
                    for (let v2 of v1.child) {
                      if (v.categoryId === v2.id) {
                        categoryName = v2.name
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
                    <View style={style.drugCategoryItem} key={k}>
                      <View style={[]}>
                        <Text
                          style={[style.drugItemLeftTitle, global.fontSize16, { marginBottom: 8 }]}
                          numberOfLines={1}>
                          {categoryName}
                        </Text>
                        <View
                          style={[
                            style.drugListFa,
                            global.flex,
                            global.alignItemsCenter,
                            global.flexWrap,
                          ]}>
                          {v.list.map((v, k) => {
                            let drugItem = "",
                              unit = ""
                            for (let v1 of this.state.drugList) {
                              if (v.id === v1.id) {
                                drugItem = v1.name || "未命名"
                                unit = v1.unit || "盒"
                              }
                            }
                            return (
                              <View
                                key={k}
                                style={[
                                  style.drugItemFa,
                                  style.traditionalChineseMedicine,
                                  global.flex,
                                  global.alignItemsCenter,
                                  { marginRight: 15 },
                                ]}>
                                <Text
                                  style={[
                                    style.drugItemTitle,
                                    global.fontSize14,
                                    { marginRight: 5 },
                                  ]}>
                                  {drugItem}
                                </Text>
                                <Text style={[style.drugItemTitle, global.fontSize12]}>
                                  {v.count} * {unit}
                                </Text>
                              </View>
                            )
                          })}
                        </View>
                      </View>
                      <View
                        style={[style.dose, global.flex, global.alignItemsCenter, global.flexWrap]}>
                        <Text style={[style.doseTitle, global.fontSize14]}>共计</Text>
                        <Text style={[style.doseDetail, global.fontSize14]}>
                          {v.doseCount || 0}
                        </Text>
                        <Text style={[style.doseTitle, global.fontSize14]}>剂</Text>
                        <Text style={[style.doseTitle, global.fontSize14]}>, 每日</Text>
                        <Text style={[style.doseDetail, global.fontSize14]}>
                          {v.dailyDose || 0}
                        </Text>
                        <Text style={[style.doseTitle, global.fontSize14]}>剂, 一剂分</Text>
                        <Text style={[style.doseDetail, global.fontSize14]}>
                          {v.everyDoseUseCount || 0}
                        </Text>
                        <Text style={[style.doseTitle, global.fontSize14]}>次使用</Text>
                      </View>
                    </View>
                  )
                } else {
                  return (
                    <View style={style.drugCategoryItem} key={k}>
                      <View style={[]}>
                        <Text
                          style={[style.drugItemLeftTitle, global.fontSize16]}
                          numberOfLines={1}>
                          {categoryName}
                        </Text>
                        <View style={style.drugListFa}>
                          {v.list.map((v, k) => {
                            let drugItem = "",
                              unit = "",
                              standard = "",
                              price = 0,
                              manufacturer = ""
                            for (let v1 of this.state.drugList) {
                              if (v.id === v1.id) {
                                drugItem = v1.name || "未命名"
                                unit = v1.unit || "盒"
                                standard = v1.standard || "暂无地址"
                                price = v1.price || 0
                                manufacturer = v1.manufacturer || "暂无规格"
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
                                  ]}>
                                  <Text
                                    style={[style.drugItemTitle, global.fontSize14]}
                                    numberOfLines={1}>
                                    {drugItem}
                                  </Text>
                                  <Text
                                    style={[style.drugItemTitle, global.fontSize12]}
                                    numberOfLines={1}>
                                    {v.count} {unit}
                                  </Text>
                                </View>
                                <View
                                  style={[
                                    style.drugItemFa,
                                    global.flex,
                                    global.alignItemsCenter,
                                    global.justifyContentSpaceBetween,
                                  ]}>
                                  <Text
                                    style={[style.drugItemDetail, global.fontSize14]}
                                    numberOfLines={1}>
                                    {standard}
                                  </Text>
                                  <Text
                                    style={[style.drugItemDetail, global.fontSize12]}
                                    numberOfLines={1}>
                                    {((price / 1000) * v.count).toFixed(2)}元
                                  </Text>
                                </View>
                                <Text
                                  style={[style.drugItemDetail, global.fontSize12]}
                                  numberOfLines={1}>
                                  {manufacturer}
                                </Text>
                                <View style={[style.usageDosage, global.flex]}>
                                  <Text style={[style.diagnosisItemTitle, global.fontSize14]}>
                                    用法用量
                                  </Text>
                                  <Text style={[style.diagnosisItemDescription, global.fontSize14]}>
                                    {v.usage}
                                  </Text>
                                </View>
                              </View>
                            )
                          })}
                        </View>
                      </View>
                    </View>
                  )
                }
              })}
            </View>
          </View>
          {/* 选填 */}
          <View style={style.diagnosis}>
            <View
              style={[
                style.theme,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentCenter,
              ]}>
              <View style={style.titleSpot} />
              <Text style={[style.title, global.fontSize14]}> 选填 </Text>
              <View style={style.titleSpot} />
            </View>
            <View style={[style.diagnosisItem, global.flex]}>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>[ 医嘱提醒 ]</Text>
              <Text style={[style.diagnosisItemDescription, global.fontSize14]}>
                {detail.advice}
              </Text>
            </View>
          </View>
          {/* 明细 */}
          <View style={style.diagnosis}>
            <View
              style={[
                style.theme,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentCenter,
              ]}>
              <View style={style.titleSpot} />
              <Text style={[style.title, global.fontSize14]}> 明细 </Text>
              <View style={style.titleSpot} />
            </View>
            <View
              style={[
                style.diagnosisItem,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentSpaceBetween,
              ]}>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>药费</Text>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>
                ¥ {(detail.cost.drugCost / 100).toFixed(2)}
              </Text>
            </View>
            <View
              style={[
                style.diagnosisItem,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentSpaceBetween,
              ]}>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>诊后管理费</Text>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>
                ¥ {(detail.cost.doctorServiceCost / 100).toFixed(2)}
              </Text>
            </View>
            <View
              style={[
                style.diagnosisItem,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentSpaceBetween,
              ]}>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>邮费</Text>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>
                ¥ {(detail.cost.expressCost / 100).toFixed(2)}
              </Text>
            </View>
            <DashLine len={45} width={windowWidth - 46} backgroundColor={sColor.colorEee} />
            <View
              style={[
                style.diagnosisItem,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentSpaceBetween,
              ]}>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>
                总计
                <Text style={[style.diagnosisItemDetail, global.fontSize12]}>( 不含快递费 )</Text>
              </Text>
              <Text style={[style.diagnosisItemAll, global.fontSize15]}>
                ¥{" "}
                {(
                  (detail.cost.drugCost + detail.cost.doctorServiceCost + detail.cost.expressCost) /
                  100
                ).toFixed(2)}
              </Text>
            </View>
          </View>
          <View style={style.doctor}>
            <Text style={[style.doctorName, global.fontSize14]}>
              [ 医生签名 ] {detail.doctor.name}
            </Text>
          </View>
        </ScrollView>
      </>
    )
  }
}
