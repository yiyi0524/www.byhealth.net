import * as userAction from '@/redux/actions/user'
import { AppState } from '@/redux/stores/store'
import { AllScreenParam } from '@/routes/bottomNav'
import api from '@/services/api'
import { GENDER_ZH, setAdeptSymptomIdList, setProfile, TECHNICAL_TITLE_ZH } from '@/services/doctor'
import { getPicCdnUrl } from '@/utils/utils'
import { TextareaItem, Toast } from '@ant-design/react-native'
import hospitalApi from '@api/hospital'
import userApi, { DoctorInfo } from '@api/user'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import gImg from '@utils/img'
import gStyle from '@utils/style'
import React, { Component } from 'react'
import { Image, RefreshControl, ScrollView, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Overwrite } from 'utility-types'
import { Picture } from '../advisory/Chat'

const style = gStyle.personalCenter.editInformation
const global = gStyle.global
interface Props {
  navigation: StackNavigationProp<AllScreenParam, 'EditInformation'>
  route: RouteProp<AllScreenParam, 'EditInformation'>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  isEditAdeptSymptomIdList: boolean
  isEditProfile: boolean
  info: {
    id: number
    name: string
    gender: number
    profile: string
    avatar: Picture
  }
  doctorInfo: Overwrite<
    DoctorInfo,
    {
      id: number
      technicalTitle: number
      departmentId: number
      adeptSymptomIdList: number[]
      countyCid: string
      provinceCid: string
      hospitalId: number
    }
  >
  departmentName: string
  adeptSymptomIdMapList: adeptSymptomIdMapItem[]
  regionCidMapAreaName: RegionCidMapAreaName
  hospitalName: string
  adeptSymptomIdList: adeptSymptomIdItem[]
}
interface adeptSymptomIdItem {
  id: number
  name: string
}
interface adeptSymptomIdMapItem {
  id: number
  name: string
  symptomList: symptomItem[]
}
interface symptomItem {
  id: number
  name: string
  isChecked: boolean
}
interface functionItem {
  name: string
  link: string
}
interface RegionCidMapAreaName extends Record<string, string> {}
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
//@ts-ignore
@connect(mapStateToProps, mapDispatchToProps)
export default class Index extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  functionList: functionItem[] = []
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      isEditAdeptSymptomIdList: false,
      isEditProfile: false,
      info: {
        id: 0,
        name: '',
        gender: 0,
        profile: '暂无简介',
        avatar: {
          id: 0,
          title: '',
          url: '',
        },
      },
      doctorInfo: {
        id: 0,
        technicalTitle: 0,
        departmentId: 0,
        adeptSymptomIdList: [],
        provinceCid: '',
        countyCid: '',
        profile: '',
        hospitalId: 0,
        hasRealNameAuth: false,
        patientCount: 0,
        prescriptionCount: 0,
        uid: 0,
      },
      departmentName: '',
      adeptSymptomIdMapList: [],
      regionCidMapAreaName: {},
      hospitalName: '',
      adeptSymptomIdList: [],
    }
  }
  async componentDidMount() {
    await this.init()
  }
  init = async () => {
    try {
      //获取个人信息
      let { data } = await userApi.getPersonalInfo()
      //获取科室及疾病列表
      let {
        data: { list: hospitalDepartmentSymptom },
      } = await hospitalApi.getAllSymptomList({
        page: -1,
        limit: -1,
        filter: {},
      })
      //地址
      let {
        data: { region: oriRegion },
      } = await api.getRegion()
      let regionCidMapAreaName: RegionCidMapAreaName = {}
      regionCidMapAreaName = this.getChildCidMapAreaName(oriRegion, regionCidMapAreaName)
      let {
        data: { list: hospitalList },
      } = await userApi.getHospitalList({
        page: -1,
        limit: -1,
        filter: {},
      })
      let hospitalName = '未知'
      for (let v of hospitalList) {
        if (v.id === data.doctorInfo.hospitalId) {
          hospitalName = v.name
        }
      }
      let doctorInfo = {
        id: data.doctorInfo.id,
        technicalTitle: data.doctorInfo.technicalTitle as number,
        departmentId: data.doctorInfo.departmentId as number,
        adeptSymptomIdList: data.doctorInfo.adeptSymptomIdList as number[],
        countyCid: data.doctorInfo.countyCid as string,
        provinceCid: data.doctorInfo.provinceCid as string,
        hospitalId: data.doctorInfo.hospitalId as number,
        hasRealNameAuth: data.doctorInfo.hasRealNameAuth,
        patientCount: data.doctorInfo.patientCount,
        profile: data.doctorInfo.profile,
        prescriptionCount: data.doctorInfo.prescriptionCount,
        uid: data.doctorInfo.uid,
      }
      this.setState({
        info: data.info,
        doctorInfo,
        regionCidMapAreaName,
        hospitalName,
      })
      for (let v of hospitalDepartmentSymptom) {
        if (v.id === this.state.doctorInfo.departmentId) {
          this.setState({
            departmentName: v.name,
          })
        }
        for (let v1 of v.symptomList) {
          v1.isChecked = false
        }
      }
      let adeptSymptomIdList = this.state.adeptSymptomIdList
      for (let v of this.state.doctorInfo.adeptSymptomIdList) {
        for (let v1 of hospitalDepartmentSymptom) {
          for (let v2 of v1.symptomList) {
            if (v === v2.id) {
              adeptSymptomIdList.push({
                id: v2.id,
                name: v2.name,
              })
              v2.isChecked = true
            }
          }
        }
      }
      this.setState({
        adeptSymptomIdMapList: hospitalDepartmentSymptom,
        adeptSymptomIdList,
      })
    } catch (err) {
      console.log(err)
    }
    this.setState({
      hasLoad: true,
    })
  }
  getChildCidMapAreaName = (arr: any, regionCidMapAreaName: any) => {
    for (let i = 0, len = arr.length; i < len; i++) {
      if (arr[i].children && arr[i].children.length > 0) {
        this.getChildCidMapAreaName(arr[i].children, regionCidMapAreaName)
      }
      regionCidMapAreaName[arr[i].cid] = arr[i].areaName
    }
    return regionCidMapAreaName
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
  submitAdeptSymptomIdList = async () => {
    let list = this.state.adeptSymptomIdList,
      adeptSymptomIdList: number[] = []
    for (let v of list) {
      adeptSymptomIdList.push(v.id)
    }
    try {
      await setAdeptSymptomIdList({ adeptSymptomIdList })
      Toast.success('擅长疾病设置成功', 2)
    } catch (err) {
      console.log(err)
      Toast.fail('擅长疾病设置失败, 错误原因: ' + err.msg, 3)
    }
  }
  editProfile = async () => {
    this.setState({
      isEditProfile: false,
    })
    try {
      await setProfile({ profile: this.state.doctorInfo.profile })
      Toast.success('我的简介设置成功', 1)
    } catch (err) {
      console.log(err)
      Toast.fail('我的简介设置失败, 错误信息: ' + err.msg, 3)
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
      <View style={style.edit}>
        <ScrollView
          style={style.main}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              // onRefresh={this.onRefresh}
            />
          }
        >
          <View style={style.header}>
            <View style={[style.headerInfo, global.flex, global.alignItemsCenter]}>
              <View style={style.headerInfoAvatar}>
                <Image
                  style={style.headerInfoImg}
                  source={
                    this.state.info.avatar.url
                      ? { uri: getPicCdnUrl(this.state.info.avatar.url, 'avatar') }
                      : gImg.common.defaultAvatar
                  }
                />
              </View>
              <View style={style.headerInfoName}>
                <Text style={[style.headerInfoTitle, global.fontSize16]}>{this.state.info.name}</Text>
                <Text style={[style.headerInfoDetail, global.fontSize14]}>
                  {TECHNICAL_TITLE_ZH[this.state.doctorInfo.technicalTitle]}
                  {'  '}
                  {GENDER_ZH[this.state.info.gender]}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.push('CustomerService')}
                style={style.headerInfoCustomerFa}
              >
                <Text style={[style.headerInfoCustomer, global.fontSize12]}>联系客服修改</Text>
              </TouchableOpacity>
            </View>
            <View style={style.headerDescription}>
              <Text style={[style.headerDepartment, global.fontSize14]}>擅长科室: {this.state.departmentName}</Text>
              <Text style={[style.headerDepartment, global.fontSize14]}>
                第一职业机构{'  '}
                {this.state.regionCidMapAreaName[parseInt(this.state.doctorInfo.provinceCid)]}
                {'  '}
                {this.state.hospitalName}
              </Text>
            </View>
          </View>
          <View style={this.state.isEditProfile ? style.departmentHidden : style.department}>
            <View style={[global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}>
              <Text style={[style.departmentTitle, global.fontSize16]}>擅长治疗疾病</Text>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    isEditAdeptSymptomIdList: true,
                  })
                }}
              >
                <Text style={[style.departmentEdit, global.fontSize14]}>编辑</Text>
              </TouchableOpacity>
            </View>
            <View style={[style.departmentList, global.flex, global.alignItemsCenter, global.flexWrap]}>
              {this.state.adeptSymptomIdList.map((v1: adeptSymptomIdItem, k1: number) => {
                return (
                  <Text key={k1} style={[style.departmentItem, global.fontSize14]}>
                    {v1.name}
                  </Text>
                )
              })}
            </View>
          </View>
          <View style={style.profile}>
            <View style={[style.profileTitle, global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}>
              <Text style={[style.profileTheme, global.fontSize16]}>我的简介</Text>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    isEditProfile: true,
                  })
                }}
              >
                <Text style={[style.profileEdit, global.fontSize14]}>编辑</Text>
              </TouchableOpacity>
            </View>
            <Text style={[style.profileDetail, global.fontSize14]}>{this.state.doctorInfo.profile}</Text>
          </View>
          {/* 编辑个人简介 */}
          <View style={this.state.isEditProfile ? style.editProfile : global.hidden}>
            <View style={[style.selectDepartmentTitle, global.flex, global.alignItemsCenter]}>
              <View style={style.selectDepartmentIcon} />
              <Text style={[style.selectDepartmentTheme, global.fontSize16]}>我的简介</Text>
            </View>
            <View style={style.editInput}>
              <TextareaItem
                rows={6}
                count={10000}
                placeholder='请输入简介'
                value={this.state.doctorInfo.profile}
                onChange={profile => {
                  if (profile) {
                    let doctorInfo = this.state.doctorInfo
                    doctorInfo.profile = profile
                    this.setState({
                      doctorInfo,
                    })
                  }
                }}
                style={style.editProfileInput}
              />
            </View>
            <TouchableOpacity onPress={this.editProfile}>
              <Text style={[style.editProfileBtn, global.fontSize14]}>完成</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {/* <View style={style.viewFa}>
          <TouchableOpacity>
            <Text style={[style.view, global.fontSize14]}>预览</Text>
          </TouchableOpacity>
        </View> */}
        {/* 擅长 */}
        <ScrollView style={this.state.isEditAdeptSymptomIdList ? style.selectDepartment : global.hidden}>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                isEditAdeptSymptomIdList: false,
              })
              this.submitAdeptSymptomIdList()
            }}
          >
            <Text style={[style.closeDepartment, global.fontSize14]}>完成</Text>
          </TouchableOpacity>
          <View style={[style.selectDepartmentTitle, global.flex, global.alignItemsCenter]}>
            <View style={style.selectDepartmentIcon} />
            <Text style={[style.selectDepartmentTheme, global.fontSize16]}>请选择擅长治疗的疾病</Text>
            {/* <Text style={[style.selectDepartmentDetail, global.fontSize14]}>(最多选10个)</Text> */}
          </View>
          <View style={[style.selectDepartmentList, global.flex, global.alignItemsCenter, global.flexWrap]}>
            {this.state.adeptSymptomIdMapList.map((v: adeptSymptomIdMapItem, k: number) => {
              return v.symptomList.map((v1: symptomItem, k1: number) => {
                return (
                  <TouchableOpacity
                    key={k1}
                    onPress={() => {
                      let adeptSymptomIdMapList = this.state.adeptSymptomIdMapList,
                        adeptSymptomIdList = this.state.adeptSymptomIdList
                      adeptSymptomIdMapList[k].symptomList[k1].isChecked = !v1.isChecked
                      if (v1.isChecked) {
                        // if (adeptSymptomIdList.length >= 10) {
                        //   adeptSymptomIdMapList[k].symptomList[k1].isChecked = false
                        //   return Toast.info("选择擅长治疗疾病不超过10个", 3)
                        // }
                        adeptSymptomIdList.push({
                          id: v1.id,
                          name: v1.name,
                        })
                      } else {
                        adeptSymptomIdList = adeptSymptomIdList.filter(v2 => v2.id !== v1.id)
                      }
                      this.setState({
                        adeptSymptomIdMapList,
                        adeptSymptomIdList,
                      })
                    }}
                  >
                    <Text
                      style={[
                        v1.isChecked ? style.selectDepartmentItemActive : style.selectDepartmentItem,
                        global.fontSize14,
                      ]}
                    >
                      {v1.name}
                    </Text>
                  </TouchableOpacity>
                )
              })
            })}
          </View>
        </ScrollView>
      </View>
    )
  }
}
