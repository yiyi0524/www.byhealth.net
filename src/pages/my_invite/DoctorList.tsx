import sColor from "@styles/color"
import global from "@styles/global"
import gImg from "@utils/img"
import gSass from "@utils/style"
import React, { Component } from "react"
import { Image, PixelRatio, Text, View, TouchableOpacity } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import pathMap from "@/routes/pathMap"
import { NavigationScreenProp } from "react-navigation"
import { InviteDoctorChildInfo, listInviteDoctorChildInfo } from "@/services/myInvite"
import moment from "moment"
import Empty from "@/components/Empty"
const style = gSass.myInvite.myInviteDoctorList
interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  hasLoad: boolean
  list: InviteDoctorChildInfo[]
}

export default class DoctorList extends Component<Props, State> {
  static navigationOptions = () => ({
    title: "邀请的医师",
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
      <TouchableOpacity>
        {/* <Text style={[style.headerRight, global.fontSize14]}>保存</Text> */}
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
      list: [],
    }
  }
  componentDidMount() {
    this.init()
  }
  init = async () => {
    try {
      let listInviteDoctorChildInfoTask = listInviteDoctorChildInfo({
        year: parseInt(moment().format("YYYY")),
        month: parseInt(moment().format("M")),
      })
      let {
        data: { list },
      } = await listInviteDoctorChildInfoTask
      this.setState({
        hasLoad: true,
        list,
      })
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    let { list } = this.state
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
        <ScrollView style={style.main}>
          <View style={[style.theme, global.flex, global.aCenter, global.jBetween]}>
            <Text style={style.themeTitle}>我邀请的医师</Text>
            <View style={[global.flex, global.aCenter]}>
              <Text style={style.themeCount}>邀请数</Text>
              <Text style={style.themeNum}>{list.length}</Text>
            </View>
          </View>
          <View style={style.list}>
            <View
              style={[style.item, style.itemGray, global.flex, global.aCenter, global.jBetween]}>
              <View style={style.title}>
                <Text style={style.desc}>医师</Text>
              </View>
              <Text style={style.desc}>一级</Text>
              <Text style={style.desc}>二级</Text>
              <Text style={style.desc}>三级</Text>
            </View>
            {list.map((item, idx) => {
              return (
                <View
                  style={[
                    style.item,
                    idx % 2 !== 0 ? style.itemGray : style.item,
                    global.flex,
                    global.aCenter,
                    global.jBetween,
                  ]}
                  key={"item" + idx}>
                  <View style={style.title}>
                    <Text style={style.desc}>{item.name}医师</Text>
                  </View>
                  <Text
                    style={style.desc}
                    onPress={() => {
                      this.props.navigation.push(pathMap.InviteDoctorGradeList, {
                        doctorId: item.doctorId,
                        level: 1,
                        doctorName: item.name,
                      })
                    }}>
                    {item.firstLevelDoctorCount}
                  </Text>
                  <Text
                    style={style.desc}
                    onPress={() => {
                      this.props.navigation.push(pathMap.InviteDoctorGradeList, {
                        doctorId: item.doctorId,
                        level: 2,
                        doctorName: item.name,
                      })
                    }}>
                    {item.secondLevelDoctorCount}
                  </Text>
                  <Text
                    style={style.desc}
                    onPress={() => {
                      this.props.navigation.push(pathMap.InviteDoctorGradeList, {
                        doctorId: item.doctorId,
                        level: 3,
                        doctorName: item.name,
                      })
                    }}>
                    {item.thirdLevelDoctorCount}
                  </Text>
                </View>
              )
            })}
            {list.length === 0 && <Empty />}
          </View>
        </ScrollView>
      </>
    )
  }
}
