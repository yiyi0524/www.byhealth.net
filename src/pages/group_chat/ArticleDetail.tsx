import global from "@/assets/styles/global"
import { AppState } from "@/redux/stores/store"
import pathMap from "@/routes/pathMap"
import { Article, getArticle } from "@/services/groupChat"
import { getPicFullUrl } from "@/utils/utils"
import { Carousel, Toast } from "@ant-design/react-native"
import gSass from "@utils/style"
import React, { Component } from "react"
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { NavigationScreenProp } from "react-navigation"
import { connect } from "react-redux"
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
            console.log("state: ", navigation.state)
            if (navigation.state.params!.isPersonalArticle) {
              navigation.push(pathMap.AddOrEditArticle, {
                type: "edit",
                id: navigation.state.params!.id,
              })
            } else {
              Toast.info("您不是此文章的作者", 2)
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
        author: {
          uid: 0,
          name: "",
          phone: "",
        },
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
      let {
        data: { detail },
      } = await detailTask
      const { uid } = this.props
      this.setState({
        detail,
      })
      let isPersonalArticle = uid === detail.author.uid
      console.log("1: ", detail, uid)
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
            <Text style={style.viewCount}>
              {detail.author.name} 发表于{detail.ctime.substr(0, 16)}
            </Text>
          </View>
        </View>
      </ScrollView>
    )
  }
}
