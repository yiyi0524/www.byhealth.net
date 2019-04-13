import global from "@/assets/styles/global"
import { BASE_URL } from "@/config/api"
import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import api, { windowWidth } from "@/services/api"
import { Icon, ImagePicker, TextareaItem, Toast } from "@ant-design/react-native"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
import {
  Image,
  PixelRatio,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  DeviceEventEmitter,
  EmitterSubscription,
} from "react-native"
import { NavigationScreenProp, ScrollView } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { Picture } from "./Chat"
import DashLine from "@components/DashLine"
import Pharmacy, { CategoryItem } from "@components/Pharmacy"
import hospital from "@api/hospital"
import pathMap from "@routes/pathMap"
const style = gStyle.advisory.SquareRoot
interface Props {
  navigation: NavigationScreenProp<State>
}

interface State {
  isSelectPharmacy: boolean
  isSelectDrug: boolean
  hasLoad: boolean
  refreshing: boolean
  patientId: number
  temp: string
  medicalRecordPic: Picture[]
  pharmacy: {
    categoryList: CategoryItem[]
    activeId: number
  }
  chooseDrugInfo: Record<number, { count: number; info: drugItem }>
}
export interface activeDrugItem {
  id: number
  count: number
}
export interface drugItem {
  id: number
  name: string
  price: number
  unit: string
  standard: string
  signature: string
  manufacturer: string
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
export default class SquareRoot extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = () => {
    return {
      title: "在线开方",
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
  listener?: EmitterSubscription
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      isSelectPharmacy: false,
      isSelectDrug: false,
      pharmacy: {
        activeId: 0,
        categoryList: [],
      },
      temp: "病毒性感冒",
      patientId: 0,
      medicalRecordPic: [],
      chooseDrugInfo: [],
    }
  }
  async componentDidMount() {
    await this.init()
    this.listener = DeviceEventEmitter.addListener(
      pathMap.SquareRoot + "Reload",
      chooseDrugInfo => {
        this.setState({
          chooseDrugInfo,
        })
        // this.init()
      },
    )
  }
  componentWillUnmount() {
    //移除监听
    if (this.listener) {
      this.listener.remove()
    }
  }
  getDrugList = () => {}
  init = async () => {
    let patientId = this.props.navigation.getParam("patientId")
    try {
      let {
        data: { list: categoryList },
      } = await hospital.getDrugCategoryList({ page: -1, limit: -1, filter: {} })
      let pharmacy = this.state.pharmacy
      pharmacy.categoryList = categoryList
      pharmacy.activeId = categoryList[0].id
      this.setState({
        hasLoad: true,
        patientId,
        pharmacy,
      })
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
  handleFileChange = (medicalRecordPic: any, operationType: string) => {
    if (operationType === "add") {
      api
        .uploadImg(medicalRecordPic[medicalRecordPic.length - 1])
        .then(json => {
          let medicalRecordPic = this.state.medicalRecordPic
          let picMode: Picture = { id: 0, title: "", url: "" }
          medicalRecordPic.push(picMode)
          medicalRecordPic[medicalRecordPic.length - 1].url = BASE_URL + json.data.url
          medicalRecordPic[medicalRecordPic.length - 1].id = json.data.picId
          console.log(medicalRecordPic)
          this.setState({
            medicalRecordPic,
          })
        })
        .catch(err => {
          Toast.fail("上传失败, 错误原因: " + err.msg + ", 请重试", 3)
          console.log(err)
        })
    } else if (operationType === "remove") {
      this.setState({
        medicalRecordPic,
      })
    }
  }
  saveTemp = async () => {
    // let temp = this.state.temp
    try {
      // await user.saveTemp({ temp })
    } catch (err) {
      Toast.fail("修改辨病失败, 错误信息: " + err.msg, 3)
      console.log(err)
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
          <View style={style.prompt}>
            <Text style={[style.promptTitle, global.fontSize14]}>
              互联网诊疗仅适用常见病、慢性病复诊, 且您必须掌握患者病历,
              确定其在实体医疗机构有过同诊断。请勿为首诊、急重症患者在线诊疗。
            </Text>
          </View>
          {/* 诊断 */}
          <View style={style.diagnosis}>
            <View
              style={[
                style.theme,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentCenter,
              ]}>
              <View style={style.titleSpot} />
              <Text style={[style.title, global.fontSize14]}> 诊断 </Text>
              <View style={style.titleSpot} />
            </View>
            <View style={[style.diagnosisItem, global.flex, global.alignItemsCenter]}>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>患者信息</Text>
              <Text style={[style.diagnosisItemLineTitle, global.fontSize14]}>孟磊</Text>
              <Text style={[style.diagnosisItemLineTitle, global.fontSize14]}>男</Text>
              <Text style={[style.diagnosisItemLineTitle, global.fontSize14]}>23 岁</Text>
            </View>
            <View style={[style.diagnosisItem, global.flex, global.alignItemsCenter]}>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>辨病</Text>
              <View style={style.diagnosisItemInput}>
                <TextareaItem
                  style={style.input}
                  autoHeight
                  value={this.state.temp}
                  onChange={value => {
                    this.setState({
                      temp: value as string,
                    })
                  }}
                  onBlur={this.saveTemp}
                />
              </View>
            </View>
            <View style={[style.diagnosisItem, global.flex, global.alignItemsCenter]}>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>辩证</Text>
              <View style={style.diagnosisItemInput}>
                <TextareaItem
                  style={style.input}
                  autoHeight
                  value={this.state.temp}
                  onChange={value => {
                    this.setState({
                      temp: value as string,
                    })
                  }}
                  onBlur={this.saveTemp}
                />
              </View>
            </View>
            <View style={style.diagnosisPic}>
              <Text style={[style.diagnosisPicTitle, global.fontSize14]}>实体医疗机构病历</Text>
              <View style={style.diagnosisItemImg}>
                <ImagePicker
                  onChange={this.handleFileChange}
                  files={this.state.medicalRecordPic}
                  selectable={this.state.medicalRecordPic.length < 9}
                />
              </View>
            </View>
          </View>
          {/* 开方 */}
          <View style={style.diagnosis}>
            <View
              style={[
                style.theme,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentCenter,
              ]}>
              <View style={style.titleSpot} />
              <Text style={[style.title, global.fontSize14]}> 开方 </Text>
              <View style={style.titleSpot} />
            </View>
            {/* <View
              style={[
                style.pharmacyName,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentSpaceBetween,
              ]}>
              <View style={[style.editPharmacyName, global.flex, global.alignItemsCenter]}>
                <Text style={[style.pharmacyNameTitle, global.fontSize14]} numberOfLines={1}>
                  {this.state.pharmacy.activeId === 0 ? "未选择药房" : null}
                  {this.state.pharmacy.categoryList.map(category => {
                    if (category.id === this.state.pharmacy.activeId) {
                      return category.title
                    }
                  })}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    isSelectPharmacy: true,
                  })
                }}>
                <View style={[global.flex, global.alignItemsCenter]}>
                  <Text style={[style.pharmacyNameTitle, global.fontSize14]}>去更换</Text>
                  <Icon style={[style.pharmacyNameIcon, global.fontSize14]} name="right" />
                </View>
              </TouchableOpacity>
            </View> */}
            <DashLine len={45} width={windowWidth - 46} backgroundColor={sColor.colorEee} />
            <Text style={[style.drug, global.fontSize24]}>R:</Text>
            <View style={style.drugList}>
              {Object.keys(this.state.chooseDrugInfo).map((drugIdStr, k) => {
                let drugId: number = parseInt(drugIdStr),
                  list = this.state.chooseDrugInfo
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
                          style={[style.drugItemLeftTitle, global.fontSize14]}
                          numberOfLines={1}>
                          {list[drugId].info.name}
                        </Text>
                        <Text
                          style={[style.drugItemLeftDetail, global.fontSize12]}
                          numberOfLines={1}>
                          {list[drugId].info.standard}
                        </Text>
                        <Text
                          style={[style.drugItemLeftDetail, global.fontSize12]}
                          numberOfLines={1}>
                          {list[drugId].info.manufacturer}
                        </Text>
                      </View>
                      <View style={style.drugItemRight}>
                        <Text
                          style={[style.drugItemLeftTitle, global.fontSize14]}
                          numberOfLines={1}>
                          {list[drugId].count}
                          {list[drugId].info.unit}
                        </Text>
                        <Text
                          style={[style.drugItemLeftDetail, global.fontSize12]}
                          numberOfLines={1}>
                          {(list[drugId].info.price / 100) * list[drugId].count}元
                        </Text>
                      </View>
                    </View>
                    <View style={[style.usageDosage, global.flex, global.alignItemsCenter]}>
                      <Text style={[style.diagnosisItemTitle, global.fontSize14]}>用法用量</Text>
                      <View style={style.diagnosisItemInput}>
                        <TextareaItem
                          style={style.input}
                          autoHeight
                          value={list[drugId].info.signature}
                          onChange={value => {
                            this.setState({
                              temp: value as string,
                            })
                          }}
                          onBlur={this.saveTemp}
                        />
                      </View>
                    </View>
                  </View>
                )
              })}
              <Text style={[style.drugPrompt, global.fontSize12]}>
                *单个处方中药成分不宜超过
                <Text style={[style.important, global.fontSize12]}>5种</Text>
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    isSelectPharmacy: true,
                  })
                }}>
                <View style={[style.editDrug, global.flex, global.alignItemsCenter]}>
                  <Icon
                    style={[style.editDrugIcon, style.important, global.fontSize16]}
                    name="form"
                  />
                  <Text style={[style.important, global.fontSize14]}>编辑药材</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {/* 选填 */}
          <View style={style.diagnosis}>
            <View
              style={[
                style.theme,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentCenter,
              ]}>
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
                  value={this.state.temp}
                  onChange={value => {
                    this.setState({
                      temp: value as string,
                    })
                  }}
                  onBlur={this.saveTemp}
                />
              </View>
            </View>
          </View>
          {/* 明细 */}
          <View style={style.diagnosis}>
            <View
              style={[
                style.theme,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentCenter,
              ]}>
              <View style={style.titleSpot} />
              <Text style={[style.title, global.fontSize14]}> 明细 </Text>
              <View style={style.titleSpot} />
            </View>
            <View
              style={[
                style.diagnosisItem,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentSpaceBetween,
              ]}>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>药费</Text>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>¥ 0.0</Text>
            </View>
            <View
              style={[
                style.diagnosisItem,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentSpaceBetween,
              ]}>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>诊后管理费</Text>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>¥ 0.0</Text>
            </View>
            <DashLine len={45} width={windowWidth - 46} backgroundColor={sColor.colorEee} />
            <View
              style={[
                style.diagnosisItem,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentSpaceBetween,
              ]}>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>
                总计
                <Text style={[style.diagnosisItemDetail, global.fontSize12]}>( 不含快递费 )</Text>
              </Text>
              <Text style={[style.diagnosisItemAll, global.fontSize15]}>¥ 0.0</Text>
            </View>
            <DashLine len={45} width={windowWidth - 46} backgroundColor={sColor.colorEee} />
          </View>
          <TouchableOpacity>
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
            closeChooseCategory={this.closeChooseCategory}
            chooseDrugInfo={this.state.chooseDrugInfo}
          />
        </View>
      </>
    )
  }
}
