import DashLine from "@/components/DashLine"
import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import pathMap from "@/routes/pathMap"
import { windowWidth } from "@/services/api"
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
import { PrescriptionDrugInfo, PrescriptionDrugCategory } from "../advisory/SquareRoot"
import doctor from "@/services/doctor"
const style = gStyle.index.AddPrescriptionTpl
const global = gStyle.global
interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  categoryId: number
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
      categoryName: "",
      tplName: "",
      advice: "",
      categoryList: [],
      drugList: [],
    }
  }
  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener(
      pathMap.AddPrescriptionTpl + "Reload",
      (prescriptionDrugCategoryList: PrescriptionDrugCategory[]) => {
        console.log(prescriptionDrugCategoryList)
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
    try {
      const { categoryId, advice, tplName, drugList } = this.state
      await doctor.addPrescriptionTpl({
        categoryId,
        name: tplName,
        advice,
        drugList,
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
              {categoryId === 1 || categoryId === 2 ? (
                <View style={style.drugCategoryItem}>
                  <Text style={[style.drugCategoryName, global.fontSize15]}>{categoryName}</Text>
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
                          {drugInfo.detail.name} {drugInfo.count} {drugInfo.detail.unit}
                        </Text>
                      )
                    })}
                  </View>
                </View>
              ) : (
                /* 西药 */
                <View style={style.drugCategoryItem}>
                  <Text style={[style.drugCategoryName, global.fontSize15]}>{categoryName}</Text>
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

              {this.state.drugList.length === 0 ? <Text style={style.empty}>暂无</Text> : null}
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
            <TouchableOpacity onPress={this.addPrescriptionTpl}>
              <Text style={[style.addPrescriptionTplBtn, global.fontSize14]}>保存</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </>
    )
  }
}
