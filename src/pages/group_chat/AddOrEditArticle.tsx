import { AllScreenParam } from '@/routes/bottomNav'
import { uploadImg } from '@/services/api'
import { addArticle, editArticle, getArticle } from '@/services/groupChat'
import { getPicFullUrl } from '@/utils/utils'
import { ImagePicker, InputItem, Portal, TextareaItem, Toast } from '@ant-design/react-native'
import imgPickerOpt from '@config/imgPickerOpt'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import gSass from '@utils/style'
import React, { Component } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import RnImagePicker from 'react-native-image-picker'
import Permissions from 'react-native-permissions'
import { Picture } from '../advisory/Chat'
const style = gSass.groupChat.addArticle
interface Props {
  navigation: StackNavigationProp<AllScreenParam, 'AddOrEditArticle'>
  route: RouteProp<AllScreenParam, 'AddOrEditArticle'>
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
  constructor(props: any) {
    super(props)
    this.state = this.getInitState(props)
  }
  getInitState = (props: Props): State => {
    const { id, type } = props.route.params
    return {
      id,
      type,
      title: '',
      content: '',
      picList: [],
    }
  }
  componentDidMount() {
    this.init()
  }
  init = async () => {
    try {
      let { id, type } = this.state
      if (type === 'edit') {
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
    let { title, content, picList, type } = this.state
    return (
      <KeyboardAvoidingView
        enabled={Platform.OS !== 'android'}
        behavior='padding'
        style={{ flex: 1 }}
        keyboardVerticalOffset={90}
      >
        <View style={style.main}>
          <ScrollView style={style.content} keyboardShouldPersistTaps='always'>
            <View style={style.list}>
              <View style={style.item}>
                <InputItem
                  clear
                  last
                  style={style.input}
                  value={title}
                  onChange={editTitle => {
                    this.setState({
                      title: editTitle,
                    })
                  }}
                  placeholder='请输入'
                >
                  标题:
                </InputItem>
              </View>
              <View style={style.item}>
                <TextareaItem
                  value={content}
                  onChange={val => {
                    let editContent: string = val ? val : ''
                    this.setState({
                      content: editContent,
                    })
                  }}
                  last
                  style={style.textarea}
                  rows={12}
                  placeholder='请输入文章内容'
                />
              </View>
              <View style={style.item}>
                <Text style={style.title}>图片展示</Text>
                <ImagePicker files={picList} onAddImageClick={this.addImage} onChange={this.onImageChange} />
              </View>
            </View>
          </ScrollView>
          <View style={style.footer}>
            <View style={style.btnPar}>
              <TouchableOpacity onPress={this.submit}>
                <View style={style.btnContent}>
                  <Text style={style.btn}>{type === 'add' ? '发布' : '更新'}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }
  onImageChange = (picList: any) => {
    console.log(picList)
    this.setState({
      picList,
    })
  }
  //上传图片
  addImage = () => {
    try {
      Permissions.check('camera')
        .then(res => {
          if (res !== 'authorized') {
            try {
              Permissions.request('camera').then(status => {
                if (status === 'authorized') {
                  console.log('获得摄像头权限')
                  RnImagePicker.launchImageLibrary(imgPickerOpt, (resp: any) => {
                    const uploadingImgKey = Toast.loading('上传图片中', 0, undefined, true)
                    if (resp.didCancel) {
                      Portal.remove(uploadingImgKey)
                    } else if (resp.error) {
                      Portal.remove(uploadingImgKey)
                      return Toast.info('您禁止了拍摄照片和录制视频权限, 请到设置中心打开', 3)
                    } else {
                      uploadImg({ url: resp.uri })
                        .then(json => {
                          Portal.remove(uploadingImgKey)
                          console.log(json)
                          let { picList } = this.state
                          picList.push({
                            id: json.data.picId,
                            title: json.data.name,
                            url: resp.uri,
                          })
                          this.setState({
                            picList,
                          })
                        })
                        .catch(e => {
                          Portal.remove(uploadingImgKey)
                          Toast.fail('上传图片, 错误信息: ' + e)
                        })
                    }
                  })
                } else {
                  return Toast.info('您禁止了拍摄照片和录制视频权限, 请到设置中心打开', 3)
                }
              })
            } catch (err) {
              console.warn(err)
            }
          } else {
            console.log('获得摄像头权限已经获取')
            RnImagePicker.launchImageLibrary(imgPickerOpt, (resp: any) => {
              const uploadingImgKey = Toast.loading('上传图片中', 0, undefined, true)
              if (resp.didCancel) {
                Portal.remove(uploadingImgKey)
              } else if (resp.error) {
                Portal.remove(uploadingImgKey)
                return Toast.info('您禁止了拍摄照片和录制视频权限, 请到设置中心打开', 3)
              } else {
                uploadImg({ url: resp.uri })
                  .then(json => {
                    Portal.remove(uploadingImgKey)
                    let { picList } = this.state
                    picList.push({
                      id: json.data.picId,
                      title: json.data.name,
                      url: resp.uri,
                    })
                    this.setState({
                      picList,
                    })
                  })
                  .catch(e => {
                    Portal.remove(uploadingImgKey)
                    Toast.fail('上传图片, 错误信息: ' + e)
                  })
              }
            })
          }
        })
        .catch(err => {
          console.log('读取权限失败: ' + err)
        })
    } catch (err) {
      console.log(err)
    }
  }
  //发布
  submit = () => {
    let { title, content, picList, type, id } = this.state
    try {
      if (title === '') {
        return Toast.info('请填写标题', 1)
      }
      if (content === '') {
        return Toast.info('请填内容', 1)
      }
      let picIdList: number[] = []
      for (let v of picList) {
        picIdList.push(v.id)
      }
      let data = {
        id,
        title,
        content,
        picIdList,
      }
      if (type === 'add') {
        addArticle(data)
          .then(json => {
            Toast.success('发布成功', 1, async () => {
              let {
                data: { detail: article },
              } = await getArticle({ id: json.data.id })
              let sendArticle = this.props.route.params.sendArticle
              sendArticle(article)
              this.props.navigation.goBack()
            })
          })
          .catch(err => {
            console.log(err)
            Toast.fail('发布错误, 错误信息: ' + err.msg, 3)
          })
      } else {
        editArticle(data)
          .then(() => {
            Toast.success('编辑成功', 1)
          })
          .catch(err => {
            console.log(err)
            Toast.fail('发布错误, 错误信息: ' + err.msg, 3)
          })
      }
    } catch (err) {
      console.log(err)
    }
  }
}
