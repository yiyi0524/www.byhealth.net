import { Toast } from "@ant-design/react-native"
import React, { Component } from "react"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import pathMap from "@/routes/pathMap"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { Picture } from "./Chat"
import { GENDER } from "@/services/doctor"
// import api from "@api/api";
const style = gStyle.advisory.advisoryIndex
const globalStyle = gStyle.global
interface Props {
  navigation: any
}
interface PatientRecord {
  id: number
  gender: number
  name: string
  currMsg: string
  currMsgTime: string
  avatar: Picture
  patientId: number
  age: number
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  patientRecordList: PatientRecord[]
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
      patientRecordList: [],
    }
  }
  async componentDidMount() {
    await this.init()
  }
  init = async () => {
    // let json = await api.getInformationList();
    let patientRecordList: PatientRecord[] = [
      {
        id: 4,
        patientId: 1,
        avatar: gImg.common.logo,
        age: 30,
        gender: GENDER.WOMAN,
        name: "孟雷",
        currMsg: "你好 我是孟雷,我头痛",
        currMsgTime: "2019-03-22 10:10:10",
      },
      {
        id: 1,
        patientId: 2,
        avatar: gImg.common.defaultAvatar,
        age: 24,
        gender: GENDER.MAN, //1:男;2:女'0:未知
        name: "吴亦凡",
        currMsg: "医生, 头还有点晕咋整?",
        currMsgTime: "2019-03-22 10:10:10",
      },
    ]
    this.setState({
      hasLoad: true,
      patientRecordList,
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
          <Text style={[style.loadingTitle, globalStyle.fontSize14, globalStyle.fontStyle]}>
            加载中...
          </Text>
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
          <View
            style={[
              style.headerList,
              globalStyle.flex,
              globalStyle.alignItemsCenter,
              globalStyle.justifyContentSpaceBetween,
            ]}>
            <TouchableOpacity
              style={[style.headerItem, globalStyle.flex, globalStyle.alignItemsCenter]}>
              <Image style={style.headerIcon} source={gImg.advisory.reply} />
              <Text style={[style.headerItemTitle, globalStyle.fontSize14, globalStyle.fontStyle]}>
                待回复
              </Text>
            </TouchableOpacity>
            <View style={style.separationLine} />
            <TouchableOpacity
              style={[style.headerItem, globalStyle.flex, globalStyle.alignItemsCenter]}>
              <Image style={style.headerIcon} source={gImg.advisory.pillPurchase} />
              <Text style={[style.headerItemTitle, globalStyle.fontSize14, globalStyle.fontStyle]}>
                代购药
              </Text>
            </TouchableOpacity>
          </View>
          <View style={style.msgList}>
            {this.state.patientRecordList.map((v: any, k: number) => {
              return (
                <TouchableOpacity
                  key={k}
                  style={[
                    style.msgItem,
                    globalStyle.flex,
                    globalStyle.justifyContentSpaceBetween,
                    globalStyle.alignItemsCenter,
                  ]}
                  onPress={() =>
                    this.props.navigation.push(pathMap.AdvisoryChat, {
                      patientId: v.patientId,
                      id: v.id,
                      title: v.name,
                    })
                  }>
                  <View style={style.baseInformation}>
                    <View style={style.avatarFormat}>
                      <Image style={style.avatar} source={v.avatar} />
                    </View>
                    <View
                      style={[
                        style.baseInformationBottom,
                        globalStyle.flex,
                        globalStyle.justifyContentSpaceAround,
                        globalStyle.alignItemsCenter,
                      ]}>
                      <Image
                        style={style.gender}
                        source={
                          v.gender === 1
                            ? gImg.common.man
                            : v.gender === 2
                            ? gImg.common.woman
                            : gImg.common.genderNull
                        }
                      />
                      <Text style={[style.age, globalStyle.fontSize13, globalStyle.fontStyle]}>
                        {v.age}岁
                      </Text>
                    </View>
                  </View>
                  <View style={style.msgCenter}>
                    <View
                      style={[
                        globalStyle.flex,
                        globalStyle.justifyContentSpaceBetween,
                        globalStyle.alignItemsCenter,
                      ]}>
                      <Text
                        style={[style.msgName, globalStyle.fontSize15, globalStyle.fontStyle]}
                        numberOfLines={1}>
                        {v.name}
                      </Text>
                      <Text style={[style.msgTime, globalStyle.fontSize13, globalStyle.fontStyle]}>
                        {v.time.substr(0, 10)}
                      </Text>
                    </View>
                    <Text
                      style={[style.msgDescription, globalStyle.fontSize14, globalStyle.fontStyle]}
                      numberOfLines={1}>
                      {v.description}
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
