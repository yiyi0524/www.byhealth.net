import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import { PrescriptionTpl } from "@/services/doctor"
import { InputItem, Toast } from "@ant-design/react-native"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
import { Image, PixelRatio, RefreshControl, Text, View } from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { NavigationScreenProp } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import DashLine from "@/components/DashLine"
import { windowWidth } from "@/services/api"
const style = gStyle.index.AddPrescriptionTpl
const global = gStyle.global
interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  categoryId: number
  prescriptionTplDetail: PrescriptionTpl
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
export default class AddPrescriptionTpl extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<State> }) => {
    let title = ""
    if (navigation.state.params) {
      title = navigation.state.params.title + "模板"
    }
    return {
      title,
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
    }
  }
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      categoryId: 0,
      prescriptionTplDetail: {
        id: 0,
        name: "",
        advice: "",
        ctime: "",
        drugList: [],
      },
    }
  }
  componentDidMount() {
    this.init()
    this.props.navigation.setParams({
      navigatePress: this.addPrescriptionTpl,
    })
  }
  init = async () => {
    try {
      let categoryId = this.props.navigation.getParam("id")
      this.setState({
        hasLoad: true,
        categoryId,
      })
    } catch (err) {
      console.log(err.msg)
    }
  }
  addPrescriptionTpl = () => {}
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
          keyboardShouldPersistTaps="always"
          style={style.main}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }>
          <View style={style.addPrescriptionTpl}>
            <View style={[style.addPrescriptionTplHeader, global.flex, global.alignItemsCenter]}>
              <Text style={[style.addPrescriptionTplHeaderTitle, global.fontSize14]}>模板名称</Text>
              <View style={style.addPrescriptionTplHeaderInput}>
                <InputItem
                  style={style.input}
                  placeholder="请输入模板名称"
                  clear
                  value={this.state.prescriptionTplDetail.name}
                  onChange={val => {
                    let { prescriptionTplDetail } = this.state
                    prescriptionTplDetail.name = val
                    this.setState({
                      prescriptionTplDetail,
                    })
                  }}
                />
              </View>
            </View>
            <View style={style.drugCategoryList}>
              <View
                style={[
                  style.drugCategoryTitle,
                  global.flex,
                  global.alignItemsCenter,
                  global.justifyContentCenter,
                ]}>
                <View style={style.spot} />
                <Text style={[style.drugCategoryTitle, global.fontSize14]}>开方</Text>
                <View style={style.spot} />
              </View>
              <DashLine width={windowWidth - 30} backgroundColor={"#ddd"} len={45} />
              {/* 中药 */}
              <View style={style.drugCategoryItem}>
                <Text style={[style.drugCategoryName, global.fontSize15]}>分裂名</Text>
                <View
                  style={[style.drugList, global.flex, global.alignItemsCenter, global.flexWrap]}>
                  <Text
                    style={[style.drugName, global.fontSize14, style.traditionalChineseMedicine]}>
                    药名名药名 4g
                  </Text>
                  <Text
                    style={[style.drugName, global.fontSize14, style.traditionalChineseMedicine]}>
                    药名药名药名药名 4g
                  </Text>
                </View>
              </View>
              {/* 西药 */}
              <View style={style.drugCategoryItem}>
                <Text style={[style.drugCategoryName, global.fontSize15]}>分裂名</Text>
                <View style={style.drugList}>
                  <View style={style.drugItem}>
                    <Text style={style.drugName}>药名</Text>
                    <Text style={style.drugName}>4g</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity>
                <Text style={[style.editDrug, global.fontSize14]}>编辑药材</Text>
              </TouchableOpacity>
            </View>
            <View style={[style.addPrescriptionTplHeader, global.flex, global.alignItemsCenter]}>
              <Text style={[style.addPrescriptionTplHeaderTitle, global.fontSize14]}>医嘱</Text>
              <View style={style.addPrescriptionTplHeaderInput}>
                <InputItem
                  style={style.input}
                  placeholder="请输入医嘱"
                  clear
                  value={this.state.prescriptionTplDetail.advice}
                  onChange={val => {
                    let { prescriptionTplDetail } = this.state
                    prescriptionTplDetail.advice = val
                    this.setState({
                      prescriptionTplDetail,
                    })
                  }}
                />
              </View>
            </View>
            <TouchableOpacity>
              <Text style={[style.addPrescriptionTplBtn, global.fontSize14]}>保存</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </>
    )
  }
}
