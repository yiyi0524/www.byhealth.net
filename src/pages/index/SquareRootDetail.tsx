import global from "@/assets/styles/global"
import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import api, { windowWidth } from "@/services/api"
import { Toast } from "@ant-design/react-native"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gStyle from "@utils/style"
import React, { Component } from "react"
import { Image, PixelRatio, RefreshControl, Text, View } from "react-native"
import { NavigationScreenProp, ScrollView } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import DashLine from "@components/DashLine"
const style = gStyle.advisory.SquareRootDetail
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
interface Props {
  navigation: NavigationScreenProp<State>
}

interface State {
  hasLoad: boolean
  refreshing: boolean
}
@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class SquareRoot extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  static navigationOptions = () => {
    return {
      title: "查看整体治疗方案",
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
      headerRight: <Text />,
    }
  }
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
    }
  }
  componentDidMount() {
    this.init()
  }

  getDrugList = () => {}
  init = async () => {
    // let patientId = this.props.navigation.getParam("patientId")
    try {
      this.setState({
        hasLoad: true,
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
          style={style.main}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }>
          <View style={style.prompt}>
            <Text style={[style.promptTitle, global.fontSize14]}>2019年04月11日 17:53</Text>
          </View>
          {/* 诊断 */}
          <View style={style.diagnosis}>
            <View
              style={[
                style.theme,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentCenter,
              ]}>
              <View style={style.titleSpot} />
              <Text style={[style.title, global.fontSize14]}> 诊断 </Text>
              <View style={style.titleSpot} />
            </View>
            <View style={[style.diagnosisItem, global.flex, global.alignItemsCenter]}>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>[ 患者信息 ]</Text>
              <Text style={[style.diagnosisItemLineTitle, global.fontSize14]}>孟磊</Text>
              <Text style={[style.diagnosisItemLineTitle, global.fontSize14]}>男</Text>
              <Text style={[style.diagnosisItemLineTitle, global.fontSize14]}>23 岁</Text>
            </View>
            <View style={[style.diagnosisItem, global.flex, global.alignItemsCenter]}>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>[ 诊断 ] </Text>
              <Text style={[style.diagnosisItemLineTitle, global.fontSize14]}>
                感冒; 头疼 流鼻涕
              </Text>
            </View>
          </View>
          {/* 开方 */}
          <View style={style.diagnosis}>
            <View
              style={[
                style.theme,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentCenter,
              ]}>
              <View style={style.titleSpot} />
              <Text style={[style.title, global.fontSize14]}> 开方 </Text>
              <View style={style.titleSpot} />
            </View>
            <DashLine len={45} width={windowWidth - 46} backgroundColor={sColor.colorEee} />
            <Text style={[style.drug, global.fontSize24]}>R:</Text>
            <View style={style.drugList}>
              {/* {Object.keys(this.state.chooseDrugInfo).map((drugIdStr, k) => {
                let drugId: number = parseInt(drugIdStr),
                  list = this.state.chooseDrugInfo
                return (
                  <View style={style.drugItem} key={k}>
                    <View
                      style={[
                        global.flex,
                        global.alignItemsCenter,
                        global.justifyContentSpaceBetween,
                      ]}>
                      <View style={style.drugItemLeft}>
                        <Text
                          style={[style.drugItemLeftTitle, global.fontSize14]}
                          numberOfLines={1}>
                          {list[drugId].info.name}
                        </Text>
                        <Text
                          style={[style.drugItemLeftDetail, global.fontSize12]}
                          numberOfLines={1}>
                          {list[drugId].info.standard}
                        </Text>
                        <Text
                          style={[style.drugItemLeftDetail, global.fontSize12]}
                          numberOfLines={1}>
                          {list[drugId].info.manufacturer}
                        </Text>
                      </View>
                      <View style={style.drugItemRight}>
                        <Text
                          style={[style.drugItemLeftTitle, global.fontSize14]}
                          numberOfLines={1}>
                          {list[drugId].count}
                          {list[drugId].info.unit}
                        </Text>
                        <Text
                          style={[style.drugItemLeftDetail, global.fontSize12]}
                          numberOfLines={1}>
                          {(list[drugId].info.price / 100) * list[drugId].count}元
                        </Text>
                      </View>
                    </View>
                    <View style={[style.usageDosage, global.flex, global.alignItemsCenter]}>
                      <Text style={[style.diagnosisItemTitle, global.fontSize14]}>用法用量</Text>
                      <View style={style.diagnosisItemInput}>
                      
                      </View>
                    </View>
                  </View>
                )
              })} */}
            </View>
          </View>
          {/* 选填 */}
          <View style={style.diagnosis}>
            <View
              style={[
                style.theme,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentCenter,
              ]}>
              <View style={style.titleSpot} />
              <Text style={[style.title, global.fontSize14]}> 选填 </Text>
              <View style={style.titleSpot} />
            </View>
            <View style={[style.diagnosisItem, global.flex, global.alignItemsCenter]}>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>[ 医嘱提醒 ]</Text>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>多喝水</Text>
            </View>
          </View>
          {/* 明细 */}
          <View style={style.diagnosis}>
            <View
              style={[
                style.theme,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentCenter,
              ]}>
              <View style={style.titleSpot} />
              <Text style={[style.title, global.fontSize14]}> 明细 </Text>
              <View style={style.titleSpot} />
            </View>
            <View
              style={[
                style.diagnosisItem,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentSpaceBetween,
              ]}>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>药费</Text>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>¥ 0.0</Text>
            </View>
            <View
              style={[
                style.diagnosisItem,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentSpaceBetween,
              ]}>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>诊后管理费</Text>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>¥ 0.0</Text>
            </View>
            <DashLine len={45} width={windowWidth - 46} backgroundColor={sColor.colorEee} />
            <View
              style={[
                style.diagnosisItem,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentSpaceBetween,
              ]}>
              <Text style={[style.diagnosisItemTitle, global.fontSize14]}>
                总计
                <Text style={[style.diagnosisItemDetail, global.fontSize12]}>( 不含快递费 )</Text>
              </Text>
              <Text style={[style.diagnosisItemAll, global.fontSize15]}>¥ 0.0</Text>
            </View>
          </View>
        </ScrollView>
      </>
    )
  }
}
