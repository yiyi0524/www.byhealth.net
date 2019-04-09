import global from "@/assets/styles/global"
import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Platform,
  PermissionsAndroid,
  Image,
} from "react-native"
import { Icon, InputItem, Picker, Toast, ImagePicker, TextareaItem } from "@ant-design/react-native"
import api from "@api/api"
import doctorApi, { authParam } from "@api/doctor"
import { BASE_URL } from "@config/api"
import hospitalApi from "@api/hospital"
import gStyle from "@utils/style"
import React, { Component } from "react"
import { NavigationScreenProp } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import sColor from "@styles/color"
import gImg from "@utils/img"
import { GENDER, GENDER_ZH, TECHNICAL_TITLE, TECHNICAL_TITLE_ZH } from "@api/doctor"
const style = gStyle.user.realNameAuth
interface Props {
  navigation: NavigationScreenProp<State>
}
interface adeptSymptomIdItem {
  id: number
  name: string
}
interface hospitalItem {
  id: number
  name: string
}
interface picture {
  name: string
  picId: number
  url: string
}
interface hospitalDepartmentItem {
  value: number
  label: string
}
interface State {
  selectHospitalActive: boolean
  selectAdeptSymptomActive: boolean
  avatarSelectable: boolean
  practisingCertificatePicIdSelectable: boolean
  qualificationCertificatePicIdSelectable: boolean
  technicalqualificationCertificatePicIdSelectable: boolean
  hasLoad: boolean
  previewPicFirstActive: boolean
  previewPicSecondActive: boolean
  hospitalName: string
  name: string
  idCardNo: string
  profile: string
  page: number
  limit: number
  gender: [number]
  technicalTitle: [number]
  departmentId: [number]
  adeptSymptomIdList: adeptSymptomIdItem[]
  hospitalId: number
  region: any
  cityId: string[]
  regionCidMapAreaName: any
  filter: {}
  hospitalList: hospitalItem[]
  avatar: picture[]
  hospitalDepartment: hospitalDepartmentItem[] //科室
  hospitalDepartmentMap: any
  hospitalDepartmentSymptom: any //症状
  practisingCertificatePicIdList: any //医生执业证书
  qualificationCertificatePicIdList: any //医生资格证书
  technicalqualificationCertificatePicIdList: any //专业技术资格证书10张
  avatarId: number
}
interface RegionCidMapAreaName extends Record<string, string> {}
interface CityItem {
  value: string
  label: string
  children: CityItem[]
}
interface genderItem {
  value: number
  label: string
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
export default class RealNameAuth extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = {
    title: "认证",
    headerStyle: {
      backgroundColor: sColor.white,
      height: 45,
      elevation: 0,
      borderBottomColor: sColor.colorDdd,
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
  gender: genderItem[] = []
  technicalTitle: genderItem[] = []
  constructor(props: any) {
    super(props)
    this.gender = [
      {
        value: GENDER.MAN,
        label: GENDER_ZH[GENDER.MAN],
      },
      {
        value: GENDER.WOMAN,
        label: GENDER_ZH[GENDER.WOMAN],
      },
    ]
    this.technicalTitle = [
      {
        value: TECHNICAL_TITLE.RESIDENT,
        label: TECHNICAL_TITLE_ZH[TECHNICAL_TITLE.RESIDENT],
      },
      {
        value: TECHNICAL_TITLE.ATTENDING_DOCTOR,
        label: TECHNICAL_TITLE_ZH[TECHNICAL_TITLE.ATTENDING_DOCTOR],
      },
      {
        value: TECHNICAL_TITLE.DEPUTY_CHIEF_PHYSICIAN,
        label: TECHNICAL_TITLE_ZH[TECHNICAL_TITLE.DEPUTY_CHIEF_PHYSICIAN],
      },
      {
        value: TECHNICAL_TITLE.CHIEF_PHYSICIAN,
        label: TECHNICAL_TITLE_ZH[TECHNICAL_TITLE.CHIEF_PHYSICIAN],
      },
    ]
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      avatarSelectable: true,
      practisingCertificatePicIdSelectable: true,
      qualificationCertificatePicIdSelectable: true,
      technicalqualificationCertificatePicIdSelectable: true,
      selectHospitalActive: false,
      selectAdeptSymptomActive: false,
      hasLoad: false,
      previewPicFirstActive: false,
      previewPicSecondActive: false,
      hospitalId: 0,
      page: 1,
      limit: -1,
      hospitalName: "",
      name: "",
      idCardNo: "",
      profile: "",
      gender: [0],
      technicalTitle: [-1],
      filter: {},
      region: [],
      cityId: [],
      regionCidMapAreaName: [],
      hospitalList: [],
      avatar: [],
      hospitalDepartment: [], //科室
      hospitalDepartmentMap: [],
      departmentId: [-1],
      hospitalDepartmentSymptom: [], //症状
      adeptSymptomIdList: [], //擅长
      practisingCertificatePicIdList: [], //医生执业证书
      qualificationCertificatePicIdList: [], //医生资格证书
      technicalqualificationCertificatePicIdList: [], //专业技术资格证书9张
      avatarId: 0,
    }
  }
  async componentDidMount() {
    await this.requestReadExteralStorage()
    this.init()
  }
  requestReadExteralStorage = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "从外部存储加载照片的权限",
            message: "必须授予权限才能在手机上列出照片供您选择。",
            buttonPositive: "",
          },
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        } else {
          console.log("申请从外部存储加载照片的权限失败")
        }
      } catch (err) {
        console.warn(err)
      }
    }
  }
  init = async () => {
    try {
      let regionCidMapAreaName: RegionCidMapAreaName = {},
        region = [],
        hospitalDepartmentList = [],
        hospitalDepartmentMap = []
      let {
        data: { region: oriRegion },
      } = await api.getRegion()
      regionCidMapAreaName = this.getChildCidMapAreaName(oriRegion, regionCidMapAreaName)
      region = this.generateFormatRegion(oriRegion)
      let {
        data: { list: hospitalDepartment },
      } = await hospitalApi.getDepartmentList({
        page: this.state.page,
        limit: this.state.limit,
        filter: this.state.filter,
      })
      for (let v of hospitalDepartment) {
        hospitalDepartmentList.push({
          value: v.id,
          label: v.name,
        })
        hospitalDepartmentMap[v.id] = v.name
      }
      let {
        data: { list: hospitalDepartmentSymptom },
      } = await hospitalApi.getAllSymptomList({
        page: this.state.page,
        limit: this.state.limit,
        filter: this.state.filter,
      })
      for (let v of hospitalDepartmentSymptom) {
        for (let v1 of v.symptomList) {
          v1.isChecked = false
        }
      }
      this.setState({
        region,
        regionCidMapAreaName,
        hospitalDepartment: hospitalDepartmentList,
        hospitalDepartmentMap,
        hospitalDepartmentSymptom,
      })
    } catch (err) {
      console.log(err.msg)
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
  generateFormatRegion = (arr: any) => {
    let cityList: CityItem[] = []
    for (let i = 0, len = arr.length; i < len; i++) {
      let children: CityItem[] = []
      if (arr[i].children && arr[i].children.length > 0) {
        children = this.generateFormatRegion(arr[i].children)
      }
      let item = {
        value: arr[i].cid,
        label: arr[i].areaName,
        children,
      }
      cityList.push(item)
    }
    return cityList
  }
  chooseCityId = async (cityId: any) => {
    this.setState({
      cityId,
    })
    try {
      let {
        data: { list: hospitalList },
      } = await hospitalApi.getList({
        page: this.state.page,
        limit: this.state.limit,
        filter: {
          countyCid: cityId[2],
        },
      })
      this.setState({
        hospitalList,
      })
    } catch (err) {
      console.log(err.msg)
    }
  }
  submit = async () => {
    if (this.state.avatar.length === 0) {
      return Toast.fail("请选择头像", 3)
    }
    if (this.state.name === "") {
      return Toast.fail("请输入姓名", 3)
    }
    if (this.state.cityId.length === 0) {
      return Toast.fail("请选择地区", 3)
    }
    if (this.state.hospitalId === 0 && this.state.hospitalName === "") {
      return Toast.fail("请选择医疗机构", 3)
    }
    if (this.state.idCardNo === "") {
      return Toast.fail("请输入身份证号码", 3)
    }
    if (this.state.idCardNo === "") {
      return Toast.fail("请输入身份证号码", 3)
    }
    if (!api.idCardIDChecked(this.state.idCardNo)) {
      return Toast.fail("身份证格式不正确", 3)
    }
    if (this.state.gender[0] === 0) {
      return Toast.fail("请选择性别", 3)
    }
    if (this.state.technicalTitle[0] === -1) {
      return Toast.fail("请选择职称", 3)
    }
    if (this.state.departmentId[0] === -1) {
      return Toast.fail("请选择科室", 3)
    }
    if (this.state.adeptSymptomIdList.length === 0) {
      return Toast.fail("请选择擅长", 3)
    }
    if (this.state.practisingCertificatePicIdList.length === 0) {
      return Toast.fail("请上传医师执业证书", 3)
    }
    if (this.state.practisingCertificatePicIdList.length === 1) {
      return Toast.fail("请上传两张医师执业证书", 3)
    }
    if (this.state.qualificationCertificatePicIdList.length === 0) {
      return Toast.fail("请上传医师资格证书", 3)
    }
    if (this.state.qualificationCertificatePicIdList.length === 1) {
      return Toast.fail("请上传两张医师资格证书", 3)
    }
    let adeptSymptomIds: any = [],
      adeptSymptomIdList = this.state.adeptSymptomIdList
    adeptSymptomIds.pop()
    for (let v of adeptSymptomIdList) {
      adeptSymptomIds.push(v.id)
    }
    let practisingCertificatePicIds: any = [],
      practisingCertificatePicIdList = this.state.practisingCertificatePicIdList
    for (let v of practisingCertificatePicIdList) {
      practisingCertificatePicIds.push(v.picId)
    }
    let qualificationCertificatePicIds: any = [],
      qualificationCertificatePicIdList = this.state.qualificationCertificatePicIdList
    for (let v of qualificationCertificatePicIdList) {
      qualificationCertificatePicIds.push(v.picId)
    }
    let technicalqualificationCertificatePicIds: any = [],
      technicalQualificationCertificatePicIdList = this.state
        .technicalqualificationCertificatePicIdList
    for (let v of technicalQualificationCertificatePicIdList) {
      technicalqualificationCertificatePicIds.push(v.picId)
    }
    let param: authParam = {
      avatar: {
        picId: this.state.avatarId,
      },
      name: this.state.name,
      countyCid: this.state.cityId[2],
      idNo: this.state.idCardNo,
      gender: this.state.gender[0],
      technicalTitle: this.state.technicalTitle[0],
      departmentId: this.state.departmentId[0],
      adeptSymptomIdList: adeptSymptomIds,
      profile: this.state.profile,
      practisingCertificatePicIdList: practisingCertificatePicIds,
      qualificationCertificatePicIdList: qualificationCertificatePicIds,
      technicalQualificationCertificatePicIdList: technicalqualificationCertificatePicIds,
    }
    if (this.state.hospitalId !== 0) {
      param.hospitalId = this.state.hospitalId
    } else {
      param.hospitalName = this.state.hospitalName
    }
    try {
      await doctorApi.doctorAuth(param)
      Toast.fail("提交成功, 等待审核", 2, () => {})
    } catch (err) {
      console.log(err)
      Toast.fail("提交失败, 错误信息: " + err.msg, 3)
    }
  }
  handleFileChange = (avatar: any, operationType: string) => {
    let avatarSelectable = avatar.length < 1
    this.setState({
      avatar,
      avatarSelectable,
    })
    if (operationType === "add") {
      api
        .uploadImg(avatar[avatar.length - 1])
        .then(json => {
          let avatarId = this.state.avatarId,
            avatar = this.state.avatar
          avatar[avatar.length - 1].url = BASE_URL + json.data.url
          avatar[avatar.length - 1].picId = json.data.picId
          avatarId = json.data.picId
          this.setState({
            avatarId,
            avatar,
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
  medicalPracticeCertificateChange = async (
    practisingCertificatePicIdList: Array<{}>,
    operationType: string,
  ) => {
    let practisingCertificatePicIdSelectable = practisingCertificatePicIdList.length < 2
    this.setState({
      practisingCertificatePicIdList,
      practisingCertificatePicIdSelectable,
    })
    if (operationType === "add") {
      api
        .uploadImg(practisingCertificatePicIdList[practisingCertificatePicIdList.length - 1])
        .then(json => {
          let practisingCertificatePicIdList = this.state.practisingCertificatePicIdList
          practisingCertificatePicIdList[practisingCertificatePicIdList.length - 1].url =
            BASE_URL + json.data.url
          practisingCertificatePicIdList[practisingCertificatePicIdList.length - 1].picId =
            json.data.picId
          this.setState({
            practisingCertificatePicIdList,
          })
        })
        .catch(err => {
          console.log(err)
        })
    } else if (operationType === "remove") {
      this.setState({
        practisingCertificatePicIdList,
      })
    }
  }
  qualificationCertificatePicIdChange = (
    qualificationCertificatePicIdList: Array<{}>,
    operationType: string,
  ) => {
    let qualificationCertificatePicIdSelectable = qualificationCertificatePicIdList.length < 2
    this.setState({
      qualificationCertificatePicIdList,
      qualificationCertificatePicIdSelectable,
    })
    if (operationType === "add") {
      api
        .uploadImg(qualificationCertificatePicIdList[qualificationCertificatePicIdList.length - 1])
        .then(json => {
          let qualificationCertificatePicIdList = this.state.qualificationCertificatePicIdList
          qualificationCertificatePicIdList[qualificationCertificatePicIdList.length - 1].url =
            BASE_URL + json.data.url
          qualificationCertificatePicIdList[qualificationCertificatePicIdList.length - 1].picId =
            json.data.picId
          this.setState({
            qualificationCertificatePicIdList,
          })
        })
        .catch(err => {
          console.log(err)
        })
    } else if (operationType === "remove") {
      this.setState({
        qualificationCertificatePicIdList,
      })
    }
  }
  technicalqualificationCertificatePicIdChange = (
    technicalqualificationCertificatePicIdList: Array<{}>,
    operationType: string,
  ) => {
    let technicalqualificationCertificatePicIdSelectable =
      technicalqualificationCertificatePicIdList.length < 9
    this.setState({
      technicalqualificationCertificatePicIdList,
      technicalqualificationCertificatePicIdSelectable,
    })
    if (operationType === "add") {
      api
        .uploadImg(
          technicalqualificationCertificatePicIdList[
            technicalqualificationCertificatePicIdList.length - 1
          ],
        )
        .then(json => {
          let technicalqualificationCertificatePicIdList = this.state
            .technicalqualificationCertificatePicIdList
          technicalqualificationCertificatePicIdList[
            technicalqualificationCertificatePicIdList.length - 1
          ].url = BASE_URL + json.data.url
          technicalqualificationCertificatePicIdList[
            technicalqualificationCertificatePicIdList.length - 1
          ].picId = json.data.picId
          this.setState({
            technicalqualificationCertificatePicIdList,
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
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
      <>
        <View style={style.main}>
          <ScrollView style={style.content} keyboardShouldPersistTaps="handled">
            <View style={style.Theme}>
              <Text style={[style.ThemeTitle, global.fontStyle, global.fontSize16]}>
                补充审核资料
              </Text>
            </View>
            <View style={style.form}>
              <View style={[style.formTitle, global.flex, global.alignItemsCenter]}>
                <Text style={style.formIcon} />
                <Text style={[style.formThem, global.fontStyle, global.fontSize14]}>
                  请上传
                  <Text style={[style.formImportant, global.fontStyle, global.fontSize14]}>
                    正面照片
                  </Text>{" "}
                  , 我们将为您制作漂亮的头像
                </Text>
              </View>
              <View
                style={[
                  style.formItem,
                  style.formAvatar,
                  global.flex,
                  global.alignItemsCenter,
                  global.justifyContentStart,
                ]}>
                <Text style={[style.fromItemTitle, global.fontSize14, global.fontStyle]}>头像</Text>
                <ImagePicker
                  selectable={this.state.avatarSelectable}
                  onChange={this.handleFileChange}
                  files={this.state.avatar}
                />
                <Text
                  style={[style.fromItemTitle_2, global.fontSize14, global.fontStyle]}
                  numberOfLines={2}>
                  正面照, 清晰度高, 半身照(胸部以上)
                </Text>
              </View>
              <View style={style.formItem}>
                <InputItem
                  clear
                  style={[style.input, global.fontStyle, global.fontSize14]}
                  value={this.state.name}
                  placeholder="姓名"
                  onChange={name => {
                    this.setState({ name })
                  }}
                />
              </View>
              <View
                style={[
                  style.formItem,
                  style.pickerItem,
                  global.flex,
                  global.justifyContentSpaceBetween,
                  global.alignItemsCenter,
                ]}>
                <Text style={style.formItemTitle}>地区</Text>
                <Picker
                  data={this.state.region}
                  style={style.picker}
                  value={this.state.cityId}
                  triggerType="onPress"
                  onChange={cityId => this.chooseCityId(cityId)}>
                  <TouchableOpacity
                    style={[
                      style.pickerTitle,
                      global.flex,
                      global.justifyContentEnd,
                      global.alignItemsCenter,
                    ]}>
                    <Text style={[style.topItemTitle, global.fontStyle, global.fontSize14]}>
                      {this.state.cityId.length === 0
                        ? "请选择"
                        : this.state.regionCidMapAreaName[this.state.cityId[2]]}
                    </Text>
                    <Icon name="right" style={[style.inputIcon, global.fontSize16]} />
                  </TouchableOpacity>
                </Picker>
              </View>
              <View
                style={[
                  style.formItem,
                  style.pickerItem,
                  global.flex,
                  global.justifyContentSpaceBetween,
                  global.alignItemsCenter,
                ]}>
                <Text style={style.formItemTitle}>医疗机构</Text>
                <TouchableOpacity
                  style={[style.hospital, global.flex, global.justifyContentSpaceBetween]}
                  onPress={() => {
                    if (this.state.cityId.length === 0) {
                      return Toast.info("请先选择地区", 3)
                    }
                    this.setState({
                      selectHospitalActive: true,
                    })
                  }}>
                  <Text style={[style.hospitalTitle, global.fontSize14, global.fontStyle]}>
                    {this.state.hospitalName === "" ? "请选择" : this.state.hospitalName}
                  </Text>
                  <Icon name="right" style={[style.inputIcon, global.fontSize16]} />
                </TouchableOpacity>
              </View>
              <View style={style.formItem}>
                <InputItem
                  clear
                  style={[style.input, global.fontStyle, global.fontSize14]}
                  value={this.state.idCardNo}
                  placeholder="身份证号码"
                  type="number"
                  onChange={idCardNo => {
                    this.setState({ idCardNo })
                  }}
                  onBlur={(idCardNo: any) => {
                    if (!api.idCardIDChecked(idCardNo)) {
                      Toast.fail("身份证不正确", 3)
                    }
                  }}
                />
              </View>
              <View
                style={[
                  style.formItem,
                  style.pickerItem,
                  global.flex,
                  global.justifyContentSpaceBetween,
                  global.alignItemsCenter,
                ]}>
                <Text style={style.formItemTitle}>性别</Text>
                <Picker
                  data={this.gender}
                  style={style.picker}
                  cols={1}
                  value={this.state.gender}
                  triggerType="onPress"
                  onChange={gender => {
                    this.setState({
                      gender: gender as [number],
                    })
                  }}>
                  <TouchableOpacity
                    style={[
                      style.pickerTitle,
                      global.flex,
                      global.justifyContentEnd,
                      global.alignItemsCenter,
                    ]}>
                    <Text style={[style.topItemTitle, global.fontStyle, global.fontSize14]}>
                      {this.state.gender[0] === GENDER.UNDEFINED
                        ? "请选择"
                        : GENDER_ZH[this.state.gender[0]]}
                    </Text>
                    <Icon name="right" style={[style.inputIcon, global.fontSize16]} />
                  </TouchableOpacity>
                </Picker>
              </View>
              <View
                style={[
                  style.formItem,
                  style.pickerItem,
                  global.flex,
                  global.justifyContentSpaceBetween,
                  global.alignItemsCenter,
                ]}>
                <Text style={style.formItemTitle}>职称</Text>
                <Picker
                  data={this.technicalTitle}
                  style={style.picker}
                  cols={1}
                  value={this.state.technicalTitle}
                  triggerType="onPress"
                  onChange={technicalTitle => {
                    this.setState({
                      technicalTitle: technicalTitle as [number],
                    })
                  }}>
                  <TouchableOpacity
                    style={[
                      style.pickerTitle,
                      global.flex,
                      global.justifyContentEnd,
                      global.alignItemsCenter,
                    ]}>
                    <Text style={[style.topItemTitle, global.fontStyle, global.fontSize14]}>
                      {this.state.technicalTitle[0] === -1
                        ? "请选择"
                        : TECHNICAL_TITLE_ZH[this.state.technicalTitle[0]]}
                    </Text>
                    <Icon name="right" style={[style.inputIcon, global.fontSize16]} />
                  </TouchableOpacity>
                </Picker>
              </View>
            </View>
            <View style={style.Theme}>
              <Text style={[style.ThemeTitle_2, global.fontStyle, global.fontSize15]}>
                平台接受住院医师 ( 仅接受三甲医院 )、主治医师、副主任医师及主任医师进行入驻
              </Text>
            </View>
            <View style={style.form}>
              <View style={[style.formTitle, global.flex, global.alignItemsCenter]}>
                <Text style={style.formIcon} />
                <Text style={[style.formThem, global.fontStyle, global.fontSize14]}>
                  科室及擅长
                </Text>
              </View>
              <View
                style={[
                  style.formItem,
                  style.pickerItem,
                  global.flex,
                  global.justifyContentSpaceBetween,
                  global.alignItemsCenter,
                ]}>
                <Text style={style.formItemTitle}>科室</Text>
                <Picker
                  data={this.state.hospitalDepartment}
                  style={style.picker}
                  cols={1}
                  value={this.state.departmentId}
                  triggerType="onPress"
                  onChange={departmentId => {
                    this.setState({
                      departmentId: departmentId as [number],
                    })
                  }}>
                  <TouchableOpacity
                    style={[
                      style.pickerTitle,
                      global.flex,
                      global.justifyContentEnd,
                      global.alignItemsCenter,
                    ]}>
                    <Text style={[style.topItemTitle, global.fontStyle, global.fontSize14]}>
                      {this.state.departmentId[0] === -1
                        ? "请选择"
                        : this.state.hospitalDepartmentMap[this.state.departmentId[0]]}
                    </Text>
                    <Icon name="right" style={[style.inputIcon, global.fontSize16]} />
                  </TouchableOpacity>
                </Picker>
              </View>
              <View
                style={[
                  style.formItem,
                  style.pickerItem,
                  global.flex,
                  global.justifyContentSpaceBetween,
                  global.alignItemsCenter,
                ]}>
                <Text style={style.formItemTitle}>擅长</Text>
                <TouchableOpacity
                  style={[style.hospital, global.flex, global.justifyContentSpaceBetween]}
                  onPress={() => {
                    this.setState({
                      selectAdeptSymptomActive: true,
                    })
                  }}>
                  <Text style={[style.hospitalTitle, global.fontSize14, global.fontStyle]}>
                    请选择{" "}
                  </Text>
                  <Icon name="right" style={[style.inputIcon, global.fontSize16]} />
                </TouchableOpacity>
              </View>
              <View style={[style.adeptSymptomIdList, global.flex, global.flexWrap]}>
                {this.state.adeptSymptomIdList.map((v: any, k: number) => {
                  return (
                    <Text
                      key={k}
                      style={[style.adeptSymptomIdItem, global.fontSize14, global.fontStyle]}>
                      {v.name}
                    </Text>
                  )
                })}
              </View>
            </View>
            <View style={style.form}>
              <View style={style.separationModule} />
              <View style={[style.formTitle, global.flex, global.alignItemsCenter]}>
                <Text style={style.formIcon} />
                <Text style={[style.formThem, global.fontStyle, global.fontSize14]}>简介</Text>
              </View>
              <View style={[style.formItemTextarea]}>
                <TextareaItem
                  style={style.formItemTextarea}
                  rows={4}
                  placeholder="简介"
                  count={100}
                  onChange={profile => {
                    this.setState({
                      profile: profile as string,
                    })
                  }}
                />
              </View>
            </View>
            <View style={style.Theme}>
              <Text style={[style.ThemeTitle, global.fontStyle, global.fontSize15]}>
                上传审核证书
              </Text>
            </View>
            <View style={style.form}>
              <View style={[style.formTitle, global.flex, global.alignItemsCenter]}>
                <Text style={style.formIcon} />
                <Text style={[style.formThem, global.fontStyle, global.fontSize14]}>
                  请上传{" "}
                  <Text style={[style.formImportant, global.fontStyle, global.fontSize14]}>
                    {" "}
                    医师执业证书
                  </Text>
                  (两张)
                </Text>
              </View>
              <View
                style={[
                  style.formItemPickerImage,
                  style.formAvatar,
                  global.flex,
                  global.alignItemsCenter,
                  global.justifyContentStart,
                ]}>
                <ImagePicker
                  selectable={this.state.practisingCertificatePicIdSelectable}
                  onChange={this.medicalPracticeCertificateChange}
                  files={this.state.practisingCertificatePicIdList}
                />
              </View>
            </View>
            <View style={style.form}>
              <View style={style.separationModule} />
              <View style={[style.formTitle, global.flex, global.alignItemsCenter]}>
                <Text style={style.formIcon} />
                <Text style={[style.formThem, global.fontStyle, global.fontSize14]}>
                  请上传{" "}
                  <Text style={[style.formImportant, global.fontStyle, global.fontSize14]}>
                    {" "}
                    医师资格证书
                  </Text>
                  (两张)
                </Text>
              </View>
              <View
                style={[
                  style.formItemPickerImage,
                  style.formAvatar,
                  global.flex,
                  global.alignItemsCenter,
                  global.justifyContentStart,
                ]}>
                <ImagePicker
                  selectable={this.state.qualificationCertificatePicIdSelectable}
                  onChange={this.qualificationCertificatePicIdChange}
                  files={this.state.qualificationCertificatePicIdList}
                />
              </View>
            </View>
            <View style={style.form}>
              <View style={style.separationModule} />
              <View style={[style.formTitle, global.flex, global.alignItemsCenter]}>
                <Text style={style.formIcon} />
                <Text style={[style.formThem, global.fontStyle, global.fontSize14]}>
                  请上传{" "}
                  <Text style={[style.formImportant, global.fontStyle, global.fontSize14]}>
                    {" "}
                    专业技术资格证书
                  </Text>
                  即职称证书(选填, 最多10张)
                </Text>
              </View>
              <View style={style.formItemImg}>
                <ImagePicker
                  selectable={this.state.technicalqualificationCertificatePicIdSelectable}
                  onChange={this.technicalqualificationCertificatePicIdChange}
                  files={this.state.technicalqualificationCertificatePicIdList}
                />
              </View>
              <View style={style.previewPic}>
                <Text style={[style.example, global.fontStyle, global.fontSize14]}>证书示例</Text>
                <Text style={[style.previewPicRequirement, global.fontSize12, global.fontStyle]}>
                  * 确保姓名、照片、编号、执业范围、签发机关等清晰可见
                </Text>
                <Text style={[style.previewPicRequirement, global.fontSize12, global.fontStyle]}>
                  * 需要上传证书第一、第二页, 确保包含执业地点以及变更记录
                </Text>
                <View
                  style={[global.flex, global.justifyContentSpaceAround, global.alignItemsCenter]}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        previewPicFirstActive: true,
                      })
                    }}>
                    <Image
                      style={style.viewPic}
                      source={gImg.common.technicalqualificationCertificatePicFirst}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        previewPicSecondActive: true,
                      })
                    }}>
                    <Image
                      style={style.viewPic}
                      source={gImg.common.technicalqualificationCertificatePicSecond}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
          <TouchableOpacity style={style.subBtn} onPress={this.submit}>
            <Text style={[style.subTitle, global.fontStyle, global.fontSize15]}>提交</Text>
          </TouchableOpacity>
          {/* 医疗机构选择 */}
          <View style={this.state.selectHospitalActive ? style.hospitalSelect : global.hidden}>
            <ScrollView style={style.hospitalContent} keyboardShouldPersistTaps="handled">
              <View
                style={[
                  style.hospitalAdd,
                  global.flex,
                  global.alignItemsCenter,
                  global.justifyContentSpaceBetween,
                ]}>
                <Icon style={style.hospitalSearchIcon} name="search" />
                <View style={style.hospitalSearch}>
                  <InputItem
                    clear
                    style={[style.hospitalInput, global.fontStyle, global.fontSize14]}
                    value={this.state.hospitalName}
                    placeholder="输入所在医疗机构"
                    onChange={hospitalName => {
                      this.setState({ hospitalName })
                    }}
                  />
                </View>
                <TouchableOpacity
                  style={style.closeBtn}
                  onPress={() => {
                    this.setState({
                      selectHospitalActive: false,
                      hospitalName: "",
                      hospitalId: 0,
                    })
                  }}>
                  <Text style={[style.close, global.fontSize14, global.fontStyle]}>取消</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[
                  this.state.hospitalName !== "" ? style.addHospital : global.hidden,
                  global.flex,
                  global.alignItemsCenter,
                  global.justifyContentCenter,
                ]}
                onPress={() => {
                  this.setState({
                    selectHospitalActive: false,
                  })
                }}>
                <Text style={[style.addHospitalBtn, global.fontSize14, global.fontStyle]}>
                  添加
                </Text>
                <Text
                  numberOfLines={1}
                  style={[style.addHospitalBtn, global.fontSize14, global.fontStyle]}>
                  {this.state.hospitalName}
                </Text>
              </TouchableOpacity>
              <View style={style.hospitalList}>
                {this.state.hospitalList.map((v: any, k: number) => {
                  return (
                    <TouchableOpacity
                      key={k}
                      onPress={() => {
                        this.setState({
                          hospitalId: v.id,
                          hospitalName: v.name,
                        })
                      }}>
                      <Text style={style.hospitalItem}>{v.name}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </ScrollView>
          </View>
          {/* 擅长选择 */}
          <View style={this.state.selectAdeptSymptomActive ? style.adeptSymptom : global.hidden}>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  selectAdeptSymptomActive: false,
                })
              }}>
              <Text style={[style.closeAdeptSymptom, global.fontStyle, global.fontSize14]}>
                关闭
              </Text>
            </TouchableOpacity>
            <ScrollView style={style.adeptSymptomContent}>
              <View style={[style.formTitle, global.flex, global.alignItemsCenter]}>
                <Text style={style.formIcon} />
                <Text style={[style.formThem, global.fontStyle, global.fontSize14]}>
                  选择擅长治疗疾病(最多选择10个)
                </Text>
              </View>
              {this.state.hospitalDepartmentSymptom.map((v: any, k: number) => {
                return (
                  <View key={k} style={style.symptomList}>
                    <Text style={[style.symptomTitle, global.fontSize14, global.fontStyle]}>
                      {v.name}
                    </Text>
                    <View style={[global.flex, global.flexWrap]}>
                      {v.symptomList.map((v1: any, k1: number) => {
                        return (
                          <TouchableOpacity
                            key={k1}
                            onPress={() => {
                              let hospitalDepartmentSymptom = this.state.hospitalDepartmentSymptom,
                                adeptSymptomIdList = this.state.adeptSymptomIdList
                              if (adeptSymptomIdList.length < 10) {
                                hospitalDepartmentSymptom[k].symptomList[
                                  k1
                                ].isChecked = !v1.isChecked
                                if (v1.isChecked) {
                                  adeptSymptomIdList.push({
                                    id: v1.id,
                                    name: v1.name,
                                  })
                                } else {
                                  adeptSymptomIdList = adeptSymptomIdList.filter(
                                    v2 => v2.id !== v1.id,
                                  )
                                }
                                this.setState({
                                  hospitalDepartmentSymptom,
                                  adeptSymptomIdList,
                                })
                              } else {
                                Toast.info("选择擅长治疗疾病不超过10个", 1)
                              }
                            }}>
                            <Text
                              style={[
                                v1.isChecked ? style.symptomItemActive : style.symptomItem,
                                global.fontSize14,
                                global.fontStyle,
                              ]}>
                              {v1.name}
                            </Text>
                          </TouchableOpacity>
                        )
                      })}
                    </View>
                  </View>
                )
              })}
            </ScrollView>
          </View>
        </View>
        <View style={this.state.previewPicFirstActive ? style.picView : global.hidden}>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                previewPicFirstActive: false,
              })
            }}>
            <Text style={[style.closePicView, global.fontSize14, global.fontStyle]}>关闭</Text>
          </TouchableOpacity>
          <View style={style.viewImgFather}>
            <Image
              style={style.viewImg}
              source={gImg.common.technicalqualificationCertificatePicFirst}
            />
          </View>
        </View>
        <View style={this.state.previewPicSecondActive ? style.picView : global.hidden}>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                previewPicSecondActive: false,
              })
            }}>
            <Text style={[style.closePicView, global.fontSize14, global.fontStyle]}>关闭</Text>
          </TouchableOpacity>
          <View style={style.viewImgFather}>
            <Image
              style={style.viewImg}
              source={gImg.common.technicalqualificationCertificatePicSecond}
            />
          </View>
        </View>
      </>
    )
  }
}
