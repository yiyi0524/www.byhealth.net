import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import pathMap from "@/routes/pathMap"
import doctor, { PrescriptionTpl } from "@/services/doctor"
import { TYPE } from "@/utils/constant"
import { Toast, SwipeAction } from "@ant-design/react-native"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component, ReactChild } from "react"
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
import Empty from "@/components/Empty"
import { SwipeActionProps } from "@ant-design/react-native/lib/swipe-action"
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
@connect(mapStateToProps, mapDispatchToProps)
export default class PrescriptionTplList extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<State> }) => {
    let title = "处方模板"
    let headerRight: ReactChild | null = null
    if (navigation.state.params) {
      title = navigation.state.params.title + "模板"
      headerRight = (
        <TouchableOpacity
          style={navigation.getParam("id") ? {} : { display: "none" }}
          onPress={() => {
            navigation.push(pathMap.AddPrescriptionTpl, {
              id: navigation.getParam("id"),
              title: navigation.getParam("title"),
            })
          }}>
          <Text style={[style.headerRight, global.fontSize14, global.fontStyle]}>新建</Text>
        </TouchableOpacity>
      )
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
      headerRight,
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
    this.subscription = DeviceEventEmitter.addListener(
      pathMap.PrescriptionTplList + "Reload",
      _ => {
        this.init()
      },
    )
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
            condition: TYPE.eq,
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
  deletePrescriptionTpl = async (id: number) => {
    try {
      await doctor.deletePrescriptionTpl({ id })
      Toast.success("删除成功", 2)
      DeviceEventEmitter.emit(pathMap.PrescriptionTplList + "Reload", null)
    } catch (err) {
      Toast.fail("删除失败, 错误信息: " + err.msg, 3)
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
          style={style.main}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }>
          <View style={style.prescriptionList}>
            {this.state.prescriptionTplList.length === 0 ? (
              <View>
                <Empty />
                <Text style={{ textAlign: "center", fontSize: 14, color: "#888" }}>暂无模板</Text>
              </View>
            ) : null}
            {this.state.prescriptionTplList.map((prescription, k) => {
              let drugStr = ""
              for (let v of prescription.drugList) {
                drugStr += v.detail.name + "、"
              }
              drugStr = drugStr.substr(0, drugStr.lastIndexOf("、"))
              let rightOpt: SwipeActionProps["right"] = prescription.isSystemTpl
                ? [
                    {
                      text: "开方",
                      onPress: () => {
                        this.props.navigation.push(pathMap.SquareRoot, {
                          mode: "wx",
                          prescription: prescription,
                        })
                      },
                      style: { backgroundColor: "blue", color: "white" },
                    },
                  ]
                : [
                    {
                      text: "开方",
                      onPress: () => {
                        this.props.navigation.push(pathMap.SquareRoot, {
                          mode: "wx",
                          prescription: prescription,
                        })
                      },
                      style: { backgroundColor: "blue", color: "white" },
                    },
                    {
                      text: "编辑",
                      onPress: () => {
                        this.props.navigation.push(pathMap.EditPrescriptionTpl, {
                          id: prescription.id,
                          title: this.state.categoryName,
                          categoryId: this.state.categoryId,
                          categoryName: this.state.categoryName,
                        })
                      },
                      style: { backgroundColor: "orange", color: "white" },
                    },
                    {
                      text: "删除",
                      onPress: () => this.deletePrescriptionTpl(prescription.id),
                      style: { backgroundColor: "red", color: "white" },
                    },
                  ]
              return (
                <SwipeAction
                  key={k}
                  autoClose
                  // disabled={prescription.isSystemTpl}
                  style={{ backgroundColor: "transparent", marginTop: 8 }}
                  right={rightOpt}
                  onOpen={() => {}}
                  onClose={() => {}}>
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
                      <View>
                        <Text style={[style.prescriptionTime, global.fontSize12]}>
                          {prescription.ctime.substr(0, 10)}
                        </Text>
                        {prescription.isSystemTpl && (
                          <Text style={[{ color: "red", marginTop: 10 }, global.fontSize12]}>
                            经典方
                          </Text>
                        )}
                      </View>
                    </View>
                    <Text style={[style.prescriptionDetail, global.fontSize14]} numberOfLines={1}>
                      {drugStr}
                    </Text>
                  </View>
                </SwipeAction>
              )
            })}
          </View>
        </ScrollView>
      </>
    )
  }
}
