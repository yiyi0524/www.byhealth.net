import AdvisoryChat from "@/pages/advisory/Chat"
import DrugSelect from "@/pages/advisory/DrugSelect"
import AdvisoryIndex from "@/pages/advisory/Index"
import SquareRoot from "@/pages/advisory/SquareRoot"
import DiagnosisSettings from "@/pages/index/DiagnosisSettings"
import InvitePatients from "@/pages/index/InvitePatients"
import Prescription from "@/pages/index/Prescription"
import About from "@/pages/personal_center/About"
import Account from "@/pages/personal_center/Account"
import ChangePwd from "@/pages/personal_center/ChangePwd"
import CustomerService from "@/pages/personal_center/CustomerService"
import EditInformation from "@/pages/personal_center/EditInformation"
import PersonalCenter from "@/pages/personal_center/Index"
import AddressBookAddGroup from "@pages/address_book/AddGroup"
import AddressBookGroup from "@pages/address_book/Group"
import AddressBookGroupDetail from "@pages/address_book/GroupDetail"
import AddressBookIndex from "@pages/address_book/Index"
import PatientDetail from "@pages/address_book/PatientDetail"
import InquirySheet from "@pages/address_book/InquirySheet"
import MedicalRecord from "@pages/address_book/MedicalRecord"
import SquareRootDetail from "@pages/advisory/SquareRootDetail"
import PrescriptionDetail from "@pages/index/PrescriptionDetail"
import RegisterAgreement from "@pages/common/RegisterAgreement"
import LawAgreement from "@pages/common/LawAgreement"
import AdvisoryMedicalRecord from "@pages/advisory/PatientDetail"
import ServiceSettings from "@pages/index/ServiceSettings"
import InvisiblePatients from "@pages/personal_center/InvisiblePatients"
import InviteDoctors from "@pages/personal_center/InviteDoctors"
import QuickReply from "@pages/advisory/QuickReply"
import SittingHospital from "@/pages/index/SittingHospital"
import SittingHospitalList from "@/pages/index/SittingHospitalList"
import AddSittingHospital from "@/pages/index/AddSittingHospital"
import EditSittingHospital from "@/pages/index/EditSittingHospital"
import PrescriptionTpl from "@/pages/index/PrescriptionTpl"
import PrescriptionTplList from "@/pages/index/PrescriptionTplList"
import AddPrescriptionTpl from "@/pages/index/AddPrescriptionTpl"
import EditPrescriptionTpl from "@/pages/index/EditPrescriptionTpl"
import SelectPrescriptionTpl from "@/pages/advisory/PrescriptionTplList"
import AddBankCard from "@/pages/personal_center/AddBankCard"
import EditBankCard from "@/pages/personal_center/EditBankCard"
import DrugDetail from "@/pages/advisory/DrugDetail"
import Calendar from "@/components/Calendar"
import Help from "@pages/index/Help"
import Home from "@pages/Home"
import Test from "@pages/Test"
import RealNameAuth from "@pages/user/RealNameAuth"
import UploadPrescription from "@pages/index/UploadPrescription"
import sColor from "@styles/color"
import gImg from "@utils/img"
import React from "react"
import PostInquiry from "@pages/address_book/PostInquiry"
import UploadPrescriptionList from "@pages/index/UploadPrescriptionList"
import UploadPrescriptionDetail from "@pages/index/UploadPrescriptionDetail"

import { Image, StyleSheet, View } from "react-native"
import {
  createBottomTabNavigator,
  createStackNavigator,
  getActiveChildNavigationOptions,
} from "react-navigation"
import pathMap from "./pathMap"
const style = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  iconFa: {
    width: 30,
    height: 30,
    overflow: "hidden",
  },
})
const TabNav = createBottomTabNavigator(
  {
    [pathMap.Home]: {
      screen: Home,
      headerMode: "none",
      navigationOptions: ({}) => ({
        title: "医馆",
        tabBarIcon: ({ focused }: { focused: boolean }) => {
          return (
            <View style={style.iconFa}>
              <Image
                style={style.icon}
                source={focused ? gImg.common.homeActive : gImg.common.home}
              />
            </View>
          )
        },
        headerTitleAllowFontScaling: false,
      }),
      tabBarOnPress: (obj: any) => {
        if (obj.navigation.state.params && obj.navigation.state.params.init) {
          obj.navigation.state.params.init()
        }
        obj.navigation.navigate(obj.navigation.state.routeName)
      },
    },
    [pathMap.AdvisoryIndex]: {
      screen: AdvisoryIndex,
      headerMode: "none",
      navigationOptions: ({}) => ({
        title: "咨询",
        tabBarIcon: ({ focused }: { focused: boolean }) => {
          return (
            <View style={style.iconFa}>
              <Image
                style={style.icon}
                source={focused ? gImg.common.advisoryActive : gImg.common.advisory}
              />
            </View>
          )
        },
        tabBarOnPress: (obj: any) => {
          obj.navigation.navigate(obj.navigation.state.routeName)
          if (obj.navigation.state.params && obj.navigation.state.params.init) {
            obj.navigation.state.params.init()
          }
        },
        headerTitleAllowFontScaling: false,
      }),
    },
    [pathMap.AddressBookIndex]: {
      screen: AddressBookIndex,
      headerMode: "none",
      navigationOptions: ({}) => ({
        title: "通讯录",
        tabBarIcon: ({ focused }: { focused: boolean }) => {
          return (
            <View style={style.iconFa}>
              <Image
                style={style.icon}
                source={focused ? gImg.common.addressBookActive : gImg.common.addressBook}
              />
            </View>
          )
        },
        tabBarOnPress: (obj: any) => {
          obj.navigation.navigate(obj.navigation.state.routeName)
          if (obj.navigation.state.params && obj.navigation.state.params.init) {
            obj.navigation.state.params.init()
          }
        },
        headerTitleAllowFontScaling: false,
      }),
    },
    [pathMap.PersonalCenter]: {
      screen: PersonalCenter,
      headerMode: "none",
      navigationOptions: ({}) => ({
        title: "我的",
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
        tabBarOnPress: (obj: any) => {
          obj.navigation.navigate(obj.navigation.state.routeName) //跳转
          if (obj.navigation.state.params && obj.navigation.state.params.init) {
            obj.navigation.state.params.init() //查询数据
          }
        },
        headerTitleAllowFontScaling: false,
      }),
    },
  },
  {
    initialRouteName: "Home",
    lazy: true, // 是否在app打开的时候将底部标签栏全部加载
    backBehavior: "none", // 点击返回退到上级界面
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: sColor.mainRed,
      inactiveTintColor: sColor.bottonNavColor,
      showLabel: true,
      showIcon: true,
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
)
TabNav.navigationOptions = ({ navigation, screenProps }: any) => {
  const childOptions = getActiveChildNavigationOptions(navigation, screenProps)
  if (childOptions.title === "医馆") {
    return {
      title: childOptions.title,
      headerTitleStyle: {
        color: sColor.white,
      },
      headerStyle: {
        height: 0,
        overFlow: "hidden",
        elevation: 0,
        borderBottomWidth: 0,
      },
    }
  }
  return {
    title: childOptions.title,
    headerTitleStyle: {
      color: sColor.mainBlack,
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      fontSize: 16,
    },
    headerStyle: {
      height: 50,
      backgroundColor: sColor.white,
      elevation: 0,
      borderBottomColor: sColor.colorEee,
      borderBottomWidth: 0,
    },
    headerTitleAllowFontScaling: false,
    headerBackAllowFontScaling: false,
  }
}

const StacksOverTabs = createStackNavigator({
  Root: {
    screen: TabNav,
  },
  [pathMap.Test]: {
    screen: Test,
  },
  [pathMap.RealNameAuth]: {
    screen: RealNameAuth,
  },
  [pathMap.AdvisoryChat]: {
    screen: AdvisoryChat,
  },
  [pathMap.AddressBookGroup]: {
    screen: AddressBookGroup,
  },
  [pathMap.AddressBookAddGroup]: {
    screen: AddressBookAddGroup,
  },
  [pathMap.AddressBookGroupDetail]: {
    screen: AddressBookGroupDetail,
  },
  [pathMap.PatientDetail]: {
    screen: PatientDetail,
  },
  [pathMap.Account]: {
    screen: Account,
  },
  [pathMap.ChangePwd]: {
    screen: ChangePwd,
  },
  [pathMap.EditInformation]: {
    screen: EditInformation,
  },
  [pathMap.About]: {
    screen: About,
  },
  [pathMap.CustomerService]: {
    screen: CustomerService,
  },
  [pathMap.Prescription]: {
    screen: Prescription,
  },
  [pathMap.InvitePatients]: {
    screen: InvitePatients,
  },
  [pathMap.DiagnosisSettings]: {
    screen: DiagnosisSettings,
  },
  [pathMap.SquareRoot]: {
    screen: SquareRoot,
  },
  [pathMap.DrugSelect]: {
    screen: DrugSelect,
  },
  [pathMap.InquirySheet]: {
    screen: InquirySheet,
  },
  [pathMap.MedicalRecord]: {
    screen: MedicalRecord,
  },
  [pathMap.SquareRootDetail]: {
    screen: SquareRootDetail,
  },
  [pathMap.PrescriptionDetail]: {
    screen: PrescriptionDetail,
  },
  [pathMap.RegisterAgreement]: {
    screen: RegisterAgreement,
  },
  [pathMap.LawAgreement]: {
    screen: LawAgreement,
  },
  [pathMap.AdvisoryMedicalRecord]: {
    screen: AdvisoryMedicalRecord,
  },
  [pathMap.ServiceSettings]: {
    screen: ServiceSettings,
  },
  [pathMap.InvisiblePatients]: {
    screen: InvisiblePatients,
  },
  [pathMap.InviteDoctors]: {
    screen: InviteDoctors,
  },
  [pathMap.QuickReply]: {
    screen: QuickReply,
  },
  [pathMap.SittingHospital]: {
    screen: SittingHospital,
  },
  [pathMap.SittingHospitalList]: {
    screen: SittingHospitalList,
  },
  [pathMap.AddSittingHospital]: {
    screen: AddSittingHospital,
  },
  [pathMap.EditSittingHospital]: {
    screen: EditSittingHospital,
  },
  [pathMap.Calendar]: {
    screen: Calendar,
  },
  [pathMap.PrescriptionTpl]: {
    screen: PrescriptionTpl,
  },
  [pathMap.PrescriptionTplList]: {
    screen: PrescriptionTplList,
  },
  [pathMap.EditPrescriptionTpl]: {
    screen: EditPrescriptionTpl,
  },
  [pathMap.AddPrescriptionTpl]: {
    screen: AddPrescriptionTpl,
  },
  [pathMap.SelectPrescriptionTpl]: {
    screen: SelectPrescriptionTpl,
  },
  [pathMap.AddBankCard]: {
    screen: AddBankCard,
  },
  [pathMap.EditBankCard]: {
    screen: EditBankCard,
  },
  [pathMap.Help]: {
    screen: Help,
  },
  [pathMap.PostInquiry]: {
    screen: PostInquiry,
  },
  [pathMap.DrugDetail]: {
    screen: DrugDetail,
  },
  [pathMap.UploadPrescription]: {
    screen: UploadPrescription,
  },
  [pathMap.UploadPrescriptionList]: {
    screen: UploadPrescriptionList,
  },
  [pathMap.UploadPrescriptionDetail]: {
    screen: UploadPrescriptionDetail,
  },
})
export default StacksOverTabs
