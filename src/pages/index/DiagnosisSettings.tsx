import * as userAction from '@/redux/actions/user'
import { AppState } from '@/redux/stores/store'
import { AllScreenParam } from '@/routes/bottomNav'
import pathMap from '@/routes/pathMap'
import doctor, { ALLOW_INQUIRY } from '@/services/doctor'
import { Icon, Switch, Toast } from '@ant-design/react-native'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import gImg from '@utils/img'
import gStyle from '@utils/style'
import React, { Component } from 'react'
import { DeviceEventEmitter, Image, RefreshControl, Text, View } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
const style = gStyle.index.DiagnosisSettings
const global = gStyle.global

interface Props {
  navigation: StackNavigationProp<AllScreenParam, 'DiagnosisSettings'>
  route: RouteProp<AllScreenParam, 'DiagnosisSettings'>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  allowInquiry: number // 开启问诊
  isSelectDisturbanceFreePeriod: boolean
  initialPrice: number
  percentageOfCommission: string
  followUpPrice: number
  isSelectInitialPrice: boolean
  isSelectFollowUpPrice: boolean
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
@connect(mapStateToProps, mapDispatchToProps)
export default class DiagnosisSettings extends Component<
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
      allowInquiry: ALLOW_INQUIRY.TRUE,
      isSelectDisturbanceFreePeriod: false,
      isSelectInitialPrice: false,
      isSelectFollowUpPrice: false,
      followUpPrice: 0,
      initialPrice: 0,
      // prettier-ignore
      reviewPriceList: [
        0.01, 1,5, 10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,350,400,450,500,550,600,650,700,750,800,850,900,950,1000,
      ],
      // prettier-ignore
      followUpReviewPriceList: [0.01,1,2,3,4,5,6,7,8,9,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,110,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,350,400,450,500,600,700,800,900,1000,1100,1200,1300,1400,1500,1600,1700,1800,1900,2000,
      ],
      percentageOfCommission: '0',
    }
  }
  componentDidMount() {
    this.init()
  }
  init = async () => {
    const {
      data: { allowInquiry, followUpPrice, initialPrice, percentageOfCommission },
    } = await doctor.getInquirySetup()
    this.setState({
      hasLoad: true,
      allowInquiry,
      followUpPrice,
      initialPrice,
      percentageOfCommission: String(percentageOfCommission),
    })
  }
  onRefresh = () => {
    this.setState({ refreshing: true })
    Promise.all([this.init(), new Promise(s => setTimeout(s, 500))])
      .then(_ => {
        this.setState({ refreshing: false })
      })
      .catch(err => {
        Toast.fail('刷新失败,错误信息: ' + err.msg)
      })
  }
  changeAllowInquiry = async () => {
    let allowInquiry = this.state.allowInquiry === ALLOW_INQUIRY.FALSE ? ALLOW_INQUIRY.TRUE : ALLOW_INQUIRY.FALSE
    await new Promise(s =>
      this.setState(
        {
          allowInquiry,
        },
        s,
      ),
    )
    try {
      let { followUpPrice, initialPrice, percentageOfCommission } = this.state
      let percentageOfCommissionInt = parseInt(percentageOfCommission)
      if (isNaN(percentageOfCommissionInt)) {
        percentageOfCommissionInt = 1
      }
      await doctor.setInquirySetup({
        followUpPrice,
        initialPrice,
        percentageOfCommission: percentageOfCommissionInt,
        allowInquiry,
      })
      DeviceEventEmitter.emit(pathMap.Home + 'Reload')
      Toast.success('设置成功', 1)
    } catch (err) {
      Toast.fail('设置失败, 错误信息: ' + err.msg, 3)
      console.log(err)
    }
  }
  closePicker = () => {
    this.setState({
      isSelectDisturbanceFreePeriod: false,
    })
  }
  setInitialPrice = async () => {
    try {
      let { allowInquiry, followUpPrice, initialPrice, percentageOfCommission } = this.state
      let percentageOfCommissionInt = parseInt(percentageOfCommission)
      if (isNaN(percentageOfCommissionInt)) {
        percentageOfCommissionInt = 1
      }
      await doctor.setInquirySetup({
        allowInquiry,
        followUpPrice,
        initialPrice,
        percentageOfCommission: percentageOfCommissionInt,
      })
      Toast.success('设置复诊价格成功', 1)
    } catch (err) {
      Toast.fail('设置复诊价格失败, 错误信息: ' + err.msg, 3)
      console.log(err)
    }
  }
  setFollowUpReviewPrice = async () => {
    try {
      let { allowInquiry, followUpPrice, initialPrice, percentageOfCommission } = this.state
      let percentageOfCommissionInt = parseInt(percentageOfCommission)
      if (isNaN(percentageOfCommissionInt)) {
        percentageOfCommissionInt = 1
      }
      await doctor.setInquirySetup({
        allowInquiry,
        followUpPrice,
        initialPrice,
        percentageOfCommission: percentageOfCommissionInt,
      })
      Toast.success('设置后续复诊价格成功', 1)
    } catch (err) {
      Toast.fail('设置后续复诊价格失败, 错误信息: ' + err.msg, 3)
      console.log(err)
    }
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
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
        >
          <View style={style.explain}>
            <View style={[style.header, global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}>
              <View style={[global.flex, global.alignItemsCenter]}>
                <View style={style.headerIcon} />
                <Text style={[style.headerTitle, global.fontSize14]}>是否开启复诊</Text>
              </View>
              <Switch checked={this.state.allowInquiry === ALLOW_INQUIRY.TRUE} onChange={this.changeAllowInquiry} />
            </View>
            <Text style={[style.title, global.fontSize14]}>在线复诊服务说明</Text>
            <View style={style.explainDetails}>
              <Text style={[style.explainDetail, global.fontSize14]}>
                您可以通过图文、语音、电话与患者交流, 首次回复需在24小时内( 22:00 - 8:30与免打扰时段不计入 ),
                默认单次交流时间为首次回复后24小时, 辨证开方后经患者同意可随时结束对话。您可自定义收费价格。
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
              activeOpacity={0.9}
              onPress={() => {
                this.setState({
                  isSelectInitialPrice: true,
                })
              }}
            >
              <View style={[style.item, global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}>
                <Text style={[style.itemTitle, global.fontSize14]}>复诊价格</Text>
                <View style={[style.itemDetail, global.flex, global.alignItemsCenter]}>
                  <Text style={[style.important, global.fontSize14]}>¥ {this.state.initialPrice / 100}</Text>
                  <Icon style={[style.itemIcon, global.fontSize14]} name='right' />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                this.setState({
                  isSelectFollowUpPrice: true,
                })
              }}
            >
              <View style={[style.item, global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}>
                <Text style={[style.itemTitle, global.fontSize14]}>
                  后续复诊价格 <Text style={[style.itemDescription, global.fontSize12]}>建议为老患者提供适当优惠</Text>
                </Text>
                <View style={[style.itemDetail, global.flex, global.alignItemsCenter]}>
                  <Text style={[style.important, global.fontSize14]}>¥ {this.state.followUpPrice / 100}</Text>
                  <Icon style={[style.itemIcon, global.fontSize14]} name='right' />
                </View>
              </View>
            </TouchableOpacity>
            {/* <View
              style={[
                style.item,
                global.flex,
                global.alignItemsCenter,
                global.justifyContentSpaceBetween,
              ]}>
              <Text style={[style.itemInputTitle, global.fontSize14]}>请输入诊后服务费比率(%)</Text>
              <View
                style={[global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}>
                <View style={style.itemInput}>
                  <InputItem
                    type="digit"
                    style={style.itemInput}
                    last
                    placeholder="0"
                    value={this.state.percentageOfCommission}
                    onChange={percentageOfCommission => {
                      let percentageOfCommissionVal = parseInt(percentageOfCommission)
                      if (isNaN(percentageOfCommissionVal)) {
                        this.setState({
                          percentageOfCommission: "",
                        })
                        return
                      }
                      if (percentageOfCommissionVal < 1) {
                        percentageOfCommissionVal = 1
                      } else if (percentageOfCommissionVal > 100) {
                        percentageOfCommissionVal = 100
                      }
                      this.setState({
                        percentageOfCommission: percentageOfCommissionVal + "",
                      })
                    }}
                    onBlur={this.setFollowUpReviewPrice}
                  />
                </View>
                <Icon style={[style.itemIcon, global.fontSize14]} name="right" />
              </View>
            </View>
           */}
          </View>
        </ScrollView>
        {/* 选择复诊价格 */}
        <View style={this.state.isSelectInitialPrice ? style.reviewPrice : global.hidden}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              this.setState({
                isSelectInitialPrice: false,
              })
            }}
          >
            <Text style={[style.closeReviewPrice, global.fontSize14]}>取消</Text>
          </TouchableOpacity>
          <Text style={[style.description, global.fontSize14]}>
            收费指导: 主任医师平均定价60元, 副主任医师平均定价40元, 主治医师平均定价20元, 您可根据实际情况进行调整。
          </Text>
          <ScrollView style={style.reviewPriceList}>
            {this.state.reviewPriceList.map((v: number, k: number) => {
              return (
                <TouchableOpacity
                  key={k}
                  onPress={() => {
                    this.setState(
                      {
                        initialPrice: v * 100,
                        isSelectInitialPrice: false,
                      },
                      this.setInitialPrice,
                    )
                  }}
                >
                  <Text
                    style={v * 100 === this.state.initialPrice ? style.reviewPriceItemActive : style.reviewPriceItem}
                  >
                    {v}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>
        {/* 选择后续复诊价格 */}
        <View style={this.state.isSelectFollowUpPrice ? style.reviewPrice : global.hidden}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              this.setState({
                isSelectFollowUpPrice: false,
              })
            }}
          >
            <Text style={[style.closeReviewPrice, global.fontSize14]}>取消</Text>
          </TouchableOpacity>
          <Text style={[style.description, global.fontSize14]}>
            收费指导: 主任医师平均定价30元, 副主任医师平均定价20元, 主治医师平均定价10元, 您可根据实际情况进行调整。选择0.01元会出现义诊标识。
          </Text>
          <ScrollView style={style.reviewPriceList}>
            {this.state.followUpReviewPriceList.map((v: number, k: number) => {
              return (
                <TouchableOpacity
                  key={k}
                  onPress={() => {
                    this.setState(
                      {
                        followUpPrice: v * 100,
                        isSelectFollowUpPrice: false,
                      },
                      this.setFollowUpReviewPrice,
                    )
                  }}
                >
                  <Text
                    style={v * 100 === this.state.followUpPrice ? style.reviewPriceItemActive : style.reviewPriceItem}
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
