import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import { Toast, Icon } from "@ant-design/react-native"
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
  TouchableNativeFeedback,
} from "react-native"
import { ScrollView, TouchableOpacity, TouchableHighlight } from "react-native-gesture-handler"
import { NavigationScreenProp } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import pathMap from "@/routes/pathMap"
const style = gStyle.index.SittingInformation
const global = gStyle.global
interface NavParams {
  navigatePress: () => void
}
interface Props {
  navigation: NavigationScreenProp<State, NavParams>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
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
        <Text style={[style.headerRight, global.fontSize14]}>分享</Text>
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
    }
  }
  async componentDidMount() {
    await this.init()
    this.props.navigation.setParams({
      navigatePress: this.shareInformation,
    })
  }

  shareInformation = () => {
    Toast.info("分享成功", 1)
  }
  init = async () => {
    this.setState({
      hasLoad: true,
    })
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
                  onPress={() => this.props.navigation.push(pathMap.MedicalInstitutionList)}>
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
                <View style={[style.medicalInstitutionItem, global.flex, global.alignItemsCenter]}>
                  <View style={style.medicalInstitutionIcon} />
                  <Text style={[style.medicalInstitutionTitle, global.fontSize14]}>
                    广东省第二中医院
                  </Text>
                </View>
                <View style={[style.medicalInstitutionItem, global.flex, global.alignItemsCenter]}>
                  <View style={style.medicalInstitutionIcon} />
                  <Text style={[style.medicalInstitutionTitle, global.fontSize14]}>
                    广东省第二中医院
                  </Text>
                </View>
              </View>
            </View>
            <View style={style.calendar} />
          </View>
        </ScrollView>
      </>
    )
  }
}
