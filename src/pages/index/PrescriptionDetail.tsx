import global from "@/assets/styles/global"
import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import { windowWidth } from "@/services/api"
import doctor, {
  GENDER_ZH,
  squareRoot,
  prescriptionDetail,
  PRESCRIPTION_STATUS_ZH,
  PRESCRIPTION_STATUS,
} from "@/services/doctor"
import hospital from "@/services/hospital"
import { Toast } from "@ant-design/react-native"
import DashLine from "@components/DashLine"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
import { Image, PixelRatio, RefreshControl, Text, View } from "react-native"
import { NavigationScreenProp, ScrollView } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
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
}
interface Props {
  navigation: NavigationScreenProp<State>
}

interface State {
  hasLoad: boolean
  refreshing: boolean
  prescriptionId: number
  detail: prescriptionDetail
  drugCategoryList: drugCategory[]
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
      title: "开方详情",
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
        syndromeDifferentiation: "", //辩证
        advice: "", //医嘱
        drugList: [],
        cost: {
          drug: 0,
          management: 0,
        },
        time: "",
        status: 0,
      },
      drugCategoryList: [],
    }
  }
  componentDidMount() {
    this.init()
  }

  getDrugList = () => {}
  init = async () => {
    let {
      data: { detail },
    } = await doctor.getPrescriptionDetail({ prescriptionId: this.state.prescriptionId })
    let {
      data: { list: drugCategoryList },
    } = await hospital.getDrugCategoryList({ page: -1, limit: -1 })
    try {
      this.setState({
        hasLoad: true,
        detail,
        drugCategoryList,
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
    let { detail } = this.state,
      status = detail.status
    return (
      <>
        <ScrollView
          style={style.main}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }>
          <View
            style={[
              style.steps,
              global.flex,
              global.alignItemsCenter,
              global.justifyContentSpaceBetween,
            ]}>
            <View style={style.step}>
              <Text style={[style.activeNum, global.fontSize12]}>1</Text>
              <Text style={[style.activeStepTitle, global.fontSize12]}>已发送</Text>
            </View>
            <View style={style.line} />
            <View style={style.step}>
              <Text style={[style.activeNum, global.fontSize12]}>2</Text>
              <Text style={[style.activeStepTitle, global.fontSize12]}>已划价</Text>
            </View>
            <View
              style={status === PRESCRIPTION_STATUS.completePay ? style.activeLine : style.line}
            />
            <View style={style.step}>
              <Text
                style={[
                  status === PRESCRIPTION_STATUS.completePay ? style.activeNum : style.num,
                  global.fontSize12,
                ]}>
                3
              </Text>
              <Text
                style={[
                  status === PRESCRIPTION_STATUS.completePay
                    ? style.activeStepTitle
                    : style.stepTitle,
                  global.fontSize12,
                ]}>
                已支付
              </Text>
            </View>
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
            <View style={[style.diagnosisItem, global.flex, global.alignItemsCenter]}>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>[ 诊断 ] </Text>
              <Text style={[style.diagnosisItemLineTitle, global.fontSize14]}>
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
                }
                return (
                  <View style={style.drugCategoryItem} key={k}>
                    <View style={[]}>
                      <Text style={[style.drugItemLeftTitle, global.fontSize16]} numberOfLines={1}>
                        {categoryName}
                      </Text>
                      <View style={style.drugListFa}>
                        {v.list.map((v, k) => {
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
                                  {v.detail.name}
                                </Text>
                                <Text
                                  style={[style.drugItemTitle, global.fontSize12]}
                                  numberOfLines={1}>
                                  {v.count} {v.detail.unit}
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
                                  {v.detail.standard}
                                </Text>
                                <Text
                                  style={[style.drugItemDetail, global.fontSize12]}
                                  numberOfLines={1}>
                                  {(v.detail.price! / 100).toFixed(2)}元
                                </Text>
                              </View>
                              <Text
                                style={[style.drugItemDetail, global.fontSize12]}
                                numberOfLines={1}>
                                {v.detail.manufacturer}
                              </Text>
                              <View
                                style={[style.usageDosage, global.flex, global.alignItemsCenter]}>
                                <Text style={[style.diagnosisItemTitle, global.fontSize14]}>
                                  用法用量
                                </Text>
                                <Text style={[style.diagnosisItemTitle, global.fontSize14]}>
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
            <View style={[style.diagnosisItem, global.flex, global.alignItemsCenter]}>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>[ 医嘱提醒 ]</Text>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>多喝水</Text>
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
                ¥ {(detail.cost.drug / 100).toFixed(2)}
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
                ¥ {(detail.cost.management / 100).toFixed(2)}
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
                ¥ {((detail.cost.drug + detail.cost.management) / 100).toFixed(2)}
              </Text>
            </View>
          </View>
        </ScrollView>
      </>
    )
  }
}
