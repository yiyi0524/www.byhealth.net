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
      assistantDoctorList: [
        {
          id: 1,
          name: '小李',
          account: '18019991888',
          pwd: '123456',
        },
        {
          id: 2,
          name: '小赵',
          account: '18019991888',
          pwd: '123456',
        },
        {
          id: 3,
          name: '小钱',
          account: '18019991888',
          pwd: '123456',
        },
        {
          id: 4,
          name: '小孙',
          account: '18019991888',
          pwd: '123456',
        },
      ],
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
