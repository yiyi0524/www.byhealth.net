import Calendar from '@/components/Calendar'
import AdvisoryChat from '@/pages/advisory/Chat'
import DrugDetail from '@/pages/advisory/DrugDetail'
import DrugSelect from '@/pages/advisory/DrugSelect'
import AdvisoryIndex from '@/pages/advisory/Index'
import SelectPrescriptionTpl from '@/pages/advisory/PrescriptionTplList'
import SquareRoot, { PrescriptionDrugCategory } from '@/pages/advisory/SquareRoot'
import AddOrEditArticle from '@/pages/group_chat/AddOrEditArticle'
import GroupChatApplyList from '@/pages/group_chat/ApplyList'
import ArticleDetail from '@/pages/group_chat/ArticleDetail'
import ArticleList from '@/pages/group_chat/ArticleList'
import AddPrescriptionTpl from '@/pages/index/AddPrescriptionTpl'
import AddSittingHospital from '@/pages/index/AddSittingHospital'
import DiagnosisSettings from '@/pages/index/DiagnosisSettings'
import EditPrescriptionTpl from '@/pages/index/EditPrescriptionTpl'
import EditSittingHospital from '@/pages/index/EditSittingHospital'
import InvitePatients from '@/pages/index/InvitePatients'
import Prescribing from '@/pages/index/Prescribing'
import Prescription from '@/pages/index/Prescription'
import PrescriptionTpl from '@/pages/index/PrescriptionTpl'
import PrescriptionTplList from '@/pages/index/PrescriptionTplList'
import SittingHospital from '@/pages/index/SittingHospital'
import SittingHospitalList from '@/pages/index/SittingHospitalList'
import About from '@/pages/personal_center/About'
import Account from '@/pages/personal_center/Account'
import AddBankCard from '@/pages/personal_center/AddBankCard'
import ChangePwd from '@/pages/personal_center/ChangePwd'
import CustomerService from '@/pages/personal_center/CustomerService'
import EditBankCard from '@/pages/personal_center/EditBankCard'
import EditInformation from '@/pages/personal_center/EditInformation'
import PersonalCenter from '@/pages/personal_center/Index'
import AddressBookAddGroup from '@pages/address_book/AddGroup'
import AddressBookGroup from '@pages/address_book/Group'
import AddressBookGroupDetail from '@pages/address_book/GroupDetail'
import AddressBookIndex from '@pages/address_book/Index'
import InquirySheet from '@pages/address_book/InquirySheet'
import MedicalRecord from '@pages/address_book/MedicalRecord'
import PatientDetail from '@pages/address_book/PatientDetail'
import PostInquiry from '@pages/address_book/PostInquiry'
import AdvisoryMedicalRecord from '@pages/advisory/PatientDetail'
import QuickReply from '@pages/advisory/QuickReply'
import SquareRootDetail from '@pages/advisory/SquareRootDetail'
import LawAgreement from '@pages/common/LawAgreement'
import RegisterAgreement from '@pages/common/RegisterAgreement'
import GroupChatDetail from '@pages/group_chat/Detail'
import EnteringGroupChat from '@pages/group_chat/EnteringGroupChat'
import GroupChat from '@pages/group_chat/Index'
import Home from '@pages/Home'
import Help from '@pages/index/Help'
import PrescriptionDetail from '@pages/index/PrescriptionDetail'
import ServiceSettings from '@pages/index/ServiceSettings'
import UploadPrescription from '@pages/index/UploadPrescription'
import UploadPrescriptionDetail from '@pages/index/UploadPrescriptionDetail'
import UploadPrescriptionList from '@pages/index/UploadPrescriptionList'
import MyInviteDoctorGradeList from '@pages/my_invite/DoctorGradeList'
import MyInviteDoctorList from '@pages/my_invite/DoctorList'
import MyInvite from '@pages/my_invite/Index'
import Order from '@pages/my_invite/Order'
import OrderCount from '@pages/my_invite/OrderCount'
import OrderMoney from '@pages/my_invite/OrderMoney'
import InvisiblePatients from '@pages/personal_center/InvisiblePatients'
import InviteDoctors from '@pages/personal_center/InviteDoctors'
import Test from '@pages/Test'
import RealNameAuth from '@pages/user/RealNameAuth'
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs'
import { ParamListBase, RouteConfig, RouteProp } from '@react-navigation/native'
import { createStackNavigator, StackNavigationOptions, StackNavigationProp } from '@react-navigation/stack'
import sColor from '@styles/color'
import gImg from '@utils/img'
import gStyle from '@utils/style'
import React from 'react'
import { Image, PixelRatio, StyleSheet, Text, View, DeviceEventEmitter } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import AdvisoryTabbar from './AdvisoryTabbar'
import GroupChatTabbar from './GroupChatTabbar'
import { Icon, Toast } from '@ant-design/react-native'
import pathMap from './pathMap'
const global = gStyle.global
const style = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  iconFa: {
    width: 30,
    height: 30,
    overflow: 'hidden',
  },
  consultation: {
    position: 'relative',
  },
  countPar: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 6,
    backgroundColor: 'red',
    zIndex: 9,
    justifyContent: 'center',
  },
})
export type AllScreenParam = {
  Root: {}
  Test: {}
  Home: {
    buffge: string
    age: number
    nextRoute: string
  }
  AdvisoryIndex: {}
  AddressBookIndex: {}
  PersonalCenter: {}
  Login: {}
  Register: {}
  ForgetPwd: {}
  RealNameAuth: {}
  AdvisoryChat: {
    mode?: 'chatGroup' | 'common' | 'scanUser'
    patientUid?: number
    patientName?: string
    consultationId?: number
    openid?: string
    groupId?: number
    groupName?: string
  }
  AddressBookGroup: {
    mode: 'delete' | 'done'
    navigatePress: Function
  }
  AddressBookAddGroup: {}
  AddressBookGroupDetail: {
    id: number // groupId
    title: string
  }
  PatientDetail: {
    patientUid: number
  }
  Account: {}
  ChangePwd: {}
  EditInformation: {}
  About: {}
  CustomerService: {}
  Prescription: {}
  InvitePatients: {}
  DiagnosisSettings: {}
  SquareRoot: {}
  DrugSelect: {
    isInSession: boolean
    categoryList: {
      id: number
      name: string
    }[]
    activeId: number
    prescriptionDrugCategoryList: PrescriptionDrugCategory[]
  }
  InquirySheet: {
    patientUid: number
    consultationId: number
  }
  MedicalRecord: {
    prescriptionId: number
    patientUid: number
  }
  SquareRootDetail: {}
  PrescriptionDetail: {}
  RegisterAgreement: {}
  LawAgreement: {}
  AdvisoryMedicalRecord: {
    patientUid: number
    consultationId: number
  }
  ServiceSettings: {}
  InvisiblePatients: {}
  InviteDoctors: {}
  QuickReply: {
    navigatePress: () => void
    mode: 'delete' | 'done'
  }
  SittingHospital: {}
  SittingHospitalList: {}
  AddSittingHospital: {}
  EditSittingHospital: {}
  Calendar: {}
  PrescriptionTpl: {}
  PrescriptionTplList: {}
  AddPrescriptionTpl: {}
  EditPrescriptionTpl: {}
  SelectPrescriptionTpl: {}
  AddBankCard: {}
  EditBankCard: {}
  Help: {}
  PostInquiry: {
    id: number
  }
  DrugDetail: {
    id: number
    name: string
  }
  UploadPrescription: {}
  UploadPrescriptionList: {}
  UploadPrescriptionDetail: {}
  GroupChat: {}
  EnteringGroupChat: {}
  GroupChatDetail: {}
  ApplyList: {}
  AddOrEditArticle: {}
  ArticleList: {}
  ArticleDetail: {}
  Prescribing: {}
  MyInvite: {}
  InviteDoctorList: {}
  InviteDoctorGradeList: {}
  Order: {}
  OrderMoney: {}
  OrderCount: {}
}

type BottomParamList = Partial<AllScreenParam>
const Tab = createBottomTabNavigator<BottomParamList>()
type GetComponentProps<T> = T extends React.ComponentType<infer P> | React.Component<infer P> ? P : never
export type ScreenOptsFn<P extends ParamListBase, N extends keyof P, O> = (props: {
  route: RouteProp<P, N>
  navigation: any
}) => O
function bottomTabOptFn<Name extends keyof AllScreenParam>({
  route,
  navigation,
}: {
  route: RouteProp<AllScreenParam, Name>
  navigation: BottomTabNavigationProp<any>
}): BottomTabNavigationOptions {
  console.log(route, navigation)
  if (route.name === '医馆' || route.name === '聊天室') {
    return {
      title: route.name,
      // title: '医馆',
      tabBarIcon: ({ focused }: { focused: boolean }) => {
        return (
          <View style={style.iconFa}>
            <Image style={style.icon} source={focused ? gImg.common.homeActive : gImg.common.home} />
          </View>
        )
      },
      // headerTitleStyle: {
      //   color: sColor.white,
      // },
      // headerStyle: {
      //   height: 0,
      //   overFlow: 'hidden',
      //   elevation: 0,
      //   borderBottomWidth: 0,
      // },
    }
  }
  return {
    title: 'buffge',
    // headerTitleStyle: {
    //   color: sColor.mainBlack,
    //   textAlign: 'center',
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   flex: 1,
    //   fontSize: 16,
    // },
    // headerStyle: {
    //   height: 50,
    //   backgroundColor: sColor.white,
    //   elevation: 0,
    //   borderBottomColor: sColor.colorEee,
    //   borderBottomWidth: 0,
    // },
    // headerTitleAllowFontScaling: false,
    // headerBackAllowFontScaling: false,
  }
}

const bottomTabConf: {
  screens: {
    [P in keyof AllScreenParam]?: RouteConfig<AllScreenParam, P, BottomTabNavigationOptions>
  }
  conf: Omit<GetComponentProps<typeof Tab['Navigator']>, 'children'>
} = {
  screens: {
    Home: {
      name: 'Home',
      component: Home,
      // options: {
      //   title: '医馆',
      //   tabBarIcon: ({ focused }: { focused: boolean }) => {
      //     return (
      //       <View style={style.iconFa}>
      //         <Image style={style.icon} source={focused ? gImg.common.homeActive : gImg.common.home} />
      //       </View>
      //     )
      //   },
      // },
      options: param => bottomTabOptFn<'Home'>(param),
    },
    AdvisoryIndex: {
      name: 'AdvisoryIndex',
      component: AdvisoryIndex,
      options: {
        title: '咨询',
        tabBarIcon: ({ focused }: { focused: boolean }) => {
          return <AdvisoryTabbar focused={focused} />
        },
      },
    },
    GroupChat: {
      name: 'GroupChat',
      component: GroupChat,
      options: {
        title: '聊天室',
        tabBarIcon: ({ focused }: { focused: boolean }) => {
          return <GroupChatTabbar focused={focused} />
        },
      },
    },
    AddressBookIndex: {
      name: 'AddressBookIndex',
      component: AddressBookIndex,
      options: {
        title: '通讯录',
        tabBarIcon: ({ focused }: { focused: boolean }) => {
          return (
            <View style={style.iconFa}>
              <Image style={style.icon} source={focused ? gImg.common.addressBookActive : gImg.common.addressBook} />
            </View>
          )
        },
      },
    },
    PersonalCenter: {
      name: 'PersonalCenter',
      component: PersonalCenter,
      options: {
        title: '我的',
        tabBarIcon: ({ focused }: { focused: boolean }) => {
          return (
            <View style={style.iconFa}>
              <Image
                style={style.icon}
                source={focused ? gImg.common.personalCenterActive : gImg.common.personalCenter}
              />
            </View>
          )
        },
      },
    },
  },
  conf: {
    initialRouteName: 'Home',
    lazy: true, // 是否在app打开的时候将底部标签栏全部加载
    backBehavior: 'none', // 点击返回退到上级界面
    tabBarOptions: {
      allowFontScaling: false,
      activeTintColor: sColor.mainRed,
      inactiveTintColor: sColor.bottonNavColor,
      showIcon: true,
      showLabel: true,
      style: {
        backgroundColor: sColor.white,
        height: 50,
        borderTopColor: sColor.colorEee,
      },
      tabStyle: {
        height: 50,
        paddingTop: 5,
        paddingBottom: 5,
      },
      labelStyle: {
        fontSize: 10,
      },
    },
  },
}

const TabNav = () => {
  return (
    <Tab.Navigator {...bottomTabConf.conf}>
      {Object.keys(bottomTabConf.screens).map(screenName => {
        const props = bottomTabConf.screens[screenName as keyof AllScreenParam]
        // @ts-ignore
        return <Tab.Screen key={screenName} name={props!.name} {...props} />
      })}
    </Tab.Navigator>
  )
}
const Stack = createStackNavigator()
export default () => {
  return (
    <Stack.Navigator initialRouteName='Root' headerMode='none'>
      {Object.keys(stacksOverTabsConfig).map(screenName => {
        const props = stacksOverTabsConfig[screenName as keyof AllScreenParam]
        // @ts-ignore
        return <Stack.Screen key={screenName} name={screenName} {...props} />
      })}
    </Stack.Navigator>
  )
}
const stacksOverTabsConfig: {
  [P in keyof AllScreenParam]?: RouteConfig<AllScreenParam, P, StackNavigationOptions>
} = {
  Root: {
    name: 'Root',
    component: TabNav,
  },
  Test: {
    name: 'Test',
    component: Test,
  },
  RealNameAuth: {
    name: 'RealNameAuth',
    component: RealNameAuth,
  },
  AdvisoryChat: {
    name: 'AdvisoryChat',
    component: AdvisoryChat,
    initialParams: {
      mode: 'common',
    },
    options: ({
      navigation,
      route,
    }: {
      route: RouteProp<AllScreenParam, 'AdvisoryChat'>
      navigation: StackNavigationProp<any>
    }) => {
      let title = ''
      let { groupId, groupName, patientName, mode } = route.params
      let isScanUserMode = false
      title = patientName || groupName || ''
      isScanUserMode = mode === 'scanUser'
      groupId = groupId || 0
      return {
        title,
        headerStyle: {
          backgroundColor: sColor.white,
          height: 45,
          elevation: 0,
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
        headerRight: isScanUserMode
          ? () => null
          : groupId > 0
          ? () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.push(pathMap.GroupChatDetail, {
                    groupId,
                    groupName,
                  })
                }}
              >
                <Icon style={[gStyle.advisory.advisoryChat.headerRight, global.fontSize18]} name='menu' />
              </TouchableOpacity>
            )
          : () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.push(pathMap.AdvisoryMedicalRecord, {
                    patientUid: route.params.patientUid,
                    consultationId: route.params.consultationId,
                  })
                }}
              >
                <Text style={[gStyle.advisory.advisoryChat.headerRight, global.fontSize14, global.fontStyle]}>
                  病历
                </Text>
              </TouchableOpacity>
            ),
      }
    },
  },
  AddressBookGroup: {
    name: 'AddressBookGroup',
    component: AddressBookGroup,
    initialParams: {
      mode: 'done',
    },
    options: ({
      route,
      navigation,
    }: {
      route: RouteProp<AllScreenParam, 'AddressBookGroup'>
      navigation: StackNavigationProp<any>
    }) => ({
      title: '患者分组',
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
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            let oriMode = route.params.mode
            navigation.setParams({
              mode: oriMode === 'done' ? 'delete' : 'done',
            })
            route.params.navigatePress()
          }}
        >
          <Text style={[gStyle.addressBook.AddressBookGroup.headerTitleLeft, global.fontSize14, global.fontStyle]}>
            {route.params.mode === 'done' ? '删除' : '完成'}
          </Text>
        </TouchableOpacity>
      ),
    }),
  },
  AddressBookAddGroup: {
    name: 'AddressBookAddGroup',
    component: AddressBookAddGroup,
    options: {
      title: '添加新分组',

      headerStyle: {
        backgroundColor: sColor.white,
        height: 50,
        elevation: 0,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: sColor.colorEee,
      },
      headerTintColor: sColor.color333,
      headerTitleStyle: {
        flex: 1,
        color: sColor.mainBlack,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        textAlign: 'center',
      },
      headerRight: () => <TouchableOpacity />,
    },
  },
  AddressBookGroupDetail: {
    name: 'AddressBookGroupDetail',
    component: AddressBookGroupDetail,
    options: ({
      route,
    }: // navigation,
    {
      route: RouteProp<AllScreenParam, 'AddressBookGroupDetail'>
      navigation: StackNavigationProp<any>
    }) => {
      return {
        title: route.params.title,
        headerStyle: {
          backgroundColor: sColor.white,
          height: 50,
          elevation: 0,
          borderBottomWidth: 1 / PixelRatio.get(),
          borderBottomColor: sColor.colorEee,
        },
        headerTintColor: sColor.color333,
        headerTitleStyle: {
          flex: 1,
          color: sColor.mainBlack,
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          textAlign: 'center',
        },
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              console.log('headerRight pressed')
            }}
          >
            <Text
              style={[gStyle.addressBook.AddressBookGroupDetail.headerTitleLeft, global.fontSize14, global.fontStyle]}
            >
              管理
            </Text>
          </TouchableOpacity>
        ),
      }
    },
  },
  PatientDetail: {
    name: 'PatientDetail',
    component: PatientDetail,
    initialParams: {},
    options: {
      title: '患者档案',
      headerStyle: {
        backgroundColor: sColor.white,
        height: 50,
        elevation: 0,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: sColor.colorEee,
      },
      headerTintColor: sColor.color333,
      headerTitleStyle: {
        flex: 1,
        color: sColor.mainBlack,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        textAlign: 'center',
      },
      headerRight: () => <TouchableOpacity />,
    },
  },
  Account: {
    name: 'Account',
    component: Account,
  },
  ChangePwd: {
    name: 'ChangePwd',
    component: ChangePwd,
  },
  EditInformation: {
    name: 'EditInformation',
    component: EditInformation,
  },
  About: {
    name: 'About',
    component: About,
  },
  CustomerService: {
    name: 'CustomerService',
    component: CustomerService,
  },
  Prescription: {
    name: 'Prescription',
    component: Prescription,
  },
  InvitePatients: {
    name: 'InvitePatients',
    component: InvitePatients,
  },
  DiagnosisSettings: {
    name: 'DiagnosisSettings',
    component: DiagnosisSettings,
  },
  SquareRoot: {
    name: 'SquareRoot',
    component: SquareRoot,
  },
  DrugSelect: {
    name: 'DrugSelect',
    component: DrugSelect,
    options: ({
      route,
      navigation,
    }: {
      route: RouteProp<AllScreenParam, 'DrugSelect'>
      navigation: StackNavigationProp<any>
    }) => {
      let title = '选择药材'
      let { categoryList, activeId } = route.params
      if (!categoryList) {
        return {}
      }
      for (let v of categoryList) {
        if (v.id === activeId) {
          title = v.name
        }
      }
      return {
        title,
        headerStyle: {
          backgroundColor: sColor.white,
          height: 45,
          elevation: 0,
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
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => {
              let { prescriptionDrugCategoryList } = route.params
              if (!prescriptionDrugCategoryList) {
                return
              }
              for (let drugCategory of prescriptionDrugCategoryList) {
                for (let drug of drugCategory.drugList) {
                  if (drug.count <= 0) {
                    return Toast.fail(`请填写${drug.detail.name}药品的数量`)
                  }
                }
              }
              DeviceEventEmitter.emit(pathMap.SquareRoot + 'Reload', prescriptionDrugCategoryList)
              DeviceEventEmitter.emit(pathMap.AddPrescriptionTpl + 'Reload', prescriptionDrugCategoryList)
              navigation.goBack()
            }}
          >
            <Icon style={[gStyle.advisory.DrugSelect.headerLeft, global.fontSize16]} name='left' />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              let { prescriptionDrugCategoryList } = route.params
              console.log(prescriptionDrugCategoryList)
              for (let drugCategory of prescriptionDrugCategoryList) {
                for (let drug of drugCategory.drugList) {
                  if (drug.count <= 0) {
                    return Toast.fail(`请填写${drug.detail.name}药品的数量`, 2)
                  }
                }
              }
              DeviceEventEmitter.emit(pathMap.SquareRoot + 'Reload', prescriptionDrugCategoryList)
              DeviceEventEmitter.emit(pathMap.AddPrescriptionTpl + 'Reload', prescriptionDrugCategoryList)
              DeviceEventEmitter.emit(pathMap.EditPrescriptionTpl + 'Reload', prescriptionDrugCategoryList)
              navigation.goBack()
            }}
          >
            <Text style={[global.fontSize16, { color: sColor.mainRed, paddingRight: 15 }]}>完成</Text>
          </TouchableOpacity>
        ),
      }
    },
  },
  InquirySheet: {
    name: 'InquirySheet',
    component: InquirySheet,
    initialParams: {
      consultationId: 0,
      patientUid: 0,
    },
    options: {
      title: '博一健康',
      headerStyle: {
        backgroundColor: sColor.white,
        height: 50,
        elevation: 0,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: sColor.colorEee,
      },
      headerTintColor: sColor.color333,
      headerTitleStyle: {
        flex: 1,
        color: sColor.mainBlack,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        textAlign: 'center',
      },
      headerRight: () => <TouchableOpacity />,
    },
  },
  MedicalRecord: {
    name: 'MedicalRecord',
    component: MedicalRecord,
    initialParams: {
      patientUid: 0,
      prescriptionId: 0,
    },
    options: {
      title: '查看病历',
      headerStyle: {
        backgroundColor: sColor.white,
        height: 50,
        elevation: 0,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: sColor.colorEee,
      },
      headerTintColor: sColor.color333,
      headerTitleStyle: {
        flex: 1,
        color: sColor.mainBlack,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        textAlign: 'center',
      },
      headerRight: () => <TouchableOpacity />,
    },
  },
  SquareRootDetail: {
    name: 'SquareRootDetail',
    component: SquareRootDetail,
  },
  PrescriptionDetail: {
    name: 'PrescriptionDetail',
    component: PrescriptionDetail,
  },
  RegisterAgreement: {
    name: 'RegisterAgreement',
    component: RegisterAgreement,
  },
  LawAgreement: {
    name: 'LawAgreement',
    component: LawAgreement,
  },
  AdvisoryMedicalRecord: {
    name: 'AdvisoryMedicalRecord',
    component: AdvisoryMedicalRecord,
    options: {
      title: '病历',
      headerStyle: {
        backgroundColor: sColor.white,
        height: 50,
        elevation: 0,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: sColor.colorEee,
      },
      headerTintColor: sColor.color333,
      headerTitleStyle: {
        flex: 1,
        color: sColor.mainBlack,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        textAlign: 'center',
      },
      headerRight: () => <TouchableOpacity />,
    },
  },
  ServiceSettings: {
    name: 'ServiceSettings',
    component: ServiceSettings,
  },
  InvisiblePatients: {
    name: 'InvisiblePatients',
    component: InvisiblePatients,
  },
  InviteDoctors: {
    name: 'InviteDoctors',
    component: InviteDoctors,
  },
  QuickReply: {
    name: 'QuickReply',
    component: QuickReply,
    initialParams: {
      mode: 'done',
    },
    options: ({
      route,
      navigation,
    }: {
      route: RouteProp<AllScreenParam, 'QuickReply'>
      navigation: StackNavigationProp<AllScreenParam, 'QuickReply'>
    }) => {
      return {
        title: '快捷回复',
        headerStyle: {
          backgroundColor: sColor.white,
          height: 50,
          elevation: 0,
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
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              let oriMode = route.params.mode
              navigation.setParams({
                mode: oriMode === 'done' ? 'delete' : 'done',
              })
              route.params.navigatePress()
            }}
          >
            <Text style={gStyle.advisory.QuickReply.headerRight}>{route.params.mode === 'done' ? '编辑' : '完成'}</Text>
          </TouchableOpacity>
        ),
      }
    },
  },
  SittingHospital: {
    name: 'SittingHospital',
    component: SittingHospital,
  },
  SittingHospitalList: {
    name: 'SittingHospitalList',
    component: SittingHospitalList,
  },
  AddSittingHospital: {
    name: 'AddSittingHospital',
    component: AddSittingHospital,
  },
  EditSittingHospital: {
    name: 'EditSittingHospital',
    component: EditSittingHospital,
  },
  Calendar: {
    name: 'Calendar',
    component: Calendar,
  },
  PrescriptionTpl: {
    name: 'PrescriptionTpl',
    component: PrescriptionTpl,
  },
  PrescriptionTplList: {
    name: 'PrescriptionTplList',
    component: PrescriptionTplList,
    options: {
      title: '模板信息',
      headerStyle: {
        backgroundColor: sColor.white,
        height: 45,
        elevation: 0,
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
      headerRight: () => <TouchableOpacity />,
    },
  },
  EditPrescriptionTpl: {
    name: 'EditPrescriptionTpl',
    component: EditPrescriptionTpl,
  },
  AddPrescriptionTpl: {
    name: 'AddPrescriptionTpl',
    component: AddPrescriptionTpl,
  },
  SelectPrescriptionTpl: {
    name: 'SelectPrescriptionTpl',
    component: SelectPrescriptionTpl,
  },
  AddBankCard: {
    name: 'AddBankCard',
    component: AddBankCard,
  },
  EditBankCard: {
    name: 'EditBankCard',
    component: EditBankCard,
  },
  Help: {
    name: 'Help',
    component: Help,
  },
  PostInquiry: {
    name: 'PostInquiry',
    component: PostInquiry,
    initialParams: {
      id: 0,
    },
    options: {
      title: '诊后咨询',
      headerStyle: {
        backgroundColor: sColor.white,
        height: 50,
        elevation: 0,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: sColor.colorEee,
      },
      headerTintColor: sColor.color333,
      headerTitleStyle: {
        flex: 1,
        color: sColor.mainBlack,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        textAlign: 'center',
      },
      headerRight: () => <TouchableOpacity />,
    },
  },
  DrugDetail: {
    name: 'DrugDetail',
    component: DrugDetail,
    initialParams: {
      name: '药品详情',
    },
    options: ({ route }: { route: RouteProp<AllScreenParam, 'DrugDetail'> }) => {
      return {
        title: route.params.name,
        headerStyle: {
          backgroundColor: sColor.white,
          height: 50,
          elevation: 0,
          borderBottomWidth: 1 / PixelRatio.get(),
          borderBottomColor: sColor.colorEee,
        },
        headerTintColor: sColor.color333,
        headerTitleStyle: {
          flex: 1,
          color: sColor.mainBlack,
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          textAlign: 'center',
        },
        headerRight: () => <TouchableOpacity />,
      }
    },
  },
  UploadPrescription: {
    name: 'UploadPrescription',
    component: UploadPrescription,
  },
  UploadPrescriptionList: {
    name: 'UploadPrescriptionList',
    component: UploadPrescriptionList,
  },
  UploadPrescriptionDetail: {
    name: 'UploadPrescriptionDetail',
    component: UploadPrescriptionDetail,
  },
  EnteringGroupChat: {
    name: 'EnteringGroupChat',
    component: EnteringGroupChat,
  },
  GroupChatDetail: {
    name: 'GroupChatDetail',
    component: GroupChatDetail,
  },
  ApplyList: {
    name: 'ApplyList',
    component: GroupChatApplyList,
  },
  ArticleList: {
    name: 'ArticleList',
    component: ArticleList,
  },
  ArticleDetail: {
    name: 'ArticleDetail',
    component: ArticleDetail,
  },
  AddOrEditArticle: {
    name: 'AddOrEditArticle',
    component: AddOrEditArticle,
  },
  Prescribing: {
    name: 'Prescribing',
    component: Prescribing,
  },
  MyInvite: {
    name: 'MyInvite',
    component: MyInvite,
  },
  InviteDoctorList: {
    name: 'InviteDoctorList',
    component: MyInviteDoctorList,
  },
  OrderMoney: {
    name: 'OrderMoney',
    component: OrderMoney,
  },
  OrderCount: {
    name: 'OrderCount',
    component: OrderCount,
  },
  InviteDoctorGradeList: {
    name: 'InviteDoctorGradeList',
    component: MyInviteDoctorGradeList,
  },
  Order: {
    name: 'Order',
    component: Order,
  },
}
