import global from "@/assets/styles/global"
import sColor from "@styles/color"
import gStyle from "@utils/style"
import React, { Component } from "react"
import {
  PixelRatio,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  RefreshControl,
} from "react-native"
import { NavigationScreenProp } from "react-navigation"
import { drugItem, activeDrugItem } from "./SquareRoot"
import { Toast, Icon, Stepper, InputItem } from "@ant-design/react-native"
import gImg from "@utils/img"
import hospital from "@/services/hospital"
const style = gStyle.advisory.DrugSelect
export interface CategoryItem {
  id: number
  title: string
}
interface Props {}
interface State {
  hasLoad: boolean
  refreshing: boolean
  page: number
  limit: number
  filter: {}
  // 当前已经选择的药品信息
  chooseDrugInfo: Record<number, { count: number; info: drugItem }>
  // 与搜索匹配的药品列表
  matchDrugList: drugItem[]
  search: string
}
interface Params {
  activeId: number
  categoryList: CategoryItem[]
  activeDrugList: activeDrugItem[]
  chooseDrugList: (id: number, count: number) => void
}
export default class Pharmacy extends Component<Props, State> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<State> }) => {
    let title = "先择药材"
    let params = navigation.state.params as Params
    for (let v of params.categoryList) {
      if (v.id === params.activeId) {
        title = v.title
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
      headerRight: <Text />,
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
      page: -1,
      limit: -1,
      filter: {},
      search: "",
      chooseDrugInfo: {},
      matchDrugList: [],
    }
  }
  async componentDidMount() {
    await this.init()
  }
  init = async () => {
    try {
      // let page = this.state.page,
      //   limit = this.state.limit,
      //   filter = this.state.filter
      // let matchDrugList = await this.getDrugList(page, limit, filter)
      let matchDrugList = [
        {
          id: 1,
          name: "杏仁清热",
          price: 1500,
          unit: "盒",
          standard: "6gx12袋(盒)",
          signature: "一天一次,一次一袋",
          manufacturer: "南京股份有限公司",
        },
        {
          id: 2,
          name: "小柴胡颗粒",
          price: 1500,
          unit: "盒",
          standard: "6gx12袋(盒)",
          signature: "一天一次,一次一袋",
          manufacturer: "南京股份有限公司",
        },
        {
          id: 3,
          name: "小柴胡颗粒1",
          price: 1500,
          unit: "盒",
          standard: "6gx12袋(盒)",
          signature: "一天一次,一次一袋",
          manufacturer: "南京股份有限公司",
        },
        {
          id: 4,
          name: "小柴胡颗粒2",
          price: 1500,
          unit: "盒",
          standard: "6gx12袋(盒)",
          signature: "一天一次,一次一袋",
          manufacturer: "南京股份有限公司",
        },
      ]
      this.setState({
        hasLoad: true,
        matchDrugList,
      })
    } catch (err) {
      console.log(err)
    }
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
  render() {
    if (!this.state.hasLoad) {
      return (
        <View style={style.loading}>
          <View style={style.loadingPic}>
            <Image style={style.loadingImg} source={gImg.common.loading} />
          </View>
          <Text style={[style.loadingTitle, global.fontSize14, global.fontStyle]}>加载中...</Text>
        </View>
      )
    }
    return (
      <ScrollView
        keyboardShouldPersistTaps="always"
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
          <TouchableOpacity>
            <Text style={[style.headerItem, global.fontSize14]}>回到对话</Text>
          </TouchableOpacity>
          <View style={style.headerLine} />
          <TouchableOpacity>
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
          {Object.keys(this.state.chooseDrugInfo).map((drugIdStr, k) => {
            let drugId: number = parseInt(drugIdStr)
            return (
              <View key={k}>
                <Text
                  onPress={() => {
                    let { chooseDrugInfo } = this.state
                    chooseDrugInfo[drugId].count--
                    if (chooseDrugInfo[drugId].count === 0) {
                      delete chooseDrugInfo[drugId]
                    }
                    this.setState({
                      chooseDrugInfo,
                    })
                  }}>
                  -----------
                </Text>
                <Text>{this.state.chooseDrugInfo[drugId].info.name}</Text>
                <Text>{this.state.chooseDrugInfo[drugId].count}</Text>
                <Text
                  onPress={() => {
                    let { chooseDrugInfo } = this.state
                    chooseDrugInfo[drugId].count++
                    this.setState({
                      chooseDrugInfo,
                    })
                  }}>
                  ++++++
                </Text>
              </View>
            )
          })}
          {/*this.state.drugList.map((drug: drugItem, k: number) => {
            for (let i = 0, list = this.state.activeDrugList; i < list.length; i++) {
              if (list[i].id === drug.id) {
                return (
                  <View
                    key={k}
                    style={[
                      style.item,
                      global.flex,
                      global.justifyContentSpaceBetween,
                      global.alignItemsCenter,
                    ]}>
                    <TouchableOpacity>
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
                        <Text style={[style.itemCenterTitle, global.fontSize14]} numberOfLines={1}>
                          {drug.name}
                        </Text>
                        <Stepper
                          styles={style.stepper}
                          inputStyle={style.stepperInput}
                          min={1}
                          step={1}
                          defaultValue={1}
                          value={list[i].count}
                          onChange={value => {
                            let activeDrugList = this.state.activeDrugList
                            activeDrugList[i].count = value
                            this.setState({ activeDrugList })
                          }}
                        />
                      </View>
                      <View style={[style.itemCenterDetail, global.flex, global.alignItemsCenter]}>
                        <Text style={[style.itemCenterDetailTitle, global.fontSize12]}>
                          {v.price / 100}元/{v.unit}
                        </Text>
                        <View style={style.littleSpot} />
                        <Text style={[style.itemCenterDetailTitle, global.fontSize12]}>
                          {v.description}
                        </Text>
                        <View style={style.littleSpot} />
                        <Text style={[style.itemCenterDetailTitle, global.fontSize12]}>
                          {v.isPrescription ? "Rx" : "OTC"}
                        </Text>
                      </View>
                      <Text
                        style={[style.itemCenterDetailCompany, global.fontSize12]}
                        numberOfLines={1}>
                        {v.company}
                      </Text>
                    </View>
                  </View>
                )
              }
            }
          })*/}
          <InputItem
            clear
            style={style.input}
            placeholder="请输入药材名称"
            value={this.state.search}
            onChange={value => {
              this.setState({
                search: value,
              })
            }}
          />
        </View>
        <View style={this.state.search !== "" ? style.drugList : global.hidden}>
          <InputItem
            clear
            style={style.input}
            placeholder="请输入药材名称2"
            value={this.state.search}
            onChange={value => {
              this.setState({
                search: value,
              })
            }}
          />
          {/* 当前匹配的药品列表 */}
          {this.state.matchDrugList.map((drug, k) => {
            return (
              <TouchableOpacity
                key={k}
                onPress={() => {
                  let { chooseDrugInfo } = this.state
                  if (drug.id in chooseDrugInfo) {
                    chooseDrugInfo[drug.id].count++
                  } else {
                    chooseDrugInfo[drug.id] = {
                      count: 1,
                      info: drug,
                    }
                  }
                  this.setState({ chooseDrugInfo, matchDrugList: [], search: "" })
                }}>
                <View key={k}>
                  <Text>{drug.name}</Text>
                </View>
              </TouchableOpacity>
            )
          })}
          {/*this.state.drugList.map((v: drugItem, k: number) => {
            for (let i = 0, list = this.state.search; i < list.length; i++) {
              if (v.name.indexOf(list[i]) !== -1) {
                return (
                  <TouchableOpacity
                    key={k}
                    onPress={() => {
                      let { activeDrugList } = this.state
                      if (activeDrugList.length > 0) {
                        for (let v1 of activeDrugList) {
                          if (v1.id === v.id) {
                            v1.count = v1.count + 1
                          } else {
                            activeDrugList.push({
                              id: v.id,
                              count: 1,
                            })
                          }
                        }
                      } else {
                        activeDrugList.push({
                          id: v.id,
                          count: 1,
                        })
                      }
                      console.log(activeDrugList)
                      this.setState({
                        search: "",
                        activeDrugList,
                      })
                    }}>
                    <View style={style.drugItem}>
                      <Text style={[style.drugTitle, global.fontSize14]} numberOfLines={1}>
                        {v.name}
                      </Text>
                      <View style={[style.drugDetail, global.flex, global.alignItemsCenter]}>
                        <Text style={[style.drugDescription, global.fontSize12]}>
                          {v.price / 100}元/{v.unit}
                        </Text>
                        <View style={style.littleSpot} />
                        <Text style={[style.drugDescription, global.fontSize12]}>
                          {v.description}
                        </Text>
                        <View style={style.littleSpot} />
                        <Text style={[style.drugDescription, global.fontSize12]}>
                          {v.isPrescription ? "RX" : "OTC"}
                        </Text>
                      </View>
                      <Text style={[style.drugCompany, global.fontSize12]}>{v.company}</Text>
                    </View>
                  </TouchableOpacity>
                )
              }
            }
          })*/}
        </View>
      </ScrollView>
    )
  }
}
