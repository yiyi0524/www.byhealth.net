import global from '@/assets/styles/global'
import { AllScreenParam } from '@/routes/bottomNav'
import { uploadImg } from '@/services/api'
import { Icon, ImagePicker, InputItem, Portal, TextareaItem, Toast, Modal} from '@ant-design/react-native'
import doctorApi from '@api/doctor'
import imgPickerOpt from '@config/imgPickerOpt'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import gImg from '@utils/img'
import gSass from '@utils/style'
import React, { Component } from 'react'
import { Image, Linking, Text, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import RnImagePicker from 'react-native-image-picker'
import ImagePickerO from 'react-native-image-crop-picker';
import { Picture } from '../advisory/Chat'
const style = gSass.index.uploadPrescription
interface Props {
  navigation: StackNavigationProp<AllScreenParam, 'UploadPrescription'>
  route: RouteProp<AllScreenParam, 'UploadPrescription'>
}
interface State {
  hasLoad: boolean
  isShowImg: boolean
  name: string
  serviceMoney: string
  advice: string
  prescriptionPicList: Picture[]
  isAddDrug: boolean
}
type DefaultProps = {}

export default class UploadPrescription extends Component<Props & DefaultProps, State> {
  static defaultProps: DefaultProps
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      isShowImg: false,
      name: '',
      advice: '',
      serviceMoney: '',
      prescriptionPicList: [],
      isAddDrug: false
    }
  }
  componentDidMount() {
    this.init()
  }
  init = () => {
    this.setState({
      hasLoad: true,
    })
  }
  prescriptionPicChange = async (prescriptionPicList: Array<any>, operationType: string) => {
    if (operationType === 'remove') {
      this.setState({
        prescriptionPicList,
      })
    }
  }
  save = () => {
    let { serviceMoney, prescriptionPicList, name, advice } = this.state
    // if (name === "") {
    //   return Toast.info("请填写患者姓名", 1)
    // }
    // if (serviceMoney === "") {
    //   return Toast.info("请填写诊后管理费", 1)
    // }
    if (prescriptionPicList.length === 0) {
      return Toast.info('请上传处方', 1)
    }
    let data = {
      name,
      serviceMoney: parseInt(serviceMoney) * 100 || 0,
      advice,
      prescriptionPicList: prescriptionPicList.map(v => v.id),
    }
    doctorApi
      .uploadPrescription(data)
      .then(() => {
        Toast.success('上传成功', 1, () => {
          this.setState({
            serviceMoney: '',
            prescriptionPicList: [],
          })
        })
      })
      .catch(err => {
        Toast.fail('上传失败, 错误信息: ' + err.msg, 3)
      })
  }
  render() {
    let { hasLoad, serviceMoney, prescriptionPicList, name, isShowImg, advice } = this.state
    if (!hasLoad) {
      return (
        <View style={style.loading}>
          <View style={style.loadingPic}>
            <Image style={style.loadingImg} source={gImg.common.loading} />
          </View>
        </View>
      )
    }
    return (
      <ScrollView style={style.main} keyboardShouldPersistTaps='handled'>
        <View style={style.tips}>
          <Text style={style.tipsTitle}>
            说明: 请将【处方信息】 及【患者的地址信息】拍照上传, 会有工作人员与患者联系确认订单。
          </Text>
          <Text style={[style.tipsTitle, { marginBottom: 0 }]}>
            地址信息包括: <Text style={style.important}>收件人姓名、联系方式、地址</Text>
          </Text>
        </View>
        <View style={style.content}>
          <View style={[style.item, global.flex, global.alignItemsCenter]}>
            <View style={style.titlePar}>
              <Text style={style.title}>患者姓名(选填)</Text>
            </View>
            <View style={style.detail}>
              <InputItem
                style={style.input}
                value={name}
                placeholder='请输入患者姓名'
                last
                clear
                onChange={val => {
                  this.setState({
                    name: val,
                  })
                }}
              />
            </View>
          </View>
          <View style={[style.item, global.flex, global.alignItemsCenter]}>
            <View style={style.titlePar}>
              <Text style={style.title}>诊后管理费(选填)</Text>
            </View>
            <View style={style.detail}>
              <InputItem
                type='number'
                style={style.input}
                value={serviceMoney}
                placeholder='请输入诊后管理费'
                last
                clear
                extra='元'
                onChange={val => {
                  let editServiceMoney: number | string = parseFloat(val)
                  if (isNaN(editServiceMoney)) {
                    editServiceMoney = ''
                  }
                  this.setState({
                    serviceMoney: String(editServiceMoney),
                  })
                }}
              />
            </View>
          </View>
          <View style={[style.item, global.flex, global.alignItemsCenter]}>
            <View style={style.titlePar}>
              <Text style={style.title}>医嘱(选填)</Text>
            </View>
            <View style={style.detail}>
              <TextareaItem
                style={[style.input, { paddingTop: 13, paddingLeft: 20 }]}
                value={advice}
                placeholder='请输入医嘱'
                last
                clear
                autoHeight
                onChange={val => {
                  this.setState({
                    advice: String(val),
                  })
                }}
              />
            </View>
          </View>
          <View style={[style.item, { borderBottomWidth: 0 }]}>
            <Text style={[style.title, style.titleCenter]}>处方(图片)列表</Text>
            <View style={[style.detail, style.uploadImg]}>
              <ImagePicker
                selectable={prescriptionPicList.length < 20}
                onChange={this.prescriptionPicChange}
                files={prescriptionPicList}
                onAddImageClick={() => {
                  this.setState({isAddDrug: true})
                  // RnImagePicker.showImagePicker(imgPickerOpt, resp => {
                  //   const uploadingImgKey = Toast.loading('上传图片中', 0, undefined, true)
                  //   if (resp.didCancel) {
                  //     Portal.remove(uploadingImgKey)
                  //   } else if (resp.error) {
                  //     Portal.remove(uploadingImgKey)
                  //     return Toast.info('您禁止了拍摄照片和录制视频权限, 请到设置中心打开', 3)
                  //   } else {
                  //     console.log(resp)

                  //     uploadImg({ url: resp.uri })
                  //       .then(json => {
                  //         Portal.remove(uploadingImgKey)
                  //         const { picId } = json.data
                  //         let img = {
                  //           url: resp.uri,
                  //           picId,
                  //           id: picId,
                  //           title: '',
                  //         }
                  //         prescriptionPicList.push(img)
                  //         this.setState({ prescriptionPicList })
                  //       })
                  //       .catch(e => {
                  //         Portal.remove(uploadingImgKey)
                  //         Toast.fail('上传图片, 错误信息: ' + e)
                  //       })
                  //   }
                  // })
                }}
              />
            </View>
            <View style={[style.example, global.flex]}>
              <Text style={style.title}>处方案例</Text>
              <TouchableOpacity
                style={style.imgPar}
                onPress={() => {
                  this.setState({
                    isShowImg: true,
                  })
                }}
              >
                <Image style={style.img} source={gImg.home.prescriptionExample} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={style.btn}>
          <View style={style.btnPar}>
            <View style={style.btnBg}>
              <TouchableOpacity onPress={this.save}>
                <Text style={style.btnTitle}>上传处方</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={[style.servicePhone, global.flex, global.alignItemsCenter, global.justifyContentCenter]}
          onPress={() => {
            Linking.openURL('tel:4000566629')
          }}
        >
          <Icon style={style.icon} name='customer-service' />
          <Text style={style.phoneTitle}>客服热线: </Text>
          <Text style={style.phone}>4000566629</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          style={isShowImg ? style.imPargShow : global.hidden}
          onPress={() => {
            this.setState({
              isShowImg: false,
            })
          }}
        >
          <Image style={isShowImg ? style.imgShow : global.hidden} source={gImg.home.prescriptionExample} />
        </TouchableOpacity>
        <Modal
              visible={this.state.isAddDrug}
              maskClosable
              transparent={true}
              // closable
              onClose={() => {
                this.setState({ isAddDrug: false})
              }}
              >
                <TouchableOpacity onPress={()=>{
                  this.setState({ prescriptionPicList })
                  ImagePickerO.openPicker({
                    multiple: true
                  }).then(images => {
                  const uploadingImgKey = Toast.loading('上传图片中', 0, undefined, true)
                  
                    for(let list in images){
                      
                      uploadImg({ url: images[list].path})
                        .then(json => {
                          Portal.remove(uploadingImgKey)
                          const { picId } = json.data
                          let img = {
                            url: images[list].path,
                            picId,
                            id: picId,
                            title: '',
                          }
                          prescriptionPicList.push(img)
                          this.setState({ prescriptionPicList })
                          
                        })
                        .catch(e => {
                          Portal.remove(uploadingImgKey)
                          Toast.fail('上传图片, 错误信息: ' + e)
                        })
                    }
                    
                    this.setState({isAddDrug: false})
                  });
                }}>
                    <Text style={{color:'#000',fontSize:18}}>打开相册</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                  this.setState({isAddDrug: false})
                  ImagePickerO.openCamera({
                  }).then(images => {
                    console.log(images)
                  const uploadingImgKey = Toast.loading('上传图片中', 0, undefined, true)
                    uploadImg({ url: images.path})
                      .then(json => {
                        Portal.remove(uploadingImgKey)
                        const { picId } = json.data
                        let img = {
                          url: images.path,
                          picId,
                          id: picId,
                          title: '',
                        }
                        prescriptionPicList.push(img)
                        this.setState({ prescriptionPicList })
                      })
                      .catch(e => {
                        Portal.remove(uploadingImgKey)
                        Toast.fail('上传图片, 错误信息: ' + e)
                      })
                  });
                }}>
                    <Text style={{color:'#000',marginTop:20,fontSize:18}}>拍照上传</Text>
                </TouchableOpacity>
              </Modal>
      </ScrollView>
    )
  }
}
