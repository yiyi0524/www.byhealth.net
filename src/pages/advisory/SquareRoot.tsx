import global from "@/assets/styles/global"
import { BASE_URL } from "@/config/api"
import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import api, { windowWidth } from "@/services/api"
import { addPrescription, GENDER, GENDER_ZH, AddPrescriptionParam } from "@/services/doctor"
import { getPatientInfo } from "@/services/patient"
import { getPersonalInfo } from "@/services/user"
import { getPicFullUrl } from "@/utils/utils"
import { Icon, ImagePicker, TextareaItem, Toast, InputItem } from "@ant-design/react-native"
import hospital from "@api/hospital"
import DashLine from "@components/DashLine"
import Pharmacy, { CategoryItem } from "@components/Pharmacy"
import pathMap from "@routes/pathMap"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
import {
  DeviceEventEmitter,
  EmitterSubscription,
  Image,
  PixelRatio,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { NavigationScreenProp, ScrollView } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { MsgType, Picture } from "./Chat"
const style = gStyle.advisory.SquareRoot
interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  // 是否为选择药房模式
  isSelectPharmacy: boolean
  // 是否为选择药品模式
  isSelectDrug: boolean
  hasLoad: boolean
  refreshing: boolean
  // 药品价格
  drugMoney: number
  // 服务费
  serviceMoney: string
  // 医生诊后管理费比率
  percentageOfCommission: number
  // 患者信息
  patientInfo: {
    uid: number
    name: string
    yearAge: number
    monthAge: number
    gender: number
  }
  // 辨病
  discrimination: string
  // 辩证
  syndromeDifferentiation: string
  // 实体医院病历id列表
  medicalRecordPicList: Picture[]
  // 医嘱
  advice: string
  // 药店
  pharmacy: {
    // 药品顶级分类列表
    categoryList: CategoryItem[]
    // 当前选中的id
    activeId: number
  }
  prescriptionDrugCategoryList: PrescriptionDrugCategory[]
}
/**
 * 处方中某个药品分类的药品集合
 */
export interface PrescriptionDrugCategory {
  id: number
  name: string
  drugList: PrescriptionDrugInfo[]
}
/**
 * 处方中某个药的信息
 */
export interface PrescriptionDrugInfo {
  id: number
  count: number
  detail: Drug
}
/**
 * 药品详情
 */
export interface Drug {
  id: number
  name: string
  unit: string
  price: number
  standard: string
  manufacturer: string
  signature: string
  ctime: string
}
const mapStateToProps = (state: AppState) => {
  return {
    isLogin: state.user.isLogin,
    name: state.user.name,
    uid: state.user.uid,
    ws: state.ws,
  }
}
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    login: (preload: userAction.UserInfo) => {
      dispatch(userAction.userLogin(preload))
    },
  }
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
      title: "在线开方",
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
  listener?: EmitterSubscription
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      isSelectPharmacy: false,
      isSelectDrug: false,
      drugMoney: 0,
      serviceMoney: "",
      percentageOfCommission: 0,
      pharmacy: {
        activeId: 0,
        categoryList: [],
      },
      patientInfo: {
        uid: 0,
        gender: GENDER.UNDEFINED,
        monthAge: 0,
        yearAge: 0,
        name: "",
      },
      discrimination: "",
      syndromeDifferentiation: "",
      medicalRecordPicList: [],
      advice: "",
      prescriptionDrugCategoryList: [],
    }
  }
  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener(
      pathMap.SquareRoot + "Reload",
      (prescriptionDrugCategoryList: PrescriptionDrugCategory[]) => {
        this.setState({
          prescriptionDrugCategoryList,
        })
      },
    )
    this.init()
  }
  componentWillUnmount() {
    //移除监听
    if (this.listener) {
      this.listener.remove()
    }
  }
  getDrugList = () => {}
  init = async () => {
    let patientUid = this.props.navigation.getParam("patientUid")
    try {
      let {
        data: { list: categoryList },
      } = await hospital.getDrugCategoryList({
        page: -1,
        limit: -1,
        filter: {},
      })
      let pharmacy = this.state.pharmacy
      pharmacy.categoryList = categoryList
      let { patientInfo } = this.state
      let {
        data: { yearAge, monthAge, name, gender, hospitalMedicalRecordPicList },
      } = await getPatientInfo({ uid: patientUid })
      let {
        data: {
          doctorInfo: { percentageOfCommission },
        },
      } = await getPersonalInfo()
      patientInfo = {
        uid: patientUid,
        monthAge,
        name,
        gender,
        yearAge,
      }
      if (!hospitalMedicalRecordPicList) {
        hospitalMedicalRecordPicList = []
      }
      for (let k in hospitalMedicalRecordPicList) {
        hospitalMedicalRecordPicList[k].url = getPicFullUrl(hospitalMedicalRecordPicList[k].url)
      }
      this.setState({
        hasLoad: true,
        pharmacy,
        patientInfo,
        percentageOfCommission: percentageOfCommission ? percentageOfCommission : 0,
        medicalRecordPicList: hospitalMedicalRecordPicList,
      })
    } catch (err) {
      console.log("发送了错误, ", err)
    }
  }
  onRefresh = () => {
    this.setState({ refreshing: true })
    Promise.all([this.init(), new Promise(s => setTimeout(s, 500))])
      .then(_ => {
        this.setState({ refreshing: false })
      })
      .catch(err => {
        this.setState({ refreshing: false })
        Toast.fail("刷新失败,错误信息: " + err.msg)
      })
  }
  handleFileChange = (medicalRecordPicList: any, operationType: string) => {
    if (operationType === "add") {
      api
        .uploadImg(medicalRecordPicList[medicalRecordPicList.length - 1])
        .then(json => {
          let medicalRecordPicList = this.state.medicalRecordPicList
          let picMode: Picture = { id: 0, title: "", url: "" }
          medicalRecordPicList.push(picMode)
          medicalRecordPicList[medicalRecordPicList.length - 1].url = BASE_URL + json.data.url
          medicalRecordPicList[medicalRecordPicList.length - 1].id = json.data.picId
          this.setState({
            medicalRecordPicList,
          })
        })
        .catch(err => {
          Toast.fail("上传失败, 错误原因: " + err.msg + ", 请重试", 3)
          console.log(err)
        })
    } else if (operationType === "remove") {
      this.setState({
        medicalRecordPicList,
      })
    }
  }
  chooseCategory = (id: number) => {
    let { pharmacy } = this.state
    pharmacy.activeId = id
    this.setState({ pharmacy })
  }
  closeChooseCategory = () => {
    this.setState({ isSelectPharmacy: false })
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
    const { patientInfo, prescriptionDrugCategoryList } = this.state
    let drugMoney = 0
    for (let prescriptionDrugCategory of prescriptionDrugCategoryList) {
      for (let prescriptionDrugInfo of prescriptionDrugCategory.drugList) {
        let {
          detail: { price },
          count,
        } = prescriptionDrugInfo
        drugMoney += (price / 1000) * count
      }
    }
    let calcServiceMoney = ((drugMoney * this.state.percentageOfCommission) / 100).toFixed(2),
      actuallyServiceMoney =
        this.state.serviceMoney === ""
          ? parseFloat(calcServiceMoney)
          : parseFloat(this.state.serviceMoney),
      totalMoney = (drugMoney + actuallyServiceMoney).toFixed(2)
    return (
      <>
        <ScrollView
          style={style.main}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }>
          <View style={style.prompt}>
            <Text style={[style.promptTitle, global.fontSize14]}>
              互联网诊疗仅适用常见病、慢性病复诊, 且您必须掌握患者病历,
              确定其在实体医疗机构有过同诊断。请勿为首诊、急重症患者在线诊疗。
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
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>患者信息</Text>
              <Text style={[style.diagnosisItemLineTitle, global.fontSize14]}>
                {patientInfo.name}
              </Text>
              <Text style={[style.diagnosisItemLineTitle, global.fontSize14]}>
                {GENDER_ZH[patientInfo.gender]}
              </Text>
              <Text style={[style.diagnosisItemLineTitle, global.fontSize14]}>
                {patientInfo.yearAge} 岁
              </Text>
            </View>
            <View style={[style.diagnosisItem, global.flex, global.alignItemsCenter]}>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>辨病</Text>
              <View style={style.diagnosisItemInput}>
                <TextareaItem
                  style={style.input}
                  autoHeight
                  value={this.state.discrimination}
                  onChange={discrimination => {
                    if (discrimination || discrimination === "") {
                      this.setState({
                        discrimination,
                      })
                    }
                  }}
                />
              </View>
            </View>
            <View style={[style.diagnosisItem, global.flex, global.alignItemsCenter]}>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>辩证</Text>
              <View style={style.diagnosisItemInput}>
                <TextareaItem
                  style={style.input}
                  autoHeight
                  value={this.state.syndromeDifferentiation}
                  onChange={syndromeDifferentiation => {
                    if (syndromeDifferentiation || syndromeDifferentiation === "") {
                      this.setState({
                        syndromeDifferentiation,
                      })
                    }
                  }}
                  // onBlur={this.saveTemp}
                />
              </View>
            </View>
            <View style={style.diagnosisPic}>
              <Text style={[style.diagnosisPicTitle, global.fontSize14]}>实体医疗机构病历</Text>
              <View style={style.diagnosisItemImg}>
                <ImagePicker
                  onChange={this.handleFileChange}
                  files={this.state.medicalRecordPicList}
                  // selectable={this.state.medicalRecordPicList.length < 9}
                  selectable={false}
                />
              </View>
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
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.push(pathMap.SelectPrescriptionTpl)
              }}>
              <View
                style={[
                  style.prescriptionTpl,
                  global.flex,
                  global.alignItemsCenter,
                  global.justifyContentSpaceBetween,
                ]}>
                <Text style={[global.fontSize14, style.prescriptionTplTitle]}>使用模板开方</Text>
                <Icon style={[style.prescriptionTplIcon, global.fontSize14]} name="right" />
              </View>
            </TouchableOpacity>
            <DashLine len={45} width={windowWidth - 46} backgroundColor={sColor.colorEee} />
            <View style={style.chooseCategoryDrugList}>
              {this.state.prescriptionDrugCategoryList.length === 0 ? (
                <Text style={[style.empty, global.fontSize14]}>暂无</Text>
              ) : null}
              {this.state.prescriptionDrugCategoryList.map((category, k) => {
                if (category.id === 1 || category.id === 2) {
                  {
                    /* 中药 */
                  }
                  return (
                    <View
                      key={k}
                      style={[
                        category.drugList.length !== 0 ? style.chooseCategoryItem : global.hidden,
                        style.traditionalChineseMedicine,
                      ]}>
                      <Text style={[style.drug, global.fontSize16]}>{category.name}</Text>
                      <View
                        style={[
                          style.chooseDrugList,
                          global.flex,
                          global.alignItemsCenter,
                          global.flexWrap,
                        ]}>
                        {category.drugList.map((drugInfo, k1) => {
                          return (
                            <View
                              style={[style.chooseDrugItem, global.flex, global.alignItemsCenter]}
                              key={k1}>
                              <Text
                                style={[style.chooseDrugTitle, global.fontSize14]}
                                numberOfLines={1}>
                                {drugInfo.detail.name}
                              </Text>
                              <Text style={[style.chooseDrugCount, global.fontSize14]}>
                                {drugInfo.count} {drugInfo.detail.unit}
                              </Text>
                            </View>
                          )
                        })}
                      </View>
                    </View>
                  )
                } else {
                  {
                    /* 西药 */
                  }
                  return (
                    <View
                      style={
                        category.drugList.length !== 0 ? style.chooseCategoryItem : global.hidden
                      }
                      key={k}>
                      <Text style={[style.drug, global.fontSize16]}>{category.name}</Text>
                      <View style={style.chooseDrugList}>
                        {category.drugList.map((drugInfo, k1) => {
                          return (
                            <View style={style.drugItem} key={k1}>
                              <View
                                style={[
                                  global.flex,
                                  global.alignItemsCenter,
                                  global.justifyContentSpaceBetween,
                                ]}>
                                <View style={style.drugItemLeft}>
                                  <Text
                                    style={[style.drugItemLeftTitle, global.fontSize14]}
                                    numberOfLines={1}>
                                    {drugInfo.detail.name || "未命名"}
                                  </Text>
                                  <Text
                                    style={[style.drugItemLeftDetail, global.fontSize12]}
                                    numberOfLines={1}>
                                    {drugInfo.detail.standard || "暂无规格"}
                                  </Text>
                                  <Text
                                    style={[style.drugItemLeftDetail, global.fontSize12]}
                                    numberOfLines={1}>
                                    {drugInfo.detail.manufacturer || "暂无厂商"}
                                  </Text>
                                </View>
                                <View style={style.drugItemRight}>
                                  <Text
                                    style={[style.drugItemLeftTitle, global.fontSize14]}
                                    numberOfLines={1}>
                                    {drugInfo.count}
                                    {drugInfo.detail.unit}
                                  </Text>
                                  <Text
                                    style={[style.drugItemLeftDetail, global.fontSize12]}
                                    numberOfLines={1}>
                                    {((drugInfo.detail.price / 1000) * drugInfo.count).toFixed(2)}元
                                  </Text>
                                </View>
                              </View>
                              <View
                                style={[style.usageDosage, global.flex, global.alignItemsCenter]}>
                                <Text style={[style.diagnosisItemTitle, global.fontSize14]}>
                                  用法用量
                                </Text>
                                <View style={style.diagnosisItemInput}>
                                  <TextareaItem
                                    style={style.input}
                                    autoHeight
                                    value={drugInfo.detail.signature}
                                    onChange={signature => {
                                      let { prescriptionDrugCategoryList } = this.state
                                      prescriptionDrugCategoryList[k].drugList[
                                        k1
                                      ].detail.signature = signature || ""
                                      this.setState({
                                        prescriptionDrugCategoryList,
                                      })
                                    }}
                                  />
                                </View>
                              </View>
                            </View>
                          )
                        })}
                      </View>
                    </View>
                  )
                }
              })}
            </View>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  isSelectPharmacy: true,
                })
              }}>
              <View style={[style.editDrug, global.flex, global.alignItemsCenter]}>
                <Icon
                  style={[style.editDrugIcon, style.important, global.fontSize16]}
                  name="form"
                />
                <Text style={[style.important, global.fontSize14]}>编辑药材</Text>
              </View>
            </TouchableOpacity>
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
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>医嘱提醒</Text>
              <View style={style.diagnosisItemInput}>
                <TextareaItem
                  style={style.input}
                  autoHeight
                  value={this.state.advice}
                  onChange={advice => {
                    if (advice || advice === "") {
                      this.setState({
                        advice,
                      })
                    }
                  }}
                  // onBlur={this.saveTemp}
                />
              </View>
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
                ¥ {drugMoney.toFixed(2)}
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
              <View style={style.percentageOfCommission}>
                <InputItem
                  labelNumber={1}
                  disabled={this.state.prescriptionDrugCategoryList.length === 0}
                  style={style.percentageOfCommissionInput}
                  placeholder={this.state.serviceMoney === "" ? calcServiceMoney : "0.00"}
                  value={this.state.serviceMoney}
                  onChange={val => {
                    let serviceMoney: number | string = parseFloat(val)
                    if (isNaN(serviceMoney)) {
                      serviceMoney = ""
                    }
                    this.setState({
                      serviceMoney: serviceMoney + "",
                    })
                  }}
                  onBlur={() => {
                    if (this.state.serviceMoney === "") {
                      this.setState({
                        serviceMoney: calcServiceMoney + "",
                      })
                    }
                  }}>
                  ¥
                </InputItem>
              </View>
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
              <Text style={[style.diagnosisItemAll, global.fontSize15]}>¥ {totalMoney}</Text>
            </View>
            <DashLine len={45} width={windowWidth - 46} backgroundColor={sColor.colorEee} />
          </View>
          <TouchableOpacity onPress={this.sendPrescriptionToUser}>
            <Text style={[style.sendPatient, global.fontSize14]}>发送给患者</Text>
          </TouchableOpacity>
        </ScrollView>
        {/* 选择药房 */}
        <View style={this.state.isSelectPharmacy ? style.selectPharmacy : global.hidden}>
          <Pharmacy
            navigation={this.props.navigation}
            categoryList={this.state.pharmacy.categoryList}
            activeId={this.state.pharmacy.activeId}
            chooseCategory={this.chooseCategory}
            closeChooseCategory={this.closeChooseCategory}
            prescriptionDrugCategoryList={this.state.prescriptionDrugCategoryList}
          />
        </View>
      </>
    )
  }
  /**
   * 发送处方给用户
   */
  sendPrescriptionToUser = () => {
    const {
      advice,
      discrimination,
      syndromeDifferentiation,
      serviceMoney,
      patientInfo: { uid: patientUid },
      prescriptionDrugCategoryList,
    } = this.state
    if (discrimination === "") {
      return Toast.info("请输入辨病", 3)
    }
    if (syndromeDifferentiation === "") {
      return Toast.info("请输入辨证", 3)
    }
    if (prescriptionDrugCategoryList.length === 0) {
      return Toast.info("请选择药材", 3)
    }
    let fmtDrugList: Record<number, { count: number; detail: Drug }> = {}
    for (let category of prescriptionDrugCategoryList) {
      for (let drugInfo of category.drugList) {
        fmtDrugList[drugInfo.id] = drugInfo
      }
    }

    let args: AddPrescriptionParam = {
      advice,
      discrimination,
      patientUid,
      syndromeDifferentiation,
      drugCategoryList: prescriptionDrugCategoryList,
    }
    if (serviceMoney !== "") {
      args.serviceMoney = parseFloat(serviceMoney) * 100
    }
    addPrescription(args)
      .then(json => {
        let prescriptionId = json.data.id
        this.props.ws.wsPost({
          url: "ws/sendPrescription",
          data: {
            type: MsgType.treatmentPlan,
            prescriptionId,
            patientUid,
          },
        })
        this.props.navigation.goBack()
      })
      .catch(err => {
        console.log(err)
        Toast.fail("发送处方失败, 错误信息: " + err.msg || err)
      })
  }
}
