import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import pathMap from "@/routes/pathMap"
import doctor, { PrescriptionTpl } from "@/services/doctor"
import { TYPE } from "@/utils/constant"
import { Toast } from "@ant-design/react-native"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
import {
  DeviceEventEmitter,
  EmitterSubscription,
  Image,
  PixelRatio,
  RefreshControl,
  Text,
  View,
} from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { NavigationScreenProp } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
const style = gStyle.index.PrescriptionTplList
const global = gStyle.global
interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  categoryId: number
  categoryName: string
  prescriptionTplList: PrescriptionTpl[]
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
export default class PrescriptionTplList extends Component<
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
      headerRight: (
        <TouchableOpacity
          onPress={() => {
            navigation.push(pathMap.AddPrescriptionTpl, {
              id: navigation.getParam("id"),
              title: navigation.getParam("title"),
            })
          }}>
          <Text style={[style.headerRight, global.fontSize14, global.fontStyle]}>新建</Text>
        </TouchableOpacity>
      ),
    }
  }
  subscription?: EmitterSubscription
  constructor(props: any) {
    super(props)

    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      categoryId: 0,
      categoryName: "",
      prescriptionTplList: [],
    }
  }
  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener(pathMap.SittingHospital + "Reload", _ => {
      this.init()
    })
    this.init()
  }
  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.remove()
    }
  }
  init = async () => {
    try {
      let categoryId = this.props.navigation.getParam("id"),
        categoryName = this.props.navigation.getParam("title")
      let {
        data: { list: prescriptionTplList },
      } = await doctor.listPrescriptionTpl({
        page: -1,
        limit: -1,
        filter: {
          categoryId: {
            condiction: TYPE.eq,
            val: categoryId,
          },
        },
      })
      this.setState({
        hasLoad: true,
        categoryId,
        categoryName,
        prescriptionTplList,
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
          <View style={style.prescriptionList}>
            {this.state.prescriptionTplList.map((prescription, k) => {
              let drug = ""
              for (let v of prescription.drugList) {
                drug += v.name + "、"
              }
              drug = drug.substr(0, drug.lastIndexOf("、"))
              return (
                <TouchableOpacity
                  key={k}
                  onPress={() =>
                    this.props.navigation.push(pathMap.EditPrescriptionTpl, {
                      id: prescription.id,
                      categoryId: this.state.categoryId,
                      categoryName: this.state.categoryName,
                    })
                  }>
                  <View style={style.prescriptionItem}>
                    <View
                      style={[
                        style.prescriptionHeader,
                        global.flex,
                        global.alignItemsCenter,
                        global.justifyContentSpaceBetween,
                      ]}>
                      <Text style={[style.prescriptionTitle, global.fontSize14]} numberOfLines={1}>
                        {prescription.name}
                      </Text>
                      <Text style={[style.prescriptionTime, global.fontSize12]}>
                        {prescription.ctime.substr(0, 10)}
                      </Text>
                    </View>
                    <Text style={[style.prescriptionDetail, global.fontSize14]} numberOfLines={1}>
                      {drug}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        </ScrollView>
      </>
    )
  }
}