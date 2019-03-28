import home from "@styles/home";
import global from "@/assets/styles/global";
import login from "@/assets/styles/user/login";
import forgetPwd from "@/assets/styles/user/forgetPwd";
import register from "@/assets/styles/user/register";
import realNameAuth from "@/assets/styles/user/realNameAuth";
import advisoryIndex from "@/assets/styles/advisory/index";
import advisoryChat from "@/assets/styles/advisory/chat";
import AddressBookIndex from "@/assets/styles/address_book/index";
import AddressBookGroup from "@/assets/styles/address_book/group";
import AddressBookAddGroup from "@/assets/styles/address_book/addGroup";
import AddressBookGroupDetail from "@/assets/styles/address_book/groupDetail";
import personalCenterIndex from "@/assets/styles/personal_center/index";
export default {
  home,
  global,
  user: {
    login,
    register,
    forgetPwd,
    realNameAuth
  },
  advisory: {
    advisoryIndex,
    advisoryChat
  },
  addressBook: {
    AddressBookIndex,
    AddressBookGroup,
    AddressBookAddGroup,
    AddressBookGroupDetail
  },
  personalCenter: {
    personalCenterIndex
  },
  common: {},
  index: {},
  admin: {}
};
