import * as userAction from '@/redux/actions/user'
import { AppState } from '@/redux/stores/store'
import pathMap from '@/routes/pathMap'
import api, { getThumbUrl, NOT_LIMIT } from '@/services/api'
import doctor, { GENDER, GENDER_ZH } from '@/services/doctor'
import hospital from '@/services/hospital'
import { getPicCdnUrl, getPicFullUrl } from '@/utils/utils'
import { Icon, Modal, Toast } from '@ant-design/react-native'
import { IconNames } from '@ant-design/react-native/lib/icon'
import patientApi, { Drug } from '@api/patient'
import sColor from '@styles/color'
import gImg from '@utils/img'
import gStyle from '@utils/style'
import moment from 'moment'
import React, { Component } from 'react'
import { DeviceEventEmitter, Image, PixelRatio, RefreshControl, ScrollView, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import ImageViewer from 'react-native-image-zoom-viewer'
import { StackNavigationProp } from '@react-navigation/stack'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { imagesViewer, Picture } from '../advisory/Chat'
const style = gStyle.addressBook.PatientDetail
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
  tonguePicList: Picture[] //舌照面
  infectedPartPicList: Picture[] //患部
  facePicList: Picture[] //面部
}
export interface MedicalRecord {
  consultation: {
    //复诊
    id: number
    patientState: string //患者自述
    lingualSurfacePicList: Picture[] //对话照片
    tonguePicList: Picture[] //舌照面
    infectedPartPicList: Picture[] //面部
    facePicList: Picture[] //面部
  }
  squareRoot: {
    //开方
    id: number
    discrimination: string //诊断,辨病
    syndromeDifferentiation: string //辨证
    drugList: Drug[] //治疗的药品列表
    time: string
  }
  doctorPatientId: number
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
  navigation: StackNavigationProp<any>
}
interface State {
  hasLoad: boolean
  showInquirySheet: boolean
  refreshing: boolean
  isShowMode: boolean
  uid: number
  inquirySheetIcon: IconNames
  patientInfo: PatientInfo
  showImg: imagesViewer[]
  region: Region[]
  medicalRecordList: MedicalRecord[]
  drugList: drugCategory[]
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
@connect(mapStateToProps, mapDispatchToProps)
export default class PatientDetail extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = () => ({
    title: '患者档案',
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
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      textAlign: 'center',
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
      inquirySheetIcon: 'down',
      showImg: [
        {
          url: 'https://www.byhealth.net/static/media/collapsed_logo.db8ef9b3.png',
          // width: windowWidth,
          // height: windowHeight,
        },
      ],
      uid: this.props.navigation.getParam('patientUid'),
      region: [],
      patientInfo: {
        name: '',
        yearAge: 0,
        monthAge: 0,
        allergyHistory: '',
        avatar: {
          id: 0,
          url: '',
          title: '',
        },
        medicalHistory: '',
        phone: '',
        provinceCid: '',
        remarks: '',
        state: '',
        weight: 0,
        gender: GENDER.UNDEFINED,
        height: 0,
        hospitalMedicalRecordPicList: [],
        tonguePicList: [], //舌照面
        infectedPartPicList: [], //
        facePicList: [], //面部
      },
      medicalRecordList: [],
      drugList: [],
    }
  }
  init = async () => {
    let { uid } = this.state
    try {
      let getPatientInfoTask = patientApi.getPatientInfo({
        uid,
      })
      let listMedicalRecordTask = patientApi.listMedicalRecord({
        page: -1,
        limit: -1,
        filter: { patientUid: uid },
      })
      let getDrugListTask = hospital.getDrugList({ page: NOT_LIMIT, limit: NOT_LIMIT })
      let getRegionTask = api.getRegion()
      let { data: patientInfo } = await getPatientInfoTask

      let {
        data: { list: medicalRecordList },
      } = await listMedicalRecordTask
      let {
        data: { region },
      } = await getRegionTask
      let {
        data: { list: drugList },
      } = await getDrugListTask
      this.setState({
        hasLoad: true,
        patientInfo,
        medicalRecordList,
        region,
        drugList,
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
        Toast.fail('刷新失败,错误信息: ' + err.msg)
      })
  }
  showMode = (img: string) => {
    this.setState({
      isShowMode: true,
      showImg: [
        {
          url: getPicCdnUrl(img),
        },
      ],
    })
  }
  setInvisiblePatients = async () => {
    try {
      await doctor.setInvisiblePatients({ patientUid: this.state.uid })
      Toast.success('设置成功', 2)
      DeviceEventEmitter.emit(pathMap.AddressBookIndex + 'Reload', null)
      DeviceEventEmitter.emit(pathMap.AdvisoryIndex + 'Reload', null)
    } catch (err) {
      Toast.fail('设置失败, 错误信息: ' + err.msg, 3)
    }
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
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
        >
          <View style={[style.header, global.flex, global.alignItemsCenter]}>
            <View style={style.headerPic}>
              <Image
                style={style.headerImg}
                source={
                  patientInfo.avatar.url
                    ? { uri: getThumbUrl({ path: getPicFullUrl(patientInfo.avatar.url) }) }
                    : gImg.common.defaultAvatar
                }
              />
            </View>
            <View style={style.headerDescription}>
              <View
                style={[
                  style.headerDescriptionTitle,
                  global.flex,
                  global.alignItemsCenter,
                  global.justifyContentSpaceBetween,
                ]}
              >
                <View style={[global.flex, global.alignItemsCenter, { flex: 1 }]}>
                  <Text style={[style.headerDescriptionName, global.fontSize15, global.fontStyle]}>
                    {patientInfo.name}
                  </Text>
                  <Text style={[style.headerDescriptionGender, global.fontSize14, global.fontStyle]}>
                    {GENDER_ZH[patientInfo.gender]}
                  </Text>
                  <Text style={[style.headerDescriptionAge, global.fontSize14, global.fontStyle]}>
                    {patientInfo.yearAge >= 3
                      ? patientInfo.yearAge + '岁'
                      : patientInfo.yearAge + '岁' + patientInfo.monthAge + '月'}
                    {/* 这里是否有错 看下 //todo juice */}
                    {this.state.region.map((v: Region) => {
                      if (patientInfo.provinceCid === v.cid) {
                        return v.areaName
                      }
                      return ''
                    })}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    Modal.alert(
                      '提示',
                      '设置不可见后, 患者将不能在博一健康找到您, 也无法购买您的复诊服务。您可在设置菜单中找到这些患者。',
                      [
                        {
                          text: '取消',
                          style: 'cancel',
                        },
                        {
                          text: '确定',
                          onPress: () => {
                            this.setInvisiblePatients()
                          },
                        },
                      ],
                    )
                  }}
                >
                  <Text style={[style.invisiblePatients, global.fontSize14]}>设置不可见</Text>
                </TouchableOpacity>
              </View>
              <View style={[style.headerDescriptionPhone, global.flex, global.alignItemsCenter]}>
                <Text style={[style.headerDescriptionPhoneTitle, global.fontSize13, global.fontStyle]}>手机号</Text>
                <Text style={[style.headerDescriptionPhoneDetail, global.fontSize13, global.fontStyle]}>
                  {patientInfo.phone}
                </Text>
              </View>
            </View>
          </View>
          {/* <View
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
          */}
          <View style={style.medicalRecordPic}>
            <View style={style.medicalRecordPicTitle}>
              <Text style={[style.medicalRecordPicTitleName, global.fontSize14, global.fontStyle]}>
                实体医疗机构病历
              </Text>
            </View>
            <View style={[style.medicalRecordPics, global.flex, global.alignItemsCenter, global.flexWrap]}>
              {patientInfo.hospitalMedicalRecordPicList.map((pic, k) => {
                return (
                  <TouchableOpacity
                    key={k}
                    onPress={() => this.showMode(getThumbUrl({ path: getPicFullUrl(pic.url) }))}
                  >
                    <Image
                      style={style.medicalRecordImg}
                      source={{
                        uri: getThumbUrl({ path: getPicFullUrl(pic.url) }),
                      }}
                    />
                  </TouchableOpacity>
                )
              })}
              {patientInfo.hospitalMedicalRecordPicList.length === 0 ? <Text>暂无</Text> : null}
            </View>
          </View>
          <View style={style.medicalRecordPic}>
            <View style={style.medicalRecordPicTitle}>
              <Text style={[style.medicalRecordPicTitleName, global.fontSize14, global.fontStyle]}>
                舌面照及其他资料照片
              </Text>
            </View>
            <View style={[style.medicalRecordPics, global.flex, global.alignItemsCenter, global.flexWrap]}>
              {patientInfo.tonguePicList.map((pic, k) => {
                return (
                  <TouchableOpacity
                    key={k}
                    onPress={() => this.showMode(getThumbUrl({ path: getPicFullUrl(pic.url) }))}
                  >
                    <Image
                      style={style.medicalRecordImg}
                      source={{
                        uri: getThumbUrl({ path: getPicFullUrl(pic.url) }),
                      }}
                    />
                  </TouchableOpacity>
                )
              })}
              {patientInfo.infectedPartPicList.map((pic, k) => {
                return (
                  <TouchableOpacity
                    key={k}
                    onPress={() => this.showMode(getThumbUrl({ path: getPicFullUrl(pic.url) }))}
                  >
                    <Image
                      style={style.medicalRecordImg}
                      source={{
                        uri: getThumbUrl({ path: getPicFullUrl(pic.url) }),
                      }}
                    />
                  </TouchableOpacity>
                )
              })}
              {patientInfo.facePicList.map((pic, k) => {
                return (
                  <TouchableOpacity
                    key={k}
                    onPress={() => this.showMode(getThumbUrl({ path: getPicFullUrl(pic.url) }))}
                  >
                    <Image
                      style={style.medicalRecordImg}
                      source={{
                        uri: getThumbUrl({ path: getPicFullUrl(pic.url) }),
                      }}
                    />
                  </TouchableOpacity>
                )
              })}
              {patientInfo.tonguePicList.length === 0 &&
              patientInfo.infectedPartPicList.length === 0 &&
              patientInfo.facePicList.length === 0 ? (
                <Text>暂无</Text>
              ) : null}
            </View>
          </View>

          <View
            style={[
              style.medicalRecordTitleBox,
              global.flex,
              global.alignItemsCenter,
              global.justifyContentSpaceBetween,
            ]}
          >
            <View style={[global.flex, global.alignItemsCenter]}>
              <View style={style.medicalRecordIcon} />
              <Text style={[style.medicalRecordTitle, global.fontSize15, global.fontStyle]}>历史病历</Text>
            </View>
          </View>
          {/* 病历列表 */}
          <View style={style.medicalRecordList}>
            {this.state.medicalRecordList.length === 0 ? <Text style={{ padding: 15 }}>暂无</Text> : null}
            {this.state.medicalRecordList.map((v: MedicalRecord) => {
              return (
                <View style={style.medicalRecordItem} key={v.squareRoot.id}>
                  <Text style={[style.medicalRecordItemTitle, global.fontSize15, global.fontStyle]}>
                    {moment(v.squareRoot.time).format('YYYY-MM-DD HH:mm')}
                  </Text>
                  <Text style={[style.medicalRecordItemSecondTitle, global.fontSize14, global.fontStyle]}>
                    患者自述
                  </Text>
                  <Text style={[style.medicalRecordItemDetail, global.fontSize14, global.fontStyle]} numberOfLines={2}>
                    {' '}
                    {v.consultation.patientState}
                  </Text>
                  <Text style={[style.medicalRecordItemSecondTitle, global.fontSize14, global.fontStyle]}>
                    舌面照及其他资料照片
                  </Text>
                  <View style={[style.medicalRecordItemPicList, global.flex, global.alignItemsCenter, global.flexWrap]}>
                    {v.consultation.tonguePicList.map((tonguePic, k) => {
                      return (
                        <TouchableOpacity
                          key={k}
                          onPress={() => {
                            this.showMode(getThumbUrl({ path: getPicFullUrl(tonguePic.url) }))
                          }}
                        >
                          <Image
                            style={style.medicalRecordImg}
                            source={
                              tonguePic.url
                                ? {
                                    uri: getThumbUrl({ path: getPicFullUrl(tonguePic.url) }),
                                  }
                                : gImg.common.defaultPic
                            }
                          />
                        </TouchableOpacity>
                      )
                    })}
                    {v.consultation.infectedPartPicList.map((infectedPartPic, k) => {
                      return (
                        <TouchableOpacity
                          key={k}
                          onPress={() => {
                            this.showMode(getThumbUrl({ path: getPicFullUrl(infectedPartPic.url) }))
                          }}
                        >
                          <Image
                            style={style.medicalRecordImg}
                            source={
                              infectedPartPic.url
                                ? {
                                    uri: getThumbUrl({ path: getPicFullUrl(infectedPartPic.url) }),
                                  }
                                : gImg.common.defaultPic
                            }
                          />
                        </TouchableOpacity>
                      )
                    })}
                    {v.consultation.facePicList.map((facePic, k) => {
                      return (
                        <TouchableOpacity
                          key={k}
                          onPress={() => {
                            this.showMode(getThumbUrl({ path: getPicFullUrl(facePic.url) }))
                          }}
                        >
                          <Image
                            style={style.medicalRecordImg}
                            source={
                              facePic.url
                                ? {
                                    uri: getThumbUrl({ path: getPicFullUrl(facePic.url) }),
                                  }
                                : gImg.common.defaultPic
                            }
                          />
                        </TouchableOpacity>
                      )
                    })}
                    {v.consultation.tonguePicList.length === 0 &&
                    v.consultation.infectedPartPicList.length === 0 &&
                    v.consultation.facePicList.length === 0 ? (
                      <Text>暂无</Text>
                    ) : null}
                  </View>
                  <Text style={[style.medicalRecordItemSecondTitle, global.fontSize14, global.fontStyle]}>
                    对话照片
                  </Text>
                  <View
                    style={[
                      style.medicalRecordItemPicList,
                      global.flex,
                      global.alignItemsCenter,
                      global.flexWrap,
                      global.justifyContentStart,
                    ]}
                  >
                    {v.consultation.lingualSurfacePicList.map((v1, k) => {
                      return (
                        <TouchableOpacity
                          key={k}
                          onPress={() => {
                            this.showMode(getThumbUrl({ path: getPicFullUrl(v1.url) }))
                          }}
                        >
                          <Image
                            style={style.medicalRecordImg}
                            source={
                              v1.url
                                ? {
                                    uri: getThumbUrl({ path: getPicFullUrl(v1.url) }),
                                  }
                                : gImg.common.defaultPic
                            }
                          />
                        </TouchableOpacity>
                      )
                    })}
                    {v.consultation.lingualSurfacePicList.length === 0 ? (
                      <Text style={{ fontSize: 14, color: '#666' }}>暂无</Text>
                    ) : null}
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.push(pathMap.InquirySheet, {
                        patientUid: this.state.uid,
                        consultationId: v.consultation.id,
                      })
                    }}
                  >
                    <View style={[global.flex, global.alignItemsCenter, global.justifyContentCenter]}>
                      <Text style={[style.medicalRecordItemReadMore, global.fontSize14]}>查看问诊单详情</Text>
                      <Icon style={[style.medicalRecordItemReadMoreIcon, global.fontSize14]} name='right' />
                    </View>
                  </TouchableOpacity>
                  <Text style={[style.squareRootItemTheme, global.fontSize15]}>医生方案</Text>
                  <View style={[style.squareRootItemTitleFa, global.flex, global.alignItemsCenter]}>
                    <Text style={[style.squareRootItemTitle, global.fontSize14]} numberOfLines={1}>
                      诊断{' '}
                    </Text>
                    <Text style={[style.squareRootItemDetail, global.fontSize14]} numberOfLines={1}>
                      {v.squareRoot.discrimination}; {v.squareRoot.syndromeDifferentiation}
                    </Text>
                  </View>
                  <View style={[style.squareRootItemTitleFa, global.flex, global.alignItemsCenter]}>
                    <Text style={[style.squareRootItemTitle, global.fontSize14]} numberOfLines={1}>
                      治疗{' '}
                    </Text>
                    <Text style={[style.squareRootItemDetail, global.fontSize14]} numberOfLines={1}>
                      {v.squareRoot.drugList.map(v1 => {
                        // 这里应该有错误 @todo juice
                        return v1.list.map(v2 => {
                          for (let v3 of this.state.drugList) {
                            if (v2.id === v3.id) {
                              return v3.name + '、'
                            }
                          }
                          return ''
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
                    }
                  >
                    <View
                      style={[
                        style.squareRootItemViewFa,
                        global.justifyContentCenter,
                        global.flex,
                        global.alignItemsCenter,
                      ]}
                    >
                      <Text style={[style.squareRootItemView, global.fontSize14]}>查看病历详情</Text>
                      <Icon style={[style.squareRootItemView, global.fontSize14]} name='right' />
                    </View>
                  </TouchableOpacity>
                  {/* <TouchableOpacity
                    style={style.postInquery}
                    onPress={() =>
                      this.props.navigation.push(pathMap.PostInquiry, {
                        id: v.doctorPatientId,
                      })
                    }>
                    <Text style={style.postInqueryTitle}>诊后咨询 </Text>
                  </TouchableOpacity> */}
                </View>
              )
            })}
          </View>
        </ScrollView>
        <View style={[style.bottomBtn, global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate(pathMap.AdvisoryChat, {
                patientName: this.state.patientInfo.name,
                patientUid: this.state.uid,
              })
            }}
          >
            <Text style={[style.bottomTitle, global.fontSize14, global.fontStyle]}>进入对话</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.push(pathMap.SquareRoot, { patientUid: this.state.uid })}
          >
            <Text style={[style.bottomTitle, global.fontSize14, global.fontStyle]}>开方</Text>
          </TouchableOpacity>
        </View>

        {/* 图片查看器 */}
        <View style={this.state.isShowMode ? style.showMode : global.hidden}>
          <View style={style.close}>
            <Icon
              onPress={() => {
                this.setState({
                  showImg: [
                    {
                      url: getPicCdnUrl('/static/media/collapsed_logo.db8ef9b3.png'),
                    },
                  ],
                  isShowMode: false,
                })
              }}
              style={style.closeIcon}
              name='close'
            />
          </View>
          <View style={style.showImgPar}>
            <ImageViewer saveToLocalByLongPress={false} imageUrls={this.state.showImg} index={0} maxOverflow={0} />
          </View>
        </View>
      </View>
    )
  }
}
