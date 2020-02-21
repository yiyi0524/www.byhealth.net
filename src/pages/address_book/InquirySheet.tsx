import * as userAction from '@/redux/actions/user'
import { AppState } from '@/redux/stores/store'
import { AllScreenParam } from '@/routes/bottomNav'
import api, { getThumbUrl } from '@/services/api'
import patient, { inquirySheet } from '@/services/patient'
import { getPicFullUrl } from '@/utils/utils'
import { Toast } from '@ant-design/react-native'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import gImg from '@utils/img'
import gStyle from '@utils/style'
import React, { Component } from 'react'
import { Image, RefreshControl, ScrollView, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Region } from './PatientDetail'

const style = gStyle.addressBook.InquirySheet
const global = gStyle.global

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
  route: RouteProp<AllScreenParam, 'InquirySheet'>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  isShowMode: boolean
  patientUid: number
  consultationId: number
  showImgUrl: any
  detail: inquirySheet
  region: Region[]
}
@connect(mapStateToProps, mapDispatchToProps)
export default class InquirySheet extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      isShowMode: false,
      patientUid: this.props.route.params.patientUid,
      consultationId: this.props.route.params.consultationId,
      showImgUrl: '',
      detail: {
        name: '',
        height: 0,
        weight: 0,
        allergyHistory: '', //过敏史
        medicalHistory: '', //病史
        state: '', //用户情况,症状与病情
        hospitalMedicalRecordPicList: [], //实体医疗机构病历列表
        tonguePicList: [], //舌照面
        infectedPartPicList: [], //患部
        facePicList: [], //面部
        dialoguePicList: [], //对话照片
        problems: {
          type: 0,
          subjectList: [],
        }, //问题列表
      },
      region: [],
    }
  }
  init = async () => {
    try {
      let {
        data: { detail },
      } = await patient.getInquirySheet({
        patientUid: this.state.patientUid,
        consultationId: this.state.consultationId,
      })
      let {
        data: { region },
      } = await api.getRegion()
      this.setState({
        hasLoad: true,
        region,
        detail,
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
  showImg = (img: string) => {
    this.setState({
      showImgUrl: img,
      isShowMode: true,
    })
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
    const { detail } = this.state
    return (
      <View style={style.detail}>
        <ScrollView
          style={style.main}
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
        >
          <View style={style.patientInfo}>
            <Text style={[style.patientInfoName, global.fontSize18]}>{detail.name}</Text>
            <View style={[global.flex, global.alignItemsCenter, global.justifyContentSpaceAround]}>
              <View style={style.patientInfoHeight}>
                <Text style={[style.patientInfoTitle, global.fontSize13]}>身高</Text>
                <Text style={[style.patientInfoDetail, global.fontSize14]}>{detail.height}cm</Text>
              </View>
              <View style={style.patientInfoHeight}>
                <Text style={[style.patientInfoTitle, global.fontSize13]}>体重</Text>
                <Text style={[style.patientInfoDetail, global.fontSize14]}>{detail.weight}kg</Text>
              </View>
            </View>
            <View style={style.patientInfoHeight}>
              <Text style={[style.patientInfoTitle, global.fontSize13]}>过敏史</Text>
              <Text style={[style.patientInfoDetail, global.fontSize14]}>{detail.allergyHistory}</Text>
            </View>
            <View style={style.patientInfoHeight}>
              <Text style={[style.patientInfoTitle, global.fontSize13]}>既往病史</Text>
              <Text style={[style.patientInfoDetail, global.fontSize14]}>{detail.medicalHistory}</Text>
            </View>
            <View style={style.patientInfoHeight}>
              <Text style={[style.patientInfoTitle, global.fontSize13]}>患者自述</Text>
              <Text style={[style.patientInfoDetail, global.fontSize14]}>{detail.state}</Text>
            </View>
          </View>
          <View style={style.patientPic}>
            <Text style={[style.patientPicTitle, global.fontSize14]}>实体医疗机构照片</Text>
            <View style={[style.patientPicList, global.flex, global.alignItemsCenter, global.flexWrap]}>
              {detail.hospitalMedicalRecordPicList.map(v => {
                return (
                  <TouchableOpacity
                    key={v.id}
                    onPress={() => {
                      this.showImg(getThumbUrl({ path: getPicFullUrl(v.url) }))
                    }}
                  >
                    <Image
                      style={style.patientImg}
                      source={v.url ? { uri: getThumbUrl({ path: getPicFullUrl(v.url) }) } : gImg.common.defaultPic}
                    />
                  </TouchableOpacity>
                )
              })}
              {detail.hospitalMedicalRecordPicList.length === 0 ? (
                <Text style={{ fontSize: 14, color: '#666' }}>暂无</Text>
              ) : null}
            </View>
          </View>
          <View style={style.patientPic}>
            <Text style={[style.patientPicTitle, global.fontSize14]}>舌面照及其他资料</Text>
            <View style={[style.patientPicList, global.flex, global.alignItemsCenter, global.flexWrap]}>
              {detail.tonguePicList.map(v => {
                return (
                  <TouchableOpacity
                    key={v.id}
                    onPress={() => {
                      this.showImg(getThumbUrl({ path: getPicFullUrl(v.url) }))
                    }}
                  >
                    <Image
                      style={style.patientImg}
                      source={v.url ? { uri: getThumbUrl({ path: getPicFullUrl(v.url) }) } : gImg.common.defaultPic}
                    />
                  </TouchableOpacity>
                )
              })}
              {detail.facePicList.map(v => {
                return (
                  <TouchableOpacity
                    key={v.id}
                    onPress={() => {
                      this.showImg(getThumbUrl({ path: getPicFullUrl(v.url) }))
                    }}
                  >
                    <Image
                      style={style.patientImg}
                      source={v.url ? { uri: getThumbUrl({ path: getPicFullUrl(v.url) }) } : gImg.common.defaultPic}
                    />
                  </TouchableOpacity>
                )
              })}
              {detail.infectedPartPicList.map(v => {
                return (
                  <TouchableOpacity
                    key={v.id}
                    onPress={() => {
                      this.showImg(getThumbUrl({ path: getPicFullUrl(v.url) }))
                    }}
                  >
                    <Image
                      style={style.patientImg}
                      source={v.url ? { uri: getThumbUrl({ path: getPicFullUrl(v.url) }) } : gImg.common.defaultPic}
                    />
                  </TouchableOpacity>
                )
              })}
              {detail.tonguePicList.length === 0 &&
              detail.facePicList.length === 0 &&
              detail.infectedPartPicList.length === 0 ? (
                <Text style={{ fontSize: 14, color: '#666' }}>暂无</Text>
              ) : null}
            </View>
          </View>
          <View style={style.patientPic}>
            <Text style={[style.patientPicTitle, global.fontSize14]}>对话照片</Text>
            <View style={[style.patientPicList, global.flex, global.alignItemsCenter, global.flexWrap]}>
              {detail.dialoguePicList.map(v => {
                return (
                  <TouchableOpacity
                    key={v.id}
                    onPress={() => {
                      this.showImg(getThumbUrl({ path: getPicFullUrl(v.url) }))
                    }}
                  >
                    <Image
                      style={style.patientImg}
                      source={v.url ? { uri: getThumbUrl({ path: getPicFullUrl(v.url) }) } : gImg.common.defaultPic}
                    />
                  </TouchableOpacity>
                )
              })}
              {detail.dialoguePicList.length === 0 ? <Text style={{ fontSize: 14, color: '#666' }}>暂无</Text> : null}
            </View>
          </View>
          <View style={style.problems}>
            <Text style={[style.theme, global.fontSize16]}>问诊单问题</Text>
            {detail.problems.subjectList.map((v, k: number) => {
              return (
                <View style={style.problem} key={k}>
                  <Text style={[style.problemTitle, global.fontSize14]}>{k + 1 + '.' + v.title}</Text>
                  <Text style={[style.problemDetail, global.fontSize14]}>
                    {v.options.map((v1, k1) => {
                      for (let v2 of v.answer) {
                        if (k1 === v2) {
                          return v1.title + '、'
                        }
                      }
                      return ''
                    })}
                  </Text>
                </View>
              )
            })}
          </View>
        </ScrollView>
        {/* 图片查看器 */}
        <View style={this.state.isShowMode ? style.showMode : global.hidden}>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                isShowMode: false,
                showImgUrl: '',
              })
            }}
          >
            <Image
              style={style.showImg}
              source={this.state.showImgUrl ? { uri: this.state.showImgUrl } : gImg.common.defaultAvatar}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
