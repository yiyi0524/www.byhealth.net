export default {
  common: {
    content: require('@sass/common/content.scss'),
    header: require('@sass/common/header.scss'),
    sidebar: require('@sass/common/sidebar.scss'),
    basicForm: require('@sass/admin/BasicForm.scss'),
    workPlace: require('@sass/admin/workplace.scss'),
    table: require('@sass/common/table.scss'),
    nav: {
      breadCrumb: require('@sass/common/nav/breadCrumb.scss'),
    },
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
