import moment from "moment";
/*
const test = {
  icon: ['fas', 'user'],
  href: '/',
  title: '开发模块',
  child: [
    {
      href: '/admin/basicForm',
      title: '基础表单',
      child: null,
    },
    {
      href: '/admin/BasicList',
      title: '表格',
      child: null,
    },
    {
      href: '/admin/Test',
      title: 'Test',
      child: null,
    },
  ]
}
*/
let buildTime = "";
if (process.env.REACT_APP_BUILD_TIME) {
  console.log(`构建时间: ${process.env.REACT_APP_BUILD_TIME}`);
  buildTime = moment(process.env.REACT_APP_BUILD_TIME).format("MM-DD HH:mm");
}
const developer = {
  icon: ["paper-clip", "dev"],
  title: `开发者 ${buildTime || ""}`,
  child: [
    {
      href: "/",
      title: "CMS",
      child: [
        {
          href: "/",
          title: "栏目",
          child: null
        },
        {
          href: "/",
          title: "内容",
          child: null
        }
      ]
    },
    {
      href: "/",
      title: "日志",
      child: [
        {
          href: "/",
          title: "全部",
          child: null
        },
        {
          href: "/",
          title: "短信",
          child: null
        },
        {
          href: "/",
          title: "wxApi",
          child: null
        },
        {
          href: "/",
          title: "sql",
          child: null
        },
        {
          href: "/",
          title: "文章爬虫",
          child: null
        }
      ]
    },
    {
      href: "/",
      title: "权限管理",
      child: [
        {
          href: "/admin/operation/list",
          title: "操作列表",
          child: null
        },
        {
          href: "/admin/operation/add",
          title: "添加操作",
          child: null
        },
        {
          href: "/admin/operation/groupList",
          title: "操作组列表",
          child: null
        },
        {
          href: "/admin/operation/addGroup",
          title: "添加操作组",
          child: null
        }
      ]
    }
  ]
};
const user = {
  icon: ["user", "user"],
  href: "",
  title: "用户管理",
  child: [
    {
      href: "/admin/user/list",
      title: "用户列表",
      child: null
    },
    {
      href: "/admin/user/add",
      title: "添加用户",
      child: null
    }
  ]
};
export const menuList = [
  // test,
  /**
   * 开发者
   */
  developer,
  user,
];
