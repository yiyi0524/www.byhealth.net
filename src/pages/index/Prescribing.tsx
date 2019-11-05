import global from "@/assets/styles/global"
import { TYPE } from "@/utils/constant"
import { Icon, InputItem } from "@ant-design/react-native"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gSass from "@utils/style"
import React, { Component } from "react"
import { Image, PixelRatio, ScrollView, Text, TouchableOpacity, View } from "react-native"
const style = gSass.index.prescribing

interface Props {}
interface State {
  page: number
  limit: number
  count: number
  filter: Record<string, any>
  search: string
  patientList: []
}
type DefaultProps = {}

export default class Prescribing extends Component<Props & DefaultProps, State> {
  static defaultProps: DefaultProps
  static navigationOptions = () => ({
    title: "立即开方",
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
    headerRight: <TouchableOpacity></TouchableOpacity>,
  })
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      page: 1,
      limit: 10,
      count: 0,
      filter: {},
      search: "",
      patientList: [],
    }
  }
  componentDidMount() {
    this.init()
  }
  init = () => {
    this.listPatient()
  }
  listPatient = () => {
    let { page, limit, filter } = this.state
    console.log(page, limit, filter)
  }

  render() {
    let { search } = this.state
    return (
      <ScrollView style={style.main}>
        <View style={style.searchPar}>
          <View style={style.search}>
            <InputItem
              style={style.input}
              last
              value={search}
              placeholder="搜索患者"
              onChange={search => {
                let { filter } = this.state
                filter = {
                  search: {
                    condition: TYPE.eqString,
                    val: search,
                  },
                }
                this.setState(
                  {
                    search,
                    filter,
                  },
                  this.listPatient,
                )
              }}>
              <Icon name="search" />
            </InputItem>
          </View>
        </View>
        <View style={style.list}>
          <TouchableOpacity style={[style.item, global.flex, global.aCenter]}>
            <Image style={style.img} source={gImg.home.prescribingPhone}></Image>
            <Text style={style.title}>手机号邀请患者</Text>
            <Text style={style.desc}>去填手机号</Text>
            <Icon style={style.icon} name="right"></Icon>
          </TouchableOpacity>
          <TouchableOpacity style={[style.item, global.flex, global.aCenter]}>
            <Image style={style.img} source={gImg.home.prescribingWeChat}></Image>
            <Text style={style.title}>微信邀请患者</Text>
            <Text style={style.desc}>发送患者微信</Text>
            <Icon style={style.icon} name="right"></Icon>
          </TouchableOpacity>
          <TouchableOpacity style={[style.item, global.flex, global.aCenter]}>
            <Image style={style.img} source={gImg.home.prescribingPhotograph}></Image>
            <Text style={style.title}>直接拍方</Text>
            <Text style={style.desc}>拍方后药房会联系患者添加微信</Text>
            <Icon style={style.icon} name="right"></Icon>
          </TouchableOpacity>
        </View>
        <View style={style.tips}>
          <Text style={style.tipsTitle}>
            互联网诊疗仅适用常见病、慢性病复诊、且您须掌握患者病历，确定其在实体医疗机构有过同诊断。请勿为首诊、急重症患者在线诊疗。
          </Text>
        </View>
        <View style={style.patientList}>
          {Array.from(new Array(3)).map(v => {
            return (
              <TouchableOpacity style={[style.patientItem, global.flex, global.aCenter]} key={v}>
                <Image style={style.avatar} source={gImg.common.defaultAvatar}></Image>
                <Text style={style.name} numberOfLines={1}>
                  哎呀
                </Text>
                <Text style={style.time}>扫码时间: 2019-09-29 10:00:00</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>
    )
  }
}
