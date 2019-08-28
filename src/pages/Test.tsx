import React, { Component } from "react"
import { Text, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Recorder } from "@react-native-community/audio-toolkit"
interface Props {}
interface State {}
type DefaultProps = {}

export default class Test extends Component<Props & DefaultProps, State> {
  static defaultProps: DefaultProps
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {}
  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          onPressIn={() => {
            console.log("in")
            let r = new Recorder("test.aac")
            r.record(err => console.log(err))
            setTimeout(() => r.stop(err => console.log(err)), 5000)
          }}
          onPressOut={() => {
            console.log("out")
          }}>
          <Text>录制</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
