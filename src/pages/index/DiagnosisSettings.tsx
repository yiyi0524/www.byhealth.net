import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import {
  Switch,
  Toast,
  Icon,
  DatePicker,
  List,
  DatePickerView,
} from "@ant-design/react-native"
import sColor from "@styles/color"
import gStyle from "@utils/style"
import React, { Component } from "react"
import {
  PixelRatio,
  RefreshControl,
  Text,
  View,
  TouchableHighlight,
} from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { NavigationScreenProp } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import userApi from "@api/user"
import moment from "moment"
const style = gStyle.index.DiagnosisSettings
const global = gStyle.global

interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  onlineReferralChecked: boolean
  isSelectDisturbanceFreePeriod: boolean
  disturbanceFreePeriodStart: Date
  disturbanceFreePeriodEnd: Date
  disturbanceFreePeriod: string
  reviewPrice: number
  isSelectReviewPrice: boolean
  isSelectFollowUpReviewPrice: boolean
  followUpReviewPrice: number
  reviewPriceList: number[]
  followUpReviewPriceList: number[]
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
  Props &
    ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = () => ({
    title: "复诊及诊后咨询设置",
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
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      onlineReferralChecked: false,
      isSelectDisturbanceFreePeriod: false,
      isSelectReviewPrice: false,
      isSelectFollowUpReviewPrice: false,
      followUpReviewPrice: 1.0,
      reviewPrice: 5.0,
      disturbanceFreePeriod: "",
      disturbanceFreePeriodStart: moment("2000-01-01 08:00:00").toDate(),
      disturbanceFreePeriodEnd: moment("2000-01-02 23:00:00").toDate(),
      reviewPriceList: [],
      followUpReviewPriceList: [],
    }
  }
  async componentDidMount() {
    await this.init()
  }
  init = async () => {
    let disturbanceFreePeriod =
      moment(this.state.disturbanceFreePeriodStart).format("HH:mm") +
      " - " +
      moment(this.state.disturbanceFreePeriodEnd).format("HH:mm")
    let reviewPriceList = this.state.reviewPriceList,
      followUpReviewPriceList = this.state.followUpReviewPriceList
    for (let i = 5; i <= 1000; ) {
      if (i < 100) {
        reviewPriceList.push(i)
        i = i + 5
      }
      if (i >= 100 && i < 300) {
        reviewPriceList.push(i)
        i = i + 10
      }
      if (i >= 300) {
        reviewPriceList.push(i)
        i = i + 50
      }
    }
    for (let i = 0; i <= 2000; ) {
      if (i < 10) {
        followUpReviewPriceList.push(i)
        i++
      }
      if (i >= 10 && i < 100) {
        followUpReviewPriceList.push(i)
        i = i + 5
      }
      if (i >= 100 && i < 300) {
        followUpReviewPriceList.push(i)
        i = i + 10
      }
      if (i >= 300 && i < 500) {
        followUpReviewPriceList.push(i)
        i = i + 50
      }
      if (i >= 500) {
        followUpReviewPriceList.push(i)
        i = i + 100
      }
    }
    this.setState({
      hasLoad: true,
      disturbanceFreePeriod,
      reviewPriceList,
      followUpReviewPriceList,
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
  onlineReferralChange = async () => {
    this.setState({
      onlineReferralChecked: !this.state.onlineReferralChecked,
    })
    try {
      await userApi.setOnlineReferral({
        onlineReferralChecked: this.state.onlineReferralChecked,
      })
      Toast.success("设置成功", 1)
    } catch (err) {
      Toast.fail("设置失败, 错误信息: " + err.msg, 3)
      console.log(err)
    }
  }
  closePicker = () => {
    this.setState({
      isSelectDisturbanceFreePeriod: false,
    })
  }
  changeDisturbanceFreePeriod = async () => {
    let start = moment(this.state.disturbanceFreePeriodStart).format("HH:mm"),
      end = moment(this.state.disturbanceFreePeriodEnd).format("HH:mm")
    try {
      await userApi.setDisturbanceFreePeriod({
        disturbanceFreePeriod: { start, end },
      })
      Toast.success("免打扰时段已设置为" + start + " - " + end + "", 2)
    } catch (err) {
      Toast.fail("设置失败, 错误原因: " + err.msg, 3)
      console.log(err)
    }
  }
  render() {
    if (!this.state.hasLoad) {
      return (
        <View style={style.loading}>
          <Text
            style={[style.loadingTitle, global.fontSize14, global.fontStyle]}
          >
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
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          <View style={style.explain}>
            <View
              style={[
                style.header,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentSpaceBetween,
              ]}
            >
              <View style={[global.flex, global.alignItemsCenter]}>
                <View style={style.headerIcon} />
                <Text style={[style.headerTitle, global.fontSize14]}>
                  在线复诊服务说明
                </Text>
              </View>
              <Switch
                checked={this.state.onlineReferralChecked}
                onChange={this.onlineReferralChange}
              />
            </View>
            <View style={style.explainDetails}>
              <Text style={[style.explainDetail, global.fontSize14]}>
                您可以通过图文、语音、电话与患者交流, 首次回复需在6小时内( 22:00
                - 8:30与免打扰时段不计入 ), 默认单次交流时间为首次回复后48小时,
                辩证开方后经患者同意可随时结束对话。您可自定义收费价格、接单上限、电话图文服务可同时开启。
              </Text>
              <Text style={[style.explainDetail, global.fontSize14]}>
                互联网诊疗仅适用常见病、慢性病复诊, 且您必须掌握患者病历,
                确定其在实体医疗机构有过同诊断。请勿为首诊、急重症患者在线诊疗。
              </Text>
            </View>
          </View>
          <View style={style.list}>
            <Text style={[style.title, global.fontSize14]}>图文复诊</Text>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  isSelectReviewPrice: true,
                })
              }}
            >
              <View
                style={[
                  style.item,
                  global.flex,
                  global.alignItemsCenter,
                  global.justifyContentSpaceBetween,
                ]}
              >
                <Text style={[style.itemTitle, global.fontSize14]}>
                  复诊价格
                </Text>
                <View
                  style={[
                    style.itemDetail,
                    global.flex,
                    global.alignItemsCenter,
                  ]}
                >
                  <Text style={[style.important, global.fontSize14]}>
                    ¥ {this.state.reviewPrice}
                  </Text>
                  <Icon
                    style={[style.itemIcon, global.fontSize14]}
                    name="right"
                  />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  isSelectFollowUpReviewPrice: true,
                })
              }}
            >
              <View
                style={[
                  style.item,
                  global.flex,
                  global.alignItemsCenter,
                  global.justifyContentSpaceBetween,
                ]}
              >
                <Text style={[style.itemTitle, global.fontSize14]}>
                  后续复诊价格{" "}
                  <Text style={[style.itemDescription, global.fontSize12]}>
                    建议为老患者提供适当优惠
                  </Text>
                </Text>
                <View
                  style={[
                    style.itemDetail,
                    global.flex,
                    global.alignItemsCenter,
                  ]}
                >
                  <Text style={[style.important, global.fontSize14]}>
                    ¥ {this.state.followUpReviewPrice}
                  </Text>
                  <Icon
                    style={[style.itemIcon, global.fontSize14]}
                    name="right"
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={style.notDisturb}>
            <View
              style={[
                style.header,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentSpaceBetween,
              ]}
            >
              <View style={[global.flex, global.alignItemsCenter]}>
                <View style={style.headerIcon} />
                <Text style={[style.headerTitle, global.fontSize14]}>
                  免打扰时段
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    isSelectDisturbanceFreePeriod: true,
                  })
                }}
              >
                <View
                  style={[
                    style.disturbanceFreePeriod,
                    global.flex,
                    global.alignItemsCenter,
                  ]}
                >
                  <Text style={[style.notDisturbTime, global.fontSize14]}>
                    {this.state.disturbanceFreePeriod}
                  </Text>
                  <Icon
                    name="right"
                    style={[style.itemIcon, global.fontSize14]}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        {/* 设置免打扰时段 */}
        <View
          style={
            this.state.isSelectDisturbanceFreePeriod
              ? style.selectDisturbanceFreePeriod
              : global.hidden
          }
        >
          <View
            style={[
              style.headerDisturbanceFreePeriod,
              global.flex,
              global.alignItemsCenter,
              global.justifyContentSpaceBetween,
            ]}
          >
            <TouchableHighlight onPress={this.closePicker}>
              <Text style={[style.close, global.fontSize14]}>取消</Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => {
                this.closePicker()
                this.setState({
                  disturbanceFreePeriod: "随时可找我",
                  disturbanceFreePeriodStart: moment(
                    "2000-01-01 00:00:00",
                  ).toDate(),
                  disturbanceFreePeriodEnd: moment(
                    "2000-01-01 24:00:00",
                  ).toDate(),
                })
                this.changeDisturbanceFreePeriod()
              }}
            >
              <Text style={[style.atAnyTime, global.fontSize14]}>
                随时可找我
              </Text>
            </TouchableHighlight>
          </View>
          <View
            style={[
              style.datePickerFa,
              global.flex,
              global.alignItemsCenter,
              global.justifyContentSpaceBetween,
            ]}
          >
            <DatePickerView
              style={style.datePicker}
              mode="time"
              value={this.state.disturbanceFreePeriodStart}
              onChange={value => {
                console.log(value)
                this.setState({
                  disturbanceFreePeriodStart: value,
                })
              }}
            />
            <Text>至</Text>
            <DatePickerView
              style={style.datePicker}
              mode="time"
              value={this.state.disturbanceFreePeriodEnd}
              onChange={value => {
                this.setState({
                  disturbanceFreePeriodEnd: value,
                })
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              this.closePicker()
              let disturbanceFreePeriod =
                moment(this.state.disturbanceFreePeriodStart).format("HH:mm") +
                " - " +
                moment(this.state.disturbanceFreePeriodEnd).format("HH:mm")
              this.setState({
                disturbanceFreePeriod,
              })
              this.changeDisturbanceFreePeriod()
            }}
          >
            <Text style={[style.submit, global.fontSize14]}>确认</Text>
          </TouchableOpacity>
        </View>
        {/* 选择复诊价格 */}
        <View
          style={
            this.state.isSelectReviewPrice ? style.reviewPrice : global.hidden
          }
        >
          <TouchableOpacity
            onPress={() => {
              this.setState({
                isSelectReviewPrice: false,
              })
            }}
          >
            <Text style={[style.closeReviewPrice, global.fontSize14]}>
              取消
            </Text>
          </TouchableOpacity>
          <Text style={[style.description, global.fontSize14]}>
            收费指导: 主任医师平均定价60元, 副主任医师平均定价40元,
            主治医师平均定价20元, 您可根据实际情况进行调整。
          </Text>
          <ScrollView style={style.reviewPriceList}>
            {this.state.reviewPriceList.map((v: number, k: number) => {
              return (
                <TouchableOpacity
                  key={k}
                  onPress={() => {
                    this.setState({
                      reviewPrice: v,
                      isSelectReviewPrice: false,
                    })
                  }}
                >
                  <Text
                    style={
                      v === this.state.reviewPrice
                        ? style.reviewPriceItemActive
                        : style.reviewPriceItem
                    }
                  >
                    {v}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>
        {/* 选择后续复诊价格 */}
        <View
          style={
            this.state.isSelectFollowUpReviewPrice
              ? style.reviewPrice
              : global.hidden
          }
        >
          <TouchableOpacity
            onPress={() => {
              this.setState({
                isSelectFollowUpReviewPrice: false,
              })
            }}
          >
            <Text style={[style.closeReviewPrice, global.fontSize14]}>
              取消
            </Text>
          </TouchableOpacity>
          <Text style={[style.description, global.fontSize14]}>
            收费指导: 主任医师平均定价30元, 副主任医师平均定价20元,
            主治医师平均定价10元, 您可根据实际情况进行调整。
          </Text>
          <ScrollView style={style.reviewPriceList}>
            {this.state.followUpReviewPriceList.map((v: number, k: number) => {
              return (
                <TouchableOpacity
                  key={k}
                  onPress={() => {
                    this.setState({
                      followUpReviewPrice: v,
                      isSelectFollowUpReviewPrice: false,
                    })
                  }}
                >
                  <Text
                    style={
                      v === this.state.followUpReviewPrice
                        ? style.reviewPriceItemActive
                        : style.reviewPriceItem
                    }
                  >
                    {v}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>
      </>
    )
  }
}
