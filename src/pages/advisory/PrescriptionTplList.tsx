import Empty from '@/components/Empty'
import * as userAction from '@/redux/actions/user'
import { AppState } from '@/redux/stores/store'
import { AllScreenParam } from '@/routes/bottomNav'
import pathMap from '@/routes/pathMap'
import doctor from '@/services/doctor'
import { getDrugCategoryList } from '@/services/hospital'
import { SwipeAction, Toast } from '@ant-design/react-native'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import gImg from '@utils/img'
import gStyle from '@utils/style'
import React, { Component } from 'react'
import { DeviceEventEmitter, Image, RefreshControl, Text, View, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { CategoryItem } from './DrugSelect'
import { PrescriptionDrugCategory, PrescriptionDrugInfo } from './SquareRoot'
const style = gStyle.advisory.SelectPrescriptionTplList
const global = gStyle.global
interface Props {
  navigation: StackNavigationProp<AllScreenParam, 'SelectPrescriptionTpl'>
  route: RouteProp<AllScreenParam, 'SelectPrescriptionTpl'>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  categoryList: CategoryItem[]
  prescriptionTplList: PrescriptionTpl[]
}
interface PrescriptionTpl {
  id: number
  name: string
  advice: string
  ctime: string
  categoryId: number
  drugList: PrescriptionDrugInfo[]
  doseCount: number
  dailyDose: number
  everyDoseUseCount: number
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
@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class PrescriptionTplList extends Component<
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
      categoryList: [],
      prescriptionTplList: [],
    }
  }
  componentDidMount() {
    this.init()
  }
  init = async () => {
    try {
      let {
        data: { list: prescriptionTplList },
      } = await doctor.listPrescriptionTpl({
        page: -1,
        limit: -1,
        filter: {},
      })
      let {
        data: { list: categoryList },
      } = await getDrugCategoryList({
        page: -1,
        limit: -1,
        filter: {},
      })
      this.setState({
        hasLoad: true, 
        categoryList,
        prescriptionTplList,
      })
    } catch (err) {
      console.log(err)
    }
  }
  onRefresh = () => {
    this.setState({ refreshing: true })
    Promise.all([this.init(), new Promise(s => setTimeout(s, 170))])
      .then(_ => {
        this.setState({ refreshing: false })
      })
      .catch(err => {
        Toast.fail('刷新失败,错误信息: ' + err.msg)
      })
  }
  selectPrescriptionTpl = (prescription: PrescriptionTpl) => {
    let prescriptionDrugCategoryList: PrescriptionDrugCategory[] = []
    let isCategoryExist = false
    for (let category of prescriptionDrugCategoryList) {
      if (category.id === prescription.categoryId) {
        isCategoryExist = true
        let currSelectDrugIds: number[] = []
        for (let drugInfo of category.drugList) {
          currSelectDrugIds.push(drugInfo.id)
        }
        prescription.drugList = prescription.drugList.filter(v => !currSelectDrugIds.includes(v.id))
        
        for (let drugInfo of prescription.drugList) {
          category.drugList.push(drugInfo)
        }
        category.doseCount = prescription.doseCount
        category.dailyDose = prescription.dailyDose
        category.everyDoseUseCount = prescription.everyDoseUseCount
      }
    }
    if (!isCategoryExist) {
      prescriptionDrugCategoryList.push({
        id: prescription.categoryId,
        name: this.state.categoryList.filter(v => v.id === prescription.categoryId)[0].name,
        drugList: prescription.drugList,
        doseCount: prescription.doseCount,
        dailyDose: prescription.dailyDose,
        everyDoseUseCount: prescription.everyDoseUseCount,
      })
    }
    console.log(prescriptionDrugCategoryList[0].drugList[0].detail)
    DeviceEventEmitter.emit(pathMap.SquareRoot + 'Reload', prescriptionDrugCategoryList)
    this.props.navigation.goBack()
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
        <ScrollView
          style={style.main}
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
        >
          <View style={style.prescriptionList}>
            {this.state.prescriptionTplList.length === 0 ? (
              <View>
                <Empty />
                <Text style={{ textAlign: 'center', fontSize: 14, color: '#888' }}>暂无模板</Text>
              </View>
            ) : null}
            {this.state.prescriptionTplList.map((prescription, k) => {
              
              let drugStr = ''
              for (let drugInfo of prescription.drugList) {
                drugStr += drugInfo.detail.name + '、'
              }
              drugStr = drugStr.substr(0, drugStr.lastIndexOf('、'))
              if(!drugStr){
                return null
              }
              return (
                <SwipeAction
                  key={k}
                  autoClose
                  style={{ backgroundColor: 'transparent', marginTop: 8 }}
                  right={[
                    {
                      text: '开方',
                      onPress: () => {
                        this.selectPrescriptionTpl(prescription)
                      },
                      style: { backgroundColor: 'blue', color: 'white' },
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.selectPrescriptionTpl(prescription)
                    }}
                  >
                    <View style={style.prescriptionItem}>
                      <View
                        style={[
                          style.prescriptionHeader,
                          global.flex,
                          global.alignItemsCenter,
                          global.justifyContentSpaceBetween,
                        ]}
                      >
                        <Text style={[style.prescriptionTitle, global.fontSize14]} numberOfLines={1}>
                          {prescription.name}
                        </Text>
                        <Text style={[style.prescriptionTime, global.fontSize12]}>
                          {prescription.ctime.substr(0, 10)}
                        </Text>
                      </View>
                      <Text style={[style.prescriptionDetail, global.fontSize14]} numberOfLines={1}>
                        {drugStr}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </SwipeAction>
              )
            })}
          </View>
        </ScrollView>
      </>
    )
  }
}
