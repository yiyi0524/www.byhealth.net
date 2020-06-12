import global from '@/assets/styles/global'
import * as userAction from '@/redux/actions/user'
import { CurrSetPrescription } from '@/redux/reducers/user'
import { AppState } from '@/redux/stores/store'
import { AllScreenParam } from '@/routes/bottomNav'
import api, { windowWidth } from '@/services/api'
import { addPrescription, AddPrescriptionParam, GENDER, GENDER_ZH, PrescriptionTpl } from '@/services/doctor'
import { EXTERN_CHINESE_DRUG_ID, ORAL_CHINESE_DRUG_ID, TOPICAL_CHINESE_DRUG_ID } from '@/services/drug'
import { getLastPrescriptionInfo, getPatientInfo } from '@/services/patient'
import { getPersonalInfo } from '@/services/user'
import { getPicCdnUrl } from '@/utils/utils'
import { Icon, ImagePicker, InputItem, List, Picker, TextareaItem, Toast } from '@ant-design/react-native'
import hospital from '@api/hospital'
import DashLine from '@components/DashLine'
import Pharmacy, { CategoryItem } from '@components/Pharmacy'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import pathMap from '@routes/pathMap'
import sColor from '@styles/color'
import gImg from '@utils/img'
import gStyle from '@utils/style'
import _ from 'lodash'
import React, { Component } from 'react'
import {
  BackHandler,
  DeviceEventEmitter,
  EmitterSubscription,
  Image,
  KeyboardAvoidingView,
  NativeEventSubscription,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { MsgType, Picture } from './Chat'

const style = gStyle.advisory.SquareRoot

interface Props {
  navigation: StackNavigationProp<AllScreenParam, 'SquareRoot'>
  route: RouteProp<AllScreenParam, 'SquareRoot'>
}
export interface State {
  mode: 'wx' | 'phone' | 'common'
  // 是否为选择药房模式
  isSelectPharmacy: boolean
  // 是否为选择药品模式
  isSelectDrug: boolean
  //是否保存为模板
  isSaveToTpl: boolean
  tplName: string
  phone: string
  drugServiceMoney: string
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
  // 辨证
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
  patientName: string
  yearAge: string
  monthAge: string
  gender: number
  status: boolean
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
  type?: string
}
/**
 * 药品详情
 */
export interface Drug {
  id: number
  name: string
  unit: string
  price: number
  type?: number
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
    saveCurrSetPrescription: (preload: [number, CurrSetPrescription | null]) => {
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
  listener?: EmitterSubscription
  hardwareBackPressListener?: NativeEventSubscription
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    let mode = this.props.route.params.mode
    let prescription: PrescriptionTpl | null | undefined = this.props.route.params.prescription
    let prescriptionDrugCategoryList: PrescriptionDrugCategory[] = []
    if (mode === 'wx' && prescription) {
      let prescriptionCategory: PrescriptionDrugCategory = {
        id: prescription.categoryId,
        drugList: prescription.drugList,
        name: prescription.name,
      }
      if (
        prescription.categoryId === ORAL_CHINESE_DRUG_ID ||
        prescription.categoryId === EXTERN_CHINESE_DRUG_ID ||
        prescription.categoryId === TOPICAL_CHINESE_DRUG_ID
      ) {
        prescriptionCategory.doseCount = prescription.doseCount
        prescriptionCategory.dailyDose = prescription.dailyDose
        prescriptionCategory.everyDoseUseCount = prescription.everyDoseUseCount
      }
      prescriptionDrugCategoryList.push(prescriptionCategory)
    }
    return {
      mode,
      hasLoad: true,
      refreshing: false,
      isSelectPharmacy: false,
      isSelectDrug: false,
      //是否保存为模板
      isSaveToTpl: false,
      phone: '',
      tplName: '',
      drugServiceMoney: '',
      //剂量
      dose: '',
      //每次几剂
      oneDose: '',
      //一剂几次使用
      oneDoseUseCount: '',
      drugMoney: 0,
      serviceMoney: '',
      percentageOfCommission: 30,
      pharmacy: {
        activeId: 0,
        categoryList: [],
      },
      patientInfo: {
        uid: 0,
        gender: GENDER.MAN,
        monthAge: 0,
        yearAge: 0,
        name: '',
      },
      discrimination: '',
      syndromeDifferentiation: '',
      medicalRecordPicList: [],
      advice: '',
      prescriptionDrugCategoryList,
      patientName: '',
      gender: GENDER.MAN,
      monthAge: '',
      yearAge: '',
      status: true,
    }
  }
  async componentDidMount() {
    const { mode } = this.state
    this.props.navigation.setParams({
      getState: () => this.state,
      saveCurrSetPrescription: this.props.saveCurrSetPrescription,
      delCurrSetPrescription: this.props.delCurrSetPrescription,
    })
    await this.init()
    this.listener = DeviceEventEmitter.addListener(
      pathMap.SquareRoot + 'Reload',
      (prescriptionDrugCategoryList: PrescriptionDrugCategory[]) => {
        this.setState({
          prescriptionDrugCategoryList,
        })
      },
    )
    if (mode === 'common') {
      this.hardwareBackPressListener = BackHandler.addEventListener('hardwareBackPress', this.onHardwareBackPress)
    }
  }
  componentWillUnmount() {
    const { mode } = this.state
    //移除监听
    if (this.listener) {
      this.listener.remove()
    }
    if (mode === 'common' && this.hardwareBackPressListener) {
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
      mode,
    } = this.state
    if (mode !== 'common') {
      return
    }
    let {
      patientInfo: { uid },
    } = this.state
    let preload: any = {
      [uid]: {
        advice,
        discrimination,
        prescriptionDrugCategoryList,
        serviceMoney,
        syndromeDifferentiation,
      },
    }
    this.props.saveCurrSetPrescription(preload)
  }
  initLastPrescriptionInfo = async () => {
    let patientUid = this.props.route.params.patientUid as number
    try {
      const {
        data: { detail: prescriptionDrugCategoryList },
      } = await getLastPrescriptionInfo({ patientUid })
      if (prescriptionDrugCategoryList) {
        this.setState({
          prescriptionDrugCategoryList,
        })
      }
    } catch (e) {
      console.log(e)
    }
  }
  initSavedPrescriptionInfo = () => {
    const { currSetPrescription } = this.props
    let {
      patientInfo: { uid },
    } = this.state
    if (uid in currSetPrescription && currSetPrescription[uid] !== null) {
      const {
        advice,
        discrimination,
        prescriptionDrugCategoryList,
        serviceMoney,
        syndromeDifferentiation,
      } = currSetPrescription[uid] as CurrSetPrescription
      this.setState({
        advice,
        discrimination,
        prescriptionDrugCategoryList,
        serviceMoney,
        syndromeDifferentiation,
      })
    }
  }
  init = async () => {
    let { patientInfo, mode } = this.state
    let {
      data: { list: categoryList },
    } = await hospital.getDrugCategoryList({
      page: -1,
      limit: -1,
      filter: {},
    })
    let pharmacy = this.state.pharmacy
    pharmacy.categoryList = categoryList
    this.setState({
      status: true,
      pharmacy,
    })
    if (mode === 'phone') {
      let phone = this.props.route.params.phone as string
      this.setState({
        phone,
      })
    }
    if (mode !== 'common') {
      return
    }

    let patientUid = this.props.route.params.patientUid as number
    try {
      this.setState({
        hasLoad: false,
      })
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
        if (hospitalMedicalRecordPicList.hasOwnProperty(k)) {
          hospitalMedicalRecordPicList[k].url = getPicCdnUrl(hospitalMedicalRecordPicList[k].url, 'avatar')
        }
      }
      this.setState({
        hasLoad: true,
        patientInfo,
        percentageOfCommission: percentageOfCommission ? percentageOfCommission : 0,
        medicalRecordPicList: hospitalMedicalRecordPicList,
      })
      if (patientUid in this.props.currSetPrescription) {
        console.log('正在初始化redux处方信息')
        this.initSavedPrescriptionInfo()
      } else {
        console.log('正在初始化上次处方信息')
        this.initLastPrescriptionInfo()
      }
    } catch (err) {
      console.log('发生了错误, ', err)
    }
  }
  onRefresh = () => {
    this.setState({ refreshing: true })
    Promise.all([this.init(), new Promise(s => setTimeout(s, 500))])
      .then(() => {
        this.setState({ refreshing: false })
      })
      .catch(err => {
        this.setState({ refreshing: false })
        Toast.fail('刷新失败,错误信息: ' + err.msg)
      })
  }
  handleFileChange = (medicalRecordPicList: any, operationType: string) => {
    if (operationType === 'add') {
      api
        .uploadImg(medicalRecordPicList[medicalRecordPicList.length - 1])
        .then(json => {
          // eslint-disable-next-line no-shadow
          let medicalRecordPicList = this.state.medicalRecordPicList
          let picMode: Picture = { id: 0, title: '', url: '' }
          medicalRecordPicList.push(picMode)
          medicalRecordPicList[medicalRecordPicList.length - 1].url = URL.createObjectURL(
            medicalRecordPicList[medicalRecordPicList.length - 1],
          )
          medicalRecordPicList[medicalRecordPicList.length - 1].id = json.data.picId
          this.setState({
            medicalRecordPicList,
          })
        })
        .catch(err => {
          Toast.fail('上传失败, 错误原因: ' + err.msg + ', 请重试', 3)
          console.log(err)
        })
    } else if (operationType === 'remove') {
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
  // eslint-disable-next-line complexity
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
      drugServiceMoney,
      mode,
      phone,
      gender,
      monthAge,
      yearAge,
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
        this.state.serviceMoney === '' ? parseFloat(calcServiceMoney) : parseFloat(this.state.serviceMoney),
      totalMoney = (drugMoney + actuallyServiceMoney).toFixed(2)
    let patientName: string = ''
    if (mode === 'common') {
      patientName = patientInfo.name
    } else if (mode === 'wx') {
      patientName = '微信用户'
    } else if (mode === 'phone') {
      patientName = '手机用户'
    }
    return (
      <>
        <KeyboardAvoidingView
          enabled={Platform.OS !== 'android'}
          behavior='padding'
          style={{ flex: 1 }}
          keyboardVerticalOffset={70}
        >
          <ScrollView
            // keyboardShouldPersistTaps="always"
            style={style.main}
            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
          >
            <View style={style.prompt}>
              <Text style={[style.promptTitle, global.fontSize14]}>
                互联网诊疗仅适用常见病、慢性病复诊, 且您必须掌握患者病历,
                确定其在实体医疗机构有过同诊断。请勿为首诊、急重症患者在线诊疗。
              </Text>
            </View>
            {/* 诊断 */}
            <View style={style.diagnosis}>
              <View style={[style.theme, global.flex, global.alignItemsCenter, global.justifyContentCenter]}>
                <View style={style.titleSpot} />
                <Text style={[style.title, global.fontSize14]}> 诊断 </Text>
                <View style={style.titleSpot} />
              </View>
              <View style={[style.diagnosisItem, global.flex, global.alignItemsCenter]}>
                <Text style={[style.diagnosisItemTitle, global.fontSize14]}>患者信息</Text>
                {mode !== 'wx' && mode !== 'phone' && (
                  <>
                    <Text style={[style.diagnosisItemLineTitle, global.fontSize14]}>{patientName}</Text>
                    <Text style={[style.diagnosisItemLineTitle, global.fontSize14]}>
                      {GENDER_ZH[patientInfo.gender]}
                    </Text>
                    <Text style={[style.diagnosisItemLineTitle, global.fontSize14]}>{patientInfo.yearAge} 岁</Text>
                  </>
                )}
              </View>
              {(mode === 'wx' || mode === 'phone') && (
                <>
                  <View style={[style.diagnosisItem, global.flex, global.alignItemsCenter]}>
                    <Text style={[style.diagnosisItemTitle, global.fontSize14]}>姓名</Text>
                    <View style={style.diagnosisItemInput}>
                      <InputItem
                        style={style.input}
                        value={this.state.patientName}
                        onChange={editPatientName => {
                          if (editPatientName || editPatientName === '') {
                            this.setState({
                              patientName: editPatientName,
                            })
                          }
                        }}
                      />
                    </View>
                  </View>
                  <View style={[style.diagnosisItem, global.flex, global.alignItemsCenter]}>
                    <Text style={[style.diagnosisItemTitle, global.fontSize14]}>年龄</Text>
                    <View style={[style.diagnosisItemInput, global.flex, global.alignItemsCenter]}>
                      <View style={{ flex: 1 }}>
                        <InputItem
                          style={[style.input]}
                          value={String(yearAge)}
                          placeholder='0'
                          onChange={val => {
                            // eslint-disable-next-line no-shadow
                            let age: number | string = parseFloat(val)
                            if (isNaN(age)) {
                              age = ''
                            }
                            this.setState({
                              yearAge: String(age),
                            })
                          }}
                          onBlur={() => {
                            if (yearAge === '') {
                              this.setState({
                                yearAge: String(yearAge),
                              })
                            }
                          }}
                        />
                      </View>
                      <Text>岁</Text>
                    </View>
                    <View style={[style.diagnosisItemInput, global.flex, global.alignItemsCenter]}>
                      <View style={{ flex: 1 }}>
                        <InputItem
                          style={style.input}
                          placeholder='0'
                          value={String(monthAge)}
                          onChange={val => {
                            // eslint-disable-next-line no-shadow
                            let age: number | string = parseFloat(val)
                            if (isNaN(age)) {
                              age = ''
                            }
                            if (age > 12) {
                              age = ''
                              Toast.info('月份不能大于12个月', 2)
                            }
                            this.setState({
                              monthAge: String(age),
                            })
                          }}
                          onBlur={() => {
                            if (monthAge === '') {
                              this.setState({
                                monthAge: String(monthAge),
                              })
                            }
                          }}
                        />
                      </View>
                      <Text>月</Text>
                    </View>
                  </View>
                  <View style={[style.diagnosisItem, global.flex, global.alignItemsCenter]}>
                    <Text style={[style.diagnosisItemTitle, global.fontSize14]}>性别</Text>
                    <View style={style.diagnosisItemInput}>
                      <Picker
                        style={style.input}
                        data={[
                          { value: GENDER.MAN, label: GENDER_ZH[GENDER.MAN] },
                          { value: GENDER.WOMAN, label: GENDER_ZH[GENDER.WOMAN] },
                        ]}
                        cols={1}
                        value={[gender]}
                        onChange={val => {
                          this.setState({ gender: val ? (val[0] as number) : 1 })
                        }}
                      >
                        <TouchableOpacity>
                          <View style={[global.flex, global.alignItemsCenter]}>
                            <Text
                              style={[
                                style.diagnosisItemTitle,
                                global.fontStyle,
                                global.fontSize14,
                                { flex: 1, textAlign: 'right' },
                              ]}
                            >
                              {gender === GENDER.MAN ? GENDER_ZH[GENDER.MAN] : GENDER_ZH[GENDER.WOMAN]}
                            </Text>
                            <Icon name='right' style={[global.fontSize16]} />
                          </View>
                        </TouchableOpacity>
                      </Picker>
                    </View>
                  </View>
                </>
              )}
              {mode === 'wx' && (
                <View style={[style.diagnosisItem, global.flex, global.alignItemsCenter]}>
                  <Text style={[style.diagnosisItemTitle, global.fontSize14]}>手机号码</Text>
                  <View style={style.diagnosisItemInput}>
                    <InputItem
                      style={style.input}
                      value={this.state.phone}
                      type='text'
                      onChange={editPhone => {
                        if (editPhone || editPhone === '') {
                          this.setState({
                            phone: editPhone,
                          })
                        }
                      }}
                      onBlur={() => {
                        if (phone) {
                          if (!/^1\d{10}$/.test(phone)) {
                            console.log('phone: ', phone)
                            Toast.info('手机号码格式错误', 1)
                            this.setState({
                              phone: '',
                            })
                          }
                        }
                      }}
                    />
                  </View>
                </View>
              )}
              {mode === 'phone' && (
                <View style={[style.diagnosisItem, global.flex, global.alignItemsCenter]}>
                  <Text style={[style.diagnosisItemTitle, global.fontSize14]}>手机</Text>
                  <View style={style.diagnosisItemInput}>
                    <InputItem
                      style={[style.input, global.fontSize14]}
                      placeholder='请输入手机号'
                      value={phone}
                      onChange={phone => {
                        this.setState({
                          phone,
                        })
                      }}
                    />
                  </View>
                  {/* <Text style={[style.diagnosisItemInput, global.fontSize14]}>{phone}</Text> */}
                </View>
              )}
              <View style={[style.diagnosisItem, global.flex, global.alignItemsCenter]}>
                <Text style={[style.diagnosisItemTitle, global.fontSize14]}>辨病</Text>
                <View style={style.diagnosisItemInput}>
                  <TextareaItem
                    style={style.input}
                    autoHeight
                    value={this.state.discrimination}
                    onChange={discrimination => {
                      if (discrimination || discrimination === '') {
                        this.setState({
                          discrimination,
                        })
                      }
                    }}
                  />
                </View>
              </View>
              <View style={[style.diagnosisItem, global.flex, global.alignItemsCenter]}>
                <Text style={[style.diagnosisItemTitle, global.fontSize14]}>辨证</Text>
                <View style={style.diagnosisItemInput}>
                  <TextareaItem
                    style={style.input}
                    autoHeight
                    value={this.state.syndromeDifferentiation}
                    onChange={syndromeDifferentiation => {
                      if (syndromeDifferentiation || syndromeDifferentiation === '') {
                        this.setState({
                          syndromeDifferentiation,
                        })
                      }
                    }}
                    // onBlur={this.saveTemp}
                  />
                </View>
              </View>
              {mode !== 'phone' && mode !== 'wx' && (
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
              )}
            </View>
            {/* 开方 */}
            <View style={style.diagnosis}>
              <View style={[style.theme, global.flex, global.alignItemsCenter, global.justifyContentCenter]}>
                <View style={style.titleSpot} />
                <Text style={[style.title, global.fontSize14]}> 开方 </Text>
                <View style={style.titleSpot} />
              </View>
              <DashLine len={45} width={windowWidth - 46} backgroundColor={sColor.colorEee} />
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.push('SelectPrescriptionTpl')
                }}
              >
                <View
                  style={[
                    style.prescriptionTpl,
                    global.flex,
                    global.alignItemsCenter,
                    global.justifyContentSpaceBetween,
                  ]}
                >
                  <Text style={[global.fontSize14, style.prescriptionTplTitle]}>使用模板开方</Text>
                  <Icon style={[style.prescriptionTplIcon, global.fontSize14]} name='right' />
                </View>
              </TouchableOpacity>
              <DashLine len={45} width={windowWidth - 46} backgroundColor={sColor.colorEee} />
              <View style={style.chooseCategoryDrugList}>
                {this.state.prescriptionDrugCategoryList.length === 0 ? (
                  <Text style={[style.empty, global.fontSize14]}>暂无</Text>
                ) : null}
                {this.state.prescriptionDrugCategoryList.map((category, k) => {
                  let gram = 0
                  for (let item of category.drugList) {
                    let g = item.detail.unit.match(/(\d+)[g克]/)
                    if (g && g[1] && !isNaN(parseFloat(g[1]))) {
                      gram += item.count + parseFloat(g[1])
                    } else {
                      gram += item.count
                    }
                  }
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
                        ]}
                      >
                        <Text style={[style.drug, global.fontSize16]}>
                          {category.name} ({category.drugList.length}味)
                        </Text>
                        <View style={[style.chooseDrugList, global.flex, global.alignItemsCenter, global.flexWrap]}>
                          {category.drugList.map((drugInfo, k1) => {
                            return (
                              <View style={[style.chooseDrugItem, global.flex, global.alignItemsCenter]} key={k1}>
                                <TouchableOpacity
                                  onPress={() => {
                                    let prescriptionDrugCategoryList = this.state.prescriptionDrugCategoryList
                                    let activeDrugList = prescriptionDrugCategoryList[k].drugList
                                    activeDrugList.splice(k1, 1)
                                    this.setState({
                                      prescriptionDrugCategoryList,
                                    })
                                  }}
                                >
                                  <Icon name='minus-circle' style={[style.minusCircle, global.fontSize16]} />
                                </TouchableOpacity>
                                <Text style={[style.chooseDrugTitle, global.fontSize14]} numberOfLines={1}>
                                  {drugInfo.detail.name}
                                  {drugInfo.type ? '(' + drugInfo.type + ')' : ''}
                                </Text>
                                <Text style={[style.chooseDrugCount, global.fontSize14]}>
                                  {drugInfo.count} * {drugInfo.detail.unit}
                                </Text>
                              </View>
                            )
                          })}
                        </View>
                        <View style={[style.gram, global.flex, global.alignItemsCenter, global.justifyContentEnd]}>
                          <Text style={style.gramDesc}>
                            单剂 {gram} 克, 总计 {category.doseCount ? gram * category.doseCount : 0} 克
                          </Text>
                        </View>
                        {/* 药剂和用法用量 */}
                        <View>
                          <View style={[style.dose, global.flex, global.alignItemsCenter]}>
                            <Text style={[style.doseTitle, global.fontSize14]}>共</Text>
                            <View style={style.doseInputFather}>
                              <InputItem
                                last
                                type='number'
                                style={style.doseInput}
                                placeholder='0'
                                value={
                                  !category.doseCount || category.doseCount === 0 ? '' : String(category.doseCount)
                                }
                                onChange={val => {
                                  let doseCount: number | string = parseInt(val)
                                  if (isNaN(doseCount)) {
                                    doseCount = 0
                                  }
                                  if (category.dailyDose && category.dailyDose > 0 && doseCount < category.dailyDose) {
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
                                placeholder='0'
                                type='number'
                                value={
                                  !category.dailyDose || category.dailyDose === 0 ? '' : String(category.dailyDose)
                                }
                                onChange={val => {
                                  let dailyDose: number | string = parseInt(val)
                                  if (isNaN(dailyDose)) {
                                    dailyDose = 0
                                  }
                                  if (category.doseCount && category.doseCount > 0 && dailyDose > category.doseCount) {
                                    return Toast.fail('每日剂量数不能大于剂量总数')
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
                                type='number'
                                placeholder='0'
                                value={
                                  !category.everyDoseUseCount || category.everyDoseUseCount === 0
                                    ? ''
                                    : String(category.everyDoseUseCount)
                                }
                                onChange={val => {
                                  let everyDoseUseCount: number | string = parseInt(val)
                                  if (isNaN(everyDoseUseCount)) {
                                    everyDoseUseCount = 0
                                  }
                                  prescriptionDrugCategoryList[k].everyDoseUseCount = everyDoseUseCount
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
                  }
                  /* 西药 */
                  return (
                    <View style={category.drugList.length !== 0 ? style.chooseCategoryItem : global.hidden} key={k}>
                      <Text style={[style.drug, global.fontSize16]}>
                        {category.name} ({category.drugList.length}味)
                      </Text>
                      <View style={style.chooseDrugList}>
                        {category.drugList.map((drugInfo, k1) => {
                          return (
                            <View style={style.drugItem} key={k1}>
                              <View style={[global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}>
                                <View style={style.drugItemLeft}>
                                  <Text style={[style.drugItemLeftTitle, global.fontSize14]} numberOfLines={1}>
                                    {drugInfo.detail.name || '未命名'}
                                  </Text>
                                  <Text style={[style.drugItemLeftDetail, global.fontSize12]} numberOfLines={1}>
                                    {drugInfo.detail.standard || '暂无规格'}
                                  </Text>
                                  <Text style={[style.drugItemLeftDetail, global.fontSize12]} numberOfLines={1}>
                                    {drugInfo.detail.manufacturer || '暂无厂商'}
                                  </Text>
                                </View>
                                <View style={style.drugItemRight}>
                                  <Text style={[style.drugItemLeftTitle, global.fontSize14]} numberOfLines={1}>
                                    {drugInfo.count}
                                    {drugInfo.detail.unit}
                                  </Text>
                                  <Text style={[style.drugItemLeftDetail, global.fontSize12]} numberOfLines={1}>
                                    {((drugInfo.detail.price / 1000) * drugInfo.count).toFixed(2)}元
                                  </Text>
                                </View>
                              </View>
                              <View style={[style.usageDosage, global.flex, global.alignItemsCenter]}>
                                <Text style={[style.diagnosisItemTitle, global.fontSize14]}>用法用量</Text>
                                <View style={style.diagnosisItemInput}>
                                  <TextareaItem
                                    style={style.input}
                                    autoHeight
                                    value={drugInfo.detail.signature}
                                    onChange={signature => {
                                      prescriptionDrugCategoryList[k].drugList[k1].detail.signature = signature || ''
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
                })}
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    isSelectPharmacy: true,
                  })
                }}
              >
                <View style={[style.editDrug, global.flex, global.alignItemsCenter]}>
                  <Icon style={[style.editDrugIcon, style.important, global.fontSize16]} name='form' />
                  <Text style={[style.important, global.fontSize14]}>编辑药材</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    isSaveToTpl: !isSaveToTpl,
                    tplName: isSaveToTpl ? tplName : '',
                  })
                }}
              >
                <View style={[style.editDrug, global.flex, global.alignItemsCenter]}>
                  {isSaveToTpl ? (
                    <Icon style={[style.editDrugIcon, global.fontSize16, style.important]} name='check-square' />
                  ) : (
                    <Icon style={[style.editDrugIcon, global.fontSize16, style.saveTpl]} name='border' />
                  )}
                  <Text style={[style.important, global.fontSize14]}>同时保存为模板</Text>
                </View>
              </TouchableOpacity>
              <View style={[isSaveToTpl ? style.tplName : global.hidden, global.flex, global.alignItemsCenter]}>
                <Text style={[style.tplTitle, global.fontSize14]}>模板名称</Text>
                <View style={style.name}>
                  <InputItem
                    style={[global.fontSize14, style.input]}
                    placeholder='请输入模板名称'
                    value={tplName}
                    onChange={editTplName => {
                      this.setState({
                        tplName: editTplName,
                      })
                    }}
                  />
                </View>
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
                <Text style={[style.diagnosisItemTitle, global.fontSize14]}>医嘱提醒</Text>
                <View style={style.diagnosisItemInput}>
                  <TextareaItem
                    style={style.input}
                    autoHeight
                    value={this.state.advice}
                    onChange={advice => {
                      if (advice || advice === '') {
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
              <View style={[style.theme, global.flex, global.alignItemsCenter, global.justifyContentCenter]}>
                <View style={style.titleSpot} />
                <Text style={[style.title, global.fontSize14]}> 明细 </Text>
                <View style={style.titleSpot} />
              </View>
              <View
                style={[style.diagnosisItem, global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}
              >
                <Text style={[style.diagnosisItemTitle, global.fontSize14]}>药费</Text>
                <Text style={[style.diagnosisItemTitle, global.fontSize14]}>¥ {drugMoney.toFixed(2)}</Text>
              </View>
              <View
                style={[style.diagnosisItem, global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}
              >
                <Text style={[style.diagnosisItemTitle, global.fontSize14]}>药事服务费</Text>
                <View style={style.percentageOfCommission}>
                  <InputItem
                    type='number'
                    labelNumber={1}
                    disabled
                    // disabled={this.state.prescriptionDrugCategoryList.length === 0}
                    style={style.percentageOfCommissionInput}
                    placeholder={this.state.serviceMoney === '' ? calcServiceMoney : '0.00'}
                    value={this.state.serviceMoney}
                    onChange={val => {
                      let serviceMoney: number | string = parseFloat(val)
                      if (isNaN(serviceMoney)) {
                        serviceMoney = ''
                      }
                      this.setState({
                        serviceMoney: String(serviceMoney),
                      })
                    }}
                    onBlur={() => {
                      if (this.state.serviceMoney === '') {
                        this.setState({
                          serviceMoney: String(calcServiceMoney),
                        })
                      }
                    }}
                  >
                    ¥
                  </InputItem>
                </View>
              </View>
              {/* 诊后药事管理费 */}
              <View
                style={[style.diagnosisItem, global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}
              >
                <Text style={[style.diagnosisItemTitle, global.fontSize14]}>诊后管理费</Text>
                <View style={style.percentageOfCommission}>
                  <InputItem
                    type='number'
                    labelNumber={1}
                    style={style.percentageOfCommissionInput}
                    placeholder={'0'}
                    value={drugServiceMoney}
                    onChange={val => {
                      // eslint-disable-next-line no-shadow
                      let drugServiceMoney: number | string = parseFloat(val)
                      if (isNaN(drugServiceMoney)) {
                        drugServiceMoney = ''
                      }
                      this.setState({
                        drugServiceMoney: String(drugServiceMoney),
                      })
                    }}
                    onBlur={() => {
                      if (drugServiceMoney === '') {
                        this.setState({
                          drugServiceMoney: String(drugServiceMoney),
                        })
                      }
                    }}
                  >
                    ¥
                  </InputItem>
                </View>
              </View>
              <DashLine len={45} width={windowWidth - 46} backgroundColor={sColor.colorEee} />
              <View
                style={[style.diagnosisItem, global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}
              >
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
  // eslint-disable-next-line complexity
  sendPrescriptionToUser = () => {
    if (!this.state.status) {
      return true
    }
    this.setState({ status: false })
    const {
      mode,
      phone,
      advice,
      discrimination,
      syndromeDifferentiation,
      serviceMoney,
      drugServiceMoney,
      patientInfo: { uid: patientUid, name: patientName },
      prescriptionDrugCategoryList,
      isSaveToTpl,
      tplName,
      patientName: name,
      monthAge,
      yearAge,
      gender,
      // drugServiceMoney,
    } = this.state

    if (prescriptionDrugCategoryList.length === 0) {
      this.setState({ status: true })
      return Toast.info('请选择药材', 3)
    }

    for (let category of prescriptionDrugCategoryList) {
      if (
        category.id === ORAL_CHINESE_DRUG_ID ||
        category.id === TOPICAL_CHINESE_DRUG_ID ||
        category.id === EXTERN_CHINESE_DRUG_ID
      ) {
        if (!category.doseCount || category.doseCount < 1) {
          this.setState({ status: true })
          return Toast.info('中药剂数必填', 2)
        }
        if (!category.dailyDose || category.dailyDose < 1) {
          this.setState({ status: true })
          return Toast.info('中药每日剂数必填', 2)
        }
        if (!category.everyDoseUseCount || category.everyDoseUseCount < 1) {
          this.setState({ status: true })
          return Toast.info('中药每剂分几次服用必填', 2)
        }
        if (category.dailyDose > category.doseCount) {
          this.setState({ status: true })
          return Toast.info('每日剂量数不能大于总剂量数', 1)
        }
      }
    }
    if (isSaveToTpl) {
      if (tplName === '') {
        this.setState({ status: true })
        return Toast.info('请输入模板名称', 3)
      }
    }
    let args: AddPrescriptionParam = {
      mode,
      advice,
      discrimination,
      patientUid,
      syndromeDifferentiation,
      drugCategoryList: prescriptionDrugCategoryList,
    }
    if (mode === 'phone' || mode === 'wx') {
      // if (yearAge === '' || parseFloat(yearAge) === 0) {
      //   if (monthAge === '' || parseFloat(monthAge) === 0) {
      //     return Toast.info('请输入年龄', 3)
      //   }
      // }
      args.phone = phone
      args.patientName = name
      args.gender = gender
      args.yearAge = yearAge !== '' ? parseFloat(yearAge) : 0
      args.monthAge = monthAge !== '' ? parseFloat(monthAge) : 0
    }
    if (serviceMoney !== '') {
      args.serviceMoney = parseFloat(serviceMoney) * 100
    }
    if (drugServiceMoney !== '') {
      args.drugServiceMoney = parseFloat(drugServiceMoney) * 100
    }
    if (isSaveToTpl) {
      args.tplName = _.trim(tplName)
    }
    addPrescription(args)
      .then(json => {
        this.setState({ status: true })
        if (mode === 'phone' || mode === 'wx') {
          return this.props.navigation.navigate('PrescriptionDetail', {
            prescriptionId: json.data.id,
            mode,
          })
        }
        let prescriptionId = json.data.id
        this.props.ws.wsPost({
          url: 'ws/sendPrescription',
          data: {
            type: MsgType.treatmentPlan,
            prescriptionId,
            patientUid,
          },
        })
        this.props.delCurrSetPrescription()
        // this.props.navigation.goBack()
        this.props.navigation.navigate('AdvisoryChat', {
          patientUid,
          patientName,
        })
      })
      .catch(err => {
        console.log(err)
        this.setState({ status: true })
        Toast.fail('发送处方失败, 错误信息: ' + err.msg || err)
      })
  }
}
