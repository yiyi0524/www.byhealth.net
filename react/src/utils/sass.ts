export default {
  common: {
    content: require('@sass/common/content.scss'),
    header: require('@sass/common/header.scss'),
    sidebar: require('@sass/common/sidebar.scss'),
    basicForm: require('@sass/admin/BasicForm.scss'),
    workPlace: require('@sass/admin/workplace.scss'),
  },
  admin: {
    user: {
      // addUser: require('@sass/admin/user/Add.scss'),
      login: require("@sass/admin/user/Login.scss"),
      list: require('@sass/admin/user/List.scss'),
      // information: require('@sass/admin/user/Information.scss'),
    },
    operation: {
      list: require('@sass/admin/operation/List.scss'),
      add: require('@sass/admin/operation/Add.scss'),
      groupList: require('@sass/admin/operation/GroupList.scss'),
      addGroup: require('@sass/admin/operation/AddGroup.scss'),
    },
    settings: {
      base: require("@sass/admin/settings/base.scss"),
    },
    //   school: {
    //     specialityList: require('@sass/admin/school/SpecialityList.scss'),
    //     collegeList: require('@sass/admin/school/CollegeList.scss'),
    //   },
    //   company: {
    //     list: require('@sass/admin/company/List.scss'),
    //     mealCardList: require('@sass/admin/company/MealCardList.scss'),
    //     industryList: require('@sass/admin/company/IndustryList.scss'),
    //     paymentRecordList: require('@sass/admin/company/PaymentRecordList.scss'),
    //     addPaymentRecord: require('@sass/admin/company/AddPaymentRecord.scss'),
    //     base: require("@sass/admin/company/base.scss"),
    //     ParkingPermit: require("@sass/admin/company/ParkingPermit.scss"),

    //   },
    //   conferenceRoomRent: {
    //     list: require("@sass/admin/conferenceRoomRent/List.scss"),
    //     RoomRentDetail: require("@sass/admin/conferenceRoomRent/RoomRentDetail.scss"),
    //   },
    //   project: {
    //     list: require('@sass/admin/project/List.scss'),
    //     base: require("@sass/admin/project/base.scss"),
    //   },
    //   apply: {
    //     allApplyList: require('@sass/admin/apply/List.scss'),
    //     createProjectList: require('@sass/admin/apply/CreateProjectList.scss'),
    //     companyEnterList: require('@sass/admin/apply/CompanyEnterList.scss'),
    //     conferenceRoomRentList: require('@sass/admin/apply/ConferenceRoomRent.scss'),
    //     coffeeHouseRentList: require('@sass/admin/apply/CoffeeHouseRentList.scss'),
    //     mealCardList: require('@sass/admin/apply/MealCardList.scss'),
    //     parkingPermitList: require('@sass/admin/apply/ParkingPermitList.scss'),
    //     recruitList: require('@sass/admin/apply/RecruitList.scss'),
    //     idCardRealNameList: require('@sass/admin/apply/IdCardRealNameList.scss'),
    //     schoolInfoList: require('@sass/admin/apply/SchoolInfoList.scss'),
    //     idCardRealNameInfo: require('@sass/admin/apply/IdCardRealNameInfo.scss'),
    //     schoolInfo: require('@sass/admin/apply/SchoolInfo.scss'),
    //     createProjectInfo: require('@sass/admin/apply/CreateProjectInfo.scss'),
    //     companyEnterInfo: require('@sass/admin/apply/CompanyEnterInfo.scss'),
    //     conferenceRoomRentInfo: require('@sass/admin/apply/ConferenceRoomRentInfo.scss'),
    //     coffeeHouseRentInfo: require('@sass/admin/apply/CoffeeHouseRentInfo.scss'),
    //     mealCardInfo: require('@sass/admin/apply/MealCardInfo.scss'),
    //     parkingPermitInfo: require('@sass/admin/apply/ParkingPermitInfo.scss'),
    //     recruitInfo: require('@sass/admin/apply/RecruitInfo.scss'),
    //   },
    //   process: {
    //     info: require('@sass/admin/process/Info.scss'),
    //     edit: require('@sass/admin/process/Edit.scss'),
    //   },
  },

  // 前端
  index: {
    hospital: {
      departmentDetail: require("@sass/index/hospital/departmentDetail.scss"),
      symptomName: require("@sass/index/hospital/symptomName.scss"),
    }
    //   home: require("@sass/index/user/Home.scss"),
    //   user: {
    //     apply: {
    //       index: require("@sass/index/user/apply/Index.scss"),
    //       createProject: require("@sass/index/user/apply/CreateProject.scss"),
    //       companyEnter: require("@sass/index/user/apply/CompanyEnter.scss"),
    //       conferenceRoomRent: require("@sass/index/user/apply/ConferenceRoomRent.scss"),
    //       coffeeHouseRent: require("@sass/index/user/apply/CoffeeHouseRent.scss"),
    //       mealCard: require("@sass/index/user/apply/MealCard.scss"),
    //       parkingPermit: require("@sass/index/user/apply/ParkingPermit.scss"),
    //       recruit: require("@sass/index/user/apply/Recruit.scss"),
    //     },
    //     auth: {
    //       idCardRealName: require("@sass/index/user/auth/IdCardRealName.scss"),
    //       schoolInfo: require("@sass/index/user/auth/SchoolInfo.scss"),
    //     },
    //     common: {
    //       login: require("@sass/index/user/common/Login.scss"),
    //       forgetPassword: require("@sass/index/user/common/ForgetPassword.scss"),
    //       register: require("@sass/index/user/common/Register.scss"),
    //       modifyPassword: require("@sass/index/user/common/ModifyPassword.scss"),
    //     },
    //     info: require("@sass/index/user/Info.scss"),
    //     settings: require("@sass/index/user/Settings.scss"),
    //   },
    //   company: {
    //     index: require("@sass/index/company/Index.scss"),
    //     mealCard: require("@sass/index/company/MealCard.scss"),
    //     parkingPermit: require("@sass/index/company/ParkingPermit.scss"),
    //   },
  }
};
