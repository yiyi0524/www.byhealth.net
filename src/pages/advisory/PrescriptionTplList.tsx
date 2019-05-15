import Empty from "@/components/Empty"
import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import pathMap from "@/routes/pathMap"
import doctor from "@/services/doctor"
import { Toast } from "@ant-design/react-native"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
import { DeviceEventEmitter, Image, PixelRatio, RefreshControl, Text, View } from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { NavigationScreenProp } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { PrescriptionDrugInfo } from "./SquareRoot"
import { PrescriptionDrugCategory } from "./SquareRoot"
import { getDrugCategoryList } from "@/services/hospital"
import { CategoryItem } from "./DrugSelect"
const style = gStyle.advisory.SelectPrescriptionTplList
const global = gStyle.global
interface Props {
  navigation: NavigationScreenProp<State>
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
  static navigationOptions = () => {
    return {
      title: "模板信息",
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
      headerRight: <TouchableOpacity />,
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
      console.log(prescriptionTplList)
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
        Toast.fail("刷新失败,错误信息: " + err.msg)
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
        console.log(currSelectDrugIds, prescription.drugList)
        prescription.drugList = prescription.drugList.filter(v => !currSelectDrugIds.includes(v.id))
        console.log(prescription.drugList)
        for (let drugInfo of prescription.drugList) {
          category.drugList.push(drugInfo)
        }
      }
    }
    if (!isCategoryExist) {
      prescriptionDrugCategoryList.push({
        id: prescription.categoryId,
        name: this.state.categoryList.filter(v => v.id === prescription.categoryId)[0].name,
        drugList: prescription.drugList,
      })
    }
    DeviceEventEmitter.emit(pathMap.SquareRoot + "Reload", prescriptionDrugCategoryList)
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
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }>
          <View style={style.prescriptionList}>
            {this.state.prescriptionTplList.length === 0 ? (
              <View>
                <Empty />
                <Text style={{ textAlign: "center", fontSize: 14, color: "#888" }}>暂无模板</Text>
              </View>
            ) : null}
            {this.state.prescriptionTplList.map((prescription, k) => {
              let drugStr = ""
              for (let drugInfo of prescription.drugList) {
                drugStr += drugInfo.detail.name + "、"
              }
              drugStr = drugStr.substr(0, drugStr.lastIndexOf("、"))
              return (
                <TouchableOpacity key={k} onPress={() => this.selectPrescriptionTpl(prescription)}>
                  <View style={style.prescriptionItem}>
                    <View
                      style={[
                        style.prescriptionHeader,
                        global.flex,
                        global.alignItemsCenter,
                        global.justifyContentSpaceBetween,
                      ]}>
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
              )
            })}
          </View>
        </ScrollView>
      </>
    )
  }
}
