import global from "@/assets/styles/global"
import pathMap from "@/routes/pathMap"
import hospital from "@/services/hospital"
import { Icon, InputItem, Toast } from "@ant-design/react-native"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
import {
  DeviceEventEmitter,
  Image,
  PixelRatio,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { NavigationScreenProp } from "react-navigation"
import { activeDrugItem, drugItem } from "./SquareRoot"
import { TYPE } from "@/utils/constant"
const style = gStyle.advisory.DrugSelect
export interface CategoryItem {
  id: number
  name: string
}
interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  page: number
  limit: number
  chatKey: string
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
      headerRight: <Text />,
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            let chooseDrugInfo = navigation.state.params!.navigatePress()
            DeviceEventEmitter.emit(pathMap.SquareRoot + "Reload", chooseDrugInfo)
            navigation.goBack()
          }}>
          <Icon style={[style.headerLeft, global.fontSize16]} name="left" />
        </TouchableOpacity>
      ),
    }
  }
  constructor(props: Props) {
    super(props)
    this.state = this.getInitState(props)
  }
  getInitState = (props: Props): State => {
    let chooseDrugInfo: any
    if (props.navigation.state.params) {
      chooseDrugInfo = props.navigation.state.params.chooseDrugInfo
    }
    return {
      hasLoad: false,
      refreshing: false,
      chatKey: "",
      page: -1,
      limit: -1,
      filter: {},
      search: "",
      chooseDrugInfo,
      matchDrugList: [],
    }
  }
  async componentDidMount() {
    await this.init()
    this.props.navigation.setParams({ navigatePress: this.getDrugInfo })
  }
  getDrugInfo = () => {
    return this.state.chooseDrugInfo
  }
  init = async () => {
    this.setState({
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
      let matchDrugList2 = [
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
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate(pathMap.AdvisoryChat)
            }}>
            <Text style={[style.headerItem, global.fontSize14]}>回到对话</Text>
          </TouchableOpacity>
          <View style={style.headerLine} />
          <TouchableOpacity
            onPress={() => {
              this.setState({
                chooseDrugInfo: [],
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
          {Object.keys(this.state.chooseDrugInfo).map((drugIdStr, k) => {
            let drugId: number = parseInt(drugIdStr),
              list = this.state.chooseDrugInfo
            return (
              <View
                key={k}
                style={[
                  style.item,
                  global.flex,
                  global.justifyContentSpaceBetween,
                  global.alignItemsCenter,
                ]}>
                <TouchableOpacity
                  onPress={() => {
                    let { chooseDrugInfo } = this.state
                    delete chooseDrugInfo[drugId]
                    this.setState({
                      chooseDrugInfo,
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
                    <Text style={[style.itemCenterTitle, global.fontSize14]} numberOfLines={1}>
                      {list[drugId].info.name}
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
                          let { chooseDrugInfo } = this.state
                          if (chooseDrugInfo[drugId].count > 1) {
                            chooseDrugInfo[drugId].count--
                          }
                          this.setState({
                            chooseDrugInfo,
                          })
                        }}>
                        <Text style={[style.btn, global.fontSize18]}>-</Text>
                      </TouchableOpacity>
                      <Text style={[style.count, global.fontSize14]}>{list[drugId].count}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          let { chooseDrugInfo } = this.state
                          chooseDrugInfo[drugId].count++
                          this.setState({
                            chooseDrugInfo,
                          })
                        }}>
                        <Text style={[style.btn, global.fontSize18]}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={[style.itemCenterDetail, global.flex, global.alignItemsCenter]}>
                    <Text style={[style.itemCenterDetailTitle, global.fontSize12]}>
                      {list[drugId].info.price / 100}元/{list[drugId].info.unit}
                    </Text>
                    <View style={style.littleSpot} />
                    <Text style={[style.itemCenterDetailTitle, global.fontSize12]}>
                      {list[drugId].info.standard}
                    </Text>
                  </View>
                  <Text
                    style={[style.itemCenterDetailCompany, global.fontSize12]}
                    numberOfLines={1}>
                    {list[drugId].info.manufacturer}
                  </Text>
                </View>
              </View>
            )
          })}
          <InputItem
            clear
            style={style.input}
            placeholder="请输入药材名称"
            value={this.state.search}
            onChange={this.search}
          />
        </View>
        <View style={this.state.search !== "" ? style.drugList : global.hidden}>
          <InputItem
            clear
            style={style.input}
            placeholder="请输入药材名称2"
            value={this.state.search}
            onChange={this.search}
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
                <View style={style.drugItem}>
                  <Text style={[style.drugTitle, global.fontSize14]} numberOfLines={1}>
                    {drug.name}
                  </Text>
                  <View style={[style.drugDetail, global.flex, global.alignItemsCenter]}>
                    <Text style={[style.drugDescription, global.fontSize12]}>
                      {drug.price / 100}元/{drug.unit}
                    </Text>
                    <View style={style.littleSpot} />
                    <Text style={[style.drugDescription, global.fontSize12]}>{drug.standard}</Text>
                  </View>
                  <Text style={[style.drugCompany, global.fontSize12]}>{drug.manufacturer}</Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>
    )
  }
}
