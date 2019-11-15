import global from "@/assets/styles/global"
import pathMap from "@/routes/pathMap"
import { Article, ArticleType, listArticle } from "@/services/groupChat"
import { TYPE } from "@/utils/constant"
import { Icon, InputItem, Modal } from "@ant-design/react-native"
import gSass from "@utils/style"
import React, { Component } from "react"
import { FlatList, Text, TouchableOpacity, View } from "react-native"
import { NavigationScreenProp } from "react-navigation"
const style = gSass.groupChat.articleList
interface Props {
  navigation: NavigationScreenProp<State>
}
interface State {
  page: number
  limit: number
  count: number
  type: number
  search: string
  filter: Record<string, any>
  list: Article[]
}
type DefaultProps = {}

export default class ArticleList extends Component<Props & DefaultProps, State> {
  static defaultProps: DefaultProps
  static navigationOptions = () => {
    return {
      title: "文章列表",
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
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      page: -1,
      limit: -1,
      count: 0,
      type: ArticleType.all,
      search: "",
      filter: {
        type: {
          condition: TYPE.eq,
          val: ArticleType.all,
        },
        search: {
          condition: TYPE.eqString,
          val: "",
        },
      },
      list: [],
    }
  }
  sendArticle = (id: number) => {
    console.log("发送文章id" + id)
  }
  renderItem = (val: any) => {
    let item = val.item
    return (
      <TouchableOpacity
        style={style.item}
        key={item.id + val.index}
        onPress={() => {
          Modal.operation([
            {
              text: "发送",
              onPress: () => this.sendArticle(item.id),
            },
            {
              text: "查看",
              onPress: () => {
                this.props.navigation.push(pathMap.ArticleDetail, { id: item.id })
              },
            },
          ])
        }}>
        <View style={[style.titlePar, global.flex, global.aCenter]}>
          <Text style={style.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Icon style={style.icon} name="right" />
        </View>
        <Text style={style.desc} numberOfLines={1}>
          {item.content}
        </Text>
        <Text style={style.time}>{item.ctime && item.ctime.substr(0, 16)}</Text>
      </TouchableOpacity>
    )
  }
  componentDidMount() {
    this.init()
  }
  init = async () => {
    try {
      this.listArticle(-1)
    } catch (err) {
      console.log(err)
    }
  }
  changeType = (type: number) => {
    let { filter } = this.state
    filter.type = {
      condition: TYPE.eq,
      val: type,
    }
    this.setState(
      {
        type,
        filter,
      },
      () => this.listArticle(-1),
    )
  }
  listArticle = async (page: number) => {
    try {
      let { limit, filter, list } = this.state
      let {
        data: { list: newList },
      } = await listArticle({ page, limit, filter })
      if (page > 1) {
        list.push(...newList)
      } else {
        list = newList
      }
      this.setState({
        list,
        page,
      })
    } catch (err) {
      console.log(err)
    }
  }
  ListHeaderComponent = () => {
    let { search, type } = this.state
    let isPersonal = type === ArticleType.personal
    return (
      <View>
        <View style={style.search}>
          <InputItem
            style={style.input}
            placeholder="请输入文章名称"
            value={search}
            last
            clear
            labelNumber={2}
            onChange={search => {
              let { filter } = this.state
              filter.search = {
                condition: TYPE.eqString,
                val: search,
              }
              this.setState(
                {
                  search,
                  filter,
                },
                () => this.listArticle(1),
              )
            }}>
            <Icon style={style.searchIcon} name="search" />
          </InputItem>
        </View>
        <View style={[style.theme, global.flex, global.aCenter]}>
          <TouchableOpacity onPress={() => this.changeType(ArticleType.all)}>
            <View style={[style.themeTitlePar, global.flex, global.aCenter]}>
              <View style={[style.themeIcon, !isPersonal ? style.themeIconActive : null]}></View>
              <Text style={[style.themeTitle, !isPersonal ? style.themeTitleActive : null]}>
                学术文章
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.changeType(ArticleType.personal)}>
            <View style={[style.themeTitlePar, global.flex, global.aCenter]}>
              <View style={[style.themeIcon, isPersonal ? style.themeIconActive : null]}></View>
              <Text style={[style.themeTitle, isPersonal ? style.themeTitleActive : null]}>
                我的发布
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  render() {
    let { list } = this.state
    return (
      <View style={style.main}>
        <FlatList
          style={style.list}
          data={list}
          extraData={this.state}
          keyExtractor={item => item.id + "list"}
          renderItem={this.renderItem}
          ListHeaderComponent={this.ListHeaderComponent}
          onEndReachedThreshold={0.1}
          onEndReached={() => {}}
        />
      </View>
    )
  }
}
