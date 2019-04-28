import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import { Toast } from "@ant-design/react-native"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
import { Image, PixelRatio, RefreshControl, ScrollView, Text, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { NavigationScreenProp } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import patient, { medicalRecord } from "@/services/patient"
import hospital from "@/services/hospital"
import moment from "moment"
import { GENDER_ZH } from "@/services/doctor"
import { getPicFullUrl } from "@/utils/utils"
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
interface drugCategory {
  id: number
  unit: string
  name: string
}
interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  prescriptionId: number
  patientUid: number
  detail: medicalRecord
  drugCategoryList: drugCategory[]
  drugList: drugCategory[]
}

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class InquirySheet extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = () => ({
    title: "查看病历",
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
      alignItems: "center",
      justifyContent: "center",
      fontSize: 14,
      textAlign: "center",
    },
    headerRight: <TouchableOpacity />,
  })
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      prescriptionId: this.props.navigation.getParam("prescriptionId") || 0,
      patientUid: this.props.navigation.getParam("patientUid") || 0,
      detail: {
        doctor: {
          name: "",
        },
        patient: {
          name: "",
          avatar: {
            id: 0,
            title: "",
            url: "",
          },
          gender: 0,
          yearAge: 0,
          monthAge: 0,
        },
        discrimination: "", //辨病
        syndromeDifferentiation: "", //辩证
        drugList: [],
        time: "",
        cost: {
          totalFee: 0,
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
      <View style={style.detail}>
        <ScrollView
          style={style.main}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }>
          <View style={style.header}>
            <Text style={[style.doctorInfo, global.fontSize14]}>
              {moment(detail.time).format("YYYY" + "年" + "MM" + "月" + "DD" + "日" + " HH:mm")}{" "}
              {detail.doctor.name}医生
            </Text>
            <View style={[style.patient, global.flex, global.alignItemsCenter]}>
              <View style={style.avatarFa}>
                <Image
                  style={style.avatar}
                  source={
                    detail.patient.avatar.url
                      ? { uri: getPicFullUrl(detail.patient.avatar.url) }
                      : gImg.common.defaultAvatar
                  }
                />
              </View>
              <Text style={[style.patientName, global.fontSize14]}>{detail.patient.name}</Text>
              <Text style={[style.patientTitle, global.fontSize14]}>
                {GENDER_ZH[detail.patient.gender]}
              </Text>
              <Text style={[style.patientTitle, global.fontSize14]}>
                {detail.patient.yearAge >= 3
                  ? detail.patient.yearAge + "岁"
                  : detail.patient.yearAge + "岁" + detail.patient.monthAge + "月"}
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
                let categoryName = ""
                for (let category of this.state.drugCategoryList) {
                  if (category.id === v.categoryId) {
                    categoryName = category.name
                  }
                }
                return (
                  <View style={style.drugCategory} key={k}>
                    <Text style={[style.drugCategoryTitle, global.fontSize14]}>{categoryName}</Text>
                    <View style={style.drugList}>
                      {v.list.map((v1, k1) => {
                        let drugName = "",
                          unit = ""
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
                            <Text style={[style.drugDetail, global.fontSize14]}>
                              用法用量: {v1.usage}
                            </Text>
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
            <View
              style={[
                style.costItem,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentSpaceBetween,
              ]}>
              <Text style={[style.costTitle, global.fontSize14]}>药费</Text>
              <Text style={[style.costTitle, global.fontSize14]}>
                ¥{" "}
                {(
                  (detail.cost.totalFee - detail.cost.doctorServiceCost - detail.cost.expressCost) /
                  100
                ).toFixed(2)}
              </Text>
            </View>
            <View
              style={[
                style.costItem,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentSpaceBetween,
              ]}>
              <Text style={[style.costTitle, global.fontSize14]}>医生服务费</Text>
              <Text style={[style.costTitle, global.fontSize14]}>
                ¥ {(detail.cost.doctorServiceCost / 100).toFixed(2)}
              </Text>
            </View>
            <View
              style={[
                style.costItem,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentSpaceBetween,
              ]}>
              <Text style={[style.costTitle, global.fontSize14]}>邮费</Text>
              <Text style={[style.costTitle, global.fontSize14]}>
                ¥ {(detail.cost.expressCost / 100).toFixed(2)}
              </Text>
            </View>
            <View
              style={[
                style.costItem,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentSpaceBetween,
              ]}>
              <Text style={[style.costTitle, global.fontSize14]}>
                总计<Text style={[style.costDetail, global.fontSize12]}>(不含代煎)</Text>
              </Text>
              <Text style={[style.costTitle, global.fontSize14]}>
                ¥ {(detail.cost.totalFee / 100).toFixed(2)}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}
