import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import { Toast, Icon, Modal } from "@ant-design/react-native"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
import { Image, PixelRatio, RefreshControl, Text, View } from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { NavigationScreenProp } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import doctor, { MedicalInstitution } from "@/services/doctor"
import hospital from "@/services/hospital"
import pathMap from "@/routes/pathMap"
const style = gStyle.index.SittingMedicalInstitutionList
const global = gStyle.global

interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  list: MedicalInstitution[]
  hospitalList: Hospital[]
}
interface Hospital {
  id: number
  name: string
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
  static navigationOptions = () => ({
    title: "管理医疗机构",
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
    headerRight: <Text />,
  })
  medicalInstitutionMapColor: string[]
  constructor(props: any) {
    super(props)
    this.medicalInstitutionMapColor = [
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
      list: [],
      hospitalList: [],
    }
  }
  componentDidMount() {
    this.init()
  }
  init = async () => {
    try {
      let {
        data: { list: hospitalList },
      } = await hospital.getList({ page: -1, limit: -1, filter: {} })
      let {
        data: { list },
      } = await doctor.ListMedicalInstitution({ page: -1, limit: -1, filter: {} })
      this.setState({
        hasLoad: true,
        list,
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
    let color = this.medicalInstitutionMapColor
    return (
      <>
        <ScrollView
          style={style.main}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }>
          <View style={style.list}>
            {this.state.list.map((v, k) => {
              let hospitalName = v.hospitalName
              for (let v1 of this.state.hospitalList) {
                if (v1.id === v.hospitalId) {
                  hospitalName = v1.name
                }
              }
              return (
                <View style={style.item} key={k}>
                  <View style={[global.flex, global.alignItemsCenter]}>
                    <Icon style={[style.itemImg, global.fontSize20]} name="home" />
                    <Text style={[style.itemTitle, global.fontSize14]}>{hospitalName}</Text>
                  </View>
                  <View style={[global.flex, global.alignItemsCenter]}>
                    <Icon style={[style.itemImg, global.fontSize20]} name="environment" />
                    <Text style={[style.itemTitle, global.fontSize14]}>{v.address.whole}</Text>
                  </View>
                  <View
                    style={[
                      style.operation,
                      global.flex,
                      global.alignItemsCenter,
                      global.justifyContentEnd,
                    ]}>
                    <TouchableOpacity
                      onPress={() => {
                        Modal.alert("提示", "确定删除该医疗机构?", [
                          {
                            text: "取消",
                            onPress: () => {},
                          },
                          {
                            text: "确定",
                            onPress: async () => {
                              try {
                                await doctor.deleteMedicalInstitution({ id: v.id })
                                await this.init()
                                Toast.success("删除成功", 2)
                              } catch (err) {
                                Toast.fail("删除失败, 错误信息: " + err.msg, 3)
                                console.log(err)
                              }
                            },
                          },
                        ])
                      }}>
                      <Text style={[style.itemBtnTitle, global.fontSize15]}>删除</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {}}>
                      <Text style={[style.itemBtnTitle, global.fontSize15]}>编辑</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={style.itemRight}>
                    <View
                      style={[
                        style.itemIcon,
                        { borderTopColor: color[k], borderRightColor: color[k] },
                      ]}
                    />
                  </View>
                </View>
              )
            })}
          </View>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.push(pathMap.AddSittingMedicalInstitution)
            }}>
            <View style={[style.btn, global.flex, global.alignItemsCenter]}>
              <Icon name="plus-circle" style={[style.btnIcon, global.fontSize20]} />
              <Text style={[style.btnTitle, global.fontSize14]}>添加医疗机构</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </>
    )
  }
}
