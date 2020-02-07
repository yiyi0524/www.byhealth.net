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
import addBankCard from "@/assets/styles/personal_center/addBankCard"
import editBankCard from "@/assets/styles/personal_center/editBankCard"
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
import EditSittingHospital from "@/assets/styles/index/editSittingHospital"
import PrescriptionTpl from "@/assets/styles/index/prescriptionTpl"
import PrescriptionTplList from "@/assets/styles/index/prescriptionTplList"
import AddPrescriptionTpl from "@/assets/styles/index/addPrescriptionTpl"
import EditPrescriptionTpl from "@/assets/styles/index/editPrescriptionTpl"
import SelectPrescriptionTplList from "@/assets/styles/advisory/prescriptionTplList"
import Help from "@/assets/styles/index/help"
import postInquiry from "@/assets/styles/address_book/postInquiry"
import DrugDetail from "@/assets/styles/advisory/drugDetail"
import uploadPrescription from "@/assets/styles/index/uploadPrescription"
import uploadPrescriptionList from "@/assets/styles/index/uploadPrescriptionList"
import uploadPrescriptionDetail from "@/assets/styles/index/uploadPrescriptionDetail"
import chatIndex from "@/assets/styles/group_chat/index"
import chat from "@/assets/styles/group_chat/chat"
import groupChatDetail from "@/assets/styles/group_chat/detail"
import groupChatApplyList from "@/assets/styles/group_chat/applyList"
import addArticle from "@/assets/styles/group_chat/addArticle"
import articleList from "@/assets/styles/group_chat/articleList"
import articleDetail from "@/assets/styles/group_chat/articleDetail"
import prescribing from "@/assets/styles/index/prescribing"
import myInviteIndex from "@/assets/styles/my_invite/index"
import myInviteDoctorList from "@/assets/styles/my_invite/doctorList"
import myInviteDoctorGradeList from "@/assets/styles/my_invite/doctorGradeList"
import order from "@/assets/styles/my_invite/order"

export default {
  home,
  global,
  index: {
    uploadPrescriptionDetail,
    uploadPrescriptionList,
    Prescription,
    InvitePatients,
    DiagnosisSettings,
    PrescriptionDetail,
    ServiceSettings,
    SittingHospital,
    SittingHospitalList,
    AddSittingHospital,
    EditSittingHospital,
    PrescriptionTpl,
    PrescriptionTplList,
    AddPrescriptionTpl,
    EditPrescriptionTpl,
    Help,
    uploadPrescription,
    prescribing,
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
    SelectPrescriptionTplList,
    DrugDetail,
  },
  addressBook: {
    AddressBookIndex,
    AddressBookGroup,
    AddressBookAddGroup,
    AddressBookGroupDetail,
    PatientDetail,
    InquirySheet,
    MedicalRecord,
    postInquiry,
  },
  personalCenter: {
    personalCenterIndex,
    account,
    addBankCard,
    editBankCard,
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
  groupChat: {
    index: chatIndex,
    chat,
    detail: groupChatDetail,
    applyList: groupChatApplyList,
    addArticle,
    articleList,
    articleDetail,
  },
  myInvite:{
    myInviteIndex,
    myInviteDoctorList,
    myInviteDoctorGradeList,
    order,
  },
  admin: {},
}
