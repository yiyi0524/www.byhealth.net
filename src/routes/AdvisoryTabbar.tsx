import gImg from "@utils/img"
import React, { Component } from "react"
import { Image, StyleSheet, View } from "react-native"
import { AppState } from "@/redux/stores/store"
import { Dispatch } from "redux"
import * as userAction from "@/redux/actions/user"
import { connect } from "react-redux"
interface Props {
  focused: boolean
}
interface State {}
const mapStateToProps = (state: AppState) => {
  return {
    ws: state.ws,
  }
}
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    login: (preload: userAction.UserInfo) => {
      dispatch(userAction.userLogin(preload))
    },
  }
}
type DefaultProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
//@ts-ignore
@connect(mapStateToProps, mapDispatchToProps)
export default class AdvisoryTabbar extends Component<Props & DefaultProps, State> {
  static defaultProps: DefaultProps
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {}
  }
  componentDidMount() {
    this.init()
  }
  init = () => {}
  render() {
    let { focused } = this.props
    let { unReadMsgCountRecord } = this.props.ws
    let countList = Object.values(unReadMsgCountRecord)
    let hasUnreadMsg = false
    for (let i = 0; i < countList.length; i++) {
      if (countList[i] !== 0) {
        hasUnreadMsg = true
        break
      }
    }
    return (
      <View style={[style.iconFa, style.consultation]}>
        <Image
          style={style.icon}
          source={focused ? gImg.common.advisoryActive : gImg.common.advisory}
        />
        {hasUnreadMsg && <View style={style.countPar}></View>}
      </View>
    )
  }
}
const style = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  iconFa: {
    width: 30,
    height: 30,
    overflow: "hidden",
  },
  consultation: {
    position: "relative",
  },
  countPar: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 6,
    backgroundColor: "red",
    zIndex: 9,
    justifyContent: "center",
  },
})
