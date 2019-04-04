import * as userAction from "@/redux/actions/user"
import { AppState } from "@/redux/stores/store"
import gStyle from "@utils/style"
import React, { Component } from "react"
import { ScrollView, Text, View, Image, TouchableOpacity } from "react-native"
import { Icon } from "@ant-design/react-native"
import gImg from "@utils/img"
import { connect } from "react-redux"
import { Dispatch } from "redux"
const style = gStyle.home
const globalStyle = gStyle.global
interface Props {}
interface State {}
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
export default class Home extends Component<
  Props &
    ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>,
  State
> {
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {}
  }
  render() {
    return (
      <>
        <ScrollView style={style.main}>
          <Image
            style={{ width: 100, height: 100, resizeMode: "center" }}
            source={gImg.common.loading}
          />
        </ScrollView>
      </>
    )
  }
}
