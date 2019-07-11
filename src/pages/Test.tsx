import { uploadImg } from "@/services/api"
import { getPicCdnUrl } from "@/utils/utils"
import { Toast } from "@ant-design/react-native"
import React, { Component } from "react"
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from "react-native"
import ImagePicker, { ImagePickerOptions } from "react-native-image-picker"

// More info on all the options is below in the API Reference... just some common use cases shown here
const options: ImagePickerOptions = {
  title: "选择图片",
  customButtons: [],
  storageOptions: {
    skipBackup: true,
    path: "images",
  },
  quality: 0.5,
  mediaType: "photo",
  cancelButtonTitle: "取消",
  allowsEditing: true,
  chooseFromLibraryButtonTitle: "从相册选择",
  takePhotoButtonTitle: "拍照",
}

interface Props {}
interface State {
  avatarSource: ImageSourcePropType
}

export default class Test extends Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      avatarSource: {
        uri: "https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=988384539,1427482972&fm=58",
        width: 100,
      },
    }
  }
  test = () => {
    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */
    ImagePicker.showImagePicker(options, resp => {
      console.log("Response = ", resp)
      if (resp.didCancel) {
      } else if (resp.error) {
        Toast.fail("选择图片失败, 错误信息: " + resp.error)
      } else {
        // const source = { uri: resp.uri, width: 100 }
        uploadImg({ url: resp.uri })
          .then(json => {
            console.log(json)
            let source = {
              uri: getPicCdnUrl(json.data.url),
            }
            this.setState({
              avatarSource: source,
            })
          })
          .catch(e => {
            console.log("上传图片失败,错误信息", e)
          })
      }
    })
  }
  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.test}>
          <Text>Hello World</Text>
        </TouchableOpacity>
        <Image
          source={this.state.avatarSource}
          style={{ width: 100, height: 100, resizeMode: "cover" }}
        />
      </View>
    )
  }
}
