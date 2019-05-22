import React, { Component } from "react"
import { KeyboardAvoidingView, Text, TextInput, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"

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
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={0}>
        <ScrollView style={{ flex: 1, backgroundColor: "yellow" }}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <View
              style={{
                height: 600,
                backgroundColor: "lightgray",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Text style={{ fontSize: 28, color: "#998462", textAlign: "center" }}>Top Area</Text>
            </View>
            <TextInput
              placeholder="<TextInput />"
              style={{ borderRadius: 5, borderWidth: 1, height: 44, paddingHorizontal: 10 }}
            />
            <View
              style={{
                height: 200,
                backgroundColor: "skyblue",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Text style={{ fontSize: 28, color: "#998462", textAlign: "center" }}>
                Bottom Area
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}
