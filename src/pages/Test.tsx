import React, { Component } from "react"
import ImageViewer from "react-native-image-zoom-viewer"
import { Modal, Button } from "@ant-design/react-native"
import { View, Image } from "react-native"
import { windowHeight, windowWidth } from "@/services/api"

interface Props {}
interface State {
  index: number
  modalVisible: boolean
  images: Image[]
  img: string
}
interface Image {
  url: string
  width?: number
  height?: number
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
      modalVisible: true,
      img: "https://avatars2.githubusercontent.com/u/7970947?v=3&s=460",
      images: [
        {
          url: "https://www.byhealth.net/uploads/20190508/20dffc8ab60da6d822d1ee9d8c80992c.jpg",
        },
      ],
    }
  }
  componentDidMount() {}

  render() {
    return (
      <View
        style={{
          height: windowHeight - 30,
        }}>
        <Button
          onPress={() => {
            this.setState({
              images: [{ url: this.state.img }],
            })
          }}>
          更换图片
        </Button>
        <ImageViewer
          saveToLocalByLongPress={false}
          imageUrls={this.state.images}
          index={this.state.index}
        />
      </View>
    )
  }
}
