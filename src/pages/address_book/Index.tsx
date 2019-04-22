import React, { Component } from "react"
import { AppState } from "@/redux/stores/store"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import * as userAction from "@/redux/actions/user"
import { ScrollView, Text, View, Image, TouchableOpacity, RefreshControl } from "react-native"
import { Toast, Icon, InputItem } from "@ant-design/react-native"
import gStyle from "@utils/style"
import gImg from "@utils/img"
import pathMap from "@/routes/pathMap"
import patientApi from "@api/patient"
import userApi from "@api/user"
import { Picture } from "@pages/advisory/Chat"
import { getPicFullUrl } from "@/utils/utils"
import { Assign } from "utility-types"
const style = gStyle.addressBook.AddressBookIndex
const global = gStyle.global
interface Props {
  navigation: any
}
export interface communicationItem {
  id: number
  uid: number
  avatar: Picture
  name: string
  gender: number
  year_age: number
  month_age: number
  phone: string
  ctime: string
  consultStyle: number
}
interface State {
  hasLoad: boolean
  hasRealNameAuth: boolean
  refreshing: boolean
  communicationList: Assign<communicationItem, { hidden?: boolean }>[]
  search: string
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
      hasRealNameAuth: false,
      refreshing: false,
      communicationList: [],
      search: "",
    }
  }
  componentDidMount() {
    this.init()
  }
  init = async () => {
    try {
      let {
        data: { doctorInfo },
      } = await userApi.getPersonalInfo()
      let {
        data: { list: communicationList },
      } = await patientApi.getAddressBoolPatientList({ page: -1, limit: -1, filter: {} })
      this.setState({
        hasLoad: true,
        hasRealNameAuth: doctorInfo.hasRealNameAuth,
        communicationList,
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
          keyboardShouldPersistTaps="always"
          style={style.main}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }>
          <View style={style.header}>
            <View
              style={[
                style.search,
                global.flex,
                global.justifyContentCenter,
                global.alignItemsCenter,
              ]}>
              <View style={style.searchTitle}>
                <TouchableOpacity
                  style={this.state.hasRealNameAuth ? global.hidden : style.searchMode}
                  onPress={() => {
                    if (!this.state.hasRealNameAuth) {
                      return Toast.info("您未认证", 3)
                    }
                  }}
                />
                <InputItem
                  style={[style.searchTitle, global.fontSize14, global.fontStyle]}
                  clear
                  last
                  labelNumber={2}
                  value={this.state.search}
                  onChange={search => {
                    this.setState({
                      search,
                    })
                    let { communicationList } = this.state
                    if (search !== "") {
                      for (let patient of communicationList) {
                        patient.hidden = patient.name.indexOf(search) < 0
                      }
                    } else {
                      communicationList = communicationList.map(v => {
                        v.hidden = false
                        return v
                      })
                    }
                    this.setState({
                      communicationList,
                    })
                  }}
                  placeholder="搜索患者">
                  <Icon name="search" style={[style.searchIcon, global.fontSize20]} />
                </InputItem>
              </View>
            </View>
          </View>
          <View style={style.separationModule} />
          <TouchableOpacity
            style={[
              style.group,
              global.flex,
              global.justifyContentSpaceBetween,
              global.alignItemsCenter,
            ]}
            onPress={() => {
              if (!this.state.hasRealNameAuth) {
                return Toast.info("您未认证", 3)
              }
              this.props.navigation.push(pathMap.AddressBookGroup)
            }}>
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
            {this.state.communicationList.map(
              (v: Assign<communicationItem, { hidden?: boolean }>, k: number) => {
                if (v.hidden) {
                  return null
                }
                return (
                  <TouchableOpacity
                    key={k}
                    style={[
                      style.communicationItem,
                      global.flex,
                      global.justifyContentStart,
                      global.alignItemsCenter,
                    ]}
                    onPress={() => {
                      if (!this.state.hasRealNameAuth) {
                        return Toast.info("您未认证", 3)
                      }
                      this.props.navigation.push(pathMap.PatientDetail, {
                        title: v.name,
                        patientUid: v.uid,
                      })
                    }}>
                    <View style={style.communicationItemPicture}>
                      <Image
                        style={style.communicationItemPic}
                        source={
                          v.avatar.url !== ""
                            ? { uri: getPicFullUrl(v.avatar.url) }
                            : gImg.common.defaultAvatar
                        }
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
                            {v.year_age || "未知"}
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
                          style={[
                            global.flex,
                            global.justifyContentStart,
                            global.alignItemsCenter,
                          ]}>
                          <Text
                            style={[style.firstConsultTime, global.fontStyle, global.fontSize13]}>
                            {v.ctime.substr(0, 10)}
                          </Text>
                          <Text
                            style={[style.firstConsultTime, global.fontStyle, global.fontSize13]}>
                            {v.consultStyle}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              },
            )}
          </View>
        </ScrollView>
      </>
    )
  }
}
