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
import changePwd from "@/assets/styles/personal_center/changePwd"
import editInformation from "@/assets/styles/personal_center/editInformation"
import about from "@/assets/styles/personal_center/about"
import customerService from "@/assets/styles/personal_center/customerService"
import Prescription from "@/assets/styles/index/prescription"
import InvitePatients from "@/assets/styles/index/invitePatients"
import DiagnosisSettings from "@/assets/styles/index/diagnosisSettings"
import SquareRoot from "@/assets/styles/advisory/squareRoot"
import DrugSelect from "@/assets/styles/advisory/drugSelect"
import InquirySheet from "@/assets/styles/address_book/inquirySheet"
import MedicalRecord from "@/assets/styles/address_book/medicalRecord"
import SquareRootDetail from "@/assets/styles/advisory/squareRootDetail"
import PrescriptionDetail from "@/assets/styles/index/prescriptionDetail"
import RegisterAgreement from "@/assets/styles/common/registerAgreement"
import LawAgreement from "@/assets/styles/common/lawAgreement"
import AdvisoryPatientDetail from "@/assets/styles/advisory/patientDetail"
import ServiceSettings from "@/assets/styles/index/serviceSettings"
import InvisiblePatients from "@/assets/styles/personal_center/invisiblePatients"
import InviteDoctors from "@/assets/styles/personal_center/inviteDoctors"
import QuickReply from "@/assets/styles/advisory/quickReply"
import SittingHospital from "@/assets/styles/index/sittingHospital"
import SittingHospitalList from "@/assets/styles/index/sittingHospitalList"
import AddSittingHospital from "@/assets/styles/index/addSittingHospital"
export default {
  home,
  global,
  index: {
    Prescription,
    InvitePatients,
    DiagnosisSettings,
    PrescriptionDetail,
    ServiceSettings,
    SittingHospital,
    SittingHospitalList,
    AddSittingHospital,
  },
  user: {
    login,
    register,
    forgetPwd,
    realNameAuth,
  },
  advisory: {
    advisoryIndex,
    advisoryChat,
    SquareRoot,
    DrugSelect,
    SquareRootDetail,
    AdvisoryPatientDetail,
    QuickReply,
  },
  addressBook: {
    AddressBookIndex,
    AddressBookGroup,
    AddressBookAddGroup,
    AddressBookGroupDetail,
    PatientDetail,
    InquirySheet,
    MedicalRecord,
  },
  personalCenter: {
    personalCenterIndex,
    account,
    changePwd,
    editInformation,
    about,
    customerService,
    InvisiblePatients,
    InviteDoctors,
  },
  common: {
    RegisterAgreement,
    LawAgreement,
  },
  admin: {},
}
