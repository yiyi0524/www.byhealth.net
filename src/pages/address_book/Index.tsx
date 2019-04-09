import React, { Component } from "react"
import { AppState } from "@/redux/stores/store"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import * as userAction from "@/redux/actions/user"
import { ScrollView, Text, View, Image, TouchableOpacity, RefreshControl } from "react-native"
import { Toast, Icon } from "@ant-design/react-native"
import gStyle from "@utils/style"
import gImg from "@utils/img"
import pathMap from "@/routes/pathMap"
import patientApi from "@api/patient"
const style = gStyle.addressBook.AddressBookIndex
const global = gStyle.global
interface Props {
  navigation: any
}
interface communicationItem {
  id: number
  uid: number
  avatar: string
  name: string
  gender: number
  age: string
  phone: string
  time: string
  consultStyle: string
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  communicationList: communicationItem[]
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
export default class Index extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      communicationList: [],
    }
  }
  async componentDidMount() {
    await this.init()
  }
  init = async () => {
    // let json = await patientApi.getPatientList();
    let communicationList = [
      {
        id: 1,
        uid: 1,
        avatar: "",
        name: "哎呀",
        gender: 1,
        age: "28岁",
        phone: "15096968574",
        time: "2019-03-27 10:00:11",
        consultStyle: "扫描",
      },
      {
        id: 2,
        uid: 2,
        avatar: "https://www.byhealth.net/uploads/20190315/1cec476d9eaef31971abef5e16716365.png",
        name: "哎呀",
        gender: 2,
        age: "两个月",
        phone: "15096968574",
        time: "2019-03-27 10:00:11",
        consultStyle: "复诊",
      },
      {
        id: 3,
        uid: 4,
        avatar: "",
        name: "哎呀",
        gender: 1,
        age: "两个月",
        phone: "15096968574",
        time: "2019-03-27 10:00:11",
        consultStyle: "复诊",
      },
      {
        id: 4,
        uid: 4,
        avatar: "https://www.byhealth.net/uploads/20190315/1cec476d9eaef31971abef5e16716365.png",
        name: "哎呀",
        gender: 2,
        age: "两个月",
        phone: "",
        time: "2019-03-27 10:00:11",
        consultStyle: "复诊",
      },
      {
        id: 5,
        uid: 5,
        avatar: "",
        name: "哎呀",
        gender: 2,
        age: "两个月",
        phone: "15096968574",
        time: "2019-03-27 10:00:11",
        consultStyle: "复诊",
      },
      {
        id: 5,
        uid: 5,
        avatar: "",
        name: "哎呀",
        gender: 2,
        age: "两个月",
        phone: "15096968574",
        time: "2019-03-27 10:00:11",
        consultStyle: "复诊",
      },
      {
        id: 6,
        uid: 6,
        avatar: "",
        name: "哎呀",
        gender: 2,
        age: "两个月",
        phone: "15096968574",
        time: "2019-03-27 10:00:11",
        consultStyle: "复诊",
      },
      {
        id: 7,
        uid: 8,
        avatar: "",
        name: "哎呀",
        gender: 2,
        age: "两个月",
        phone: "15096968574",
        time: "2019-03-27 10:00:11",
        consultStyle: "复诊",
      },
    ]

    this.setState({
      hasLoad: true,
      communicationList,
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
          <Text style={[style.loadingTitle, global.fontSize14, global.fontStyle]}>加载中...</Text>
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
          <View style={style.header}>
            <TouchableOpacity
              style={[
                style.search,
                global.flex,
                global.justifyContentCenter,
                global.alignItemsCenter,
              ]}>
              <Icon name="search" style={[style.searchIcon, global.fontSize16]} />
              <Text style={[style.searchTitle, global.fontSize14, global.fontStyle]}>搜索患者</Text>
            </TouchableOpacity>
          </View>
          <View style={style.separationModule} />
          <TouchableOpacity
            style={[
              style.group,
              global.flex,
              global.justifyContentSpaceBetween,
              global.alignItemsCenter,
            ]}
            onPress={() => this.props.navigation.push(pathMap.AddressBookGroup)}>
            <View
              style={[
                style.groupTheme,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentStart,
              ]}>
              <Image style={style.groupImg} source={gImg.addressBook.group} />
              <Text style={[style.groupTitle, global.fontSize14, global.fontStyle]}>患者分组</Text>
            </View>
            <Icon name="right" style={[style.groupIcon, global.fontSize14]} />
          </TouchableOpacity>
          <View style={style.separationModule} />
          <View style={style.communicationList}>
            {this.state.communicationList.map((v: any, k: number) => {
              return (
                <TouchableOpacity
                  key={k}
                  style={[
                    style.communicationItem,
                    global.flex,
                    global.justifyContentStart,
                    global.alignItemsCenter,
                  ]}
                  onPress={() =>
                    this.props.navigation.push(pathMap.PatientDetail, {
                      title: v.name,
                    })
                  }>
                  <View style={style.communicationItemPicture}>
                    <Image
                      style={style.communicationItemPic}
                      source={v.avatar !== "" ? { uri: v.avatar } : gImg.common.defaultAvatar}
                    />
                  </View>
                  <View style={[style.groupTheme, global.justifyContentCenter]}>
                    <Text
                      style={[style.communicationItemTitle, global.fontSize14, global.fontStyle]}>
                      {v.name}
                    </Text>
                    <View
                      style={[
                        style.communicationItemdescriptionBottom,
                        global.flex,
                        global.justifyContentSpaceBetween,
                        global.alignItemsCenter,
                      ]}>
                      <View
                        style={[
                          style.communicationItemDescription,
                          global.flex,
                          global.justifyContentStart,
                          global.alignItemsCenter,
                        ]}>
                        <Image
                          style={style.genderIcon}
                          source={
                            v.gender === 1
                              ? gImg.common.man
                              : v.gender === 2
                              ? gImg.common.woman
                              : gImg.common.genderNull
                          }
                        />
                        <Text
                          style={[
                            style.communicationItemDetail,
                            global.fontSize11,
                            global.fontStyle,
                          ]}>
                          {v.age || "未知"}
                        </Text>
                        <Image style={style.genderIcon} source={gImg.addressBook.phone} />
                        <Text
                          style={[
                            style.communicationItemDetail,
                            global.fontSize11,
                            global.fontStyle,
                          ]}>
                          {v.phone.substr(7, 4) || "未填写"}
                        </Text>
                      </View>
                      <View
                        style={[global.flex, global.justifyContentStart, global.alignItemsCenter]}>
                        <Text style={[style.firstConsultTime, global.fontStyle, global.fontSize13]}>
                          {v.time.substr(0, 10)}
                        </Text>
                        <Text style={[style.firstConsultTime, global.fontStyle, global.fontSize13]}>
                          {v.consultStyle}
                        </Text>
                      </View>
                    </View>
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
