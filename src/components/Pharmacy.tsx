import global from '@/assets/styles/global'
import { PrescriptionDrugCategory } from '@/pages/advisory/SquareRoot'
import hospital from '@/services/hospital'
import { TYPE } from '@/utils/constant'
import { getPicCdnUrl } from '@/utils/utils'
import { windowWidth } from '@/services/api'
import pathMap from '@/routes/pathMap'
import { Icon, Picker, Modal} from '@ant-design/react-native'
import sColor from '@styles/color'
import gImg from '@utils/img'
import React, { Component } from 'react'
import { PixelRatio, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Picture } from '@/pages/advisory/Chat'
// import value from '*.png'
export interface CategoryItem {
  id: number
  name: string
}
interface picker {
  value: number
  label: string
}
interface Props {
  navigation: StackNavigationProp<any>
  categoryList: CategoryItem[]
  activeId: number
  isInSession?: boolean
  prescriptionDrugCategoryList: PrescriptionDrugCategory[]
  chooseCategory: (id: number) => void
  closeChooseCategory: () => void
  pharmacyChange: (data:{
    id: number
    name: string
  }) => void
}
interface categoryMapList extends Record<string, string> {}
interface State {
  drugType: number
  drugstoreDeteils: boolean
  visible: boolean
  stateList: StateDetail[]
  stateIndex: number
  storeList: StoreDetail[]
  categoryList: picker[]
  categoryMapList: categoryMapList
}
export interface StateDetail {
  id: number
  name: string
}
export interface StoreDetail {
  id: number
  name: string
  pic: Picture
  introduce: string
}
export default class Pharmacy extends Component<Props, State> {
  static defaultProps = {
    isInSession: false,
  }
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return {
      drugType: 0,
      drugstoreDeteils:false,
      visible: false,
      stateList:[],
      stateIndex: 0,
      storeList: [],
      categoryList: [],
      categoryMapList: {}
    }
  }
  componentDidMount() {
    let categoryList: picker[] = [],
    categoryMapList: categoryMapList = {};
    for (let v of this.props.categoryList) {
      categoryList.push({
        value: v.id,
        label: v.name,
      })
      categoryMapList[v.id] = v.name
    }
    this.setState({
      categoryList,
      drugType: this.props.categoryList.length === 0 ? 0 : this.props.categoryList[0].id,
      categoryMapList
    },this.init)
  }
  init = async () => {
    let {drugType,categoryList} = this.state;
    let {
      data: { list: stateList },
    } = await hospital.getDrugStateList({
      page: -1,
      limit: -1,
      filter: {
        categoryId: {
          condition: TYPE.eq,
          val: drugType,
        },
      },
    })
    this.setState({
      stateList
    },this.store)
  }
  store = async () => {
    let {stateList,stateIndex} = this.state;
    if(stateList.length === 0){
      this.setState({
        storeList: []
      })
      return;
    }
    let {
      data: { list: storeList },
    } = await hospital.getDrugStoreList({
      page: -1,
      limit: -1,
      filter: {
        stateId: {
          condition: TYPE.eq,
          val: stateList[stateIndex].id,
        }
      },
    })
    this.setState({
      storeList
    })
  }
  render() {
    const {
      categoryList,
      drugType,
      categoryMapList,
      drugstoreDeteils,
      visible,
      stateList,
      storeList,
      stateIndex,
    } = this.state
    return (
      <View style={styles.main}>
        <TouchableOpacity onPress={this.props.closeChooseCategory}>
          <Icon style={styles.close} name='close' />
        </TouchableOpacity>
        <View style={[styles.theme, global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween ]}>
          <Text style={ global.fontSize14}>请选择药品分类</Text>
          <Picker
            data={categoryList}
            cols={1}
            value={[drugType]}
            onChange={val => {
              this.setState({
                drugType: val ? (val[0] as number) : 0
              })
            }}
          >
            <TouchableOpacity style={[global.flex, global.alignItemsCenter]}>
              <Text>
                {categoryMapList[drugType]}
              </Text>
              <Icon name='right' style={global.fontSize16} />
            </TouchableOpacity>
          </Picker>
        </View>
        <View style={[styles.listBox, global.flex, global.justifyContentSpaceBetween]}>
          <View style={styles.listLeftBox}>
            <ScrollView
              style={styles.listLeft}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.list}>
                <View>
                  {stateList.map((category,index) => {
                      return (
                        <TouchableOpacity
                          key={category.id}
                          style={this.props.activeId === category.id ? styles.item : styles.item}
                          onPress={()=>
                            this.setState({
                              stateIndex: index
                            },this.store)
                          }
                        >
                          <Text style={[styles.title, global.fontSize14, stateIndex === index ? styles.active : null]} key={category.id}>
                            {category.name}
                          </Text>
                        </TouchableOpacity>
                      )
                  })}
                  <View style={styles.item}>
                    <Text style={ global.fontSize14} />
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
          <ScrollView
           style={styles.listRight}
           showsVerticalScrollIndicator={false}
          >
            <View>
              {storeList.map((category) => {
                  return (
                    <View
                      style={styles.itemActive}
                    >
                      <View style={[global.flex, global.alignItemsCenter]}>
                        <TouchableOpacity
                          key={category.id}
                          style={[global.flex, global.alignItemsCenter]}
                          onPress={async () => {
                            const {
                              chooseCategory,
                              navigation,
                              categoryList,
                              prescriptionDrugCategoryList,
                              isInSession,
                            } = this.props
                            await chooseCategory(category.id)
                            await navigation.push(pathMap.DrugSelect, {
                              categoryList,
                              stateId: category.id,
                              stateName: category.name,
                              activeId: drugType,
                              isInSession,
                              // prescriptionDrugCategoryList,
                              prescriptionDrugCategoryList,
                            })
                            await this.props.closeChooseCategory()
                            await this.props.pharmacyChange({
                              id:category.id,
                              name:category.name})
                          }}
                        >
                          <Image style={styles.img} source={
                            category.pic && category.pic.url !== ''
                              ? { uri: getPicCdnUrl(category.pic.url, 'avatar') }
                              : gImg.home.prescribingWeChat
                          } />
                          <Text style={[styles.title, global.fontSize14]} key={category.id}>
                            {category.name}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={()=>
                            this.setState({
                              visible:true
                            })
                          }
                        >
                          <Icon  style={ global.fontSize16} color={sColor.mainRed} name='question-circle'></Icon>
                        </TouchableOpacity>
                      </View>
                      {/* 当需要类似打粉说明时显示 */}
                      {category.introduce != '' && category.introduce != null && 
                        <View>
                          <Text style={[styles.titleTop, global.fontSize10]} key={category.id}>
                          {category.introduce}
                          </Text>
                        </View>
                      }
  
                      {/* 当需要类似代煎时显示 */}
                      {/* { category.boilMedicine &&
                        <View style={styles.boilMedicine}>
                          { category.deficiencyDrug ? 
                            <Text style={[styles.deficiency, global.fontSize10]} key={category.id}>
                              缺少药材
                            </Text>: <Text style={[styles.title, global.fontSize10]} key={category.id}>
                              单剂量
                          </Text>
                          }
                        </View>
                      } */}
                    </View>
                  )
              })}
              <View style={styles.item}>
                <Text style={global.fontSize14} />
              </View>
            </View>
          </ScrollView>
        </View>
        <Modal
          popup
          visible={this.state.visible}
          animationType="slide-up"
          onClose={()=>this.setState({visible:false})}
          style={styles.model}
          maskClosable={true}
        >
          <View style={[styles.theme, global.flex, global.alignItemsCenter, global.justifyContentSpaceBetween ]}>
          <Text></Text>
            <Text style={ global.fontSize14}>药房</Text>
            <TouchableOpacity
             onPress={()=>this.setState({visible:false})}
            >
              <Icon style={ global.fontSize16} color={sColor.color999} name='close'></Icon>
            </TouchableOpacity>
          </View>
          <ScrollView 
          style={styles.pharmacyDetailsBox}
          >
            <View style={{ paddingVertical: 20, paddingHorizontal: 20 }}>
              <Image style={styles.image} source={gImg.home.prescribingWeChat} />
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>123</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>Content...</Text>
              <Text style={{ textAlign: 'center' }}>123</Text>
            </View>
          </ScrollView>
        </Modal>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  close: {
    marginTop: 100,
    color: sColor.white,
    fontSize: 22,
    paddingLeft: 15,
    paddingBottom: 15,
  },
  model: {
    flex: 1,
  },
  bgc: {
    backgroundColor: sColor.mainRed
  },
  image: {
    // height: 300,
    width:320, 
  },
  img: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  pharmacyDetailsBox: {
    height: 500,
  },
  boilMedicine: {
    marginTop: 10,
  },
  listBox: {
    flex: 1,
    backgroundColor: sColor.mainBgColor,
    paddingBottom: 20,
  },
  listLeftBox: {
    // height: 500
    backgroundColor: sColor.white,
  },
  active: {
    color:sColor.mainRed
  },
  list: {
    backgroundColor: sColor.white,
    paddingBottom: 10,
  },
  theme: {
    height: 50,
    lineHeight: 50,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: 'center',
    color: sColor.color333,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorDdd,
    backgroundColor: sColor.white,
  },
  listLeft: {
    flex: 1,
  },
  listRight: {
    width: windowWidth - 200,
    marginLeft: 10,
    marginTop: 10,
    marginRight: 10,
  },
  item: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    // borderBottomWidth: 1 / PixelRatio.get(),
    // borderBottomColor: sColor.colorEee,
    backgroundColor: sColor.white,
  },
  
  itemActive: {
    backgroundColor: sColor.white,
    marginBottom: 10,
    borderRadius:5,
    padding: 10,
  },
  deficiency: {
    color:sColor.mainRed,
    marginLeft: 5,
    marginRight: 5,
  },
  titleTop: {
    margin: 5,
    color: sColor.color666,
  },
  title: {
    marginLeft: 5,
    marginRight: 5,
    color: sColor.color666,
  },
  listRightItem: {
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: sColor.colorEee,
  },
  listRightTitle: {
    color: sColor.color666,
    height: 50,
    lineHeight: 50,
    paddingLeft: 15,
    backgroundColor: sColor.colorEee,
  },
})
