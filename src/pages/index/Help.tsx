import { Accordion } from '@ant-design/react-native'
import sColor from '@styles/color'
import gImg from '@utils/img'
import gSass from '@utils/style'
import React, { Component } from 'react'
import { Image, PixelRatio, Text, View } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
const style = gSass.index.Help
interface Item {
  id: number
  question: string
  answer: string
}
interface Props {}
interface State {
  hasLoad: boolean
  activeSections: number[]
  list: Item[]
}

export default class Help extends Component<Props, State> {
  static navigationOptions = () => ({
    title: '帮助',
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
    headerRight: (
      <TouchableOpacity>{/* <Text style={[style.headerRight, global.fontSize14]}>保存</Text> */}</TouchableOpacity>
    ),
  })
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      hasLoad: false,
      activeSections: [0, 0],
      list: [
        {
          id: 1,
          question: '1、如何设置患者不可见?',
          answer:
            '点击 "通讯录" , "选择患者" 并点击该患者 , 点击 "设置不可见" , 弹出弹框询问是否设置不可见, 点击确定, 该患者将不会出现在您的通讯录或咨询列表中;',
        },
        {
          id: 2,
          question: '2、如何设置取消患者不可见?',
          answer:
            '点击 "我的" , 点击 "患者不可见" , 在患者不可见页面中选择患者并点击取消不可见, 该患者将在你的通讯录中显示',
        },
        {
          id: 3,
          question: '3、如何设置在平台搜不到我?',
          answer: '"医馆首页" , 点击 "服务设置" , 点击右侧开关, 开启或关闭在平台搜不到我功能',
        },
        {
          id: 4,
          question: '4、如何邀请患者?',
          answer:
            '"医馆首页" , 点击 "邀请患者" , 把你二维码截图分享给你即将邀请的患者, 用微信扫码就能准确找到您进行复诊',
        },
        {
          id: 5,
          question: '5、如何提现?',
          answer:
            '点击 "我的" , 点击 "账户" ,点击 "去提现" 按钮,输入你要提现的金额, 等待管理员审核, 审核通过后提现金额将在1-14个工作日转账到您的银行卡, 注意查收',
        },
        {
          id: 6,
          question: '6、如何开方?',
          answer:
            '聊天页面中点击辨证开方, 填写辨病 辨证, 点击编辑药材 选择要开方的药品类型,如果内服中药, 搜索药材名 如 金银花 搜索 "金" "金银" 或"银花" 搜索"金花"不能搜索到, 选中药品之后输入数量,如 500 g,每次开方可选中多个药材, 点击右上角完成, 如果开中药方 需要填写中药的 总剂量 每日剂量 每剂分几次使用, 西药或中成药可以编辑用户用量.  医嘱为选填 诊后管理费可编辑. 点击发送给患者 完成开方',
        },
      ],
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
  onChange = (activeSections: number[]) => {
    this.setState({ activeSections })
  }
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
    let { list } = this.state
    return (
      <>
        <ScrollView style={style.main}>
          <View style={style.list}>
            <Accordion onChange={this.onChange} activeSections={this.state.activeSections}>
              {list.map((v, k) => {
                return (
                  <Accordion.Panel style={style.headerTitle} header={v.question} key={k}>
                    <View style={style.item}>
                      <Text style={style.title}>{v.answer}</Text>
                    </View>
                  </Accordion.Panel>
                )
              })}
            </Accordion>
          </View>
        </ScrollView>
      </>
    )
  }
}
