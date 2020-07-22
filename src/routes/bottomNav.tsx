import Calendar from '@/components/Calendar'
import AdvisoryChat from '@/pages/advisory/Chat'
import DrugDetail from '@/pages/advisory/DrugDetail'
import DrugSelect from '@/pages/advisory/DrugSelect'
import AdvisoryIndex from '@/pages/advisory/Index'
import SelectPrescriptionTpl from '@/pages/advisory/PrescriptionTplList'
import SquareRoot, { PrescriptionDrugCategory, State as SquareRootState } from '@/pages/advisory/SquareRoot'
import { CurrSetPrescription } from '@/redux/reducers/user'
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
import { PrescriptionTpl as PrescriptionTplDetail } from '@api/doctor'
import PrescriptionTplList from '@/pages/index/PrescriptionTplList'
import SittingHospital from '@/pages/index/SittingHospital'
import SittingHospitalList from '@/pages/index/SittingHospitalList'
import About from '@/pages/personal_center/About'
import Account from '@/pages/personal_center/Account'
import AddBankCard from '@/pages/personal_center/AddBankCard'
import ChangePwd from '@/pages/personal_center/ChangePwd'
import AssistantDoctorList from '@/pages/personal_center/AssistantDoctorList'
import AddOrEditAssistant from '@/pages/personal_center/AddOrEditAssistant'
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
import gSass from '@utils/style'
import PrescriptionDetail from '@pages/index/PrescriptionDetail'
import ServiceSettings from '@pages/index/ServiceSettings'
import UploadPrescription from '@pages/index/UploadPrescription'
import UploadPrescriptionDetail from '@pages/index/UploadPrescriptionDetail'
import UploadPrescriptionList from '@pages/index/UploadPrescriptionList'
import MyInviteDoctorGradeList from '@pages/my_invite/DoctorGradeList'
import MyInviteDoctorList from '@pages/my_invite/DoctorList'
import MyInvite from '@pages/my_invite/Index'
import FundingDetail from '@pages/personal_center/FundingDetail'
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
import React, { ReactChild } from 'react'
import { Image, PixelRatio, StyleSheet, Text, View, DeviceEventEmitter, Alert } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import AdvisoryTabbar from './AdvisoryTabbar'
import GroupChatTabbar from './GroupChatTabbar'
import { Toast, Icon } from '@ant-design/react-native'

// import Icon from 'react-native-vector-icons/FontAwesome'

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
  AssistantDoctorList: {}
  EditInformation: {}
  About: {}
  CustomerService: {}
  Prescription: {}
  InvitePatients: {
    navigatePress: () => void
    mode: 'delete' | 'done'
  }
  DiagnosisSettings: {}
  SquareRoot: {
    mode: 'wx' | 'phone' | 'common'
    patientUid?: number
    status?: boolean
    phone?: string
    prescription?: PrescriptionTplDetail | null
    getState?: () => any
    saveCurrSetPrescription?: (p: any) => any
    delCurrSetPrescription?: () => any
  }
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
  SquareRootDetail: {
    prescriptionId: number
  }
  PrescriptionDetail: {
    mode: 'wx' | 'phone' | 'common'
    prescriptionId: number
  }
  RegisterAgreement: {
    isLogin: boolean
  }
  LawAgreement: {
    isLogin: boolean
  }
  AdvisoryMedicalRecord: {
    patientUid: number
    consultationId: number
  }
  ServiceSettings: {}
  InvisiblePatients: {}
  InviteDoctors: {
    navigatePress?: () => void
    mode: 'delete' | 'done'
  }
  QuickReply: {
    navigatePress?: () => void
    mode: 'delete' | 'done'
  }
  SittingHospital: {
    navigatePress?: () => void
  }
  SittingHospitalList: {}
  AddSittingHospital: {
    navigatePress?: () => void
  }
  EditSittingHospital: {
    id: number
    navigatePress?: () => void
  }
  Calendar: {}
  PrescriptionTpl: {}
  PrescriptionTplList: {
    id: number
    title: string
  }
  AddPrescriptionTpl: {
    id: number
    title: string
  }
  EditPrescriptionTpl: {
    title: string
    id: number
    categoryId: number
    categoryName: string
  }
  SelectPrescriptionTpl: {}
  AddBankCard: {
    navigatePress?: () => void
  }
  EditBankCard: {
    navigatePress?: () => void
  }
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
  UploadPrescriptionDetail: {
    id: number
  }
  GroupChat: {}
  EnteringGroupChat: {
    patientUid: number
    groupChatId: number
  }
  GroupChatDetail: {
    groupId: number
    groupName: string
    navigatePress?: () => void
    mode?: 'delete' | 'done'
    isAdmin?: boolean
  }
  ApplyList: {
    id: number
    name: string
  }
  AddOrEditArticle: {
    id: number
    type: 'add' | 'edit'
    sendArticle?: (p: any) => any
  }
  AddOrEditAssistant: {
    id: number
    type: 'add' | 'edit'
    sendArticle?: (p: any) => any
  }
  ArticleList: {
    sendArticle?: (p: any) => any
  }
  ArticleDetail: {
    id: number
    isPersonalArticle: boolean
  }
  Prescribing: {}
  MyInvite: {}
  FundingDetail: {}
  InviteDoctorList: {}
  InviteDoctorGradeList: {
    level: number
    doctorId: number
    doctorName: string
  }
  Order: {
    doctorId: number
    doctorName: string
    date?: string
  }
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
}: {
  route: RouteProp<AllScreenParam, Name>
  navigation: BottomTabNavigationProp<any>
}): BottomTabNavigationOptions {
  let title: string = route.name
  if (title === 'Home') {
    title = '首页'
  }
  return {
    title,
    tabBarIcon: ({ focused }: { focused: boolean }) => {
      return (
        <View style={style.iconFa}>
          <Image style={style.icon} source={focused ? gImg.common.homeActive : gImg.common.home} />
        </View>
      )
    },
  }
}

const bottomTabConf: {
  screens: { [P in keyof AllScreenParam]?: RouteConfig<AllScreenParam, P, BottomTabNavigationOptions> }
  conf: Omit<GetComponentProps<typeof Tab['Navigator']>, 'children'>
} = {
  screens: {
    Home: {
      name: 'Home',
      component: Home,
      // options: {
      // title: '医馆',
      // tabBarIcon: ({ focused }: { focused: boolean }) => {
      //   return (
      //     <View style={style.iconFa}>
      //       <Image style={style.icon} source={focused ? gImg.common.homeActive : gImg.common.home} />
      //     </View>
      //   )
      // },
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
      allowFontScaling: true,
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
        fontSize: 11,
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
    <Stack.Navigator initialRouteName='Root' headerMode='screen'>
      {Object.keys(stacksOverTabsConfig).map(screenName => {
        const props = stacksOverTabsConfig[screenName as keyof AllScreenParam]
        // @ts-ignore
        return <Stack.Screen key={screenName} name={screenName} {...props} />
      })}
    </Stack.Navigator>
  )
}
const stacksOverTabsConfig: { [P in keyof AllScreenParam]?: RouteConfig<AllScreenParam, P, StackNavigationOptions> } = {
  Root: {
    name: 'Root',
    component: TabNav,
    options: {
      title: '返回',
      header: () => undefined,
    },
  },
  Test: {
    name: 'Test',
    component: Test,
  },
  RealNameAuth: {
    name: 'RealNameAuth',
    component: RealNameAuth,
    options: {
      title: '实名认证',
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
      navigation: StackNavigationProp<AllScreenParam, 'AddressBookGroup'>
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
      navigation: StackNavigationProp<AllScreenParam, 'AddressBookGroupDetail'>
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
    options: ({
      navigation,
      route,
    }: {
      route: RouteProp<AllScreenParam, 'Account'>
      navigation: StackNavigationProp<AllScreenParam, 'Account'>
    }) => {
      return {
        title: '账户',
        headerStyle: {
          backgroundColor: sColor.lightGreen,
          height: 45,
          elevation: 0,
          borderColor: sColor.lightGreen,
        },
        headerTintColor: sColor.white,
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
              navigation.push('FundingDetail')
            }}
          >
            <Text style={{ fontSize: 14, color: '#fff', marginRight: 20 }}>明细</Text>
          </TouchableOpacity>
        ),
      }
    },
  },
  ChangePwd: {
    name: 'ChangePwd',
    component: ChangePwd,
    options: {
      title: '重新设置密码',
      headerStyle: {
        backgroundColor: sColor.white,
        height: 45,
        elevation: 0,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: sColor.colorDdd,
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
  // 医助管理
  AssistantDoctorList: {
    name: 'AssistantDoctorList',
    component: AssistantDoctorList,
    options: ({
      route,
      navigation,
    }: {
      route: RouteProp<AllScreenParam, 'AssistantDoctorList'>
      navigation: StackNavigationProp<AllScreenParam, 'AssistantDoctorList'>
    }) => {
      return {
        title: '医助管理',
        headerStyle: {
          backgroundColor: '#fff',
          height: 45,
          elevation: 0,
          borderColor: '#E3E3E3',
        },
        headerTintColor: '#333',
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
              navigation.push('AddOrEditAssistant', {
                type: 'add',
                id: 0,
              })
            }}
          >
            <Text style={gSass.groupChat.articleDetail.rightTitle}>新建</Text>
          </TouchableOpacity>
        ),
      }
    },
  },
  // 添加医助
  AddOrEditAssistant: {
    name: 'AddOrEditAssistant',
    component: AddOrEditAssistant,
    initialParams: {
      id: 0,
      type: 'add',
    },
    options: ({ route }: { route: RouteProp<AllScreenParam, 'AddOrEditAssistant'> }) => {
      let title = '添加医助'
      if (route.params.type === 'edit') {
        title = '编辑医助'
      }
      return {
        title,
        headerStyle: {
          backgroundColor: '#fff',
          height: 45,
          elevation: 0,
          borderColor: '#E3E3E3',
        },
        headerTintColor: '#333',
        headerTitleStyle: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          textAlign: 'center',
        },
        headerRight: () => (
          <TouchableOpacity>
            <Text />
          </TouchableOpacity>
        ),
      }
    },
  },
  EditInformation: {
    name: 'EditInformation',
    component: EditInformation,
    options: {
      title: '编辑资料',
      headerStyle: {
        backgroundColor: sColor.white,
        height: 45,
        elevation: 0,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: sColor.colorDdd,
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
  About: {
    name: 'About',
    component: About,
    options: {
      title: '关于我们',
      headerStyle: {
        backgroundColor: sColor.white,
        height: 45,
        elevation: 0,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: sColor.colorDdd,
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
  CustomerService: {
    name: 'CustomerService',
    component: CustomerService,
    options: {
      title: '联系客服',
      headerStyle: {
        backgroundColor: sColor.white,
        height: 45,
        elevation: 0,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: sColor.colorDdd,
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
  Prescription: {
    name: 'Prescription',
    component: Prescription,
    options: {
      title: '已开处方',
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
  InvitePatients: {
    name: 'InvitePatients',
    component: InvitePatients,
    initialParams: {
      mode: 'done',
    },
    options: ({
      route,
    }: {
      route: RouteProp<AllScreenParam, 'InvitePatients'>
      navigation: StackNavigationProp<AllScreenParam, 'InvitePatients'>
    }) => {
      return {
        title: '二维码名片',
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
        headerRight: () => <TouchableOpacity onPress={route.params.navigatePress} />,
      }
    },
  },
  DiagnosisSettings: {
    name: 'DiagnosisSettings',
    component: DiagnosisSettings,
    options: {
      title: '复诊及诊后咨询设置',
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
      headerRight: () => <Text />,
    },
  },
  SquareRoot: {
    name: 'SquareRoot',
    component: SquareRoot,
    initialParams: {
      mode: 'common',
      prescription: null,
    },
    options: ({
      route,
      navigation,
    }: {
      route: RouteProp<AllScreenParam, 'SquareRoot'>
      navigation: StackNavigationProp<AllScreenParam, 'SquareRoot'>
    }) => {
      return {
        title: '在线开方',
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
          <View>
            <TouchableOpacity
              onPress={() => {
                let getState: () => SquareRootState = route.params.getState as any
                let state = getState()
                if (state.mode !== 'common') {
                  return navigation.goBack()
                }
                Alert.alert('', '是否保存开方内容', [
                  {
                    text: '否',
                    onPress: () => {
                      const { delCurrSetPrescription } = route.params
                      delCurrSetPrescription && delCurrSetPrescription()
                      navigation.goBack()
                    },
                  },
                  {
                    text: '保存并返回',
                    onPress: () => {
                      let saveCurrSetPrescription: (preload: [number, CurrSetPrescription]) => void = route.params
                        .saveCurrSetPrescription as any
                      const {
                        advice,
                        discrimination,
                        prescriptionDrugCategoryList,
                        serviceMoney,
                        syndromeDifferentiation,
                      } = state
                      let preload: [number, CurrSetPrescription] = [
                        state.patientInfo.uid,
                        {
                          advice,
                          discrimination,
                          prescriptionDrugCategoryList,
                          serviceMoney,
                          syndromeDifferentiation,
                        },
                      ]
                      saveCurrSetPrescription(preload)
                      navigation.goBack()
                    },
                  },
                ])
              }}
            >
              <Icon name='arrow-left' style={{ fontSize: 22, color: '#000', paddingLeft: 15 }} />
            </TouchableOpacity>
          </View>
        ),
        headerRight: () => <Text />,
      }
    },
  },
  DrugSelect: {
    name: 'DrugSelect',
    component: DrugSelect,
    options: ({
      route,
      navigation,
    }: {
      route: RouteProp<AllScreenParam, 'DrugSelect'>
      navigation: StackNavigationProp<AllScreenParam, 'DrugSelect'>
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
    options: {
      title: '查看整体治疗方案',
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
      headerRight: () => <Text />,
    },
  },
  PrescriptionDetail: {
    name: 'PrescriptionDetail',
    component: PrescriptionDetail,
    initialParams: {
      mode: 'common',
    },
    options: {
      title: '开方详情',
      headerStyle: {
        height: 45,
        elevation: 0,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: sColor.colorEee,
      },
      headerTintColor: sColor.color333,
      headerTitleStyle: {
        flex: 1,
        backgroundColor: sColor.white,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        textAlign: 'center',
      },
      headerRight: () => <Text />,
    },
  },
  RegisterAgreement: {
    name: 'RegisterAgreement',
    component: RegisterAgreement,
    initialParams: {
      isLogin: true,
    },
    options: ({
      route,
      navigation,
    }: {
      route: RouteProp<AllScreenParam, 'RegisterAgreement'>
      navigation: StackNavigationProp<AllScreenParam, 'RegisterAgreement'>
    }) => ({
      title: '医生注册协议',
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
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            if (route.params.isLogin) {
              navigation.goBack()
            } else {
              navigation.navigate('Register')
            }
          }}
        >
          <Icon style={{ paddingLeft: 15, fontSize: 18, color: '#333' }} name='left' />
        </TouchableOpacity>
      ),
      headerRight: () => <Text />,
    }),
  },
  LawAgreement: {
    name: 'LawAgreement',
    component: LawAgreement,
    initialParams: {
      isLogin: true,
    },
    options: ({
      route,
      navigation,
    }: {
      route: RouteProp<AllScreenParam, 'LawAgreement'>
      navigation: StackNavigationProp<AllScreenParam, 'LawAgreement'>
    }) => {
      return {
        title: '法律申明与隐私政策',
        headerStyle: {
          backgroundColor: sColor.white,
          height: 50,
          elevation: 0,
          // color: sColor.mainBlack,
          borderBottomWidth: 1 / PixelRatio.get(),
          borderBottomColor: sColor.colorEee,
        },
        headerTintColor: sColor.color333,
        headerTitleStyle: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          color: '#666',
          textAlign: 'center',
        },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => {
              if (route.params.isLogin) {
                navigation.goBack()
              } else {
                navigation.navigate('Register')
              }
            }}
          >
            <Icon style={{ paddingLeft: 15, fontSize: 18, color: '#333' }} name='left' />
          </TouchableOpacity>
        ),
        headerRight: () => <Text />,
      }
    },
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
    options: {
      title: '服务设置',
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
    },
  },
  InvisiblePatients: {
    name: 'InvisiblePatients',
    component: InvisiblePatients,
    options: {
      title: '患者不可见',
      headerStyle: {
        backgroundColor: sColor.white,
        height: 45,
        elevation: 0,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: sColor.colorDdd,
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
  InviteDoctors: {
    name: 'InviteDoctors',
    component: InviteDoctors,
    options: ({
      navigation,
    }: {
      route: RouteProp<AllScreenParam, 'InviteDoctors'>
      navigation: StackNavigationProp<AllScreenParam, 'InviteDoctors'>
    }) => {
      return {
        title: '邀请医生',
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
            style={{ paddingRight: 20 }}
            onPress={() => {
              navigation.push('MyInvite')
            }}
          >
            <Text style={{ fontSize: 14, color: '#05A4A5' }}>我的邀请</Text>
          </TouchableOpacity>
        ),
      }
    },
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
              route.params.navigatePress && route.params.navigatePress()
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
    options: ({
      route,
    }: {
      route: RouteProp<AllScreenParam, 'SittingHospital'>
      navigation: StackNavigationProp<AllScreenParam, 'SittingHospital'>
    }) => {
      console.log(route)
      console.log(navigator)
      return {
        title: '本月坐诊信息',
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
          <TouchableOpacity>{/* <Text style={[style.headerRight, global.fontSize14]}>分享</Text> */}</TouchableOpacity>
        ),
      }
    },
  },
  SittingHospitalList: {
    name: 'SittingHospitalList',
    component: SittingHospitalList,
    options: {
      title: '管理医疗机构',
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
    },
  },
  AddSittingHospital: {
    name: 'AddSittingHospital',
    component: AddSittingHospital,
    options: ({
      route,
    }: {
      route: RouteProp<AllScreenParam, 'AddSittingHospital'>
      navigation: StackNavigationProp<AllScreenParam, 'AddSittingHospital'>
    }) => {
      return {
        title: '医疗机构信息',
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
              route.params.navigatePress && route.params.navigatePress()
            }}
          >
            <Text style={[gStyle.index.AddSittingHospital.headerRight, global.fontSize14]}>保存</Text>
          </TouchableOpacity>
        ),
      }
    },
  },
  EditSittingHospital: {
    name: 'EditSittingHospital',
    component: EditSittingHospital,
    options: ({
      route,
    }: {
      route: RouteProp<AllScreenParam, 'EditSittingHospital'>
      navigation: StackNavigationProp<AllScreenParam, 'EditSittingHospital'>
    }) => {
      return {
        title: '医疗机构信息',
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
          <TouchableOpacity onPress={route.params.navigatePress}>
            <Text style={[gStyle.index.EditSittingHospital.headerRight, global.fontSize14]}>保存</Text>
          </TouchableOpacity>
        ),
      }
    },
  },
  Calendar: {
    name: 'Calendar',
    component: Calendar,
  },
  PrescriptionTpl: {
    name: 'PrescriptionTpl',
    component: PrescriptionTpl,
    options: {
      title: '选择处方模板类型',
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
        color: sColor.mainBlack,
        justifyContent: 'center',
        fontSize: 14,
        textAlign: 'center',
      },
    },
  },
  PrescriptionTplList: {
    name: 'PrescriptionTplList',
    component: PrescriptionTplList,
    options: ({
      route,
      navigation,
    }: {
      route: RouteProp<AllScreenParam, 'PrescriptionTplList'>
      navigation: StackNavigationProp<AllScreenParam, 'PrescriptionTplList'>
    }) => {
      let title = '处方模板'
      let headerRight: () => ReactChild | null = () => null
      if (route.params.title) {
        title = route.params.title + '模板'
        headerRight = () => (
          <TouchableOpacity
            style={route.params.id ? {} : { display: 'none' }}
            onPress={() => {
              navigation.push('AddPrescriptionTpl', {
                id: route.params.id,
                title: route.params.title,
              })
            }}
          >
            <Text style={[gStyle.index.PrescriptionTplList.headerRight, global.fontSize14, global.fontStyle]}>
              新建
            </Text>
          </TouchableOpacity>
        )
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
        headerRight,
      }
    },
  },
  EditPrescriptionTpl: {
    name: 'EditPrescriptionTpl',
    component: EditPrescriptionTpl,
    options: ({
      route,
    }: {
      route: RouteProp<AllScreenParam, 'EditPrescriptionTpl'>
      navigation: StackNavigationProp<AllScreenParam, 'EditPrescriptionTpl'>
    }) => {
      const title = route.params.title + '模板'
      return {
        title,
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
  AddPrescriptionTpl: {
    name: 'AddPrescriptionTpl',
    component: AddPrescriptionTpl,
    options: ({
      route,
    }: {
      route: RouteProp<AllScreenParam, 'AddPrescriptionTpl'>
      navigation: StackNavigationProp<AllScreenParam, 'AddPrescriptionTpl'>
    }) => {
      let title = route.params.title + '模板'
      return {
        title,
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
        headerRight: () => <TouchableOpacity />,
      }
    },
  },
  SelectPrescriptionTpl: {
    name: 'SelectPrescriptionTpl',
    component: SelectPrescriptionTpl,
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
  AddBankCard: {
    name: 'AddBankCard',
    component: AddBankCard,
    options: ({
      route,
    }: {
      route: RouteProp<AllScreenParam, 'AddBankCard'>
      navigation: StackNavigationProp<AllScreenParam, 'AddBankCard'>
    }) => {
      return {
        title: '管理银行卡',
        headerStyle: {
          backgroundColor: '#fff',
          height: 45,
          elevation: 0,
          borderColor: '#fff',
        },
        headerTintColor: '#333',
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
              route.params.navigatePress && route.params.navigatePress()
            }}
          >
            <Text style={[gStyle.personalCenter.addBankCard.headerRight, global.fontSize14, global.fontStyle]}>
              完成
            </Text>
          </TouchableOpacity>
        ),
      }
    },
  },
  EditBankCard: {
    name: 'EditBankCard',
    component: EditBankCard,
    options: ({
      route,
    }: {
      route: RouteProp<AllScreenParam, 'EditBankCard'>
      navigation: StackNavigationProp<AllScreenParam, 'EditBankCard'>
    }) => {
      return {
        title: '管理银行卡',
        headerStyle: {
          backgroundColor: '#fff',
          height: 45,
          elevation: 0,
          borderColor: '#fff',
        },
        headerTintColor: '#333',
        headerTitleStyle: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          textAlign: 'center',
        },
        headerRight: () => (
          <TouchableOpacity onPress={() => route.params.navigatePress && route.params.navigatePress()}>
            <Text style={[gStyle.personalCenter.editBankCard.headerRight, global.fontSize14, global.fontStyle]}>
              完成
            </Text>
          </TouchableOpacity>
        ),
      }
    },
  },
  Help: {
    name: 'Help',
    component: Help,
    options: {
      title: '帮助',
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
    options: ({
      navigation,
    }: {
      route: RouteProp<AllScreenParam, 'UploadPrescription'>
      navigation: StackNavigationProp<AllScreenParam, 'UploadPrescription'>
    }) => {
      return {
        title: '代客下单',
        headerStyle: {
          backgroundColor: sColor.white,
          height: 45,
          elevation: 0,
          borderBottomColor: sColor.colorDdd,
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
            style={gSass.index.uploadPrescription.headerRight}
            onPress={() => {
              navigation.push('UploadPrescriptionList')
            }}
          >
            <Text style={gSass.index.uploadPrescription.headerTitle}>历史记录</Text>
          </TouchableOpacity>
        ),
      }
    },
  },
  UploadPrescriptionList: {
    name: 'UploadPrescriptionList',
    component: UploadPrescriptionList,
    options: {
      title: '处方列表',
      headerStyle: {
        backgroundColor: sColor.white,
        height: 45,
        elevation: 0,
        borderBottomColor: sColor.colorDdd,
      },
      headerTintColor: sColor.color333,
      headerTitleStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        textAlign: 'center',
      },
    },
  },
  UploadPrescriptionDetail: {
    name: 'UploadPrescriptionDetail',
    component: UploadPrescriptionDetail,
    options: {
      title: '处方详情',
      headerStyle: {
        backgroundColor: sColor.white,
        height: 45,
        elevation: 0,
        borderBottomColor: sColor.colorDdd,
      },
      headerTintColor: sColor.color333,
      headerTitleStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        textAlign: 'center',
      },
    },
  },
  EnteringGroupChat: {
    name: 'EnteringGroupChat',
    component: EnteringGroupChat,
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
      navigation: StackNavigationProp<AllScreenParam, 'AdvisoryChat'>
    }) => {
      let title = ''
      let { groupId, groupName, patientName, mode } = route.params
      let isScanUserMode = false
      title = patientName || groupName || ''
      isScanUserMode = mode === 'scanUser'
      groupId = groupId as number
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
                  navigation.push('GroupChatDetail', {
                    groupId: groupId as number,
                    groupName: groupName as string,
                  })
                }}
              >
                <Icon style={[gStyle.advisory.advisoryChat.headerRight, global.fontSize18]} name='menu' />
              </TouchableOpacity>
            )
          : () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.push('AdvisoryMedicalRecord', {
                    patientUid: route.params.patientUid as number,
                    consultationId: route.params.consultationId as number,
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
  GroupChatDetail: {
    name: 'GroupChatDetail',
    component: GroupChatDetail,
    initialParams: {
      groupId: 0,
      groupName: '',
      isAdmin: false,
      mode: 'done',
    },
    options: ({
      navigation,
      route,
    }: {
      route: RouteProp<AllScreenParam, 'GroupChatDetail'>
      navigation: StackNavigationProp<AllScreenParam, 'GroupChatDetail'>
    }) => {
      const { groupName: title, isAdmin } = route.params
      // const isAdmin = navigation.getParam('isAdmin') || false
      return {
        title,
        headerStyle: {
          backgroundColor: '#fff',
          height: 45,
          elevation: 0,
          borderColor: '#E3E3E3',
        },
        headerTintColor: '#333',
        headerTitleStyle: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          textAlign: 'center',
        },
        headerRight: isAdmin
          ? () => (
              <TouchableOpacity
                onPress={() => {
                  let oriMode = route.params.mode
                  navigation.setParams({
                    mode: oriMode === 'done' ? 'delete' : 'done',
                  })
                  route.params.navigatePress && route.params.navigatePress()
                }}
              >
                <Text style={style.icon}>{route.params.mode === 'done' ? '选择' : '删除'}</Text>
              </TouchableOpacity>
            )
          : () => <Text />,
      }
    },
  },
  ApplyList: {
    name: 'ApplyList',
    component: GroupChatApplyList,
    initialParams: {
      id: 0,
      name: '',
    },
    options: ({ route }: { route: RouteProp<AllScreenParam, 'ApplyList'> }) => {
      let title = route.params.name
      return {
        title,
        headerStyle: {
          backgroundColor: '#fff',
          height: 45,
          elevation: 0,
          borderColor: '#E3E3E3',
        },
        headerTintColor: '#333',
        headerTitleStyle: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          textAlign: 'center',
        },
        headerRight: () => (
          <TouchableOpacity>
            <Text> </Text>
          </TouchableOpacity>
        ),
      }
    },
  },
  ArticleList: {
    name: 'ArticleList',
    component: ArticleList,
    options: {
      title: '文章列表',
      headerStyle: {
        backgroundColor: '#fff',
        height: 45,
        elevation: 0,
        borderColor: '#E3E3E3',
      },
      headerTintColor: '#333',
      headerTitleStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        textAlign: 'center',
      },
      headerRight: () => (
        <TouchableOpacity>
          <Text />
        </TouchableOpacity>
      ),
    },
  },
  ArticleDetail: {
    name: 'ArticleDetail',
    component: ArticleDetail,
    initialParams: {
      id: 0,
      isPersonalArticle: false,
    },
    options: ({
      route,
      navigation,
    }: {
      route: RouteProp<AllScreenParam, 'ArticleDetail'>
      navigation: StackNavigationProp<AllScreenParam, 'ArticleDetail'>
    }) => {
      return {
        title: '文章详情',
        headerStyle: {
          backgroundColor: '#fff',
          height: 45,
          elevation: 0,
          borderColor: '#E3E3E3',
        },
        headerTintColor: '#333',
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
              if (route.params.isPersonalArticle) {
                navigation.push('AddOrEditArticle', {
                  type: 'edit',
                  id: route.params.id,
                })
              } else {
                Toast.info('您不是此文章的作者', 2)
              }
            }}
          >
            <Text style={gSass.groupChat.articleDetail.rightTitle}>编辑</Text>
          </TouchableOpacity>
        ),
      }
    },
  },
  AddOrEditArticle: {
    name: 'AddOrEditArticle',
    component: AddOrEditArticle,
    initialParams: {
      id: 0,
      type: 'add',
    },
    options: ({ route }: { route: RouteProp<AllScreenParam, 'AddOrEditArticle'> }) => {
      let title = '添加文章'
      if (route.params.type === 'edit') {
        title = '编辑文章'
      }
      return {
        title,
        headerStyle: {
          backgroundColor: '#fff',
          height: 45,
          elevation: 0,
          borderColor: '#E3E3E3',
        },
        headerTintColor: '#333',
        headerTitleStyle: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          textAlign: 'center',
        },
        headerRight: () => (
          <TouchableOpacity>
            <Text />
          </TouchableOpacity>
        ),
      }
    },
  },
  //资金明细
  FundingDetail: {
    name: 'FundingDetail',
    component: FundingDetail,
    options: {
      title: '资金明细',
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
  Prescribing: {
    name: 'Prescribing',
    component: Prescribing,
    options: {
      title: '立即开方',
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
  MyInvite: {
    name: 'MyInvite',
    component: MyInvite,
    options: {
      title: '我的邀请',
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
  InviteDoctorList: {
    name: 'InviteDoctorList',
    component: MyInviteDoctorList,
    options: {
      title: '邀请的医师',
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
  OrderMoney: {
    name: 'OrderMoney',
    component: OrderMoney,
    options: {
      title: '订单金额',
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
  OrderCount: {
    name: 'OrderCount',
    component: OrderCount,
    options: {
      title: '订单量',
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
  InviteDoctorGradeList: {
    name: 'InviteDoctorGradeList',
    component: MyInviteDoctorGradeList,
    initialParams: {
      doctorId: 0,
      doctorName: '',
      level: 0,
    },
    options: {
      title: '邀请的医生',
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
  Order: {
    name: 'Order',
    component: Order,
    options: {
      title: '医师订单',
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
    },
  },
}
