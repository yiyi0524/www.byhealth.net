import React, { Component } from "react"
import { CameraRoll, View, TouchableOpacity, Text } from "react-native"
import QrCode from "react-native-qrcode"
import ViewShot from "react-native-view-shot"
interface Props {}
interface State {}

export default class Main extends Component<Props, State> {
  refs: any
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {}
  }
  componentDidMount() {}
  saveQrCode = () => {
    console.log(this.refs)
    this.refs.viewShot
      .capture()
      .then((uri: any) => {
        console.log("do something with ", uri)
        CameraRoll.saveToCameraRoll(uri)
          .then(json => {
            console.log(json)
          })
          .catch(e => {
            console.log(e)
          })
      })
      .catch((e: any) => {
        console.log(e)
      })
  }
  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.saveQrCode}>
          <ViewShot
            ref="viewShot"
            options={{ format: "jpg", quality: 1, snapshotContentContainer: true }}>
            <Text>...Something to title...</Text>
            <QrCode value={"www.buffge.com"} size={200} bgColor="#333" fgColor="white" />
          </ViewShot>
        </TouchableOpacity>
      </View>
    )
  }
}
