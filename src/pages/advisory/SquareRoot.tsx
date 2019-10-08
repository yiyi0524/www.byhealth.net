import global from "@/assets/styles/global"
import { BASE_URL } from "@/config/api"
import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import api, { windowWidth } from "@/services/api"
import { addPrescription, AddPrescriptionParam, GENDER, GENDER_ZH } from "@/services/doctor"
import {
  EXTERN_CHINESE_DRUG_ID,
  ORAL_CHINESE_DRUG_ID,
  TOPICAL_CHINESE_DRUG_ID,
} from "@/services/drug"
import { getPatientInfo } from "@/services/patient"
import { getPersonalInfo } from "@/services/user"
import { getPicCdnUrl } from "@/utils/utils"
import { Icon, ImagePicker, InputItem, TextareaItem, Toast } from "@ant-design/react-native"
import hospital from "@api/hospital"
import DashLine from "@components/DashLine"
import Pharmacy, { CategoryItem } from "@components/Pharmacy"
import pathMap from "@routes/pathMap"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
import {
  Alert,
  DeviceEventEmitter,
  EmitterSubscription,
  Image,
  KeyboardAvoidingView,
  PixelRatio,
  Platform,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  NativeEventSubscription,
} from "react-native"
import { NavigationScreenProp, ScrollView } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { MsgType, Picture } from "./Chat"
import { CurrSetPrescription } from "@/redux/reducers/user"
import _ from "lodash"
const style = gStyle.advisory.SquareRoot

interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  // 是否为选择药房模式
  isSelectPharmacy: boolean
  // 是否为选择药品模式
  isSelectDrug: boolean
  //是否保存为模板
  isSaveToTpl: boolean
  tplName: string
  afterDiagnosisDrugMoney: string
  hasLoad: boolean
  refreshing: boolean
  // 药品价格
  drugMoney: number
  //剂量
  dose: string
  //每次几剂
  oneDose: string
  //一剂几次使用
  oneDoseUseCount: string
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
  // 剂量数
  doseCount?: number
  // 每日剂量数
  dailyDose?: number
  // 每剂分几次使用
  everyDoseUseCount?: number
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
  category_id?: number
}
const mapStateToProps = (state: AppState) => {
  return {
    isLogin: state.user.isLogin,
    name: state.user.name,
    currSetPrescription: state.user.currSetPrescription,
    uid: state.user.uid,
    ws: state.ws,
  }
}
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    login: (preload: userAction.UserInfo) => {
      dispatch(userAction.userLogin(preload))
    },
    saveCurrSetPrescription: (preload: CurrSetPrescription) => {
      dispatch(userAction.saveCurrSetPrescription(preload))
    },
    delCurrSetPrescription: () => {
      dispatch(userAction.delCurrSetPrescription())
    },
  }
}
// @ts-ignore
@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class SquareRoot extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = (opts: any) => {
    const { navigation } = opts
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
      headerLeft: (
        <View>
          <TouchableOpacity
            onPress={() => {
              Alert.alert("", "是否保存开方内容", [
                {
                  text: "否",
                  onPress: () => {
                    const delCurrSetPrescription = navigation.getParam("delCurrSetPrescription")
                    delCurrSetPrescription()
                    navigation.goBack()
                  },
                },
                {
                  text: "保存并返回",
                  onPress: () => {
                    let getState: () => State = navigation.getParam("getState")
                    let saveCurrSetPrescription: (
                      preload: CurrSetPrescription,
                    ) => void = navigation.getParam("saveCurrSetPrescription")
                    let state = getState()
                    const {
                      advice,
                      discrimination,
                      prescriptionDrugCategoryList,
                      serviceMoney,
                      syndromeDifferentiation,
                    } = state
                    saveCurrSetPrescription({
                      advice,
                      discrimination,
                      prescriptionDrugCategoryList,
                      serviceMoney,
                      syndromeDifferentiation,
                    })
                    navigation.goBack()
                  },
                },
              ])
            }}>
            <Text style={{ marginLeft: 10 }}>返回</Text>
          </TouchableOpacity>
        </View>
      ),
      headerRight: <Text />,
    }
  }
  listener?: EmitterSubscription
  hardwareBackPressListener?: NativeEventSubscription
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
      //是否保存为模板
      isSaveToTpl: false,
      tplName: "",
      afterDiagnosisDrugMoney: "",
      //剂量
      dose: "",
      //每次几剂
      oneDose: "",
      //一剂几次使用
      oneDoseUseCount: "",
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
    this.props.navigation.setParams({
      getState: () => this.state,
      saveCurrSetPrescription: this.props.saveCurrSetPrescription,
      delCurrSetPrescription: this.props.delCurrSetPrescription,
    })
    this.listener = DeviceEventEmitter.addListener(
      pathMap.SquareRoot + "Reload",
      (prescriptionDrugCategoryList: PrescriptionDrugCategory[]) => {
        this.setState({
          prescriptionDrugCategoryList,
        })
      },
    )
    this.hardwareBackPressListener = BackHandler.addEventListener(
      "hardwareBackPress",
      this.onHardwareBackPress,
    )
    this.init()
    this.initSavedPrescriptionInfo()
  }
  componentWillUnmount() {
    //移除监听
    if (this.listener) {
      this.listener.remove()
    }
    if (this.hardwareBackPressListener) {
      this.hardwareBackPressListener.remove()
    }
  }
  onHardwareBackPress = () => {
    const {
      advice,
      discrimination,
      prescriptionDrugCategoryList,
      serviceMoney,
      syndromeDifferentiation,
    } = this.state
    this.props.saveCurrSetPrescription({
      advice,
      discrimination,
      prescriptionDrugCategoryList,
      serviceMoney,
      syndromeDifferentiation,
    })
  }
  initSavedPrescriptionInfo = () => {
    const { currSetPrescription } = this.props
    if (currSetPrescription) {
      const {
        advice,
        discrimination,
        prescriptionDrugCategoryList,
        serviceMoney,
        syndromeDifferentiation,
      } = currSetPrescription
      this.setState({
        advice,
        discrimination,
        prescriptionDrugCategoryList,
        serviceMoney,
        syndromeDifferentiation,
      })
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
        hospitalMedicalRecordPicList[k].url = getPicCdnUrl(hospitalMedicalRecordPicList[k].url)
      }
      this.setState({
        hasLoad: true,
        pharmacy,
        patientInfo,
        percentageOfCommission: percentageOfCommission ? percentageOfCommission : 0,
        medicalRecordPicList: hospitalMedicalRecordPicList,
      })
    } catch (err) {
      console.log("发生了错误, ", err)
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
    const {
      patientInfo,
      prescriptionDrugCategoryList,
      isSaveToTpl,
      tplName,
      afterDiagnosisDrugMoney,
    } = this.state
    let drugMoney = 0
    for (let prescriptionDrugCategory of prescriptionDrugCategoryList) {
      // 某分类的药品总价
      let drugCategoryMoney = 0
      for (let prescriptionDrugInfo of prescriptionDrugCategory.drugList) {
        let {
          detail: { price },
          count,
        } = prescriptionDrugInfo
        drugCategoryMoney += (price / 1000) * count
      }
      // 如果为中药
      if (
        prescriptionDrugCategory.id === ORAL_CHINESE_DRUG_ID ||
        prescriptionDrugCategory.id === TOPICAL_CHINESE_DRUG_ID ||
        prescriptionDrugCategory.id === EXTERN_CHINESE_DRUG_ID
      ) {
        drugMoney += drugCategoryMoney * (prescriptionDrugCategory.doseCount || 1)
      } else {
        drugMoney += drugCategoryMoney
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
        <KeyboardAvoidingView
          enabled={Platform.OS !== "android"}
          behavior="padding"
          style={{ flex: 1 }}
          keyboardVerticalOffset={70}>
          <ScrollView
            keyboardShouldPersistTaps="always"
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
                  if (
                    category.id === ORAL_CHINESE_DRUG_ID ||
                    category.id === TOPICAL_CHINESE_DRUG_ID ||
                    category.id === EXTERN_CHINESE_DRUG_ID
                  ) {
                    /* 中药 */
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
                                  {drugInfo.count} * {drugInfo.detail.unit}
                                </Text>
                              </View>
                            )
                          })}
                        </View>
                        {/* 药剂和用法用量 */}
                        <View>
                          <View style={[style.dose, global.flex, global.alignItemsCenter]}>
                            <Text style={[style.doseTitle, global.fontSize14]}>共</Text>
                            <View style={style.doseInputFather}>
                              <InputItem
                                last
                                type="number"
                                style={style.doseInput}
                                placeholder="0"
                                value={
                                  !category.doseCount || category.doseCount === 0
                                    ? ""
                                    : category.doseCount + ""
                                }
                                onChange={val => {
                                  let { prescriptionDrugCategoryList } = this.state
                                  let doseCount: number | string = parseInt(val)
                                  if (isNaN(doseCount)) {
                                    doseCount = 0
                                  }
                                  if (
                                    category.dailyDose &&
                                    category.dailyDose > 0 &&
                                    doseCount < category.dailyDose
                                  ) {
                                    prescriptionDrugCategoryList[k].dailyDose = 0
                                    // return Toast.fail("剂量总数不能小于每日剂量数")
                                  }
                                  prescriptionDrugCategoryList[k].doseCount = doseCount
                                  this.setState({
                                    prescriptionDrugCategoryList,
                                  })
                                }}
                              />
                            </View>
                            <Text style={[style.doseTitle, global.fontSize14]}>剂, </Text>
                            <Text style={[style.doseTitle, global.fontSize14]}>每日</Text>
                            <View style={style.doseInputFather}>
                              <InputItem
                                last
                                style={style.doseInput}
                                placeholder="0"
                                type="number"
                                value={
                                  !category.dailyDose || category.dailyDose === 0
                                    ? ""
                                    : category.dailyDose + ""
                                }
                                onChange={val => {
                                  let { prescriptionDrugCategoryList } = this.state
                                  let dailyDose: number | string = parseInt(val)
                                  if (isNaN(dailyDose)) {
                                    dailyDose = 0
                                  }
                                  if (
                                    category.doseCount &&
                                    category.doseCount > 0 &&
                                    dailyDose > category.doseCount
                                  ) {
                                    return Toast.fail("每日剂量数不能大于剂量总数")
                                  }
                                  prescriptionDrugCategoryList[k].dailyDose = dailyDose
                                  this.setState({
                                    prescriptionDrugCategoryList,
                                  })
                                }}
                              />
                            </View>
                            <Text style={[style.doseTitle, global.fontSize14]}>剂</Text>
                          </View>
                          <View style={[global.flex, global.alignItemsCenter]}>
                            <Text style={[style.doseTitle, global.fontSize14]}>一剂分</Text>
                            <View style={style.doseInputFather}>
                              <InputItem
                                last
                                style={style.doseInput}
                                type="number"
                                placeholder="0"
                                value={
                                  !category.everyDoseUseCount || category.everyDoseUseCount === 0
                                    ? ""
                                    : category.everyDoseUseCount + ""
                                }
                                onChange={val => {
                                  let { prescriptionDrugCategoryList } = this.state
                                  let everyDoseUseCount: number | string = parseInt(val)
                                  if (isNaN(everyDoseUseCount)) {
                                    everyDoseUseCount = 0
                                  }
                                  prescriptionDrugCategoryList[
                                    k
                                  ].everyDoseUseCount = everyDoseUseCount
                                  this.setState({
                                    prescriptionDrugCategoryList,
                                  })
                                }}
                              />
                            </View>
                            <Text style={[style.doseTitle, global.fontSize14]}>次使用</Text>
                          </View>
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
                                      {((drugInfo.detail.price / 1000) * drugInfo.count).toFixed(2)}
                                      元
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
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    isSaveToTpl: !isSaveToTpl,
                    tplName: isSaveToTpl ? tplName : "",
                  })
                }}>
                <View style={[style.editDrug, global.flex, global.alignItemsCenter]}>
                  <Icon
                    style={[
                      style.editDrugIcon,
                      global.fontSize16,
                      isSaveToTpl ? style.important : style.saveTpl,
                    ]}
                    name="check-square"
                  />
                  <Text style={[isSaveToTpl ? style.important : style.saveTpl, global.fontSize14]}>
                    同时保存为模板
                  </Text>
                </View>
              </TouchableOpacity>
              <View
                style={[
                  isSaveToTpl ? style.tplName : global.hidden,
                  global.flex,
                  global.alignItemsCenter,
                ]}>
                <Text style={[style.tplTitle, global.fontSize14]}>模板名称</Text>
                <View style={style.name}>
                  <InputItem
                    clear
                    style={[global.fontSize14, style.input]}
                    placeholder="请输入模板名称"
                    value={tplName}
                    onChange={tplName => {
                      this.setState({
                        tplName,
                      })
                    }}
                  />
                </View>
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
              {/* 诊后药事管理费 */}
              <View
                style={[
                  style.diagnosisItem,
                  global.flex,
                  global.alignItemsCenter,
                  global.justifyContentSpaceBetween,
                ]}>
                <Text style={[style.diagnosisItemTitle, global.fontSize14]}>诊后药事管理费</Text>
                <View style={style.percentageOfCommission}>
                  <InputItem
                    type="number"
                    labelNumber={1}
                    style={style.percentageOfCommissionInput}
                    placeholder={"0"}
                    value={afterDiagnosisDrugMoney}
                    onChange={val => {
                      let afterDiagnosisDrugMoney: number | string = parseFloat(val)
                      if (isNaN(afterDiagnosisDrugMoney)) {
                        afterDiagnosisDrugMoney = ""
                      }
                      this.setState({
                        afterDiagnosisDrugMoney: afterDiagnosisDrugMoney + "",
                      })
                    }}
                    onBlur={() => {
                      if (afterDiagnosisDrugMoney === "") {
                        this.setState({
                          afterDiagnosisDrugMoney: afterDiagnosisDrugMoney + "",
                        })
                      }
                    }}>
                    %
                  </InputItem>
                </View>
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
                    type="number"
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
              isInSession
              closeChooseCategory={this.closeChooseCategory}
              prescriptionDrugCategoryList={this.state.prescriptionDrugCategoryList}
            />
          </View>
        </KeyboardAvoidingView>
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
      isSaveToTpl,
      tplName,
      afterDiagnosisDrugMoney,
    } = this.state
    if (discrimination === "") {
      return Toast.info("请输入辩病", 3)
    }
    if (syndromeDifferentiation === "") {
      return Toast.info("请输入辨证", 3)
    }
    if (prescriptionDrugCategoryList.length === 0) {
      return Toast.info("请选择药材", 3)
    }

    for (let category of prescriptionDrugCategoryList) {
      if (
        category.id === ORAL_CHINESE_DRUG_ID ||
        category.id === TOPICAL_CHINESE_DRUG_ID ||
        category.id === EXTERN_CHINESE_DRUG_ID
      ) {
        if (!category.doseCount || category.doseCount < 1) {
          return Toast.info("中药剂数必填", 2)
        }
        if (!category.dailyDose || category.dailyDose < 1) {
          return Toast.info("中药每日剂数必填", 2)
        }
        if (!category.everyDoseUseCount || category.everyDoseUseCount < 1) {
          return Toast.info("中药每剂分几次服用必填", 2)
        }
        if (category.dailyDose > category.doseCount) {
          return Toast.info("每日剂量数不能大于总剂量数", 1)
        }
      }
    }
    // todo 接口添加tplName(string)字段 诊后药事管理费(string)没有添加到接口中
    if (isSaveToTpl) {
      if (tplName === "") {
        return Toast.info("请输入模板名称", 3)
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
    if (isSaveToTpl) {
      args.tplName = _.trim(tplName)
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
        this.props.delCurrSetPrescription()
        this.props.navigation.goBack()
      })
      .catch(err => {
        console.log(err)
        Toast.fail("发送处方失败, 错误信息: " + err.msg || err)
      })
  }
}
