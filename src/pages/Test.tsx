import { windowHeight } from "@/services/api"
import React, { Component } from "react"
import { View, WebView } from "react-native"
import { windowWidth } from "@/utils/utils"
import { lawAgreementHtml } from "@/config/api"

interface Props {}
interface State {
  index: number
}

export default class Test extends Component<Props, State> {
  refs: any
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      index: 0,
    }
  }
  componentDidMount() {}

  render() {
    return (
      <WebView
        style={{
          flex: 1,
          width: windowWidth,
          padding: 15,
        }}
        decelerationRate="normal"
        automaticallyAdjustContentInsets
        scalesPageToFit
        javaScriptEnabled // 仅限Android平台。iOS平台JavaScript是默认开启的。
        domStorageEnabled // 适用于安卓
        scrollEnabled={false}
        source={{ html: lawAgreementHtml, baseUrl: "" }}
      />
    )
  }
}
