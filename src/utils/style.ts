import home from "@styles/home"
import global from "@/assets/styles/global"
import login from "@/assets/styles/user/login"
import forgetPwd from "@/assets/styles/user/forgetPwd"
import register from "@/assets/styles/user/register"
import realNameAuth from "@/assets/styles/user/realNameAuth"
import advisoryIndex from "@/assets/styles/advisory/index"
import advisoryChat from "@/assets/styles/advisory/chat"
import AddressBookIndex from "@/assets/styles/address_book/index"
import AddressBookGroup from "@/assets/styles/address_book/group"
import AddressBookAddGroup from "@/assets/styles/address_book/addGroup"
import AddressBookGroupDetail from "@/assets/styles/address_book/groupDetail"
import PatientDetail from "@/assets/styles/address_book/patientDetail"
import personalCenterIndex from "@/assets/styles/personal_center/index"
import account from "@/assets/styles/personal_center/account"
import ChangePwd from "@/assets/styles/personal_center/changePwd"
import EditInformation from "@/assets/styles/personal_center/editInformation"
import About from "@/assets/styles/personal_center/about"
import CustomerService from "@/assets/styles/personal_center/customerService"
export default {
  home,
  global,
  user: {
    login,
    register,
    forgetPwd,
    realNameAuth,
  },
  advisory: {
    advisoryIndex,
    advisoryChat,
  },
  addressBook: {
    AddressBookIndex,
    AddressBookGroup,
    AddressBookAddGroup,
    AddressBookGroupDetail,
    PatientDetail,
  },
  personalCenter: {
    personalCenterIndex,
    account,
    ChangePwd,
    EditInformation,
    About,
    CustomerService,
  },
  common: {},
  index: {},
  admin: {},
}
