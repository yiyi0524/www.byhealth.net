import global from '@/assets/styles/global'
import { AppState } from '@/redux/stores/store'
import { AllScreenParam } from '@/routes/bottomNav'
import { Article, getArticle } from '@/services/groupChat'
import { getPicFullUrl } from '@/utils/utils'
import { Carousel } from '@ant-design/react-native'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import gSass from '@utils/style'
import React, { Component } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux'
const style = gSass.groupChat.articleDetail

interface Props {
  navigation: StackNavigationProp<AllScreenParam, 'ArticleDetail'>
  route: RouteProp<AllScreenParam, 'ArticleDetail'>
}
interface State {
  isPersonalArticle: boolean
  id: number
  step: number
  detail: Article
}
type DefaultProps = {} & ReturnType<typeof mapStateToProps>
const mapStateToProps = (state: AppState) => {
  return {
    isLogin: state.user.isLogin,
    name: state.user.name,
    uid: state.user.uid,
  }
}
//@ts-ignore
@connect(mapStateToProps)
export default class ArticleDetail extends Component<Props & DefaultProps, State> {
  static defaultProps: DefaultProps
  constructor(props: any) {
    super(props)
    this.state = this.getInitState(props)
  }
  getInitState = (props: Props): State => {
    const { id } = props.route.params
    return {
      id,
      isPersonalArticle: false,
      step: 0,
      detail: {
        id: 0,
        title: '',
        author: {
          uid: 0,
          name: '',
          phone: '',
        },
        content: '',
        picList: [],
        viewCount: 0,
        ctime: '',
      },
    }
  }
  componentDidMount() {
    this.init()
  }
  init = async () => {
    try {
      let { id } = this.state
      let detailTask = getArticle({ id })
      let {
        data: { detail },
      } = await detailTask
      const { uid } = this.props
      this.setState({
        detail,
      })
      let isPersonalArticle = uid === detail.author.uid
      console.log('1: ', detail, uid)
      this.props.navigation.setParams({
        isPersonalArticle,
      })
    } catch (err) {
      console.log(err)
    }
  }
  render() {
    let { detail, step } = this.state
    if (detail.id === 0) {
      return <Text style={style.tips}>此文章已被移除或不存在</Text>
    }
    console.log(detail)
    return (
      <ScrollView style={style.main}>
        <Carousel
          style={style.slider}
          selectedIndex={step}
          autoplay
          infinite
          dots={false}
          afterChange={editStep => {
            this.setState({
              step: editStep,
            })
          }}
        >
          {detail.picList.map(v => {
            return (
              <View style={style.item} key={v.id}>
                <Image style={style.img} source={{ uri: getPicFullUrl(v.url) }} />
              </View>
            )
          })}
        </Carousel>
        <View style={style.dotPar}>
          <Text style={style.dot}>
            {step + 1}/{detail.picList.length}
          </Text>
        </View>
        <View style={style.article}>
          <Text style={style.title}>{detail.title}</Text>
          <Text style={style.content}>{detail.content}</Text>
          <View style={[style.time, global.flex, global.aCenter, global.jBetween]}>
            <Text style={style.viewCount}>阅读{detail.viewCount}</Text>
            <Text style={style.viewCount}>
              {detail.author.name} 发表于{detail.ctime.substr(0, 16)}
            </Text>
          </View>
        </View>
      </ScrollView>
    )
  }
}
