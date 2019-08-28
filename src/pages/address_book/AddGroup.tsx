import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import { getPicCdnUrl } from "@/utils/utils"
import { Icon, InputItem, Toast } from "@ant-design/react-native"
import doctor, { GENDER } from "@api/doctor"
import patientApi from "@api/patient"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
// prettier-ignore
import { Image, PixelRatio, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { NavigationScreenProp } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { patientItem } from "./GroupDetail"
const style = gStyle.addressBook.AddressBookAddGroup
const global = gStyle.global

interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  groupName: string
  name: string
  patientList: patientItem[]
  patientUidList: number[]
  selectPatientList: string[]
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
  static navigationOptions = () => ({
    title: "添加新分组",
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
  })
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: true,
      refreshing: false,
      name: "",
      groupName: "",
      patientList: [],
      patientUidList: [],
      selectPatientList: [],
    }
  }
  componentDidMount() {
    this.init()
  }
  init = async () => {
    this.setState({
      hasLoad: false,
    })
    let {
      data: { list: communicationList },
    } = await patientApi.getAddressBoolPatientList({ page: -1, limit: -1, filter: {} })
    let patientList: patientItem[] = []
    for (let v of communicationList) {
      patientList.push({
        uid: v.uid,
        avatar: v.avatar,
        gender: v.gender,
        year_age: v.year_age,
        month_age: v.month_age,
        name: v.name,
        isChecked: false,
      })
    }
    this.setState({
      hasLoad: true,
      patientList,
    })
  }
  onRefresh = () => {
    this.setState({ refreshing: true })
    this.init()
      .then(_ => {
        this.setState({ refreshing: false })
      })
      .catch(err => {
        Toast.fail("刷新失败,错误信息: " + err.msg)
      })
  }
  submit = () => {
    if (this.state.groupName === "") {
      return Toast.info("请输入分组名", 3)
    }
    if (this.state.patientUidList.length === 0) {
      return Toast.info("请至少选择一名患者", 2)
    }
    doctor
      .addPatientGroup({
        name: this.state.groupName,
        patientUidList: this.state.patientUidList,
      })
      .then(() => {
        Toast.success("添加成功", 1, () => {
          this.setState(this.getInitState(), this.init)
        })
      })
      .catch(err => {
        Toast.fail("添加分组失败, 错误信息: " + err.msg, 3)
      })
  }
  render() {
    if (!this.state.hasLoad) {
      return (
        <View style={style.loading}>
          <Image style={{ width: 150 }} source={gImg.common.loading} />
        </View>
      )
    }
    return (
      <View style={style.group}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={style.main}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }>
          <View style={style.header}>
            <InputItem
              clear
              value={this.state.groupName}
              onChange={groupName => {
                this.setState({
                  groupName,
                })
              }}
              style={[style.headerInput, global.fontSize14, global.fontStyle]}
              placeholder="输入分组名称">
              名称
            </InputItem>
          </View>
          <View style={[style.patientTitle, global.flex, global.alignItemsCenter]}>
            <View style={global.titleIcon} />
            <Text style={[global.fontSize14, global.fontStyle]}>选择患者</Text>
          </View>
          <Text
            style={[
              this.state.patientUidList.length !== 0 ? style.selectPatient : global.hidden,
              global.fontSize14,
              global.fontStyle,
            ]}
            numberOfLines={1}>
            所选患者
          </Text>
          <Text
            style={[
              this.state.selectPatientList.length !== 0 ? style.selectpatientTitle : global.hidden,
              global.fontSize12,
              global.fontStyle,
            ]}
            numberOfLines={1}>
            {this.state.selectPatientList.map((v: string) => {
              return v + "、"
            })}
          </Text>
          <Text
            style={[
              this.state.name !== "" ? style.selectPatient : global.hidden,
              global.fontSize14,
              global.fontStyle,
            ]}
            numberOfLines={1}>
            " {this.state.name} " 的搜索结果
          </Text>
          <Text
            style={[
              this.state.name === "" ? style.selectPatient : global.hidden,
              global.fontSize14,
              global.fontStyle,
            ]}
            numberOfLines={1}>
            所有患者
          </Text>
          <View style={style.patientList}>
            {this.state.patientList.map((v: patientItem, k: number) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={k}
                  style={[style.patientItem, global.flex, global.alignItemsCenter]}
                  onPress={() => {
                    let patientList = this.state.patientList,
                      patientUidList = this.state.patientUidList,
                      selectPatientList = this.state.selectPatientList
                    patientList[k].isChecked = !patientList[k].isChecked
                    if (v.isChecked) {
                      patientUidList.push(v.uid)
                      selectPatientList.push(v.name)
                    } else {
                      patientUidList = patientUidList.filter(item => {
                        return item !== v.uid
                      })
                      selectPatientList = selectPatientList.filter(item => {
                        return item !== v.name
                      })
                    }
                    this.setState({
                      patientList,
                      patientUidList,
                      selectPatientList,
                    })
                  }}>
                  <View style={style.patientItemAvatar}>
                    <Image
                      style={style.patientAvatar}
                      source={
                        v.avatar.url !== ""
                          ? { uri: getPicCdnUrl(v.avatar.url) }
                          : gImg.common.defaultAvatar
                      }
                    />
                  </View>
                  <View
                    style={[style.patientItemDescription, global.flex, global.alignItemsCenter]}>
                    <Text style={style.patientName}>{v.name}</Text>
                    <View style={[style.patientDescription, global.flex, global.alignItemsCenter]}>
                      <Image
                        style={style.patientGender}
                        source={
                          v.gender === GENDER.MAN
                            ? gImg.common.man
                            : v.gender === GENDER.WOMAN
                            ? gImg.common.woman
                            : gImg.common.genderNull
                        }
                      />
                      <Text style={[style.patientAge, global.fontSize12, global.fontStyle]}>
                        {v.year_age}岁{v.month_age !== 0 ? v.month_age + "月" : null}
                      </Text>
                    </View>
                  </View>
                  <Icon
                    name="check-circle"
                    style={[
                      v.isChecked ? style.selectIconActive : style.selectIcon,
                      global.fontSize18,
                    ]}
                  />
                </TouchableOpacity>
              )
            })}
          </View>
        </ScrollView>
        <TouchableOpacity style={style.submitBtn} onPress={() => this.submit()}>
          <Text style={[style.submit, global.fontStyle, global.fontSize15]}>完成</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
