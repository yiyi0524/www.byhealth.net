import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity, View, Image } from 'react-native'
import { Modal } from '@ant-design/react-native'
import { AppState } from '@redux/stores/store'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import * as userAction from '@/redux/actions/user'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { AllScreenParam } from '@/routes/bottomNav'
import userApi from '@api/user'
import gStyle from '@utils/style'
const global = gStyle.global
const style = gStyle.personalCenter.assistantDoctor

interface Props {
  navigation: StackNavigationProp<AllScreenParam, 'ChangePwd'>
  route: RouteProp<AllScreenParam, 'ChangePwd'>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  assistantDoctorList: assistantDoctor[]
  addAssistant: boolean
  editAssistant: boolean
  showModal: boolean
}
export interface assistantDoctor {
  id: number
  name: string
  account: string
  pwd: string
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
export default class ChangePwd extends Component<
  Props & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
  State
> {
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: true,
      refreshing: false,
      assistantDoctorList: [],
      addAssistant: false,
      editAssistant: false,
      showModal: false,
    }
  }
  componentDidMount() {
    this.init()
  }
  init = async () => {
    this.setState({
      hasLoad: true,
    })
    let {
      data: { list: assistantDoctorList },
    } = await userApi.getAssistantList({
      page: -1,
      limit: -1,
      filter: {},
    })
    this.setState({
      assistantDoctorList,
    })
  }
  buildAssistantDom = (v: assistantDoctor, k: number): React.ReactChild => {
    return (
      <TouchableOpacity
        key={k}
        style={[style.assistantItem, global.flex]}
        onPress={() => {
          this.props.navigation.push('AddOrEditAssistant', {
            type: 'edit',
            id: v.id,
          })
        }}
      >
        <View style={style.basicInfo}>
          <Text style={style.name}>名称:{v.name}</Text>
          <Text style={style.account}>账号:{v.account}</Text>
        </View>
        <Text style={style.editBtn}>编辑</Text>
      </TouchableOpacity>
    )
  }
  render() {
    return (
      <ScrollView>
        {this.state.assistantDoctorList.map((v: assistantDoctor, k: number) => this.buildAssistantDom(v, k))}
        <Modal visible={this.state.showModal} style={style.modal} transparent />
      </ScrollView>
    )
  }
}
