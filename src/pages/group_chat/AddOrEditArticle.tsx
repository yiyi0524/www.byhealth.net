import { ImagePicker, InputItem, TextareaItem, Toast, Portal } from "@ant-design/react-native"
import gSass from "@utils/style"
import React, { Component } from "react"
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { Picture } from "../advisory/Chat"
import Permissions from "react-native-permissions"
import RnImagePicker from "react-native-image-picker"
import { uploadImg } from "@/services/api"
import imgPickerOpt from "@config/imgPickerOpt"
import { BASE_URL } from "@/config/api"
import { addArticle, getArticle, editArticle } from "@/services/groupChat"
import { NavigationScreenProp } from "react-navigation"
import { getPicFullUrl } from "@/utils/utils"
const style = gSass.groupChat.addArticle
interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  id: number
  type: string
  title: string
  content: string
  picList: Picture[]
}
type DefaultProps = {}

export default class AddArticle extends Component<Props & DefaultProps, State> {
  static defaultProps: DefaultProps
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<State> }) => {
    let title = "添加文章"
    if (navigation.state.params) {
      if (navigation.state.params.type === "edit") {
        title = "编辑文章"
      }
    }
    return {
      title,
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
    this.state = this.getInitState(props)
  }
  getInitState = (props: Props): State => {
    let id = 0,
      type = "add"
    if (props.navigation.state.params) {
      id = props.navigation.state.params.id
      type = props.navigation.state.params.type
    }
    return {
      id,
      type,
      title: "",
      content: "",
      picList: [],
    }
  }
  componentDidMount() {
    this.init()
  }
  init = async () => {
    try {
      let { id, type } = this.state
      if (type === "edit") {
        let detailTask = getArticle({ id })
        let {
          data: {
            detail: { title, content, picList },
          },
        } = await detailTask
        for (let v of picList) {
          v.url = getPicFullUrl(v.url)
        }
        this.setState({
          title,
          content,
          picList,
        })
      }
    } catch (err) {
      console.log(err)
    }
  }
  render() {
    let { title, content, picList } = this.state
    return (
      <KeyboardAvoidingView
        enabled={Platform.OS !== "android"}
        behavior="padding"
        style={{ flex: 1 }}
        keyboardVerticalOffset={90}>
        <View style={style.main}>
          <ScrollView style={style.content} keyboardShouldPersistTaps="always">
            <View style={style.list}>
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
                  rows={12}
                  placeholder="填写病例说明"
                />
              </View>
              <View style={style.item}>
                <ImagePicker files={picList} onAddImageClick={this.addImage} />
              </View>
            </View>
          </ScrollView>
          <View style={style.footer}>
            <View style={style.btnPar}>
              <TouchableOpacity onPress={this.submit}>
                <View style={style.btnContent}>
                  <Text style={style.btn}>发布</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }
  //上传图片
  addImage = () => {
    try {
      Permissions.check("camera")
        .then(res => {
          if (res !== "authorized") {
            try {
              Permissions.request("camera").then(status => {
                if (status === "authorized") {
                  console.log("获得摄像头权限")
                  RnImagePicker.launchImageLibrary(imgPickerOpt, resp => {
                    const uploadingImgKey = Toast.loading("上传图片中", 0, () => {}, true)
                    if (resp.didCancel) {
                      Portal.remove(uploadingImgKey)
                    } else if (resp.error) {
                      Portal.remove(uploadingImgKey)
                      return Toast.info("您禁止了拍摄照片和录制视频权限, 请到设置中心打开", 3)
                    } else {
                      uploadImg({ url: resp.uri })
                        .then(json => {
                          Portal.remove(uploadingImgKey)
                          console.log(json)
                          let { picList } = this.state
                          picList.push({
                            id: json.data.picId,
                            title: json.data.name,
                            url: BASE_URL + json.data.url,
                          })
                          this.setState({
                            picList,
                          })
                        })
                        .catch(e => {
                          Portal.remove(uploadingImgKey)
                          Toast.fail("上传图片, 错误信息: " + e)
                        })
                    }
                  })
                } else {
                  return Toast.info("您禁止了拍摄照片和录制视频权限, 请到设置中心打开", 3)
                }
              })
            } catch (err) {
              console.warn(err)
            }
          } else {
            console.log("获得摄像头权限已经获取")
            RnImagePicker.launchImageLibrary(imgPickerOpt, resp => {
              const uploadingImgKey = Toast.loading("上传图片中", 0, () => {}, true)
              if (resp.didCancel) {
                Portal.remove(uploadingImgKey)
              } else if (resp.error) {
                Portal.remove(uploadingImgKey)
                return Toast.info("您禁止了拍摄照片和录制视频权限, 请到设置中心打开", 3)
              } else {
                uploadImg({ url: resp.uri })
                  .then(json => {
                    Portal.remove(uploadingImgKey)
                    let { picList } = this.state
                    picList.push({
                      id: json.data.picId,
                      title: json.data.name,
                      url: BASE_URL + json.data.url,
                    })
                    this.setState({
                      picList,
                    })
                  })
                  .catch(e => {
                    Portal.remove(uploadingImgKey)
                    Toast.fail("上传图片, 错误信息: " + e)
                  })
              }
            })
          }
        })
        .catch(err => {
          console.log("读取权限失败: " + err)
        })
    } catch (err) {
      console.log(err)
    }
  }
  //发布
  submit = () => {
    let { title, content, picList, type, id } = this.state
    try {
      if (title === "") {
        return Toast.info("请填写标题", 1)
      }
      if (content === "") {
        return Toast.info("请填内容", 1)
      }
      let data = {
        id,
        title,
        content,
        picList,
      }
      if (type === "add") {
        addArticle(data)
          .then(() => {
            Toast.success("发布成功", 1, () => {
              this.setState({
                title: "",
                content: "",
                picList: [],
              })
            })
          })
          .catch(err => {
            console.log(err)
            Toast.fail("发布错误, 错误信息: " + err.msg, 3)
          })
      } else {
        editArticle(data)
          .then(() => {
            Toast.success("发布成功", 1, () => {
              this.setState({
                title: "",
                content: "",
                picList: [],
              })
            })
          })
          .catch(err => {
            console.log(err)
            Toast.fail("发布错误, 错误信息: " + err.msg, 3)
          })
      }
    } catch (err) {
      console.log(err)
    }
  }
}
