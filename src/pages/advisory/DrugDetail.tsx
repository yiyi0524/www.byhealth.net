import { Toast } from '@ant-design/react-native'
import drugApi, { Drug, TYPE } from '@api/drug'
import sColor from '@styles/color'
import gImg from '@utils/img'
import gStyle from '@utils/style'
import React, { Component } from 'react'
import { Image, PixelRatio, RefreshControl, ScrollView, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { StackNavigationProp } from '@react-navigation/stack'
import { getPicFullUrl } from '@/utils/utils'
const style = gStyle.advisory.DrugDetail
const global = gStyle.global
interface Props {
  navigation: StackNavigationProp<any>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  detail: Drug
}

export default class DrugDetail extends Component<Props, State> {
  static navigationOptions = ({ navigation }: { navigation: StackNavigationProp<any> }) => ({
    title: navigation.getParam('name') || '药品详情',
    headerStyle: {
      backgroundColor: sColor.white,
      height: 50,
      elevation: 0,
      color: sColor.mainBlack,
      borderBottomWidth: 1 / PixelRatio.get(),
      borderBottomColor: sColor.colorEee,
    },
    headerTintColor: sColor.color333,
    headerTitleStyle: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      textAlign: 'center',
    },
    headerRight: <TouchableOpacity />,
  })
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      refreshing: false,
      detail: {
        category: { id: 0, name: '' },
        description: '',
        id: 0,
        isChinesePatentDrug: false,
        manufacturer: '',
        name: '',
        notes: '',
        picture: {
          id: 0,
          title: '',
          url: '',
        },
        price: 0,
        signature: '',
        standard: '',
        taboo: '',
        type: 0,
        unit: '',
        drugInteraction: '',
        untowardEffect: '',
      },
    }
  }
  init = async () => {
    let id = this.props.navigation.getParam('id')
    try {
      let {
        data: { detail },
      } = await drugApi.getDetail({ id })
      this.setState({
        hasLoad: true,
        detail: {
          id: detail.id,
          category: detail.category,
          description: detail.description,
          isChinesePatentDrug: false,
          manufacturer: detail.manufacturer,
          name: detail.name,
          notes: detail.notes,
          picture: detail.picture,
          price: detail.price,
          signature: detail.signature,
          standard: detail.standard,
          taboo: detail.taboo,
          type: detail.type,
          unit: detail.unit,
          drugInteraction: detail.drugInteraction,
          untowardEffect: detail.untowardEffect,
        },
      })
    } catch (err) {
      console.log(err)
    }
  }
  componentDidMount() {
    this.init()
  }
  onRefresh = () => {
    this.setState({ refreshing: true })
    Promise.all([this.init(), new Promise(s => setTimeout(s, 500))])
      .then(_ => {
        this.setState({ refreshing: false })
      })
      .catch(err => {
        Toast.fail('刷新失败,错误信息: ' + err.msg)
      })
  }

  // eslint-disable-next-line complexity
  render() {
    if (!this.state.hasLoad) {
      return (
        <View style={style.loading}>
          <View style={style.loadingPic}>
            <Image style={style.loadingImg} source={gImg.common.loading} />
          </View>
        </View>
      )
    }
    let { detail } = this.state
    return (
      <ScrollView
        style={style.main}
        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
      >
        <View style={style.content}>
          {/* 中药 */}
          <View style={detail.type === TYPE.chinese && !detail.isChinesePatentDrug ? style.drug : global.hidden}>
            <View style={style.themePar}>
              <Text style={style.theme}>中药</Text>
            </View>
            <View style={style.item}>
              <Text style={style.title}>药品分类</Text>
              <View style={style.detailPar}>
                <Text style={style.detail}>{detail.category.name}</Text>
              </View>
            </View>
            <View style={style.item}>
              <Text style={style.title}>药品名称</Text>
              <View style={style.detailPar}>
                <Text style={style.detail}>{detail.name}</Text>
              </View>
            </View>
            <View style={style.item}>
              <View style={style.detailPar}>
                <Text style={style.detail}>
                  药品价格: {(detail.price / 1000).toFixed(3)}元/{detail.unit}
                </Text>
              </View>
            </View>
            <View style={style.item}>
              <Text style={style.title}>药品图片</Text>
              <View style={style.detailPar}>
                <Text style={!detail.picture ? style.detail : global.hidden}>无</Text>
                <Image
                  style={detail.picture ? style.img : global.hidden}
                  source={
                    detail.picture && detail.picture.url
                      ? { uri: getPicFullUrl(detail.picture.url) }
                      : gImg.common.defaultPic
                  }
                />
              </View>
            </View>
          </View>
          {/* 西药 */}
          <View style={detail.type === TYPE.western || detail.isChinesePatentDrug ? style.drug : global.hidden}>
            <View style={style.themePar}>
              <Text style={style.theme}>
                {detail.type === TYPE.western ? '西药' : detail.isChinesePatentDrug ? '中成药' : ''}
              </Text>
            </View>
            <View style={style.item}>
              <Text style={style.title}>药品分类</Text>
              <View style={style.detailPar}>
                <Text style={style.detail}>{detail.category.name}</Text>
              </View>
            </View>
            <View style={style.item}>
              <Text style={style.title}>药品名称</Text>
              <View style={style.detailPar}>
                <Text style={style.detail}>{detail.name}</Text>
              </View>
            </View>
            <View style={style.item}>
              <View style={style.detailPar}>
                <Text style={style.detail}>药品价格: {(detail.price / 1000).toFixed(3)}元</Text>
              </View>
            </View>
            <View style={style.item}>
              <Text style={style.title}>药品图片</Text>
              <View style={style.detailPar}>
                {detail.picture ? (
                  <Image
                    style={style.img}
                    source={
                      detail.picture && detail.picture.url
                        ? { uri: getPicFullUrl(detail.picture.url) }
                        : gImg.common.defaultPic
                    }
                  />
                ) : (
                  <Text style={style.detail}>无</Text>
                )}
              </View>
            </View>
            <View style={style.item}>
              <Text style={style.title}>描述</Text>
              <View style={style.detailPar}>
                <Text style={style.detail}>{detail.description || '无'}</Text>
              </View>
            </View>
            <View style={style.item}>
              <Text style={style.title}>规格</Text>
              <View style={style.detailPar}>
                <Text style={style.detail}>{detail.standard || '无'}</Text>
              </View>
            </View>
            <View style={style.item}>
              <Text style={style.title}>厂商</Text>
              <View style={style.detailPar}>
                <Text style={style.detail}>{detail.manufacturer || '无'}</Text>
              </View>
            </View>
            <View style={style.item}>
              <Text style={style.title}>用法用量</Text>
              <View style={style.detailPar}>
                <Text style={style.detail}>{detail.signature || '无'}</Text>
              </View>
            </View>
            <View style={style.item}>
              <Text style={style.title}>不良反应</Text>
              <View style={style.detailPar}>
                <Text style={style.detail}>{detail.untowardEffect || '无'}</Text>
              </View>
            </View>
            <View style={style.item}>
              <Text style={style.title}>禁忌</Text>
              <View style={style.detailPar}>
                <Text style={style.detail}>{detail.taboo || '无'}</Text>
              </View>
            </View>
            <View style={style.item}>
              <Text style={style.title}>注意事项</Text>
              <View style={style.detailPar}>
                <Text style={style.detail}>{detail.notes || '无'}</Text>
              </View>
            </View>
            <View style={style.item}>
              <Text style={style.title}>药物相互作用</Text>
              <View style={style.detailPar}>
                <Text style={style.detail}>{detail.drugInteraction || '无'}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }
}
