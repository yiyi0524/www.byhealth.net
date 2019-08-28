import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import pathMap from "@/routes/pathMap"
import { Icon, Toast } from "@ant-design/react-native"
import Calendar from "@components/Calendar"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
import {
  Image,
  PixelRatio,
  RefreshControl,
  Text,
  View,
  DeviceEventEmitter,
  EmitterSubscription,
} from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { NavigationScreenProp } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import doctor, { SittingHospital } from "@/services/doctor"
import hospital from "@/services/hospital"
const style = gStyle.index.SittingHospital
const global = gStyle.global
interface NavParams {
  navigatePress: () => void
}
interface Hospital {
  id: number
  name: string
}
interface Props {
  navigation: NavigationScreenProp<State, NavParams>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  sittingInfoList: SittingHospital[]
  hospitalList: Hospital[]
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
export default class SittingInformation extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = ({
    navigation,
  }: {
    navigation: NavigationScreenProp<State, NavParams>
  }) => ({
    title: "坐诊信息",
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
        {/* <Text style={[style.headerRight, global.fontSize14]}>分享</Text> */}
      </TouchableOpacity>
    ),
  })
  sittingInfoMapColor: string[]
  subscription?: EmitterSubscription
  constructor(props: any) {
    super(props)
    this.sittingInfoMapColor = [
      "#f2878d",
      "#d68db5",
      "#ac84bf",
      "#9b9fc5",
      "#8fb2d4",
      "#82c6c9",
      "#71c797",
    ]
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      sittingInfoList: [],
      hospitalList: [],
    }
  }
  async componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener(pathMap.SittingHospital + "Reload", _ => {
      this.init()
    })
    await this.init()
    this.props.navigation.setParams({
      navigatePress: this.shareInformation,
    })
  }
  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.remove()
    }
  }

  shareInformation = () => {
    Toast.info("分享成功", 1)
  }
  init = async () => {
    try {
      let {
        data: { list: hospitalList },
      } = await hospital.getList({ page: -1, limit: -1, filter: {} })
      let {
        data: { list: sittingInfoList },
      } = await doctor.listSittingHospital({ page: -1, limit: -1, filter: {} })
      this.setState({
        hasLoad: true,
        sittingInfoList,
        hospitalList,
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
          <View style={style.content}>
            <View style={style.medicalInstitution}>
              <View style={[style.header, global.flex, global.alignItemsCenter]}>
                <Text style={[style.selectMedicalInstitutionTitle, global.fontSize14]}>
                  医疗机构
                </Text>
                <TouchableOpacity
                  onPress={() => this.props.navigation.push(pathMap.SittingHospitalList)}>
                  <View
                    style={[style.selectMedicalInstitution, global.flex, global.alignItemsCenter]}>
                    <Text style={[style.selectMedicalInstitutionTheme, global.fontSize14]}>
                      添加医疗机构
                    </Text>
                    <Icon
                      style={[style.selectMedicalInstitutionIcon, global.fontSize14]}
                      name="right"
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={style.medicalInstitutionList}>
                {this.state.sittingInfoList.map((v, k) => {
                  let hospitalName = v.hospitalName
                  for (let v1 of this.state.hospitalList) {
                    if (v.hospitalId === v1.id) {
                      hospitalName = v1.name
                    }
                  }
                  return (
                    <View
                      style={[style.medicalInstitutionItem, global.flex, global.alignItemsCenter]}
                      key={k}>
                      <View
                        style={[
                          style.medicalInstitutionIcon,
                          { backgroundColor: this.sittingInfoMapColor[k] },
                        ]}
                      />
                      <Text style={[style.medicalInstitutionTitle, global.fontSize14]}>
                        {hospitalName}
                      </Text>
                    </View>
                  )
                })}
              </View>
            </View>
            <View style={style.calendar}>
              <Calendar />
            </View>
          </View>
        </ScrollView>
      </>
    )
  }
}
