import global from "@/assets/styles/global"
import { BASE_URL } from "@/config/api"
import { getPicFullUrl } from "@/utils/utils"
import { Icon } from "@ant-design/react-native"
import doctorApi from "@api/doctor"
import sColor from "@styles/color"
import gImg from "@utils/img"
import gSass from "@utils/style"
import React, { Component } from "react"
import { Image, Text, TouchableOpacity, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import ImageViewer from "react-native-image-zoom-viewer"
import { NavigationScreenProp } from "react-navigation"
import { imagesViewer, Picture } from "../advisory/Chat"
const style = gSass.index.uploadPrescriptionDetail
interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  hasLoad: boolean
  isShowImg: boolean
  showImgUrl: imagesViewer[]
  name: string
  serviceMoney: number
  ctime: string
  expressName: string
  expressNo: string
  advice: string
  status: string
  prescriptionPicList: Picture[]
}
type DefaultProps = {}

export default class UploadPrescriptionDetail extends Component<Props & DefaultProps, State> {
  static defaultProps: DefaultProps
  static navigationOptions = () => ({
    title: "处方详情",
    headerStyle: {
      backgroundColor: sColor.white,
      height: 45,
      elevation: 0,
      borderBottomColor: sColor.colorDdd,
    },
    headerTintColor: sColor.color333,
    headerTitleStyle: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      fontSize: 14,
      textAlign: "center",
    },
    headerRight: <Text />,
  })
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      isShowImg: false,
      expressName: "",
      expressNo: "",
      advice: "",
      status: "",
      showImgUrl: [],
      name: "",
      serviceMoney: 0,
      ctime: "",
      prescriptionPicList: [],
    }
  }
  componentDidMount() {
    this.init()
  }
  init = async () => {
    try {
      let id = this.props.navigation.getParam("id")
      let {
        data: {
          detail: {
            name,
            serviceMoney,
            prescriptionPicList,
            ctime,
            expressName,
            expressNo,
            advice,
            status,
          },
        },
      } = await doctorApi.uploadPrescriptionDetail({ id })
      this.setState({
        hasLoad: true,
        name,
        serviceMoney,
        prescriptionPicList,
        ctime,
        expressName,
        expressNo,
        advice,
        status,
        showImgUrl:
          prescriptionPicList.length > 0
            ? [{ url: getPicFullUrl(prescriptionPicList[0].url) }]
            : [],
      })
    } catch (err) {
      console.log(err)
    }
  }
  render() {
    let {
      hasLoad,
      serviceMoney,
      prescriptionPicList,
      name,
      isShowImg,
      showImgUrl,
      ctime,
      expressName,
      expressNo,
      advice,
      status,
    } = this.state
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
      <>
        <ScrollView style={style.main} keyboardShouldPersistTaps="handled">
          <View style={style.content}>
            <View style={[style.item, global.flex, global.alignItemsCenter]}>
              <Text style={style.title}>患者姓名</Text>
              <Text style={style.input}>{name}</Text>
            </View>
            <View style={[style.item, global.flex, global.alignItemsCenter]}>
              <Text style={style.title}>诊后管理费(元)</Text>
              <Text style={style.input}>{(serviceMoney / 100).toFixed(2)}</Text>
            </View>
            <View style={[style.item, global.flex, global.alignItemsCenter]}>
              <Text style={style.title}>物流单号</Text>
              <Text style={style.input}>{expressNo}</Text>
            </View>
            <View style={[style.item, global.flex, global.alignItemsCenter]}>
              <Text style={style.title}>快递名称</Text>
              <Text style={style.input}>{expressName}</Text>
            </View>
            <View style={[style.item, global.flex, global.alignItemsCenter]}>
              <Text style={style.title}>医嘱</Text>
              <Text style={style.input}>{advice}</Text>
            </View>
            <View style={[style.item, global.flex, global.alignItemsCenter]}>
              <Text style={style.title}>发货状态</Text>
              <Text style={style.input}>{status}</Text>
            </View>
            <View style={[style.item, { borderBottomWidth: 0 }]}>
              <Text style={[style.title, style.titleCenter]}>处方(图片)列表</Text>
              <View style={[style.list, global.flex, global.alignItemsCenter, global.flexWrap]}>
                {prescriptionPicList.map((v, k) => {
                  return (
                    <TouchableOpacity
                      style={style.picItem}
                      key={k}
                      onPress={() => {
                        this.setState({
                          isShowImg: true,
                          showImgUrl: [
                            {
                              url: getPicFullUrl(v.url),
                            },
                          ],
                        })
                      }}>
                      <Image
                        style={style.pic}
                        source={v.url ? { uri: getPicFullUrl(v.url) } : gImg.common.defaultPic}
                      />
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
            <View style={[style.item, global.flex, global.alignItemsCenter]}>
              <Text style={style.title}>上传时间</Text>
              <Text style={style.input}>{ctime}</Text>
            </View>
          </View>
        </ScrollView>
        <View style={isShowImg ? style.showMode : global.hidden}>
          <View style={style.close}>
            <Icon
              onPress={() => {
                this.setState({
                  showImgUrl: [
                    {
                      url: BASE_URL + "/static/media/collapsed_logo.db8ef9b3.png",
                    },
                  ],
                  isShowImg: false,
                })
              }}
              style={style.closeIcon}
              name="close"
            />
          </View>
          <View style={style.showImgPar}>
            <ImageViewer
              saveToLocalByLongPress={false}
              imageUrls={showImgUrl}
              index={0}
              maxOverflow={0}
              onCancel={() => {}}
            />
          </View>
        </View>
      </>
    )
  }
}
