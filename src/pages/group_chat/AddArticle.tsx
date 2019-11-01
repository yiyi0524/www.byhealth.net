import { ImagePicker, InputItem, TextareaItem } from "@ant-design/react-native"
import gSass from "@utils/style"
import React, { Component } from "react"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { Picture } from "../advisory/Chat"
const style = gSass.groupChat.addArticle
interface Props {}
interface State {
  title: string
  content: string
  picList: Picture[]
}
type DefaultProps = {}

export default class AddArticle extends Component<Props & DefaultProps, State> {
  static defaultProps: DefaultProps
  static navigationOptions = () => {
    return {
      title: "发布文章",
      headerStyle: {
        backgroundColor: "#fff",
        height: 45,
        elevation: 0,
        borderColor: "#E3E3E3",
      },
      headerTintColor: "#333",
      headerTitleStyle: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        textAlign: "center",
      },
      headerRight: (
        <TouchableOpacity>
          <Text></Text>
        </TouchableOpacity>
      ),
    }
  }
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      title: "",
      content: "",
      picList: [],
    }
  }
  render() {
    let { title, content, picList } = this.state
    return (
      <View style={style.main}>
        <ScrollView style={style.content} keyboardShouldPersistTaps="always">
          <View style={style.item}>
            <InputItem
              clear
              last
              style={style.input}
              value={title}
              onChange={title => {
                this.setState({
                  title,
                })
              }}
              placeholder="4-23字">
              标题:
            </InputItem>
          </View>
          <View style={style.item}>
            <TextareaItem
              value={content}
              onChange={val => {
                let content: string = val ? val : ""
                this.setState({
                  content,
                })
              }}
              last
              style={style.textarea}
              rows={10}
              placeholder="填写病例说明"
              count={1000}
            />
          </View>
          <View style={style.item}>
            <ImagePicker
              files={picList}
              onChange={() => {}}
              selectable={picList.length < 6}
              // accept="image/*"
            />
          </View>
        </ScrollView>
        <View style={style.footer}>
          <View style={style.btnPar}>
            <TouchableOpacity>
              <View style={style.btnContent}>
                <Text style={style.btn}>发布</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}
