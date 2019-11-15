import React, { Component } from "react"
import { ScrollView, TouchableOpacity, View, Image, Text } from "react-native"
import gSass from "@utils/style"
import { Carousel, Toast } from "@ant-design/react-native"
import { Article, getArticle, articleViewCount, checkIsPersonalArticle } from "@/services/groupChat"
import { NavigationScreenProp } from "react-navigation"
import { getPicFullUrl } from "@/utils/utils"
import global from "@/assets/styles/global"
import pathMap from "@/routes/pathMap"
const style = gSass.groupChat.articleDetail

interface NavParams {
  id: number
  isPersonalArticle: boolean
}
interface Props {
  navigation: NavigationScreenProp<State, NavParams>
}
interface State {
  isPersonalArticle: boolean
  id: number
  step: number
  detail: Article
}
type DefaultProps = {}

export default class ArticleDetail extends Component<Props & DefaultProps, State> {
  static defaultProps: DefaultProps
  static navigationOptions = ({
    navigation,
  }: {
    navigation: NavigationScreenProp<State, NavParams>
  }) => {
    return {
      title: "文章详情",
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
        <TouchableOpacity
          onPress={() => {
            if (navigation.state.params!.isPersonalArticle) {
              navigation.push(pathMap.AddOrEditArticle, {
                type: "edit",
                id: navigation.state.params!.id,
              })
            } else {
              Toast.info("你不是此文章的作者", 1)
            }
          }}>
          <Text style={style.rightTitle}>编辑</Text>
        </TouchableOpacity>
      ),
    }
  }
  constructor(props: any) {
    super(props)
    this.state = this.getInitState(props)
  }
  getInitState = (props: Props): State => {
    let id = 0
    if (props.navigation.state.params) {
      id = props.navigation.state.params.id
    }
    return {
      id,
      isPersonalArticle: false,
      step: 0,
      detail: {
        id: 0,
        title: "",
        content: "",
        picList: [],
        viewCount: 0,
        ctime: "",
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
      let checkIsPersonalArticleTask = checkIsPersonalArticle({ id })
      let {
        data: { detail },
      } = await detailTask
      let {
        data: { isPersonalArticle },
      } = await checkIsPersonalArticleTask
      this.setState({
        detail,
        isPersonalArticle,
      })
      this.props.navigation.setParams({
        isPersonalArticle: isPersonalArticle,
      })
    } catch (err) {
      console.log(err)
    }
  }
  render() {
    let { detail, step } = this.state
    return (
      <ScrollView style={style.main}>
        <Carousel
          style={style.slider}
          selectedIndex={step}
          autoplay
          infinite
          dots={false}
          afterChange={step => {
            this.setState({
              step,
            })
          }}>
          {detail.picList.map(v => {
            return (
              <View style={style.item} key={v.id}>
                <Image style={style.img} source={{ uri: getPicFullUrl(v.url) }}></Image>
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
            <Text style={style.viewCount}>发表于{detail.ctime.substr(0, 16)}</Text>
          </View>
        </View>
      </ScrollView>
    )
  }
}
