import * as userAction from '@/redux/actions/user'
import { AppState } from '@/redux/stores/store'
import { Icon, Toast } from '@ant-design/react-native'
import gStyle from '@utils/style'
import React, { Component } from 'react'
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  ImageSourcePropType,
  Linking,
} from 'react-native'
import { connect } from 'react-redux'
import { StackNavigationProp } from '@react-navigation/stack'
import { Dispatch } from 'redux'
import { AllScreenParam } from '@/routes/bottomNav'
import { RouteProp } from '@react-navigation/native'
import gImg from '@utils/img'
import { customerServicePhone, customerServiceWeChat } from '@/config/api'
const style = gStyle.personalCenter.customerService
const global = gStyle.global
interface Props {
  navigation: StackNavigationProp<AllScreenParam, 'CustomerService'>
  route: RouteProp<AllScreenParam, 'CustomerService'>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
}
interface item {
  icon: ImageSourcePropType
  name: string
  link: string
  type: string
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
export default class CustomerService extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  list: item[] = []
  constructor(props: any) {
    super(props)
    this.list = [
      {
        icon: gImg.advisory.customerServicePhone,
        name: '电话: ' + customerServicePhone,
        link: customerServicePhone,
        type: 'phone',
      },
      {
        icon: gImg.advisory.customerServiceWeixin,
        name: '微信: ' + customerServiceWeChat,
        link: customerServiceWeChat,
        type: 'weixin',
      },
    ]
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
    }
  }
  async componentDidMount() {
    await this.init()
  }
  init = async () => {
    this.setState({
      hasLoad: true,
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
          <View style={style.list}>
            {this.list.map((v: item, k: number) => {
              return (
                <TouchableOpacity
                  key={k}
                  style={[style.item, global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}
                  onPress={() => {
                    switch (v.type) {
                      case 'phone':
                        Linking.openURL('tel:' + v.link)
                        break
                      case '微信':
                        break
                      default:
                        break
                    }
                  }}
                >
                  <View style={[style.itemTitle, global.flex, global.alignItemsCenter]}>
                    <View style={style.itemPic}>
                      <Image style={style.itemImg} source={v.icon} />
                    </View>
                    <Text style={[style.itemTheme, global.fontSize14]}>{v.name}</Text>
                  </View>
                  <Icon style={[v.type === 'phone' ? style.itemIcon : global.hidden, global.fontSize14]} name='right' />
                </TouchableOpacity>
              )
            })}
          </View>
        </ScrollView>
      </>
    )
  }
}
