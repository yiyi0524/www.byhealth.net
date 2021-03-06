import global from '@/assets/styles/global'
import * as userAction from '@/redux/actions/user'
import { CurrSetPrescription } from '@/redux/reducers/user'
import { AppState } from '@/redux/stores/store'
import { AllScreenParam } from '@/routes/bottomNav'
import api, { windowWidth } from '@/services/api'
import doctor, { addPrescription, AddPrescriptionParam, GENDER, GENDER_ZH, PrescriptionTpl } from '@/services/doctor'
import { EXTERN_CHINESE_DRUG_ID, ORAL_CHINESE_DRUG_ID, TOPICAL_CHINESE_DRUG_ID, getDetail } from '@/services/drug'
import { getLastPrescriptionInfo, getPatientInfo, Drug as DrugTwo } from '@/services/patient'
import { getPersonalInfo } from '@/services/user'
import { getPicCdnUrl } from '@/utils/utils'
import { Icon, ImagePicker, InputItem, Picker, TextareaItem, Toast } from '@ant-design/react-native'
import hospital from '@api/hospital'
import { TYPE } from '@/utils/constant'
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
    doctorServiceCost: number
    expressCost: number
  }
  time: string
  status: number
  shippingNo: string
}
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
  // 加工费
  processingFee: string
  //常用药
  popularDrugList: Drug[]
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
  pharmacyName: {
    id: number
    name: string
    drugType: number
    stateId: number
    state: string
    categoryName?: string
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
  filter: {}
  detail: prescriptionDetail
  NoMedicine: {
    id: number
    name: string
    price: number
    status: boolean
  }[]
  stateType: {
    status: boolean
    price: number
  }
  saveType: number
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
    saveCurrSetPrescriptionWx: (preload: [number, CurrSetPrescription | null]) => {
      dispatch(userAction.saveCurrSetPrescription(preload))
    },
    saveCurrSetPrescriptionPhone: (preload: [number, CurrSetPrescription | null]) => {
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
      processingFee: '',
      percentageOfCommission: 30,
      popularDrugList: [],
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
      pharmacyName: {
        id: 0,
        name: "",
        drugType: 0,
        stateId: 0,
        state: "",
        categoryName: '',
      },
      prescriptionDrugCategoryList,
      patientName: '',
      gender: GENDER.MAN,
      monthAge: '',
      yearAge: '',
      status: true,
      filter: {},
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
          doctorServiceCost: 0,
          expressCost: 0,
        },
        time: '',
        status: 0,
        shippingNo: '',
      },
      NoMedicine: [],
      stateType: {
        status: true,
        price: 0,
      },
      saveType: 0
    }
  }
  async componentDidMount() {
    this.props.navigation.setParams({
      getState: () => this.state,
      saveCurrSetPrescription: this.props.saveCurrSetPrescription,
      saveCurrSetPrescriptionWx: this.props.saveCurrSetPrescriptionWx,
      saveCurrSetPrescriptionPhone: this.props.saveCurrSetPrescriptionPhone,
      delCurrSetPrescription: this.props.delCurrSetPrescription,
    })
    await this.init()
    this.listener = DeviceEventEmitter.addListener(
      pathMap.SquareRoot + 'Reload',
      (prescriptionDrugCategoryList: PrescriptionDrugCategory[]) => {
        this.setState({
          prescriptionDrugCategoryList,
        }, this.store)
      },
    )

    this.listener = DeviceEventEmitter.addListener(
      pathMap.SquareRoot + 'State',
      (state: {
        id: number,
        name: string,
        drugType: number,
        stateId: number
        state: string,
        categoryName: string
      }) => {
        this.setState({
          pharmacyName: state,
        }, this.store)
      },
    )
    this.hardwareBackPressListener = BackHandler.addEventListener('hardwareBackPress', this.onHardwareBackPress)
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
  store = async () => {
    let { prescriptionDrugCategoryList, pharmacyName } = this.state,
      drug: number[] = [];
    if (prescriptionDrugCategoryList.length !== 0) {
      for (let categoryList of prescriptionDrugCategoryList[0].drugList) {
        drug.push(categoryList.id)
      }
    }
    let {
      data: { list: storeList },
    } = await hospital.getStoreDrug({
      page: -1,
      limit: -1,
      filter: {
        storeId: {
          condition: TYPE.eq,
          val: pharmacyName.id,
        },
        stateId: {
          condition: TYPE.eq,
          val: pharmacyName.stateId,
        },
        drug: {
          condition: TYPE.in,
          val: drug,
        }
      },
    })
    this.setState({
      NoMedicine: storeList
    })


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
    let preload: any = {}
    let {
      patientInfo: { uid },
    } = this.state
    switch (mode) {
      case 'common':
        preload = {
          [uid]: {
            advice,
            discrimination,
            prescriptionDrugCategoryList,
            serviceMoney,
            syndromeDifferentiation,
          },
        }
        this.props.saveCurrSetPrescription(preload)
        break;
      case 'wx':
        preload = {
          ['wx']: {
            advice,
            discrimination,
            prescriptionDrugCategoryList,
            serviceMoney,
            syndromeDifferentiation,
          },
        }
        this.props.saveCurrSetPrescriptionWx(preload)
        break;
      case 'phone':
        preload = {
          [this.state.phone]: {
            advice,
            discrimination,
            prescriptionDrugCategoryList,
            serviceMoney,
            syndromeDifferentiation,
          },
        }
        this.props.saveCurrSetPrescriptionPhone(preload)
        break;
    }
  }
  initLastPrescriptionInfo = async () => {
    let patientUid = this.props.route.params.patientUid as number
    if (patientUid > 0) {
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
  }
  initSavedPrescriptionInfo = () => {
    const { currSetPrescription } = this.props
    let { mode, patientInfo, phone } = this.state
    let item: any = ''
    if (this.props.route.params.prescriptionId) {
      item = this.props.route.params.prescriptionId + 'id'
    }else{
      switch (mode) {
        case 'common':
          item = patientInfo.uid
          break;
        case 'wx':
          item = 'wx'
          break;
        case 'phone':
          item = phone
          break;
        default:
          return true
      }
    }
    if (item in currSetPrescription && currSetPrescription[item] !== null) {
      const {
        advice,
        discrimination,
        prescriptionDrugCategoryList,
        serviceMoney,
        syndromeDifferentiation,
        pharmacyName,
        patientName,
        phone,
        gender,
        yearAge,
        monthAge,
      } = currSetPrescription[item] as CurrSetPrescription
      this.setState({
        advice,
        discrimination,
        prescriptionDrugCategoryList,
        serviceMoney,
        syndromeDifferentiation,
      })
      if(mode != 'common'){
        this.setState({
          patientName: patientName || '' ,
          phone: this.state.phone ? this.state.phone : (phone || ''),
          gender: gender || this.state.gender,
        })
      }
      console.log({
        advice,
        discrimination,
        prescriptionDrugCategoryList,
        serviceMoney,
        syndromeDifferentiation,
        pharmacyName,
        patientName,
        phone,
        gender,
        yearAge,
        monthAge,
      })
      if (yearAge) {
        this.setState({
          yearAge
        })
      }
      if (monthAge) {
        this.setState({
          monthAge
        })
      }
      if (pharmacyName) {
        this.setState({
          pharmacyName
        })
        this.getStateStore(pharmacyName.stateId, pharmacyName.id)
      }
    }
  }
  getStateStore = async (stateId: number, storeId: number) => {
    let status: boolean = true,
      price = 0;
    let {
      data
    } = await hospital.getStateStore(stateId, storeId)
    price = data.price
    status = data.status
    this.setState({
      stateType: {
        status,
        price
      }
    })
  }
  init = async () => {
    let { patientInfo, mode } = this.state
    let status: boolean = false
    if (this.props.route.params.status) {
      status = this.props.route.params.status
    }
    let categoryId: number = 0,
      storeId: number = 0,
      stateId: number = 0;
    let drugList: DrugTwo[] = [],
      prescriptionDrugCategoryList = this.state.prescriptionDrugCategoryList;
    if (this.props.route.params.patientUid) {
      try {
        let {
          data: { detail },
        } = await doctor.getPrescriptionDetail({ prescriptionId: this.props.route.params.patientUid, status: false })

        if (mode !== 'common' || status) {
          patientInfo = {
            uid: detail.patient.uid || this.props.route.params.patientUid,
            monthAge: detail.patient.monthAge,
            name: detail.patient.name,
            gender: detail.patient.gender,
            yearAge: detail.patient.yearAge,
          }
          this.setState({
            patientInfo,
          })

        }
      } catch (e) {

      }
    } else if (this.props.route.params.prescriptionId) {
      // console.log(this.props.route.params.OfficialAccounts)
      try {
        let {
          data: { detail },
        } = await doctor.getPrescriptionDetail({ prescriptionId: this.props.route.params.prescriptionId })
        if (detail.drugList[0]) {
          categoryId = detail.drugList[0].categoryId
          drugList = detail.drugList
        }
        storeId = detail.storeId || 0;
        stateId = detail.stateId || 0;
        patientInfo = {
          uid: detail.patient.uid || 0,
          monthAge: detail.patient.monthAge,
          name: detail.patient.name,
          gender: detail.patient.gender,
          yearAge: detail.patient.yearAge,
        }
        console.log(detail)
        this.setState({
          patientName: detail.patient.name,
          phone: detail.patient.phone,
          mode: detail.type
        })
        this.setState({
          patientInfo,
          monthAge: String(detail.patient.monthAge),
          yearAge: String(detail.patient.yearAge),
          gender: detail.patient.gender,
        })
      } catch (err) {

      }
    } else if (mode === 'phone') {
      try {
        let {
          data: { detail },
        } = await doctor.getPrescriptionDetail({ phone: this.props.route.params.phone as string })
        if (detail.drugList[0]) {
          categoryId = detail.drugList[0].categoryId
          drugList = detail.drugList
        }
        storeId = detail.storeId || 0;
        stateId = detail.stateId || 0;
        patientInfo = {
          uid: detail.patient.uid || 0,
          monthAge: detail.patient.monthAge,
          name: detail.patient.name,
          gender: detail.patient.gender,
          yearAge: detail.patient.yearAge,
        }

        this.setState({
          patientName: detail.patient.name,
        })
        this.setState({
          patientInfo,
        })
      } catch (err) {
        console.log(err)

      }
    }
    let {
      data: { list: categoryList },
    } = await hospital.getDrugCategoryList({
      page: -1,
      limit: -1,
      filter: {},
    })
    let categoryName: string = ''
    if (categoryId > 0) {
      for (let item of categoryList) {
        if (item.id === categoryId) {
          categoryName = item.name
        }
      }
      if (!categoryName) {
        categoryId = 0
      }
    }

    prescriptionDrugCategoryList = []
    for (let drug of drugList) {
      let name: string = ''
      for (let item of categoryList) {
        if (item.id === drug.categoryId) {
          name = item.name
        }
      }
      let prescriptionDrugInfo: PrescriptionDrugInfo[] = []
      for (let drugInfo of drug.list) {
        if (drugInfo.detail && drugInfo.id) {
          prescriptionDrugInfo.push({
            id: drugInfo.id || 0,
            count: drugInfo.count,
            detail: {
              id: drugInfo.id || 0,
              name: drugInfo.detail.name || '',
              unit: drugInfo.detail.unit || '',
              price: drugInfo.detail.price || 0,
              type: drugInfo.detail.type || 0,
              standard: drugInfo.detail.standard || '',
              manufacturer: drugInfo.detail.manufacturer || '',
              signature: drugInfo.detail.signature || '',
              ctime: drugInfo.detail.ctime || '',
              category_id: drug.categoryId,
            },
            type: drugInfo.type,
          })
        } else if (drugInfo.id) {
          try {
            let {
              data: { detail },
            } = await getDetail({ id: drugInfo.id })
            prescriptionDrugInfo.push({
              id: drugInfo.id,
              count: drugInfo.count,
              detail: {
                id: drugInfo.id,
                name: detail.name,
                unit: detail.unit,
                price: detail.price,
                type: detail.type,
                standard: detail.standard,
                manufacturer: detail.manufacturer,
                signature: detail.signature,
                ctime: detail.ctime || '',
                category_id: drug.categoryId,
              },
              type: drugInfo.type,
            })
          } catch (e) { }
        }
      }
      if (prescriptionDrugInfo) {
        prescriptionDrugCategoryList.push({
          id: drug.categoryId,
          name,
          drugList: prescriptionDrugInfo,
          // 剂量数
          doseCount: drug.doseCount,
          // 每日剂量数
          dailyDose: drug.dailyDose,
          // 每剂分几次使用
          everyDoseUseCount: drug.everyDoseUseCount
        })
      }

      this.setState({
        prescriptionDrugCategoryList,
      })
    }
    let pharmacy = this.state.pharmacy
    pharmacy.categoryList = categoryList
    this.setState({
      pharmacy,
    })
    let {
      data: { list: stateList },
    } = await hospital.getDrugStateList({
      page: -1,
      limit: -1,
      filter: {
        categoryId: {
          condition: TYPE.eq,
          val: categoryId === 0 ? categoryList[0].id : categoryId,
        }
      },
    })
    let stateName: string = ''
    if (stateId > 0) {
      for (let item of stateList) {
        if (item.id === stateId) {
          stateName = item.name
        }
      }
      if (!stateName) {
        stateId = 0
      }
    }
    pharmacy.activeId = 0
    if (stateList.length > 0) {
      let {
        data: { list: storeList },
      } = await hospital.getDrugStoreList({
        page: -1,
        limit: -1,
        filter: {
          stateId: {
            condition: TYPE.eq,
            val: stateId > 0 ? stateId : stateList[0].id,
          },
        },
      })
      if (stateId > 0 && storeList.length == 0) {
        stateId = 0
        let {
          data: { list },
        } = await hospital.getDrugStoreList({
          page: -1,
          limit: -1,
          filter: {
            stateId: {
              condition: TYPE.eq,
              val: stateList[0].id,
            },
          },
        })
        storeList = list
      }
      if (storeList.length > 0) {
        pharmacy.activeId = stateId > 0 ? stateId : stateList[0].id
        let storeName: string = ''
        if (storeId > 0) {
          for (let item of storeList) {
            if (item.id === storeId) {
              storeName = item.name
            }
          }
          if (!storeName) {
            storeId = 0
          }
        }
        this.setState({
          pharmacyName: {
            id: storeId > 0 ? storeId : storeList[0].id,
            name: storeId > 0 ? storeName : storeList[0].name,
            drugType: categoryId > 0 ? categoryId : categoryList[0].id,
            stateId: stateId > 0 ? stateId : stateList[0].id,
            state: stateId > 0 ? stateName : stateList[0].name,
            categoryName: categoryId > 0 ? categoryName : categoryList[0].name,
          }
        }, this.store)
        this.getStateStore(stateId > 0 ? stateId : stateList[0].id, storeId > 0 ? storeId : storeList[0].id)
      }
    }
    this.setState({
      status: true,
      pharmacy,
    })
    if (mode === 'phone') {
      let phone = this.props.route.params.phone as string
      if(!this.state.phone){
        this.setState({
          phone,
        })
      }
    }
    let patientUid = this.props.route.params.patientUid as number
    if (patientUid > 0) {
      try {
        this.setState({
          hasLoad: false,
        })
        if (mode === 'common' && !status) {
          let {
            data: { yearAge, monthAge, name, gender, hospitalMedicalRecordPicList },
          } = await getPatientInfo({ uid: patientUid })
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
          console.log(patientInfo)
          this.setState({
            patientInfo,
            medicalRecordPicList: hospitalMedicalRecordPicList,
          })
        }
        let {
          data: {
            doctorInfo: { percentageOfCommission },
          },
        } = await getPersonalInfo()
        this.setState({
          hasLoad: true,
          percentageOfCommission: percentageOfCommission ? percentageOfCommission : 0,
        })
        if (patientUid in this.props.currSetPrescription) {
          console.log('正在初始化redux处方信息')
        } else if (patientUid) {
          console.log('正在初始化上次处方信息')
          this.initLastPrescriptionInfo()
        }
      } catch (err) {
        console.log('发生了错误, ', err)
      }
    }
    this.initSavedPrescriptionInfo()
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
  pharmacyChange = (data: { id: number, name: string, drugType: number, state: string, stateId: number, categoryName: string }) => {
    this.getStateStore(data.stateId, data.id)
    this.setState({
      pharmacyName: data
    }, this.store)
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
      NoMedicine,
      stateType
    } = this.state
    let drugMoney = 0
    let drugList: any = {};
    for (let drugInfo of NoMedicine) {
      drugList[drugInfo.id] = drugInfo.price
    }
    for (let prescriptionDrugCategory of prescriptionDrugCategoryList) {
      // 某分类的药品总价
      let drugCategoryMoney = 0
      for (let prescriptionDrugInfo of prescriptionDrugCategory.drugList) {
        let {
          detail: { price },
          count,
          id
        } = prescriptionDrugInfo
        if (drugList[id]) {
          price = drugList[id]
        }
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
        this.state.serviceMoney === '' ? parseFloat(calcServiceMoney) : parseFloat(this.state.serviceMoney);
    let processingPrice: number = 0;
    this.state.prescriptionDrugCategoryList.forEach(category => {
      let gram: number = 0
      for (let item of category.drugList) {
        let g = item.detail.unit.match(/(\d+)[g克]/)
        if (g && g[1] && !isNaN(parseFloat(g[1]))) {
          gram += item.count * parseFloat(g[1])
        } else {
          gram += item.count
        }
      }
      if (!category.doseCount) {
        category.doseCount = 0
      }
      if (stateType.status) {
        processingPrice += gram * category.doseCount * stateType.price
      } else {
        processingPrice += category.doseCount * stateType.price
      }
    })
    let
      totalMoney = (drugMoney + actuallyServiceMoney + processingPrice / 1000).toFixed(2)
    let processingFee = (processingPrice / 1000).toFixed(2)
    let patientName: string = patientInfo.name
    if (!patientName) {
      if (mode === 'wx') {
        patientName = '微信用户'
      } else if (mode === 'phone') {
        patientName = '手机用户'
      }
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
                      <Text>年</Text>
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
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    isSelectPharmacy: true,
                  })
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
                  <Text style={[global.fontSize14, style.prescriptionTplTitle]}>切换药房</Text>
                  <View
                    style={[
                      global.flex,
                      global.alignItemsCenter,
                      global.justifyContentSpaceBetween,]}
                  >
                    <Text style={[global.fontSize14, style.prescriptionTplTitle]}>{this.state.pharmacyName.state}-{this.state.pharmacyName.name}</Text>
                    <Icon style={[style.prescriptionTplIcon, global.fontSize14]} name='right' />
                  </View>
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
                      gram += item.count * parseFloat(g[1])
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
                            let res = this.state.NoMedicine?.filter((item) => item.id === drugInfo.detail.id)
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
                                <Text style={[style.chooseDrugTitle, global.fontSize14, res && res.length != 0 && res[0].status === false ? style.deficiency : null]} numberOfLines={1}>
                                  {drugInfo.detail.name}
                                  {drugInfo.type ? '(' + drugInfo.type + ')' : ''}
                                </Text>
                                <Text style={[style.chooseDrugCount, global.fontSize14, res && res.length != 0 && res[0].status === false ? style.deficiency : null]}>
                                  {drugInfo.count} * {drugInfo.detail.unit}
                                </Text>
                                {
                                  this.state.NoMedicine && this.state.NoMedicine.some((item) => item.status !== true) &&
                                  this.state.NoMedicine.map((drugStatus) => {
                                    if (drugInfo.detail.id === drugStatus.id && drugStatus.status === false) {
                                      return <Text style={[style.deficiency, global.fontSize14]}>
                                        (缺)
                                              </Text>
                                    }
                                  })


                                }

                              </View>
                            )
                          }
                          )}
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
                  const { navigation } = this.props
                  navigation.navigate('DrugSelect', {
                    categoryList: this.state.pharmacy.categoryList,
                    storeId: this.state.pharmacyName.id,
                    stateName: this.state.pharmacyName.name,
                    activeId: this.state.pharmacyName.drugType,
                    stateId: this.state.pharmacyName.stateId,
                    state: this.state.pharmacyName.state,
                    categoryName: this.state.pharmacyName.categoryName,
                    isInSession: false,
                    prescriptionDrugCategoryList: this.state.prescriptionDrugCategoryList
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
              {this.state.pharmacyName.id > 0 &&
                <View
                  style={[style.diagnosisItem, global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}
                >
                  <Text style={[style.diagnosisItemTitle, global.fontSize14]}>加工费</Text>
                  <View style={style.percentageOfCommission}>
                    <View style={style.percentageOfCommission}>
                      <InputItem
                        type='number'
                        labelNumber={1}
                        disabled
                        // disabled={this.state.prescriptionDrugCategoryList.length === 0}
                        style={style.percentageOfCommissionInput}
                        placeholder={this.state.processingFee === '' ? processingFee : '0.00'}
                        value={this.state.processingFee}
                        onChange={val => {
                          let processingFee: number | string = parseFloat(val)
                          if (isNaN(processingFee)) {
                            processingFee = ''
                          }
                          this.setState({
                            processingFee: String(processingFee),
                          })
                        }}
                        onBlur={() => {
                          if (this.state.processingFee === '') {
                            this.setState({
                              processingFee: String(processingFee),
                            })
                          }
                        }}
                      >
                        ¥
                  </InputItem>
                    </View>
                  </View>
                </View>
              }
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
            <View style={global.flex}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    saveType: 0,
                  }, this.sendPrescriptionToUser)

                }
                }
                style={style.saveBox}>
                <Text style={[style.savePrescription, global.fontSize14]}>暂存处方</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={
                  () => {
                    this.setState({
                      saveType: 1,
                    }, this.sendPrescriptionToUser)
                  }
                }
                style={style.sendbox}>
                <Text style={[style.sendPatient, global.fontSize14]}>发送给患者</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          {/* 选择药房 */}
          <View style={this.state.isSelectPharmacy ? style.selectPharmacy : global.hidden}>
            <Pharmacy
              navigation={this.props.navigation}
              categoryList={this.state.pharmacy.categoryList}
              activeId={this.state.pharmacy.activeId}
              chooseCategory={this.chooseCategory}
              pharmacyChange={this.pharmacyChange}
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
      pharmacyName,
      saveType,
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
    args.stateId = pharmacyName.stateId
    args.storeId = pharmacyName.id
    console.log(args)
    addPrescription(args)
      .then(json => {
        this.setState({ status: true })
        if (mode === 'phone' || mode === 'wx') {
          if (saveType === 0) {
            return this.props.navigation.push('Prescription')
          }
          else {
            
            return this.props.navigation.navigate('PrescriptionDetail', {
              prescriptionId: json.data.id,
              mode,
            })
          }
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
        this.props.navigation.goBack()
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
