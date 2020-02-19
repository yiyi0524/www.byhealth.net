// import Calendar from '@/components/Calendar'
// import AdvisoryChat from '@/pages/advisory/Chat'
// import DrugDetail from '@/pages/advisory/DrugDetail'
// import DrugSelect from '@/pages/advisory/DrugSelect'
import AdvisoryIndex from '@/pages/advisory/Index'
// import SelectPrescriptionTpl from '@/pages/advisory/PrescriptionTplList'
// import SquareRoot from '@/pages/advisory/SquareRoot'
// import AddOrEditArticle from '@/pages/group_chat/AddOrEditArticle'
// import GroupChatApplyList from '@/pages/group_chat/ApplyList'
// import ArticleDetail from '@/pages/group_chat/ArticleDetail'
// import ArticleList from '@/pages/group_chat/ArticleList'
// import AddPrescriptionTpl from '@/pages/index/AddPrescriptionTpl'
// import AddSittingHospital from '@/pages/index/AddSittingHospital'
// import DiagnosisSettings from '@/pages/index/DiagnosisSettings'
// import EditPrescriptionTpl from '@/pages/index/EditPrescriptionTpl'
// import EditSittingHospital from '@/pages/index/EditSittingHospital'
// import InvitePatients from '@/pages/index/InvitePatients'
// import Prescribing from '@/pages/index/Prescribing'
// import Prescription from '@/pages/index/Prescription'
// import PrescriptionTpl from '@/pages/index/PrescriptionTpl'
// import PrescriptionTplList from '@/pages/index/PrescriptionTplList'
// import SittingHospital from '@/pages/index/SittingHospital'
// import SittingHospitalList from '@/pages/index/SittingHospitalList'
// import About from '@/pages/personal_center/About'
// import Account from '@/pages/personal_center/Account'
// import AddBankCard from '@/pages/personal_center/AddBankCard'
// import ChangePwd from '@/pages/personal_center/ChangePwd'
// import CustomerService from '@/pages/personal_center/CustomerService'
// import EditBankCard from '@/pages/personal_center/EditBankCard'
// import EditInformation from '@/pages/personal_center/EditInformation'
import PersonalCenter from '@/pages/personal_center/Index'
// import AddressBookAddGroup from '@pages/address_book/AddGroup'
// import AddressBookGroup from '@pages/address_book/Group'
// import AddressBookGroupDetail from '@pages/address_book/GroupDetail'
import AddressBookIndex from '@pages/address_book/Index'
// import InquirySheet from '@pages/address_book/InquirySheet'
// import MedicalRecord from '@pages/address_book/MedicalRecord'
// import PatientDetail from '@pages/address_book/PatientDetail'
// import PostInquiry from '@pages/address_book/PostInquiry'
// import AdvisoryMedicalRecord from '@pages/advisory/PatientDetail'
// import QuickReply from '@pages/advisory/QuickReply'
// import SquareRootDetail from '@pages/advisory/SquareRootDetail'
// import LawAgreement from '@pages/common/LawAgreement'
// import RegisterAgreement from '@pages/common/RegisterAgreement'
// import GroupChatDetail from '@pages/group_chat/Detail'
// import EnteringGroupChat from '@pages/group_chat/EnteringGroupChat'
import GroupChat from '@pages/group_chat/Index'
import Home from '@pages/Home'
// import Help from '@pages/index/Help'
// import PrescriptionDetail from '@pages/index/PrescriptionDetail'
// import ServiceSettings from '@pages/index/ServiceSettings'
// import UploadPrescription from '@pages/index/UploadPrescription'
// import UploadPrescriptionDetail from '@pages/index/UploadPrescriptionDetail'
// import UploadPrescriptionList from '@pages/index/UploadPrescriptionList'
// import InvisiblePatients from '@pages/personal_center/InvisiblePatients'
// import InviteDoctors from '@pages/personal_center/InviteDoctors'
// import MyInvite from '@pages/my_invite/Index'
// import MyInviteDoctorList from '@pages/my_invite/DoctorList'
// import OrderCount from '@pages/my_invite/OrderCount'
// import OrderMoney from '@pages/my_invite/OrderMoney'
// import MyInviteDoctorGradeList from '@pages/my_invite/DoctorGradeList'
// import Order from '@pages/my_invite/Order'
import Test from '@pages/Test'
// import RealNameAuth from '@pages/user/RealNameAuth'
import gImg from '@utils/img'
import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import pathMap from './pathMap'
import AdvisoryTabbar from './AdvisoryTabbar'
import GroupChatTabbar from './GroupChatTabbar'
import { RouteConfig } from '@react-navigation/native'

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
const Tab = createBottomTabNavigator()
type ParamList = {
  [key: string]: undefined
}
const bottomTabConf: {
  screens: {
    // [key: string]: RouteConfig<ParamList, any, any>
    [key: string]: BottomTabNavigationProp<ParamList, any>
  }
  conf: any
} = {
  screens: {
    [pathMap.Home]: {
      name: pathMap.Home,
      component: Home,
      options: {
        title: '医馆',
        tabBarIcon: ({ focused }: { focused: boolean }) => {
          return (
            <View style={style.iconFa}>
              <Image style={style.icon} source={focused ? gImg.common.homeActive : gImg.common.home} />
            </View>
          )
        },
      },
    },
    [pathMap.AdvisoryIndex]: {
      name: pathMap.AdvisoryIndex,
      component: AdvisoryIndex,
      options: {
        title: '咨询',
        tabBarIcon: ({ focused }: { focused: boolean }) => {
          return <AdvisoryTabbar focused={focused} />
        },
      },
    },
    [pathMap.GroupChat]: {
      name: pathMap.GroupChat,
      component: GroupChat,
      options: {
        title: '聊天室',
        tabBarIcon: ({ focused }: { focused: boolean }) => {
          return <GroupChatTabbar focused={focused} />
        },
      },
    },
    [pathMap.AddressBookIndex]: {
      name: pathMap.AddressBookIndex,
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
    [pathMap.PersonalCenter]: {
      name: pathMap.PersonalCenter,
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
    // initialRouteName: 'Home',
    // lazy: true, // 是否在app打开的时候将底部标签栏全部加载
    // backBehavior: 'none', // 点击返回退到上级界面
    // swipeEnabled: true,
    // animationEnabled: true,
    // tabBarOptions: {
    //   activeTintColor: sColor.mainRed,
    //   inactiveTintColor: sColor.bottonNavColor,
    //   showLabel: true,
    //   showIcon: true,
    //   style: {
    //     backgroundColor: sColor.white,
    //     height: 50,
    //     borderTopColor: sColor.colorEee,
    //   },
    //   tabStyle: {
    //     height: 50,
    //     paddingTop: 5,
    //     paddingBottom: 5,
    //   },
    //   labelStyle: {
    //     fontSize: 10,
    //   },
    // },
  },
}
const TabNav = () => {
  return (
    <Tab.Navigator {...bottomTabConf.conf}>
      {Object.keys(bottomTabConf.screens).map(screenName => {
        const props = bottomTabConf.screens[screenName]
        return <Tab.Screen key={screenName} name={screenName} {...props} />
      })}
    </Tab.Navigator>
  )
}

// TabNav.navigationOptions = ({ navigation, route }: any) => {
// if (childOptions.title === '医馆' || childOptions.title === '聊天室') {
//   return {
//     title: childOptions.title,
//     headerTitleStyle: {
//       color: sColor.white,
//     },
//     headerStyle: {
//       height: 0,
//       overFlow: 'hidden',
//       elevation: 0,
//       borderBottomWidth: 0,
//     },
//   }
// }
//   return {
//     title: 'buffg1',
//     headerTitleStyle: {
//       color: sColor.mainBlack,
//       textAlign: 'center',
//       justifyContent: 'center',
//       alignItems: 'center',
//       flex: 1,
//       fontSize: 16,
//     },
//     headerStyle: {
//       height: 50,
//       backgroundColor: sColor.white,
//       elevation: 0,
//       borderBottomColor: sColor.colorEee,
//       borderBottomWidth: 0,
//     },
//     headerTitleAllowFontScaling: false,
//     headerBackAllowFontScaling: false,
//   }
// }
const Stack = createStackNavigator()
export default () => {
  return (
    <Stack.Navigator initialRouteName='Root' headerMode='none'>
      {Object.keys(stacksOverTabsConfig).map(screenName => {
        const props = stacksOverTabsConfig[screenName]
        return <Stack.Screen name={screenName} {...props} />
      })}
    </Stack.Navigator>
  )
}
const stacksOverTabsConfig = {
  Root: {
    component: TabNav,
  },
  [pathMap.Test]: {
    component: Test,
  },
  // [pathMap.RealNameAuth]: {
  //   component: RealNameAuth,
  // },
  // [pathMap.AdvisoryChat]: {
  //   component: AdvisoryChat,
  // },
  // [pathMap.AddressBookGroup]: {
  //   component: AddressBookGroup,
  // },
  // [pathMap.AddressBookAddGroup]: {
  //   component: AddressBookAddGroup,
  // },
  // [pathMap.AddressBookGroupDetail]: {
  //   component: AddressBookGroupDetail,
  // },
  // [pathMap.PatientDetail]: {
  //   component: PatientDetail,
  // },
  // [pathMap.Account]: {
  //   component: Account,
  // },
  // [pathMap.ChangePwd]: {
  //   component: ChangePwd,
  // },
  // [pathMap.EditInformation]: {
  //   component: EditInformation,
  // },
  // [pathMap.About]: {
  //   component: About,
  // },
  // [pathMap.CustomerService]: {
  //   component: CustomerService,
  // },
  // [pathMap.Prescription]: {
  //   component: Prescription,
  // },
  // [pathMap.InvitePatients]: {
  //   component: InvitePatients,
  // },
  // [pathMap.DiagnosisSettings]: {
  //   component: DiagnosisSettings,
  // },
  // [pathMap.SquareRoot]: {
  //   component: SquareRoot,
  // },
  // [pathMap.DrugSelect]: {
  //   component: DrugSelect,
  // },
  // [pathMap.InquirySheet]: {
  //   component: InquirySheet,
  // },
  // [pathMap.MedicalRecord]: {
  //   component: MedicalRecord,
  // },
  // [pathMap.SquareRootDetail]: {
  //   component: SquareRootDetail,
  // },
  // [pathMap.PrescriptionDetail]: {
  //   component: PrescriptionDetail,
  // },
  // [pathMap.RegisterAgreement]: {
  //   component: RegisterAgreement,
  // },
  // [pathMap.LawAgreement]: {
  //   component: LawAgreement,
  // },
  // [pathMap.AdvisoryMedicalRecord]: {
  //   component: AdvisoryMedicalRecord,
  // },
  // [pathMap.ServiceSettings]: {
  //   component: ServiceSettings,
  // },
  // [pathMap.InvisiblePatients]: {
  //   component: InvisiblePatients,
  // },
  // [pathMap.InviteDoctors]: {
  //   component: InviteDoctors,
  // },
  // [pathMap.QuickReply]: {
  //   component: QuickReply,
  // },
  // [pathMap.SittingHospital]: {
  //   component: SittingHospital,
  // },
  // [pathMap.SittingHospitalList]: {
  //   component: SittingHospitalList,
  // },
  // [pathMap.AddSittingHospital]: {
  //   component: AddSittingHospital,
  // },
  // [pathMap.EditSittingHospital]: {
  //   component: EditSittingHospital,
  // },
  // [pathMap.Calendar]: {
  //   component: Calendar,
  // },
  // [pathMap.PrescriptionTpl]: {
  //   component: PrescriptionTpl,
  // },
  // [pathMap.PrescriptionTplList]: {
  //   component: PrescriptionTplList,
  // },
  // [pathMap.EditPrescriptionTpl]: {
  //   component: EditPrescriptionTpl,
  // },
  // [pathMap.AddPrescriptionTpl]: {
  //   component: AddPrescriptionTpl,
  // },
  // [pathMap.SelectPrescriptionTpl]: {
  //   component: SelectPrescriptionTpl,
  // },
  // [pathMap.AddBankCard]: {
  //   component: AddBankCard,
  // },
  // [pathMap.EditBankCard]: {
  //   component: EditBankCard,
  // },
  // [pathMap.Help]: {
  //   component: Help,
  // },
  // [pathMap.PostInquiry]: {
  //   component: PostInquiry,
  // },
  // [pathMap.DrugDetail]: {
  //   component: DrugDetail,
  // },
  // [pathMap.UploadPrescription]: {
  //   component: UploadPrescription,
  // },
  // [pathMap.UploadPrescriptionList]: {
  //   component: UploadPrescriptionList,
  // },
  // [pathMap.UploadPrescriptionDetail]: {
  //   component: UploadPrescriptionDetail,
  // },
  // [pathMap.EnteringGroupChat]: {
  //   component: EnteringGroupChat,
  // },
  // [pathMap.GroupChatDetail]: {
  //   component: GroupChatDetail,
  // },
  // [pathMap.ApplyList]: {
  //   component: GroupChatApplyList,
  // },
  // [pathMap.ArticleList]: {
  //   component: ArticleList,
  // },
  // [pathMap.ArticleDetail]: {
  //   component: ArticleDetail,
  // },
  // [pathMap.AddOrEditArticle]: {
  //   component: AddOrEditArticle,
  // },
  // [pathMap.Prescribing]: {
  //   component: Prescribing,
  // },
  // //我的邀请
  // [pathMap.MyInvite]: {
  //   component: MyInvite,
  // },
  // [pathMap.InviteDoctorList]: {
  //   component: MyInviteDoctorList,
  // },
  // [pathMap.OrderMoney]: {
  //   component: OrderMoney,
  // },
  // [pathMap.OrderCount]: {
  //   component: OrderCount,
  // },
  // [pathMap.InviteDoctorGradeList]: {
  //   component: MyInviteDoctorGradeList,
  // },
  // [pathMap.Order]: {
  //   component: Order,
  // },
}
