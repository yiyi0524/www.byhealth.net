import { AllScreenParam } from '@/routes/bottomNav'
import { InputItem, Toast } from '@ant-design/react-native'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import gImg from '@utils/img'
import gStyle from '@utils/style'
import React, { Component } from 'react'
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { addAssistant, editAssistant } from '@/services/user'
const style = gStyle.personalCenter.addAssistant

interface Props {
  navigation: StackNavigationProp<AllScreenParam, 'AddOrEditAssistant'>
  route: RouteProp<AllScreenParam, 'AddOrEditAssistant'>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  id: number
  type: string
  name: string
  account: string
  pwd: string
}
type DefaultProps = {}

export default class AddAssistant extends Component<Props & DefaultProps, State> {
  static defaultProps: DefaultProps
  constructor(props: any) {
    super(props)
    this.state = this.getInitState(props)
  }
  getInitState = (props: Props): State => {
    const { id, type } = props.route.params
    return {
      hasLoad: true,
      refreshing: false,
      id,
      type,
      name: '',
      account: '',
      pwd: '',
    }
  }
  componentDidMount() {
    this.init()
  }
  init = async () => {}
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
    return (
      <ScrollView
        style={style.main}
        keyboardShouldPersistTaps='always'
        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
      >
        <View style={style.list}>
          <View style={style.item}>
            <InputItem
              clear
              value={this.state.name}
              placeholder='名称'
              type='text'
              style={style.input}
              onChange={name => {
                this.setState({
                  name,
                })
              }}
            />
          </View>
          <View style={style.item}>
            <InputItem
              clear
              value={this.state.account}
              placeholder='账号'
              type='text'
              style={style.input}
              onChange={account => {
                this.setState({
                  account,
                })
              }}
            />
          </View>
          <View style={style.item}>
            <InputItem
              clear
              value={this.state.pwd}
              placeholder='密码'
              type='password'
              style={style.input}
              onChange={pwd => {
                this.setState({
                  pwd,
                })
              }}
            />
          </View>
          <TouchableOpacity onPress={this.submit}>
            <Text style={style.btn}>{this.state.type === 'add' ? '添加' : '编辑'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }

  //发布
  submit = () => {
    let { name, account, pwd, type, id } = this.state
    try {
      if (name === '') {
        return Toast.info('请填写名称', 1)
      }
      if (account === '') {
        return Toast.info('请填写账号', 1)
      }
      if (pwd === '') {
        return Toast.info('请填写密码', 1)
      }
      let data = {
        id,
        name,
        account,
        pwd,
      }
      if (type === 'add') {
        addAssistant(data)
          .then(() => {
            Toast.success('添加成功', 1, async () => {
              this.props.navigation.goBack()
            })
          })
          .catch(err => {
            console.log(err)
            Toast.fail('添加失败, 错误信息: ' + err.msg, 3)
          })
      } else {
        editAssistant(data)
          .then(() => {
            Toast.success('编辑成功', 1, async () => {
              this.props.navigation.goBack()
            })
          })
          .catch(err => {
            console.log(err)
            Toast.fail('编辑失败, 错误信息: ' + err.msg, 3)
          })
      }
    } catch (e) {
      console.log(e)
    }
    //   } else {
    //     editArticle(data)
    //       .then(() => {
    //         Toast.success('编辑成功', 1)
    //       })
    //       .catch(err => {
    //         console.log(err)
    //         Toast.fail('发布错误, 错误信息: ' + err.msg, 3)
    //       })
    //   }
    // } catch (err) {
    //   console.log(err)
    // }
  }
}
