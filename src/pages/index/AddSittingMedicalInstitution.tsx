import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import { Toast, Icon, Modal, Picker, List, InputItem } from "@ant-design/react-native"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
import { Image, PixelRatio, RefreshControl, Text, View } from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { NavigationScreenProp } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import api from "@/services/api"
const style = gStyle.index.AddSittingMedicalInstitution
const global = gStyle.global
interface NavParams {
  navigatePress: () => void
}
interface CityItem {
  value: string
  label: string
  children: CityItem[]
}
interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  region: CityItem[]
  cityInfo: string[]
  hospitalId: number
  hospitalName: string
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
      region: [],
      cityInfo: [],
      hospitalId: 0,
      hospitalName: "",
    }
  }
  componentDidMount() {
    this.init()
    this.props.navigation.setParams({
      navigatePress: this.saveInfo,
    })
  }
  init = async () => {
    try {
      let region = []
      let {
        data: { region: oriRegion },
      } = await api.getRegion()
      region = this.generateFormatRegion(oriRegion)
      this.setState({
        region,
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
  saveInfo = () => {}
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
          <View style={style.list}>
            <View style={style.item}>
              <Picker
                style={style.input}
                data={this.state.region}
                cols={3}
                value={this.state.cityInfo}
                onChange={val => {
                  console.log(val)
                }}>
                <List.Item arrow="horizontal">地区信息</List.Item>
              </Picker>
            </View>
            <View style={[style.item]}>
              <InputItem
                style
                clear
                editable={false}
                value={this.state.hospitalName}
                extra={<Icon name="right" style={[style.icon, global.fontSize14]} />}
                placeholder="请输入医疗机构名称">
                医疗机构名称
              </InputItem>
            </View>
          </View>
        </ScrollView>
      </>
    )
  }
}
