import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import pathMap from "@/routes/pathMap"
import api from "@/services/api"
import { GENDER, GENDER_ZH } from "@/services/doctor"
import { getPicFullUrl } from "@/utils/utils"
import { Icon, Toast } from "@ant-design/react-native"
import patientApi, { Drug, InquirySheet } from "@api/patient"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
import { Image, PixelRatio, RefreshControl, ScrollView, Text, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { NavigationScreenProp } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { Picture } from "../advisory/Chat"
import moment from "moment"
import hospital from "@/services/hospital"
import { IconNames } from "@ant-design/react-native/lib/icon"
const style = gStyle.advisory.AdvisoryPatientDetail
const global = gStyle.global
/**
 * 患者信息
 */
export interface PatientInfo {
  name: string
  avatar: Picture
  gender: number
  yearAge: 0
  monthAge: 0
  provinceCid: string
  remarks: string
  phone: string
  height: number
  weight: number
  state: string
  allergyHistory: string
  medicalHistory: string
  hospitalMedicalRecordPicList: Picture[] //实体医疗机构病历列表
}
export interface MedicalRecord {
  consultation: {
    //复诊
    id: number
    patientState: string //患者自述
    lingualSurfacePicList: Picture[] //舌照面及其他资料照片
    dialoguePicList: Picture[] //对话照片
  }
  squareRoot: {
    //开方
    id: number
    discrimination: string //诊断,辨病
    syndromeDifferentiation: string //辩证
    drugList: Drug[] //治疗的药品列表
    time: string
  }
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
interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  hasLoad: boolean
  showInquirySheet: boolean
  refreshing: boolean
  isShowMode: boolean
  uid: number
  consultationId: number
  inquirySheetIcon: IconNames
  patientInfo: PatientInfo
  showImg: any
  region: Region[]
  medicalRecordList: MedicalRecord[]
  drugList: drugCategory[]
  inquirySheet: InquirySheet
}
interface drugCategory {
  id: number
  name: string
}
export interface Region {
  cid: string
  value?: string
  label?: string
  areaName: string
  children: Region[]
}
@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class PatientDetail extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = () => ({
    title: "病历",
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
  })
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      isShowMode: false,
      showInquirySheet: false,
      inquirySheetIcon: "down",
      showImg: gImg.common.defaultAvatar,
      uid: this.props.navigation.getParam("patientUid"),
      consultationId: this.props.navigation.getParam("consultationId"),
      region: [],
      patientInfo: {
        name: "",
        yearAge: 0,
        monthAge: 0,
        allergyHistory: "",
        avatar: {
          id: 0,
          url: "",
          title: "",
        },
        medicalHistory: "",
        phone: "",
        provinceCid: "",
        remarks: "",
        state: "",
        weight: 0,
        gender: GENDER.UNDEFINED,
        height: 0,
        hospitalMedicalRecordPicList: [],
      },
      medicalRecordList: [],
      drugList: [],
      inquirySheet: {
        type: 0,
        subjectList: [],
      },
    }
  }
  init = async () => {
    let { uid } = this.state
    try {
      let { data: patientInfo } = await patientApi.getPatientInfo({
        uid,
      })
      let { consultationId } = this.state
      let {
        data: { detail: inquirySheet },
      } = await patientApi.inquirySheet({
        consultationId,
      })
      let {
        data: { list: medicalRecordList },
      } = await patientApi.listMedicalRecord({
        page: -1,
        limit: -1,
        filter: { patientUid: uid },
      })
      let {
        data: { region },
      } = await api.getRegion()
      let {
        data: { list: drugList },
      } = await hospital.getDrugList({ page: -1, limit: -1 })
      this.setState({
        hasLoad: true,
        patientInfo,
        medicalRecordList,
        region,
        drugList,
        inquirySheet,
      })
    } catch (err) {
      console.log(err)
    }
  }
  componentDidMount() {
    this.init()
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
  showMode = (img: string) => {
    this.setState({
      isShowMode: true,
      showImg: img,
    })
  }
  render() {
    const { patientInfo } = this.state

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
      <View style={style.detail}>
        <ScrollView
          style={style.main}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }>
          <View style={[style.header, global.flex, global.alignItemsCenter]}>
            <View style={style.headerPic}>
              <Image
                style={style.headerImg}
                source={
                  patientInfo.avatar.url
                    ? { uri: getPicFullUrl(patientInfo.avatar.url) }
                    : gImg.common.defaultAvatar
                }
              />
            </View>
            <View style={style.headerDescription}>
              <View style={[style.headerDescriptionTitle, global.flex, global.alignItemsCenter]}>
                <Text style={[style.headerDescriptionName, global.fontSize15, global.fontStyle]}>
                  {patientInfo.name}
                </Text>
                <Text style={[style.headerDescriptionGender, global.fontSize14, global.fontStyle]}>
                  {GENDER_ZH[patientInfo.gender]}
                </Text>
                <Text style={[style.headerDescriptionAge, global.fontSize14, global.fontStyle]}>
                  {patientInfo.yearAge >= 3
                    ? patientInfo.yearAge + "岁"
                    : patientInfo.yearAge + "岁" + patientInfo.monthAge + "月"}
                  {this.state.region.map((v: Region) => {
                    if (patientInfo.provinceCid === v.cid) {
                      console.log(patientInfo.provinceCid)
                      return v.areaName
                    }
                  })}
                </Text>
              </View>
              <View style={[style.headerDescriptionPhone, global.flex, global.alignItemsCenter]}>
                <Text
                  style={[style.headerDescriptionPhoneTitle, global.fontSize13, global.fontStyle]}>
                  手机号
                </Text>
                <Text
                  style={[style.headerDescriptionPhoneDetail, global.fontSize13, global.fontStyle]}>
                  {patientInfo.phone}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={[
              style.physicalQuality,
              global.flex,
              global.justifyContentSpaceAround,
              global.alignItemsCenter,
            ]}>
            <View style={style.physicalQualityItem}>
              <Text style={[style.physicalQualityItemTitle, global.fontSize13, global.fontStyle]}>
                患者身高
              </Text>
              <Text style={[style.physicalQualityItemDetail, global.fontSize14, global.fontStyle]}>
                {patientInfo.height}cm
              </Text>
            </View>
            <View style={style.physicalQualityItemLine} />
            <View style={style.physicalQualityItem}>
              <Text style={[style.physicalQualityItemTitle, global.fontSize13, global.fontStyle]}>
                患者体重
              </Text>
              <Text style={[style.physicalQualityItemDetail, global.fontSize14, global.fontStyle]}>
                {patientInfo.weight}kg
              </Text>
            </View>
          </View>
          <View style={style.medicalHistory}>
            <View style={[style.medicalHistoryItem, global.flex, global.alignItemsCenter]}>
              <Text style={[style.medicalHistoryItemTitle, global.fontSize14, global.fontStyle]}>
                过敏历史
              </Text>
              <Text
                style={[style.medicalHistoryItemDetail, global.fontSize14, global.fontStyle]}
                numberOfLines={1}>
                {patientInfo.allergyHistory || "无"}
              </Text>
            </View>
            <View style={[style.medicalHistoryItem, global.flex, global.alignItemsCenter]}>
              <Text style={[style.medicalHistoryItemTitle, global.fontSize14, global.fontStyle]}>
                既往病史
              </Text>
              <Text
                style={[style.medicalHistoryItemDetail, global.fontSize14, global.fontStyle]}
                numberOfLines={1}>
                {patientInfo.medicalHistory || "无"}
              </Text>
            </View>
            <View style={[style.medicalHistoryItem, global.flex, global.alignItemsCenter]}>
              <Text style={[style.medicalHistoryItemTitle, global.fontSize14, global.fontStyle]}>
                患者自述
              </Text>
              <Text
                style={[style.medicalHistoryItemDetail, global.fontSize14, global.fontStyle]}
                numberOfLines={1}>
                {patientInfo.state || "无"}
              </Text>
            </View>
          </View>
          <View style={style.medicalRecordPic}>
            <View style={style.medicalRecordPicTitle}>
              <Text style={[style.medicalRecordPicTitleName, global.fontSize14, global.fontStyle]}>
                实体医疗机构病历
              </Text>
            </View>
            <View
              style={[
                style.medicalRecordPics,
                global.flex,
                global.alignItemsCenter,
                global.flexWrap,
              ]}>
              {patientInfo.hospitalMedicalRecordPicList.map((pic, k) => {
                return (
                  <TouchableOpacity key={k} onPress={() => this.showMode(getPicFullUrl(pic.url))}>
                    <Image
                      style={style.medicalRecordImg}
                      source={{
                        uri: getPicFullUrl(pic.url),
                      }}
                    />
                  </TouchableOpacity>
                )
              })}
              {patientInfo.hospitalMedicalRecordPicList.length === 0 ? <Text>暂无</Text> : null}
            </View>
          </View>
          <View style={style.inquirySheet}>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  showInquirySheet: !this.state.showInquirySheet,
                  inquirySheetIcon: this.state.showInquirySheet ? "down" : "up",
                })
              }}>
              <View
                style={[
                  style.inquirySheetTitle,
                  global.flex,
                  global.alignItemsCenter,
                  global.justifyContentSpaceBetween,
                ]}>
                <Text style={[style.inquirySheetName, global.fontSize14, global.fontStyle]}>
                  问诊单问题
                </Text>
                <Icon
                  style={[style.inquirySheetIcon, global.fontSize16]}
                  name={this.state.inquirySheetIcon}
                />
              </View>
              <View style={this.state.showInquirySheet ? style.inquirySheetList : global.hidden}>
                {this.state.inquirySheet.subjectList.map((v, k) => {
                  return (
                    <View style={style.inquirySheetItem} key={k}>
                      <Text style={[global.fontSize14, style.inquirySheetQuestion]}>{v.title}</Text>
                      <Text style={[global.fontSize14, style.inquirySheetAnswer]}>
                        {v.answer.map(v1 => {
                          for (let i = 0; i < v.options.length; i++) {
                            if (i === v1) {
                              return v.options[i].title + "、"
                            }
                          }
                        })}
                      </Text>
                    </View>
                  )
                })}
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={[
              style.medicalRecordTitleBox,
              global.flex,
              global.alignItemsCenter,
              global.justifyContentSpaceBetween,
            ]}>
            <View style={[global.flex, global.alignItemsCenter]}>
              <View style={style.medicalRecordIcon} />
              <Text style={[style.medicalRecordTitle, global.fontSize15, global.fontStyle]}>
                历史病历
              </Text>
            </View>
          </View>
          {/* 病历列表 */}
          <View style={style.medicalRecordList}>
            {this.state.medicalRecordList.length === 0 ? (
              <Text style={{ padding: 15 }}>暂无</Text>
            ) : null}
            {this.state.medicalRecordList.map((v: MedicalRecord) => {
              return (
                <View style={style.medicalRecordItem} key={v.squareRoot.id}>
                  <Text style={[style.medicalRecordItemTitle, global.fontSize15, global.fontStyle]}>
                    {moment(v.squareRoot.time).format("YYYY-MM-DD HH:mm")}
                  </Text>
                  <Text
                    style={[
                      style.medicalRecordItemSecondTitle,
                      global.fontSize14,
                      global.fontStyle,
                    ]}>
                    患者自述
                  </Text>
                  <Text
                    style={[style.medicalRecordItemDetail, global.fontSize14, global.fontStyle]}
                    numberOfLines={2}>
                    {" "}
                    {v.consultation.patientState}
                  </Text>
                  {/* <Text
                    style={[
                      style.medicalRecordItemSecondTitle,
                      global.fontSize14,
                      global.fontStyle,
                    ]}>
                    舌面照及其他资料
                  </Text>
                  <View
                    style={[
                      style.medicalRecordItemPicList,
                      global.flex,
                      global.alignItemsCenter,
                      global.flexWrap,
                    ]}>
                    {v.consultation.lingualSurfacePicList.map((v, k) => {
                      return (
                        <TouchableOpacity
                          key={k}
                          onPress={() => {
                            this.showMode(v.url)
                          }}>
                          <Image
                            style={style.medicalRecordImg}
                            source={
                              v.url
                                ? {
                                    uri: getPicFullUrl(v.url),
                                  }
                                : gImg.common.defaultPic
                            }
                          />
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                   */}
                  <Text
                    style={[
                      style.medicalRecordItemSecondTitle,
                      global.fontSize14,
                      global.fontStyle,
                    ]}>
                    对话照片
                  </Text>
                  <View
                    style={[
                      style.medicalRecordItemPicList,
                      global.flex,
                      global.alignItemsCenter,
                      global.flexWrap,
                    ]}>
                    {v.consultation.lingualSurfacePicList.map((v1, k) => {
                      return (
                        <TouchableOpacity
                          key={k}
                          onPress={() => {
                            this.showMode(v1.url)
                          }}>
                          <Image
                            style={style.medicalRecordImg}
                            source={
                              v1.url
                                ? {
                                    uri: getPicFullUrl(v1.url),
                                  }
                                : gImg.common.defaultPic
                            }
                          />
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.push(pathMap.InquirySheet, {
                        patientUid: this.state.uid,
                        consultationId: v.consultation.id,
                      })
                    }}>
                    <View
                      style={[global.flex, global.alignItemsCenter, global.justifyContentCenter]}>
                      <Text style={[style.medicalRecordItemReadMore, global.fontSize14]}>
                        查看问诊单详情
                      </Text>
                      <Icon
                        style={[style.medicalRecordItemReadMoreIcon, global.fontSize14]}
                        name="right"
                      />
                    </View>
                  </TouchableOpacity>
                  <Text style={[style.squareRootItemTheme, global.fontSize15]}>医生方案</Text>
                  <View style={[style.squareRootItemTitleFa, global.flex, global.alignItemsCenter]}>
                    <Text style={[style.squareRootItemTitle, global.fontSize14]} numberOfLines={1}>
                      诊断{" "}
                    </Text>
                    <Text style={[style.squareRootItemDetail, global.fontSize14]} numberOfLines={1}>
                      {v.squareRoot.discrimination}; {v.squareRoot.syndromeDifferentiation}
                    </Text>
                  </View>
                  <View style={[style.squareRootItemTitleFa, global.flex, global.alignItemsCenter]}>
                    <Text style={[style.squareRootItemTitle, global.fontSize14]} numberOfLines={1}>
                      治疗{" "}
                    </Text>
                    <Text style={[style.squareRootItemDetail, global.fontSize14]} numberOfLines={1}>
                      {v.squareRoot.drugList.map(v1 => {
                        return v1.list.map(v2 => {
                          for (let v3 of this.state.drugList) {
                            if (v2.id === v3.id) {
                              return v3.name + "、"
                            }
                          }
                        })
                      })}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.push(pathMap.MedicalRecord, {
                        prescriptionId: v.squareRoot.id,
                        patientUid: this.state.uid,
                      })
                    }>
                    <View
                      style={[
                        style.squareRootItemViewFa,
                        global.justifyContentCenter,
                        global.flex,
                        global.alignItemsCenter,
                      ]}>
                      <Text style={[style.squareRootItemView, global.fontSize14]}>
                        查看病历详情
                      </Text>
                      <Icon style={[style.squareRootItemView, global.fontSize14]} name="right" />
                    </View>
                  </TouchableOpacity>
                </View>
              )
            })}
          </View>
        </ScrollView>
        <View
          style={[
            style.bottomBtn,
            global.flex,
            global.alignItemsCenter,
            global.justifyContentSpaceBetween,
          ]}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate(pathMap.AdvisoryChat, {
                patientName: this.state.patientInfo.name,
                patientUid: this.state.uid,
              })
            }}>
            <Text style={[style.bottomTitle, global.fontSize14, global.fontStyle]}>进入对话</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.push(pathMap.SquareRoot, { patientUid: this.state.uid })
            }>
            <Text style={[style.bottomTitle, global.fontSize14, global.fontStyle]}>开方</Text>
          </TouchableOpacity>
        </View>

        {/* 图片查看器 */}
        <View style={this.state.isShowMode ? style.showMode : global.hidden}>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                isShowMode: false,
                showImg: gImg.common.defaultAvatar,
              })
            }}>
            <Image
              style={style.showImg}
              source={
                this.state.showImg !== gImg.common.defaultAvatar
                  ? { uri: getPicFullUrl(this.state.showImg) }
                  : this.state.showImg
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
