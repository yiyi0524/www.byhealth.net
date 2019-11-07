import global from "@/assets/styles/global"
import pathMap from "@/routes/pathMap"
import hospital from "@/services/hospital"
import { TYPE } from "@/utils/constant"
import { Icon, InputItem, Toast, List } from "@ant-design/react-native"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
import {
  DeviceEventEmitter,
  Image,
  KeyboardAvoidingView,
  PixelRatio,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { NavigationScreenProp } from "react-navigation"
import { Drug, PrescriptionDrugCategory } from "./SquareRoot"
import { listPopularDrug } from "@/services/drug"
const style = gStyle.advisory.DrugSelect
export interface CategoryItem {
  id: number
  name: string
}
interface Props {
  navigation: NavigationScreenProp<
    State,
    {
      isInSession: boolean
      categoryList: CategoryItem[]
      activeId: number
      prescriptionDrugCategoryList: PrescriptionDrugCategory[]
    }
  >
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  currDrugId: number
  page: number
  limit: number
  chatKey: string
  filter: {}
  // 当前已经选择的药品信息
  prescriptionDrugCategoryList: PrescriptionDrugCategory[]
  // 与搜索匹配的药品列表
  matchDrugList: Drug[]
  //常用药
  popularDrugList: Drug[]
  search: string
}
// interface Params {
//   activeId: number
//   categoryList: CategoryItem[]
//   activeDrugList: activeDrugItem[]
//   chooseDrugList: (id: number, count: number) => void
// }
export default class DrugSelect extends Component<Props, State> {
  refs: any
  static navigationOptions = ({
    navigation,
  }: {
    navigation: NavigationScreenProp<
      State,
      {
        isInSession?: boolean
        categoryList: CategoryItem[]
        activeId: number
        prescriptionDrugCategoryList: PrescriptionDrugCategory[]
      }
    >
  }) => {
    let title = "选择药材"
    // let params = navigation.state.params as Params
    let { params } = navigation.state
    if (!params) {
      return
    }
    for (let v of params.categoryList) {
      if (v.id === params.activeId) {
        title = v.name
      }
    }
    return {
      title,
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
        <TouchableOpacity
          onPress={() => {
            if (!params) {
              return
            }
            let prescriptionDrugCategoryList = params.prescriptionDrugCategoryList
            for (let drugCategory of prescriptionDrugCategoryList) {
              for (let drug of drugCategory.drugList) {
                if (drug.count <= 0) {
                  return Toast.fail(`请填写${drug.detail.name}药品的数量`)
                }
              }
            }
            DeviceEventEmitter.emit(pathMap.SquareRoot + "Reload", prescriptionDrugCategoryList)
            DeviceEventEmitter.emit(
              pathMap.AddPrescriptionTpl + "Reload",
              prescriptionDrugCategoryList,
            )
            navigation.goBack()
          }}>
          <Icon style={[style.headerLeft, global.fontSize16]} name="left" />
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity
          onPress={() => {
            let prescriptionDrugCategoryList = navigation.state.params!.prescriptionDrugCategoryList
            console.log(prescriptionDrugCategoryList)
            for (let drugCategory of prescriptionDrugCategoryList) {
              for (let drug of drugCategory.drugList) {
                if (drug.count <= 0) {
                  return Toast.fail(`请填写${drug.detail.name}药品的数量`, 2)
                }
              }
            }
            DeviceEventEmitter.emit(pathMap.SquareRoot + "Reload", prescriptionDrugCategoryList)
            DeviceEventEmitter.emit(
              pathMap.AddPrescriptionTpl + "Reload",
              prescriptionDrugCategoryList,
            )
            DeviceEventEmitter.emit(
              pathMap.EditPrescriptionTpl + "Reload",
              prescriptionDrugCategoryList,
            )
            navigation.goBack()
          }}>
          <Text style={[global.fontSize16, { color: sColor.mainRed, paddingRight: 15 }]}>完成</Text>
        </TouchableOpacity>
      ),
    }
  }
  constructor(props: any) {
    super(props)
    this.state = this.getInitState(props)
  }
  getInitState = (props: Props): State => {
    let prescriptionDrugCategoryList: PrescriptionDrugCategory[] = []
    if (props.navigation.state.params) {
      prescriptionDrugCategoryList = props.navigation.state.params.prescriptionDrugCategoryList
    }
    return {
      hasLoad: false,
      refreshing: false,
      chatKey: "",
      currDrugId: 0,
      page: -1,
      limit: -1,
      filter: {},
      search: "",
      prescriptionDrugCategoryList,
      matchDrugList: [],
      popularDrugList: [],
    }
  }
  async componentDidMount() {
    this.init()
    this.props.navigation.setParams({
      prescriptionDrugCategoryList: this.state.prescriptionDrugCategoryList,
    })
  }
  init = async () => {
    let activeId = this.props.navigation.getParam("activeId")
    let {
      data: { list: popularDrugList },
    } = await listPopularDrug({
      page: 1,
      limit: 30,
      filter: {
        category: {
          condition: TYPE.eq,
          val: activeId,
        },
      },
    })
    this.setState({
      popularDrugList,
      hasLoad: true,
    })
  }
  getDrugList = async (page: number, limit: number, filter = {}) => {
    try {
      let {
        data: { list: drugList },
      } = await hospital.getDrugList({
        page,
        limit,
        filter,
      })
      return drugList
    } catch (err) {
      console.log(err)
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
  search = async (val: string) => {
    this.setState({
      search: val,
    })
    if (!val) {
      return
    }
    try {
      let filter = {
        name: {
          condition: TYPE.like,
          val,
        },
        category: {
          condition: TYPE.eq,
          val: this.props.navigation.state.params!.activeId || 0,
        },
      }
      let matchDrugList = await this.getDrugList(-1, -1, filter)
      this.setState({
        matchDrugList,
      })
    } catch (err) {
      console.log(err)
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
    const isInSession = this.props.navigation.state.params!.isInSession
    const drugCategoryId = this.props.navigation.state.params!.activeId
    return (
      <KeyboardAvoidingView
        enabled={Platform.OS !== "android"}
        behavior="padding"
        style={{ flex: 1 }}
        keyboardVerticalOffset={70}>
        <ScrollView
          // keyboardShouldPersistTaps="always"
          style={style.main}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }>
          <View
            style={[
              style.header,
              global.flex,
              global.alignItemsCenter,
              global.justifyContentSpaceBetween,
            ]}>
            <TouchableOpacity
              disabled={isInSession !== true}
              onPress={() => {
                this.props.navigation.navigate(pathMap.AdvisoryChat)
              }}>
              <Text
                style={[
                  style.headerItem,
                  global.fontSize14,
                  isInSession !== true ? style.headerItemDisabled : null,
                ]}>
                回到对话
              </Text>
            </TouchableOpacity>
            <View style={style.headerLine} />
            <TouchableOpacity
              onPress={() => {
                let prescriptionDrugCategoryList = this.state.prescriptionDrugCategoryList
                prescriptionDrugCategoryList = prescriptionDrugCategoryList.filter(
                  v => v.id !== drugCategoryId,
                )
                this.props.navigation.setParams({
                  prescriptionDrugCategoryList,
                })
                this.setState({
                  prescriptionDrugCategoryList,
                })
              }}>
              <Text style={[style.headerItem, global.fontSize14]}>清空处方</Text>
            </TouchableOpacity>
            <View style={style.headerLine} />
            <TouchableOpacity>
              <Text style={[style.headerItem, style.headerItemDisabled, global.fontSize14]}>
                看问诊单
              </Text>
            </TouchableOpacity>
          </View>
          <View style={style.list}>
            {/* 当前已经选择的药品信息 */}
            <View style={this.state.search === "" ? style.drugList : global.hidden}>
              {this.state.prescriptionDrugCategoryList.map((category, k) => {
                if (category.id !== drugCategoryId) {
                  return false
                }
                return category.drugList.map((drugInfo, k2) => {
                  setTimeout(() => {
                    if (this.state.currDrugId === drugInfo.id) {
                      try {
                        this.refs["input" + drugInfo.id].focus()
                      } catch (e) {
                        console.log(e)
                      }
                    }
                  }, 500)
                  return (
                    <View
                      key={k + "-" + k2}
                      style={[
                        style.item,
                        global.flex,
                        global.justifyContentSpaceBetween,
                        global.alignItemsCenter,
                      ]}>
                      <TouchableOpacity
                        onPress={() => {
                          let { prescriptionDrugCategoryList } = this.state
                          prescriptionDrugCategoryList[k].drugList = prescriptionDrugCategoryList[
                            k
                          ].drugList.filter(currDrugInfo => currDrugInfo.id !== drugInfo.id)
                          this.setState({
                            prescriptionDrugCategoryList,
                          })
                        }}>
                        <Icon style={[style.itemIcon, global.fontSize22]} name="minus-circle" />
                      </TouchableOpacity>
                      <View style={style.itemCenter}>
                        <View
                          style={[
                            style.itemCenterTitleFa,
                            global.flex,
                            global.alignItemsCenter,
                            global.justifyContentSpaceBetween,
                          ]}>
                          <Text
                            style={[style.itemCenterTitle, global.fontSize14]}
                            numberOfLines={1}>
                            {drugInfo.detail.name}
                          </Text>
                          <View
                            style={[
                              style.setCount,
                              global.flex,
                              global.alignItemsCenter,
                              global.justifyContentSpaceBetween,
                            ]}>
                            <TouchableOpacity
                              onPress={() => {
                                let { prescriptionDrugCategoryList } = this.state
                                if (prescriptionDrugCategoryList[k].drugList[k2].count > 1) {
                                  prescriptionDrugCategoryList[k].drugList[k2].count--
                                }
                                this.setState({
                                  prescriptionDrugCategoryList,
                                })
                              }}>
                              <Text style={[style.btn, global.fontSize18]}>-</Text>
                            </TouchableOpacity>
                            <View
                              style={{
                                width: 60,
                              }}>
                              <InputItem
                                last
                                ref={"input" + drugInfo.id}
                                type="number"
                                placeholder="0"
                                style={[style.count, global.fontSize14]}
                                value={drugInfo.count === 0 ? "" : drugInfo.count + ""}
                                onChange={val => {
                                  let { prescriptionDrugCategoryList } = this.state
                                  if (val) {
                                    let count = parseInt(val)
                                    if (!isNaN(count)) {
                                      prescriptionDrugCategoryList[k].drugList[k2].count =
                                        count === 0 ? 1 : count
                                    }
                                  } else if (val === "") {
                                    prescriptionDrugCategoryList[k].drugList[k2].count = 0
                                  }
                                  this.setState({
                                    prescriptionDrugCategoryList,
                                  })
                                }}
                                onBlur={evt => {
                                  this.setState({
                                    currDrugId: 0,
                                  })
                                  let { prescriptionDrugCategoryList } = this.state

                                  if (evt === "") {
                                    prescriptionDrugCategoryList[k].drugList[k2].count = 0
                                  }
                                  this.setState({
                                    prescriptionDrugCategoryList,
                                  })
                                }}
                              />
                            </View>
                            <TouchableOpacity
                              onPress={() => {
                                let { prescriptionDrugCategoryList } = this.state
                                prescriptionDrugCategoryList[k].drugList[k2].count++
                                this.setState({
                                  prescriptionDrugCategoryList,
                                })
                              }}>
                              <Text style={[style.btn, global.fontSize18]}>+</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View
                          style={[style.itemCenterDetail, global.flex, global.alignItemsCenter]}>
                          <Text style={[style.itemCenterDetailTitle, global.fontSize12]}>
                            {drugInfo.detail.price / 1000}元/{drugInfo.detail.unit}
                          </Text>
                          <View style={style.littleSpot} />
                          <Text style={[style.itemCenterDetailTitle, global.fontSize12]}>
                            {drugInfo.detail.standard}
                          </Text>
                        </View>
                        <Text
                          style={[style.itemCenterDetailCompany, global.fontSize12]}
                          numberOfLines={1}>
                          {drugInfo.detail.manufacturer}
                        </Text>
                      </View>
                    </View>
                  )
                })
              })}
            </View>
            <List>
              <InputItem
                style={style.input}
                placeholder="请输入药材名称"
                value={this.state.search}
                onChange={this.search}
              />
            </List>
            <View style={this.state.search === "" ? style.popularDrug : global.hidden}>
              <View
                style={[style.popularDrugList, global.flex, global.alignItemsCenter, global.wrap]}>
                {this.state.popularDrugList.map((drug, k) => {
                  return (
                    <TouchableOpacity
                      style={style.popularDrugItem}
                      key={k}
                      onPress={() => {
                        let { prescriptionDrugCategoryList } = this.state
                        let currCategoryId = this.props.navigation.state.params!.activeId
                        try {
                          let hasCategory = false
                          for (let category of prescriptionDrugCategoryList) {
                            if (category.id === currCategoryId) {
                              hasCategory = true
                              for (let drugInfo of category.drugList) {
                                if (drugInfo.id === drug.id) {
                                  drugInfo.count++
                                  throw new Error("当前药品已存在,数量加1,中断")
                                }
                              }
                            }
                          }
                          if (!hasCategory) {
                            prescriptionDrugCategoryList.push({
                              id: currCategoryId,
                              name: this.getCategoryName(currCategoryId),
                              drugList: [
                                {
                                  id: drug.id,
                                  count: 0,
                                  detail: drug,
                                },
                              ],
                            })
                          } else {
                            for (let category of prescriptionDrugCategoryList) {
                              if (category.id === currCategoryId) {
                                category.drugList.push({
                                  id: drug.id,
                                  count: 0,
                                  detail: drug,
                                })
                              }
                            }
                          }
                        } catch (e) {}
                        this.setState({
                          prescriptionDrugCategoryList,
                          matchDrugList: [],
                          search: "",
                          currDrugId: drug.id,
                        })
                      }}>
                      <Text style={style.drugItemTitle}>{drug.name}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
            <View style={this.state.search !== "" ? style.drugList : global.hidden}>
              {/* 当前匹配的药品列表 */}
              {this.state.matchDrugList.map((drug, k) => {
                return (
                  <TouchableOpacity
                    key={k}
                    onPress={() => {
                      let { prescriptionDrugCategoryList } = this.state
                      let currCategoryId = this.props.navigation.state.params!.activeId
                      try {
                        let hasCategory = false
                        for (let category of prescriptionDrugCategoryList) {
                          if (category.id === currCategoryId) {
                            hasCategory = true
                            for (let drugInfo of category.drugList) {
                              if (drugInfo.id === drug.id) {
                                drugInfo.count++
                                throw new Error("当前药品已存在,数量加1,中断")
                              }
                            }
                          }
                        }
                        if (!hasCategory) {
                          prescriptionDrugCategoryList.push({
                            id: currCategoryId,
                            name: this.getCategoryName(currCategoryId),
                            drugList: [
                              {
                                id: drug.id,
                                count: 0,
                                detail: drug,
                              },
                            ],
                          })
                        } else {
                          for (let category of prescriptionDrugCategoryList) {
                            if (category.id === currCategoryId) {
                              category.drugList.push({
                                id: drug.id,
                                count: 0,
                                detail: drug,
                              })
                            }
                          }
                        }
                      } catch (e) {}
                      this.setState({
                        prescriptionDrugCategoryList,
                        matchDrugList: [],
                        search: "",
                        currDrugId: drug.id,
                      })
                    }}>
                    <View style={style.drugItem}>
                      <Text style={[style.drugTitle, global.fontSize14]} numberOfLines={1}>
                        {drug.name}
                      </Text>
                      <View style={[style.drugDetail, global.flex, global.alignItemsCenter]}>
                        <Text style={[style.drugDescription, global.fontSize12]}>
                          {drug.price / 1000}元/{drug.unit}
                        </Text>
                        <View style={style.littleSpot} />
                        <Text style={[style.drugDescription, global.fontSize12]}>
                          {drug.standard}
                        </Text>
                      </View>
                      <Text style={[style.drugCompany, global.fontSize12]}>
                        {drug.manufacturer}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
  getCategoryName = (id: number): string => {
    for (let v of this.props.navigation.state.params!.categoryList) {
      if (v.id === id) {
        return v.name
      }
    }
    return ""
  }
}
