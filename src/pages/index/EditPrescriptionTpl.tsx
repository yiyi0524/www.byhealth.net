import DashLine from "@/components/DashLine"
import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import pathMap from "@/routes/pathMap"
import { windowWidth } from "@/services/api"
import doctor, { PrescriptionTpl } from "@/services/doctor"
import hospital from "@/services/hospital"
import { Icon, InputItem, Toast } from "@ant-design/react-native"
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
  View,
} from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { NavigationScreenProp } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { CategoryItem } from "../advisory/DrugSelect"
import { drugItem } from "../advisory/SquareRootOld"
const style = gStyle.index.EditPrescriptionTpl
const global = gStyle.global
interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  id: number
  categoryId: number
  categoryName: string
  prescriptionTplDetail: PrescriptionTpl
  categoryList: CategoryItem[]
  chooseDrugInfo: Record<number, { count: string; info: drugItem }>
  chooseDrugMapList: chooseDrug[]
}
interface chooseDrug {
  id: number
  name: string
  drugList: drugInfo[]
}
interface drugInfo {
  id: number
  count: number
  info: drugItem
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
export default class AddPrescriptionTpl extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<State> }) => {
    let title = ""
    if (navigation.state.params) {
      title = navigation.state.params.title + "模板"
    }
    return {
      title,
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
      id: 0,
      categoryId: 0,
      categoryName: "",
      prescriptionTplDetail: {
        id: 0,
        categoryId: 0,
        name: "",
        advice: "",
        ctime: "",
        drugList: [],
      },
      chooseDrugInfo: [],
      chooseDrugMapList: [],
      categoryList: [],
    }
  }
  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener(
      pathMap.AddPrescriptionTpl + "Reload",
      async (chooseDrugInfo: Record<number, { count: string; info: drugItem }>) => {
        let chooseDrugMapList: chooseDrug[] = []
        let drugList: { id: number; count: number; info: drugItem }[] = []
        for (let [_, v] of Object.entries(chooseDrugInfo)) {
          drugList.push({
            id: v.info.id,
            count: parseInt(v.count),
            info: v.info,
          })
        }
        chooseDrugMapList.push({
          id: this.state.categoryId,
          name: this.state.categoryName,
          drugList,
        })
        this.setState({
          chooseDrugInfo,
          chooseDrugMapList,
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
  init = async () => {
    try {
      let {
        data: { list: categoryList },
      } = await hospital.getDrugCategoryList({
        page: -1,
        limit: -1,
        filter: {},
      })
      let id = this.props.navigation.getParam("id"),
        categoryId = this.props.navigation.getParam("categoryId"),
        categoryName = this.props.navigation.getParam("categoryName")
      let {
        data: { detail: prescriptionTplDetail },
      } = await doctor.getPrescriptionTpl({ id })
      let chooseDrugMapList: chooseDrug[] = [],
        chooseDrugInfo: Record<number, { count: string; info: drugItem }> = {}
      let drugList: drugInfo[] = []
      for (let v of prescriptionTplDetail.drugList) {
        drugList.push(v)
      }
      chooseDrugMapList.push({
        id: categoryId,
        name: categoryName,
        drugList: drugList,
      })
      for (let v of prescriptionTplDetail.drugList) {
        chooseDrugInfo[v.id] = { count: v.count + "", info: v.info }
      }
      this.setState({
        hasLoad: true,
        id,
        categoryName,
        categoryId,
        categoryList,
        chooseDrugMapList,
        chooseDrugInfo,
        prescriptionTplDetail,
      })
    } catch (err) {
      console.log(err.msg)
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
  editPrescriptionTpl = async () => {
    if (this.state.prescriptionTplDetail.name === "") {
      return Toast.info("请输入模板名称", 2)
    }
    if (this.state.chooseDrugMapList.length === 0) {
      return Toast.info("请选择药材", 2)
    }
    if (this.state.prescriptionTplDetail.advice === "") {
      return Toast.info("请输入医嘱", 2)
    }
    try {
      await doctor.editPrescriptionTpl({
        id: this.state.id,
        name: this.state.prescriptionTplDetail.name,
        advice: this.state.prescriptionTplDetail.advice,
        drugList: this.state.chooseDrugMapList[0].drugList,
      })
      Toast.success("修改成功", 1)
      DeviceEventEmitter.emit(pathMap.PrescriptionTplList + "Reload", null)
      this.props.navigation.goBack()
    } catch (err) {
      console.log(err)
      Toast.fail("修改失败, 错误原因: " + err.msg, 3)
    }
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
          keyboardShouldPersistTaps="always"
          style={style.main}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }>
          <View style={style.addPrescriptionTpl}>
            <View style={[style.addPrescriptionTplHeader, global.flex, global.alignItemsCenter]}>
              <Text style={[style.addPrescriptionTplHeaderTitle, global.fontSize14]}>模板名称</Text>
              <View style={style.addPrescriptionTplHeaderInput}>
                <InputItem
                  style={style.input}
                  placeholder="请输入模板名称"
                  clear
                  value={this.state.prescriptionTplDetail.name}
                  onChange={val => {
                    let { prescriptionTplDetail } = this.state
                    prescriptionTplDetail.name = val
                    this.setState({
                      prescriptionTplDetail,
                    })
                  }}
                />
              </View>
            </View>
            <View style={style.drugCategoryList}>
              <View
                style={[
                  style.drugCategoryTitle,
                  global.flex,
                  global.alignItemsCenter,
                  global.justifyContentCenter,
                ]}>
                <View style={style.spot} />
                <Text style={[style.drugCategoryTheme, global.fontSize16]}>开方</Text>
                <View style={style.spot} />
              </View>
              <DashLine width={windowWidth - 30} backgroundColor={"#ddd"} len={45} />

              {this.state.chooseDrugMapList.map((category, k) => {
                if (category.id === 1 || category.id === 2) {
                  {
                    /* 中药 */
                  }
                  return (
                    <View style={style.drugCategoryItem} key={k}>
                      <Text style={[style.drugCategoryName, global.fontSize15]}>
                        {category.name}
                      </Text>
                      <View
                        style={[
                          style.drugList,
                          global.flex,
                          global.alignItemsCenter,
                          global.flexWrap,
                        ]}>
                        {category.drugList.map((drug, k1) => {
                          return (
                            <Text
                              key={k1}
                              style={[
                                style.drugName,
                                global.fontSize14,
                                style.traditionalChineseMedicine,
                              ]}>
                              {drug.info.name} {drug.count} {drug.info.unit}
                            </Text>
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
                    <View style={style.drugCategoryItem}>
                      <Text style={[style.drugCategoryName, global.fontSize15]}>
                        {category.name}
                      </Text>
                      <View style={style.drugList}>
                        {category.drugList.map((drug, k1) => {
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
                                    style={[
                                      style.drugTitle,
                                      style.drugMarginBottom,
                                      global.fontSize14,
                                    ]}>
                                    {drug.info.name}
                                  </Text>
                                  <Text
                                    style={[
                                      style.drugName,
                                      style.drugMarginBottom,
                                      global.fontSize12,
                                    ]}>
                                    {drug.info.standard || "暂无规格"}
                                  </Text>
                                </View>
                                <View style={style.drugItemRight}>
                                  <Text style={[style.drugItemRightTitle, global.fontSize14]}>
                                    {drug.count}
                                    {drug.info.unit}
                                  </Text>
                                  <Text style={[style.drugItemRightTitle, global.fontSize14]}>
                                    {drug.info.price / 1000} 元
                                  </Text>
                                </View>
                              </View>
                              <Text style={[style.drugName, global.fontSize12]}>
                                {drug.info.manufacturer || "暂无厂商信息"}
                              </Text>
                            </View>
                          )
                        })}
                      </View>
                    </View>
                  )
                }
              })}
              {this.state.chooseDrugMapList.length === 0 ? (
                <Text style={style.empty}>暂无</Text>
              ) : null}
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.push(pathMap.DrugSelect, {
                    categoryList: this.state.categoryList,
                    activeId: this.state.categoryId,
                    chooseDrugInfo: this.state.chooseDrugInfo,
                  })
                }}>
                <View style={[global.flex, global.alignItemsCenter]}>
                  <Icon name="form" style={[style.editDrug, global.fontSize14]} />
                  <Text style={[style.editDrug, global.fontSize14]}>编辑药材</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={[style.addPrescriptionTplHeader, global.flex, global.alignItemsCenter]}>
              <Text style={[style.addPrescriptionTplHeaderTitle, global.fontSize14]}>医嘱</Text>
              <View style={style.addPrescriptionTplHeaderInput}>
                <InputItem
                  style={style.input}
                  placeholder="请输入医嘱"
                  clear
                  value={this.state.prescriptionTplDetail.advice}
                  onChange={val => {
                    let { prescriptionTplDetail } = this.state
                    prescriptionTplDetail.advice = val
                    this.setState({
                      prescriptionTplDetail,
                    })
                  }}
                />
              </View>
            </View>
            <TouchableOpacity onPress={this.editPrescriptionTpl}>
              <Text style={[style.addPrescriptionTplBtn, global.fontSize14]}>保存</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </>
    )
  }
}
