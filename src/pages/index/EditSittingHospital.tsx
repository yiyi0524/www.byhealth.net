import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import api, { windowWidth } from "@/services/api"
import { Icon, InputItem, List, Picker, Toast } from "@ant-design/react-native"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
import { Image, PixelRatio, RefreshControl, Text, View, DeviceEventEmitter } from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { NavigationScreenProp } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import hospital from "@/services/hospital"
import { TYPE } from "@/utils/constant"
import doctor from "@/services/doctor"
import pathMap from "@/routes/pathMap"
const style = gStyle.index.EditSittingHospital
const global = gStyle.global
interface NavParams {
  navigatePress: () => void
}
interface RegionCidMapAreaName extends Record<string, string> {}
interface CityItem {
  value: string
  label: string
  children: CityItem[]
}
interface hospital {
  id: number
  name: string
  hidden: boolean
}
interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  hospitalId: number
  sittingHospitalId: number
  hospitalName: string
  detail: string
  page: number
  limit: number
  isSelectHospital: boolean
  filter: {}
  region: CityItem[]
  cityInfo: string[]
  regionCidMapAreaName: RegionCidMapAreaName
  hospitalList: hospital[]
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
export default class DiagnosisSettings extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = ({
    navigation,
  }: {
    navigation: NavigationScreenProp<State, NavParams>
  }) => ({
    title: "医疗机构信息",
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
    headerRight: (
      <TouchableOpacity
        onPress={() => {
          navigation.state.params!.navigatePress()
        }}>
        <Text style={[style.headerRight, global.fontSize14]}>保存</Text>
      </TouchableOpacity>
    ),
  })
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      isSelectHospital: false,
      sittingHospitalId: this.props.navigation.getParam("id"),
      hospitalId: 0,
      hospitalName: "",
      detail: "",
      page: -1,
      limit: -1,
      filter: {},
      region: [],
      cityInfo: [],
      regionCidMapAreaName: {},
      hospitalList: [],
    }
  }
  componentDidMount() {
    this.init()
    this.props.navigation.setParams({
      navigatePress: this.editSittingHospital,
    })
  }
  init = async () => {
    try {
      let region = [],
        regionCidMapAreaName: RegionCidMapAreaName = {}
      let {
        data: { detail: info },
      } = await doctor.getSittingHospital({ id: this.state.sittingHospitalId })
      let { detail, cityInfo, hospitalId, hospitalName } = this.state
      detail = info.detail
      cityInfo = [info.provinceCid, info.cityCid, info.countyCid]
      hospitalId = info.hospitalId
      hospitalName = info.hospitalName
      let {
        data: { region: oriRegion },
      } = await api.getRegion()
      region = this.generateFormatRegion(oriRegion)
      regionCidMapAreaName = this.getChildCidMapAreaName(oriRegion, regionCidMapAreaName)
      this.setState({
        region,
        regionCidMapAreaName,
        detail,
        cityInfo,
        hospitalId,
        hospitalName,
      })
    } catch (err) {
      console.log(err.msg)
    }
    this.setState({
      hasLoad: true,
    })
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
  getChildCidMapAreaName = (arr: any, regionCidMapAreaName: any) => {
    for (let i = 0, len = arr.length; i < len; i++) {
      if (arr[i].children && arr[i].children.length > 0) {
        this.getChildCidMapAreaName(arr[i].children, regionCidMapAreaName)
      }
      regionCidMapAreaName[arr[i].cid] = arr[i].areaName
    }
    return regionCidMapAreaName
  }
  editSittingHospital = async () => {
    try {
      if (this.state.cityInfo.length === 0) {
        return Toast.fail("请选择地区", 3)
      }
      if (this.state.hospitalName === "") {
        if (this.state.hospitalId === 0) {
          return Toast.fail("请输入医疗机构名称", 3)
        }
      }
      if (this.state.detail === "") {
        return Toast.fail("请输入您的地址", 3)
      }
      doctor
        .editSittingHospital({
          id: this.state.sittingHospitalId,
          countyCid: parseInt(this.state.cityInfo[2]),
          hospitalId: this.state.hospitalId,
          hospitalName: this.state.hospitalName,
          detail: this.state.detail,
        })
        .then(() => {
          Toast.success("修改成功", 2)
          DeviceEventEmitter.emit(pathMap.SittingHospital + "Reload", null)
          DeviceEventEmitter.emit(pathMap.SittingHospitalList + "Reload", null)
          DeviceEventEmitter.emit(pathMap.Calendar + "Reload", null)
          this.props.navigation.goBack()
        })
    } catch (err) {
      Toast.fail("修改失败, 错误信息: " + err.msg, 3)
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
  chooseCityId = async (cityInfo: any) => {
    this.setState({
      cityInfo,
    })
    try {
      let {
        data: { list: hospitalList },
      } = await hospital.getList({
        page: this.state.page,
        limit: this.state.limit,
        filter: {
          countyCid: {
            condition: TYPE.eq,
            val: cityInfo[2],
          },
        },
      })
      for (let v of hospitalList) {
        v.hidden = false
      }
      this.setState({
        hospitalList,
        hospitalName: "",
        hospitalId: 0,
      })
    } catch (err) {
      console.log(err.msg)
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
      <>
        <ScrollView
          keyboardShouldPersistTaps="always"
          style={style.main}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }>
          <View style={style.list}>
            <View style={style.item}>
              <Text style={[style.title, global.fontSize14]}>地区信息</Text>
              <View style={style.picker}>
                <Picker
                  data={this.state.region}
                  cols={3}
                  value={this.state.cityInfo}
                  onChange={val => this.chooseCityId(val)}>
                  <TouchableOpacity>
                    <View style={[global.flex, global.alignItemsCenter]}>
                      <Text style={[style.pickerItem, global.fontStyle, global.fontSize14]}>
                        {this.state.cityInfo.length === 0
                          ? "请选择"
                          : this.state.regionCidMapAreaName[this.state.cityInfo[2]]}
                      </Text>
                      <Icon name="right" style={[style.pickerIcon, global.fontSize16]} />
                    </View>
                  </TouchableOpacity>
                </Picker>
              </View>
            </View>
            <View style={[style.item]}>
              <Text style={[style.title, global.fontSize14]}>医疗机构名称</Text>
              <TouchableOpacity
                style={style.input}
                onPress={() => {
                  if (this.state.cityInfo.length === 0) {
                    return Toast.info("请选择地区", 2)
                  } else {
                    this.setState({
                      isSelectHospital: true,
                    })
                  }
                }}>
                <View style={[global.flex, global.alignItemsCenter]}>
                  <Text style={[style.name, global.fontSize14]}>
                    {this.state.hospitalName ? this.state.hospitalName : "请输入医疗机构名称"}
                  </Text>
                  <Icon name="right" style={[style.pickerIcon, global.fontSize14]} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={[style.item]}>
              <Text style={[style.title, global.fontSize14]}>医疗机构地址</Text>
              <View style={style.input}>
                <InputItem
                  style={style.input}
                  clear
                  last
                  labelNumber={6}
                  value={this.state.detail}
                  onChange={detail => {
                    this.setState({
                      detail,
                    })
                  }}
                  extra={<Icon name="right" style={[style.icon, global.fontSize14]} />}
                  placeholder="请输入您的地址"
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={this.state.isSelectHospital ? style.hospital : global.hidden}>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                isSelectHospital: false,
                hospitalName: "",
                hospitalId: 0,
              })
            }}>
            <Text style={[style.close, global.fontSize14]}>关闭</Text>
          </TouchableOpacity>
          <ScrollView style={style.hospitalCenter}>
            <InputItem
              style={style.search}
              last
              value={this.state.hospitalName}
              placeholder="请输入医疗机构名称"
              extra={<Icon name="search" />}
              onChange={hospitalName => {
                this.setState({
                  hospitalName,
                })
                let hospitalList = this.state.hospitalList
                if (hospitalName !== "") {
                  for (let hospital of hospitalList) {
                    hospital.hidden = hospital.name.indexOf(hospitalName) < 0
                  }
                } else {
                  hospitalList = hospitalList.map(v => {
                    v.hidden = false
                    return v
                  })
                }
                this.setState({
                  hospitalList,
                })
              }}
            />
            <TouchableOpacity
              style={[this.state.hospitalName !== "" ? null : global.hidden]}
              onPress={() => {
                if (this.state.hospitalName === "") {
                  return
                }
                this.setState({
                  isSelectHospital: false,
                  hospitalId: 0,
                })
              }}>
              <View
                style={[
                  style.addHospital,
                  global.flex,
                  global.alignItemsCenter,
                  global.justifyContentCenter,
                ]}>
                <Text style={[style.addHospitalBtn, global.fontSize14, global.fontStyle]}>
                  添加
                </Text>
                <Text
                  numberOfLines={1}
                  style={[style.addHospitalName, global.fontSize14, global.fontStyle]}>
                  {this.state.hospitalName}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={style.hospitalList}>
              {this.state.hospitalList.map((v, k) => {
                if (v.hidden) {
                  return null
                }
                return (
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        hospitalName: v.name,
                        hospitalId: v.id,
                        isSelectHospital: false,
                      })
                    }}
                    key={k}>
                    <Text style={[style.hospitalItem, global.fontSize14]}>{v.name}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </ScrollView>
        </View>
      </>
    )
  }
}
