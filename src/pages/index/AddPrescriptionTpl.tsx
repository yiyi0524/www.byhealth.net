import DashLine from "@/components/DashLine"
import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import pathMap from "@/routes/pathMap"
import { windowWidth } from "@/services/api"
import doctor from "@/services/doctor"
import {
  ORAL_CHINESE_DRUG_ID,
  TOPICAL_CHINESE_DRUG_ID,
  EXTERN_CHINESE_DRUG_ID,
} from "@/services/drug"
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
import { PrescriptionDrugCategory, PrescriptionDrugInfo } from "../advisory/SquareRoot"
const style = gStyle.index.AddPrescriptionTpl
const global = gStyle.global
interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  categoryId: number
  //剂量
  doseCount: number
  //每天几剂
  dailyDose: number
  //一剂几次使用
  total: number //药品总价
  everyDoseUseCount: number
  categoryName: string
  tplName: string
  advice: string
  categoryList: CategoryItem[]
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
      categoryId: 0,
      //剂量
      doseCount: 0,
      //每天几剂
      dailyDose: 0,
      total: 0,
      //一剂几次使用
      everyDoseUseCount: 0,
      categoryName: "",
      tplName: "",
      advice: "",
      categoryList: [],
      drugList: [],
    }
  }
  componentDidMount() {
    //
    this.listener = DeviceEventEmitter.addListener(
      pathMap.AddPrescriptionTpl + "Reload",
      (prescriptionDrugCategoryList: PrescriptionDrugCategory[]) => {
        let { drugList } = this.state
        drugList = prescriptionDrugCategoryList[0].drugList
        this.setState({
          drugList,
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
      let categoryId = this.props.navigation.getParam("id")
      let categoryName = categoryList.filter((v: any) => v.id === categoryId)[0].name
      this.setState({
        hasLoad: true,
        categoryId,
        categoryName,
        categoryList,
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
  addPrescriptionTpl = async () => {
    if (this.state.tplName === "") {
      return Toast.info("请输入模板名称", 2)
    }
    if (this.state.drugList.length === 0) {
      return Toast.info("请编辑药材", 2)
    }
    if (this.state.advice === "") {
      return Toast.info("请输入医嘱", 2)
    }
    if (
      this.state.categoryId === ORAL_CHINESE_DRUG_ID ||
      this.state.categoryId === TOPICAL_CHINESE_DRUG_ID ||
      this.state.categoryId === EXTERN_CHINESE_DRUG_ID
    ) {
      if (this.state.doseCount === 0) {
        return Toast.info("请输入药剂总数", 2)
      }
      if (this.state.dailyDose === 0) {
        return Toast.info("请输入每日药剂数", 2)
      }
      if (this.state.everyDoseUseCount === 0) {
        return Toast.info("请输入一剂使用次数", 2)
      }
      if (this.state.dailyDose > this.state.doseCount) {
        return Toast.info("每日剂量数不能大于总剂量数", 1)
      }
    }
    try {
      const {
        categoryId,
        advice,
        tplName,
        drugList,
        doseCount,
        dailyDose,
        everyDoseUseCount,
      } = this.state
      await doctor.addPrescriptionTpl({
        categoryId,
        name: tplName,
        advice,
        drugList,
        doseCount,
        dailyDose,
        everyDoseUseCount,
      })
      Toast.success("添加成功", 2)
      DeviceEventEmitter.emit(pathMap.PrescriptionTplList + "Reload", null)
      this.props.navigation.goBack()
    } catch (err) {
      console.log(err)
      Toast.fail("添加失败, 错误信息:" + err.msg, 3)
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
    const { categoryId, drugList, categoryName } = this.state
    let total = 0,
      drugCategoryMoney = 0
    for (let v of drugList) {
      drugCategoryMoney += v.count * (v.detail.price / 1000)
      if (
        v.detail.category_id === ORAL_CHINESE_DRUG_ID ||
        v.detail.category_id === EXTERN_CHINESE_DRUG_ID ||
        v.detail.category_id === TOPICAL_CHINESE_DRUG_ID
      ) {
        total += drugCategoryMoney * (this.state.doseCount || 1)
      } else {
        total += drugCategoryMoney
      }
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
                  value={this.state.tplName}
                  onChange={tplName => {
                    this.setState({
                      tplName,
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
              {categoryId === ORAL_CHINESE_DRUG_ID ||
              categoryId === TOPICAL_CHINESE_DRUG_ID ||
              categoryId === EXTERN_CHINESE_DRUG_ID ? (
                <View style={style.drugCategoryItem}>
                  <Text style={[style.drugCategoryName, global.fontSize15]}>{categoryName}</Text>
                  {this.state.drugList.length === 0 ? (
                    <Text style={style.empty}>暂无药品</Text>
                  ) : null}
                  <View
                    style={[style.drugList, global.flex, global.alignItemsCenter, global.flexWrap]}>
                    {drugList.map((drugInfo, k) => {
                      return (
                        <Text
                          key={k}
                          style={[
                            style.drugName,
                            global.fontSize14,
                            style.traditionalChineseMedicine,
                          ]}>
                          {drugInfo.detail.name} {drugInfo.count} * {drugInfo.detail.unit}
                        </Text>
                      )
                    })}
                  </View>
                  {/* 药剂和用法用量 */}
                  <View>
                    <View style={[style.dose, global.flex, global.alignItemsCenter]}>
                      <Text style={[style.doseTitle, global.fontSize14]}>共</Text>
                      <View style={style.doseInputFather}>
                        <InputItem
                          type="number"
                          last
                          style={style.doseInput}
                          placeholder="0"
                          value={this.state.doseCount === 0 ? "" : this.state.doseCount + ""}
                          onChange={val => {
                            let doseCount: number | string = parseInt(val)
                            if (isNaN(doseCount)) {
                              doseCount = 0
                            }
                            if (
                              this.state.dailyDose &&
                              this.state.dailyDose > 0 &&
                              this.state.dailyDose > this.state.doseCount
                            ) {
                              return Toast.fail("每日剂量数不能大于剂量总数")
                            }
                            this.setState({
                              doseCount,
                            })
                          }}
                        />
                      </View>
                      <Text style={[style.doseTitle, global.fontSize14]}>剂, </Text>
                      <Text style={[style.doseTitle, global.fontSize14]}>每日</Text>
                      <View style={style.doseInputFather}>
                        <InputItem
                          last
                          type="number"
                          style={style.doseInput}
                          placeholder="0"
                          value={this.state.dailyDose === 0 ? "" : this.state.dailyDose + ""}
                          onChange={val => {
                            let dailyDose: number | string = parseInt(val)
                            if (isNaN(dailyDose)) {
                              dailyDose = 0
                            }
                            if (
                              this.state.doseCount &&
                              this.state.doseCount > 0 &&
                              this.state.doseCount < this.state.doseCount
                            ) {
                              return Toast.fail("剂量总数不能小于每日剂量数")
                            }
                            this.setState({
                              dailyDose,
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
                          type="number"
                          style={style.doseInput}
                          placeholder="0"
                          value={
                            this.state.everyDoseUseCount === 0
                              ? ""
                              : this.state.everyDoseUseCount + ""
                          }
                          onChange={val => {
                            let everyDoseUseCount: number | string = parseInt(val)
                            if (isNaN(everyDoseUseCount)) {
                              everyDoseUseCount = 0
                            }
                            this.setState({
                              everyDoseUseCount,
                            })
                          }}
                        />
                      </View>
                      <Text style={[style.doseTitle, global.fontSize14]}>次使用</Text>
                    </View>
                  </View>
                </View>
              ) : (
                /* 西药 */
                <View style={style.drugCategoryItem}>
                  <Text style={[style.drugCategoryName, global.fontSize15]}>{categoryName}</Text>
                  {this.state.drugList.length === 0 ? (
                    <Text style={style.empty}>暂无药品</Text>
                  ) : null}
                  <View style={style.drugList}>
                    {drugList.map((drugInfo, k) => {
                      return (
                        <View style={style.drugItem} key={k}>
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
                                {drugInfo.detail.name}
                              </Text>
                              <Text
                                style={[style.drugName, style.drugMarginBottom, global.fontSize12]}>
                                {drugInfo.detail.standard || "暂无规格"}
                              </Text>
                            </View>
                            <View style={style.drugItemRight}>
                              <Text style={[style.drugItemRightTitle, global.fontSize14]}>
                                {drugInfo.count}
                                {drugInfo.detail.unit}
                              </Text>
                              <Text style={[style.drugItemRightTitle, global.fontSize14]}>
                                {drugInfo.detail.price / 1000} 元
                              </Text>
                            </View>
                          </View>
                          <Text style={[style.drugName, global.fontSize12]}>
                            {drugInfo.detail.manufacturer || "暂无厂商信息"}
                          </Text>
                        </View>
                      )
                    })}
                  </View>
                </View>
              )}

              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.push(pathMap.DrugSelect, {
                    categoryList: this.state.categoryList,
                    activeId: this.state.categoryId,
                    prescriptionDrugCategoryList: [
                      {
                        id: categoryId,
                        name: categoryName,
                        drugList,
                      },
                    ],
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
                  value={this.state.advice}
                  onChange={advice => {
                    this.setState({
                      advice,
                    })
                  }}
                />
              </View>
            </View>
            <View style={[style.addPrescriptionTplHeader, global.flex, global.alignItemsCenter]}>
              <Text style={[style.addPrescriptionTplHeaderTitle, global.fontSize14]}>
                药品总价{" "}
              </Text>
              <Text style={style.addPrescriptionTplDetail}>¥ {total.toFixed(2)}</Text>
              <Text>元</Text>
            </View>
            <TouchableOpacity onPress={this.addPrescriptionTpl}>
              <Text style={[style.addPrescriptionTplBtn, global.fontSize14]}>保存</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </>
    )
  }
}
