import * as userAction from '@/redux/actions/user'
import { AppState } from '@/redux/stores/store'
import { AllScreenParam } from '@/routes/bottomNav'
import pathMap from '@/routes/pathMap'
import hospital from '@/services/hospital'
import { Icon, Toast } from '@ant-design/react-native'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import gImg from '@utils/img'
import gStyle from '@utils/style'
import React, { Component } from 'react'
import { DeviceEventEmitter, EmitterSubscription, Image, RefreshControl, Text, View } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { CategoryItem } from '../advisory/DrugSelect'
const style = gStyle.index.PrescriptionTpl
const global = gStyle.global
interface Props {
  navigation: StackNavigationProp<AllScreenParam, 'PrescriptionTpl'>
  route: RouteProp<AllScreenParam, 'PrescriptionTpl'>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  categoryList: CategoryItem[]
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
//@ts-ignore
@connect(mapStateToProps, mapDispatchToProps)
export default class PrescriptionTpl extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  subscription?: EmitterSubscription
  constructor(props: any) {
    super(props)

    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      categoryList: [],
    }
  }
  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener(pathMap.SittingHospital + 'Reload', _ => {
      this.init()
    })
    this.init()
  }
  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.remove()
    }
  }
  init = async () => {
    try {
      let {
        data: { list: categoryList },
      } = await hospital.getDrugCategoryList({ page: -1, limit: -1, filter: {} })
      this.setState({
        hasLoad: true,
        categoryList,
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
          <View style={style.categoryList}>
            {this.state.categoryList.map((category, k) => {
              return (
                <TouchableOpacity
                  key={k}
                  onPress={() =>
                    this.props.navigation.push('PrescriptionTplList', {
                      id: category.id,
                      title: category.name,
                    })
                  }
                >
                  <View
                    style={[
                      style.categoryItem,
                      global.flex,
                      global.alignItemsCenter,
                      global.justifyContentSpaceBetween,
                    ]}
                  >
                    <Text style={[style.categoryTitle, global.fontSize15]}>{category.name}</Text>
                    <Icon name='right' style={[style.contegoryIcon, global.fontSize14]} />
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
