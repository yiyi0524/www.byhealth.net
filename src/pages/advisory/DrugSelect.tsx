import global from '@/assets/styles/global'
import { AllScreenParam } from '@/routes/bottomNav'
import pathMap from '@/routes/pathMap'
import { listPopularDrug } from '@/services/drug'
import hospital from '@/services/hospital'
import { TYPE } from '@/utils/constant'
import { TYPE as DrugType } from '@api/drug'
import { Icon, InputItem, Toast, Modal } from '@ant-design/react-native'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import gImg from '@utils/img'
import gStyle from '@utils/style'
import React, { Component } from 'react'
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native'
import { Drug, PrescriptionDrugCategory } from './SquareRoot'
const style = gStyle.advisory.DrugSelect
export interface CategoryItem {
  id: number
  name: string
}
interface Props {
  navigation: StackNavigationProp<any>
  route: RouteProp<AllScreenParam, 'DrugSelect'>
}
interface State {
  hasLoad: boolean
  refreshing: boolean
  currDrugId: number
  page: number
  limit: number
  chatKey: string
  filter: {}
  // 当前已经选择的药品信息
  prescriptionDrugCategoryList: PrescriptionDrugCategory[]
  // 与搜索匹配的药品列表
  matchDrugList: Drug[]
  //常用药
  popularDrugList: Drug[]
  search: string
  isAddDrug: boolean
  activeDrug: Drug
  chinese: boolean
  activeValue: number
  getBlur: boolean
  blurPage: number
  fryFirst: string
  backDown: string
}
export default class DrugSelect extends Component<Props, State> {
  refs: any
  myScroll = React.createRef<ScrollView>()
  constructor(props: any) {
    super(props)
    this.state = this.getInitState(props)
  }
  getInitState = (props: Props): State => {
    let prescriptionDrugCategoryList: PrescriptionDrugCategory[] = []
    if (props.route.params.prescriptionDrugCategoryList) {
      prescriptionDrugCategoryList = props.route.params.prescriptionDrugCategoryList
    }
    return {
      hasLoad: false,
      refreshing: false,
      chatKey: '',
      currDrugId: 0,
      page: -1,
      limit: -1,
      filter: {},
      search: '',
      prescriptionDrugCategoryList,
      matchDrugList: [],
      popularDrugList: [],
      isAddDrug: false,
      activeDrug: {
        id: 0,
        name: '',
        unit: '',
        price: 0,
        standard: '',
        manufacturer: '',
        signature: '',
        ctime: '',
      },
      chinese: false,
      // activeName: '药品名',
      // activeId: -1,
      activeValue: 0,
      getBlur: false,
      blurPage: 1,
      fryFirst: '',
      backDown: '',
    }
  }
  async componentDidMount() {
    this.init()
    this.props.navigation.setParams({
      prescriptionDrugCategoryList: this.state.prescriptionDrugCategoryList,
    })
    setTimeout(() => {
      this.myScroll.current && this.myScroll.current.scrollToEnd(), 100
    })
  }
  init = async () => {

    let activeId = this.props.route.params.activeId,

      filter: any = {
        category: {
          condition: TYPE.eq,
          val: activeId,
        },
      }
    if (this.props.route.params.storeId) {
      filter.stateId = {
        condition: TYPE.eq,
        val: this.props.route.params.storeId,
      }
    }
    try {
      let {
        data: { list: popularDrugList },
      } = await listPopularDrug({
        page: 1,
        limit: 30,
        filter,
      })
      this.setState({
        popularDrugList,
        hasLoad: true,
      })
    } catch (err) {
      console.log(err)
    }
  }

  getDrugList = async (page: number, limit: number, filter = {}) => {
    try {
      let {
        data: { list: drugList },
      } = await hospital.getDrugList({
        page,
        limit,
        filter,
      })
      return drugList
    } catch (err) {
      console.log(err)
    }
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
  search = async (val: string) => {
    this.setState({
      search: val,
    })
    // if (!val) {
    //   return
    // }
    let blurPage = this.state.blurPage
    if (val !== this.state.search) {
      blurPage = 1
    }
    try {
      let filter: any = {
        name: {
          condition: TYPE.like,
          val,
        },
        category: {
          condition: TYPE.eq,
          val: this.props.route.params.activeId,
        },
      }
      if (this.props.route.params.storeId) {
        filter.stateId = {
          condition: TYPE.eq,
          val: this.props.route.params.storeId,
        }
      }
      let matchDrugList = await this.getDrugList(blurPage, 20, filter)
      this.setState({
        matchDrugList,
        blurPage: blurPage++,
      })
    } catch (err) {
      console.log(err)
    }
  }
  loadingData = () => {
    // this.search(this.state.blurPage)
    // 这里是下拉加载
    console.log('这里是下拉加载')
  }
  // 选择数组:
  renderItem = (val: any) => {
    let drug = val.item
    return (
      <TouchableOpacity
        // key={k}
        onPress={() => {
          if (drug.type === DrugType.chinese) {
            this.setState({
              isAddDrug: true,
              activeDrug: drug,
            })
          } else {
            let { prescriptionDrugCategoryList } = this.state
            let currCategoryId = this.props.route.params.activeId
            try {
              let hasCategory = false
              for (let category of prescriptionDrugCategoryList) {
                if (category.id === currCategoryId) {
                  hasCategory = true
                  for (let drugInfo of category.drugList) {
                    if (drugInfo.id === drug.id) {
                      drugInfo.count++
                      throw new Error('当前药品已存在,数量加1,中断')
                    }
                  }
                }
              }
              if (!hasCategory) {
                prescriptionDrugCategoryList.push({
                  id: currCategoryId,
                  name: this.getCategoryName(currCategoryId),
                  drugList: [
                    {
                      id: drug.id,
                      count: 0,
                      detail: drug,
                    },
                  ],
                })
              } else {
                for (let category of prescriptionDrugCategoryList) {
                  if (category.id === currCategoryId) {
                    category.drugList.push({
                      id: drug.id,
                      count: 0,
                      detail: drug,
                    })
                  }
                }
              }
            } catch (e) {
              console.log(e)
            }
            this.setState({
              prescriptionDrugCategoryList,
              matchDrugList: [],
              search: '',
              currDrugId: drug.id,
            })
          }
        }}
      >
        <View style={style.drugItem}>
          <Text style={[style.drugTitle, global.fontSize14]} numberOfLines={1}>
            {drug.name}
          </Text>
          <View style={[style.drugDetail, global.flex, global.alignItemsCenter]}>
            <Text style={[style.drugDescription, global.fontSize12]}>
              {drug.price / 1000}元/{drug.unit}
            </Text>
            <View style={style.littleSpot} />
            <Text style={[style.drugDescription, global.fontSize12]}>{drug.standard}</Text>
          </View>
          <Text style={[style.drugCompany, global.fontSize12]}>{drug.manufacturer}</Text>
        </View>
      </TouchableOpacity>
    )
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
    const isInSession = this.props.route.params.isInSession
    const drugCategoryId = this.props.route.params.activeId
    return (
      <KeyboardAvoidingView
        enabled={Platform.OS !== 'android'}
        behavior='padding'
        style={{ flex: 1 }}
        keyboardVerticalOffset={70}
      >
        <ScrollView
          // keyboardShouldPersistTaps="always"
          style={style.main}
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
        >
          <View style={[style.header, global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween]}>
            <TouchableOpacity
              disabled={isInSession !== true}
              onPress={() => {
                this.props.navigation.navigate(pathMap.AdvisoryChat)
              }}
            >
              <Text
                style={[style.headerItem, global.fontSize14, isInSession !== true ? style.headerItemDisabled : null]}
              >
                回到对话
              </Text>
            </TouchableOpacity>
            <View style={style.headerLine} />
            <TouchableOpacity
              onPress={() => {
                let prescriptionDrugCategoryList = this.state.prescriptionDrugCategoryList
                prescriptionDrugCategoryList = prescriptionDrugCategoryList.filter(v => v.id !== drugCategoryId)
                this.props.navigation.setParams({
                  prescriptionDrugCategoryList,
                })
                this.setState({
                  prescriptionDrugCategoryList,
                })
              }}
            >
              <Text style={[style.headerItem, global.fontSize14]}>清空处方</Text>
            </TouchableOpacity>
            <View style={style.headerLine} />
            <TouchableOpacity>
              <Text style={[style.headerItem, style.headerItemDisabled, global.fontSize14]}>看问诊单</Text>
            </TouchableOpacity>
          </View>
          <View style={style.list}>
            {/* 当前已经选择的药品信息 */}
            <View style={[this.state.search === '' ? style.drugList : global.hidden]}>

              {this.state.prescriptionDrugCategoryList.map((category, k) => {
                // if (category.id !== drugCategoryId) {
                //   return false
                // }
                return category.drugList.map((drugInfo, k2) => {
                  console.log(drugInfo)
                  setTimeout(() => {
                    if (this.state.currDrugId === drugInfo.id) {
                      try {
                        // eslint-disable-next-line react/no-string-refs
                        this.refs['input' + drugInfo.id].focus()
                      } catch (e) {
                        console.log(e)
                      }
                    }
                  }, 500)
                  // 中药
                  if (!drugInfo.detail.type || drugInfo.detail.type === 0) {
                    return (
                      <TouchableOpacity
                        key={k + '-' + k2}
                        style={[style.item, global.flex, global.justifyContentSpaceBetween, global.alignItemsCenter]}
                        onPress={() => {
                          this.setState({
                            isAddDrug: true,
                            activeValue: drugInfo.count,
                            activeDrug: drugInfo.detail,
                          })
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            let { prescriptionDrugCategoryList } = this.state
                            prescriptionDrugCategoryList[k].drugList = prescriptionDrugCategoryList[k].drugList.filter(
                              currDrugInfo => currDrugInfo.id !== drugInfo.id,
                            )
                            this.setState({
                              prescriptionDrugCategoryList,
                            })
                          }}
                        >

                          <Icon style={[style.itemIcon, global.fontSize22]} name='minus-circle' />
                        </TouchableOpacity>
                        <Text style={style.numberRight}>{k2 + 1}.</Text>
                        <View style={style.itemCenter}>
                          <View
                            style={[
                              global.flex,
                              global.alignItemsCenter,
                              global.justifyContentSpaceBetween,
                            ]}
                          >
                            <View
                              style={global.flex}
                            >
                              <TouchableOpacity
                                onPress={() => {
                                  this.props.navigation.push(pathMap.DrugDetail, {
                                    id: drugInfo.detail.id,
                                    name: drugInfo.detail.name,
                                  })
                                }}
                              >
                              </TouchableOpacity>
                              <Text style={[style.itemCenterTitle, global.fontSize14]} numberOfLines={1}>
                                {drugInfo.detail.name}
                                {drugInfo.type ? '(' + drugInfo.type + ')' : ''}
                              </Text>
                              <View style={[style.itemCenterDetail, global.flex, global.alignItemsCenter]}>
                                <Text style={[style.itemCenterDetailTitle, global.fontSize14]}>
                                  {drugInfo.detail.price / 1000}元/{drugInfo.detail.unit}
                                </Text>
                                <View style={style.littleSpot} />
                                <Text style={[style.itemCenterDetailTitle, global.fontSize14]}>
                                  {drugInfo.detail.standard}
                                </Text>
                                {this.state.popularDrugList.length !== 0 &&
                                  this.state.popularDrugList.every(item => {
                                    return item.id !== drugInfo.detail.id
                                  })
                                  ?
                                  <Text style={[style.deficiency, global.fontSize14]}>
                                    (缺)
                                      </Text>
                                  : null
                                }
                              </View>
                            </View  >
                            <TouchableOpacity>
                              <Text
                                style={style.itemNumber}
                              >
                                {drugInfo.count} {drugInfo.detail.unit}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )
                  }
                  // 西药
                  else {
                    return (
                      <View
                        key={k + '-' + k2}
                        style={[style.itemWest, global.flex, global.justifyContentSpaceBetween, global.alignItemsCenter]}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            let { prescriptionDrugCategoryList } = this.state
                            prescriptionDrugCategoryList[k].drugList = prescriptionDrugCategoryList[k].drugList.filter(
                              currDrugInfo => currDrugInfo.id !== drugInfo.id,
                            )
                            this.setState({
                              prescriptionDrugCategoryList,
                            })
                          }}
                        >
                          <Icon style={[style.itemIcon, global.fontSize22]} name='minus-circle' />
                        </TouchableOpacity>
                        <View style={style.itemCenter}>
                          <View
                            style={[
                              style.itemCenterTitleFa,
                              global.flex,
                              global.alignItemsCenter,
                              global.justifyContentSpaceBetween,
                            ]}
                          >
                            <TouchableOpacity
                              style={style.itemCenterTitlePar}
                              onPress={() => {
                                this.props.navigation.push(pathMap.DrugDetail, {
                                  id: drugInfo.detail.id,
                                  name: drugInfo.detail.name,
                                })
                              }}
                            >
                              <Text style={[style.itemCenterTitle, global.fontSize14, style.itemNumber]} numberOfLines={1}>
                                {drugInfo.detail.name}
                                {drugInfo.type ? '(' + drugInfo.type + ')' : ''}
                              </Text>
                            </TouchableOpacity>
                            <View
                              style={[
                                style.setCount,
                                global.flex,
                                global.alignItemsCenter,
                                global.justifyContentSpaceBetween,
                              ]}
                            >
                              <TouchableOpacity
                                onPress={() => {
                                  let { prescriptionDrugCategoryList } = this.state
                                  if (prescriptionDrugCategoryList[k].drugList[k2].count > 1) {
                                    prescriptionDrugCategoryList[k].drugList[k2].count--
                                  }
                                  this.setState({
                                    prescriptionDrugCategoryList,
                                  })
                                }}
                              >
                                <Text style={[style.btn, global.fontSize18]}>-</Text>
                              </TouchableOpacity>
                              <View
                                style={{
                                  width: 60,
                                }}
                              >
                                <InputItem
                                  last
                                  ref={'input' + drugInfo.id}
                                  type='number'
                                  placeholder='0'
                                  style={[style.count, global.fontSize14]}
                                  value={drugInfo.count === 0 ? '' : String(drugInfo.count)}
                                  onChange={val => {
                                    let { prescriptionDrugCategoryList } = this.state
                                    if (val) {
                                      let count = parseInt(val)
                                      if (!isNaN(count)) {
                                        prescriptionDrugCategoryList[k].drugList[k2].count = count === 0 ? 1 : count
                                      }
                                    } else if (val === '') {
                                      prescriptionDrugCategoryList[k].drugList[k2].count = 0
                                    }
                                    this.setState({
                                      prescriptionDrugCategoryList,
                                    })
                                  }}
                                  onBlur={evt => {
                                    this.setState({
                                      currDrugId: 0,
                                    })
                                    let { prescriptionDrugCategoryList } = this.state

                                    if (evt === '') {
                                      prescriptionDrugCategoryList[k].drugList[k2].count = 0
                                    }
                                    this.setState({
                                      prescriptionDrugCategoryList,
                                    })
                                  }}
                                />
                              </View>
                              <TouchableOpacity
                                onPress={() => {
                                  let { prescriptionDrugCategoryList } = this.state
                                  prescriptionDrugCategoryList[k].drugList[k2].count++
                                  this.setState({
                                    prescriptionDrugCategoryList,
                                  })
                                }}
                              >
                                <Text style={[style.btn, global.fontSize18]}>+</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                          <View style={[style.itemCenterDetail, global.flex, global.alignItemsCenter]}>
                            <Text style={[style.itemCenterDetailTitle, global.fontSize12]}>
                              {drugInfo.detail.price / 1000}元/{drugInfo.detail.unit}
                            </Text>
                            <View style={style.littleSpot} />
                            <Text style={[style.itemCenterDetailTitle, global.fontSize12]}>
                              {drugInfo.detail.standard}
                            </Text>
                          </View>
                          <Text style={[style.itemCenterDetailCompany, global.fontSize12]} numberOfLines={1}>
                            {drugInfo.detail.manufacturer}
                          </Text>
                        </View>
                      </View>
                    )
                  }
                })
              })}
            </View>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <View style={style.inputWrap}>
                <InputItem
                  style={style.input}
                  placeholder='请输入药材名称'
                  value={this.state.search}
                  onFocus={() => {
                    this.setState(
                      {
                        getBlur: true,
                      },
                      () => {
                        this.search('')
                      },
                    )
                  }}
                  onChange={this.search}
                />
              </View>
              <TouchableOpacity
                style={style.closeList}
                onPress={() => {
                  this.setState({
                    getBlur: false,
                    search: '',
                  })
                }}
              >
                <Text style={style.closeBtn}>x</Text>
              </TouchableOpacity>
            </View>
            <View style={this.state.search === '' ? style.popularDrug : global.hidden}>
              <View style={[style.popularDrugList, global.flex, global.alignItemsCenter, global.wrap]}>
                {this.state.popularDrugList.map((drug, k) => {
                  return (
                    <TouchableOpacity
                      style={style.popularDrugItem}
                      key={k}
                      onPress={() => {
                        if (drug.type === DrugType.chinese) {
                          this.setState({
                            isAddDrug: true,
                            activeDrug: drug,
                            chinese: true,
                          })
                        } else {
                          let { prescriptionDrugCategoryList } = this.state
                          let currCategoryId = this.props.route.params.activeId
                          try {
                            let hasCategory = false
                            for (let category of prescriptionDrugCategoryList) {
                              if (category.id === currCategoryId) {
                                hasCategory = true
                                for (let drugInfo of category.drugList) {
                                  if (drugInfo.id === drug.id) {
                                    drugInfo.count++
                                    throw new Error('当前药品已存在,数量加1,中断')
                                  }
                                }
                              }
                            }
                            if (!hasCategory) {
                              prescriptionDrugCategoryList.push({
                                id: currCategoryId,
                                name: this.getCategoryName(currCategoryId),
                                drugList: [
                                  {
                                    id: drug.id,
                                    count: 0,
                                    detail: drug,
                                  },
                                ],
                              })
                            } else {
                              for (let category of prescriptionDrugCategoryList) {
                                if (category.id === currCategoryId) {
                                  category.drugList.push({
                                    id: drug.id,
                                    count: 0,
                                    detail: drug,
                                  })
                                }
                              }
                            }
                          } catch (e) {
                            console.log(e)
                          }
                          this.setState({
                            prescriptionDrugCategoryList,
                            matchDrugList: [],
                            search: '',
                            currDrugId: drug.id,
                          })
                        }
                      }}
                    >
                      <Text style={style.drugItemTitle}>{drug.name}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
            <View style={this.state.search !== '' ? style.drugList : global.hidden}>
              {/* 当前匹配的药品列表 */}
              <FlatList
                style={[style.drugList]}
                data={this.state.matchDrugList}
                extraData={this.state}
                keyExtractor={item => item.id + 'list'}
                renderItem={this.renderItem}
                onEndReached={_ => this.loadingData()}
                onEndReachedThreshold={0.9}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                    progressViewOffset={40}
                    tintColor={'#ff6600'}
                    title={'拼命加载中...'}
                  />
                }
              />
            </View>
            {/* 添加弹窗 */}
            <Modal
              style={style.modal}
              visible={this.state.isAddDrug}
              maskClosable
              transparent={true}
              closable
              title={'添加药材'}
              footer={[
                {
                  text: '取消',
                  onPress: () => {
                    this.setState({ isAddDrug: false, activeValue: 0, fryFirst: '', })
                  },
                },
                {
                  text: '确定',
                  onPress: () => {
                    let { prescriptionDrugCategoryList } = this.state
                    let currCategoryId = this.props.route.params.activeId
                    try {
                      // 首先确定一下所添加药品是否存在
                      let hasCategory = false
                      for (let category of prescriptionDrugCategoryList) {
                        if (category.id === currCategoryId) {
                          hasCategory = true
                          for (let drugInfo of category.drugList) {
                            if (drugInfo.id === this.state.activeDrug.id) {
                              drugInfo.count = this.state.activeValue
                              drugInfo.type = this.state.fryFirst
                              throw new Error('当前药品已存在,数量加1,中断')
                            }
                          }
                        }
                      }
                      if (!hasCategory) {
                        prescriptionDrugCategoryList.push({
                          id: currCategoryId,
                          name: this.getCategoryName(currCategoryId),
                          drugList: [
                            {
                              id: this.state.activeDrug.id,
                              count: this.state.activeValue,
                              detail: this.state.activeDrug,
                              type: this.state.fryFirst,
                            },
                          ],
                        })
                      } else {
                        for (let category of prescriptionDrugCategoryList) {
                          if (category.id === currCategoryId) {
                            category.drugList.push({
                              id: this.state.activeDrug.id,
                              count: this.state.activeValue,
                              detail: this.state.activeDrug,
                              type: this.state.fryFirst,
                            })
                          }
                        }
                      }
                    } catch (e) {
                      console.log(e)
                    }
                    this.setState({
                      prescriptionDrugCategoryList,
                      matchDrugList: [],
                      search: '',
                      getBlur: false,
                      blurPage: 1,
                      currDrugId: this.state.activeDrug.id,
                      activeValue: 0,
                      fryFirst: '',
                    })
                  },
                },
              ]}
              onClose={() => {
                this.setState({ isAddDrug: false, activeValue: 0, fryFirst: '' })
              }}
            >
              <View style={style.inputDrug}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      activeValue: this.state.activeValue - 1,
                    })
                  }}
                >
                  <Text style={style.addDrugFive}>-1</Text>
                </TouchableOpacity>
                <View style={style.inputWrap}>
                  <InputItem
                    last
                    type='number'
                    defaultValue={this.state.activeValue === 0 ? '0' : String(this.state.activeValue)}
                    style={style.inputNum}
                    // value={this.state.activeValue === 0 ? '0' : String(this.state.activeValue)}
                    onChange={val => {
                      if (val) {
                        let count = parseInt(val)
                        if (!isNaN(count)) {
                          this.setState({
                            activeValue: count,
                          })
                        }
                      } else if (val === '') {
                        this.setState({
                          activeValue: 0,
                        })
                      }
                    }}
                    onBlur={evt => {
                      this.setState({
                        activeValue: 0,
                      })
                    }}
                  />
                </View>
                <Text style={style.addDrugFive}>克</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      activeValue: this.state.activeValue + 5,
                    })
                  }}
                >
                  <Text style={style.addDrugFive}>+5</Text>
                </TouchableOpacity>
              </View>
              <View style={style.chooseList}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      activeValue: 10,
                    })
                  }}
                >
                  <Text style={style.chooseItem}>10g</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      activeValue: 15,
                    })
                  }}
                >
                  <Text style={style.chooseItem}>15g</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      activeValue: 20,
                    })
                  }}
                >
                  <Text style={style.chooseItem}>20g</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      activeValue: 30,
                    })
                  }}
                >
                  <Text style={style.chooseItem}>30g</Text>
                </TouchableOpacity>
              </View>
              <View style={style.chooseList}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      fryFirst: '先煎',
                    })
                  }}
                >
                  <Text style={this.state.fryFirst === '先煎' ? style.activeChooseItem : style.chooseItem}>先煎</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      fryFirst: '后下',
                    })
                  }}
                >
                  <Text style={this.state.fryFirst === '后下' ? style.activeChooseItem : style.chooseItem}>后下</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
  getCategoryName = (id: number): string => {
    for (let v of this.props.route.params.categoryList) {
      if (v.id === id) {
        return v.name
      }
    }
    return ''
  }
}
