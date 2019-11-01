import React, { Component } from "react"
import { ScrollView } from "react-native"
interface Props {}
interface State {}
type DefaultProps = {}

export default class ArticleDetail extends Component<Props & DefaultProps, State> {
  static defaultProps: DefaultProps
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {}
  }
  render() {
    return <ScrollView></ScrollView>
  }
}
