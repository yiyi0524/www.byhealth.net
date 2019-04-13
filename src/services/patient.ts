import { bget, bpost, GetListParam } from "./api"
import { GENDER } from "./doctor"
/**
 * todo获取资讯患者信息
 *
 */
export async function getPatientList({ page = -1, limit = -1, filter }: GetListParam) {
  return {
    data: {
      list: [
        {
          id: 4,
          patientId: 1,
          avatar: {
            id: -1,
            url: "",
            title: "",
          },
          age: 30,
          gender: GENDER.WOMAN,
          name: "孟雷",
          phone: "15096483854",
          currMsg: "你好 我是孟雷,我头痛",
          currMsgTime: "2019-03-22 10:10:10",
        },
        {
          id: 1,
          patientId: 2,
          avatar: {
            id: -1,
            url: "",
            title: "",
          },
          age: 24,
          gender: GENDER.MAN, //1:男;2:女'0:未知
          name: "吴亦凡",
          phone: "15096483854",
          currMsg: "医生, 头还有点晕咋整?",
          currMsgTime: "2019-03-22 10:10:10",
        },
      ],
    },
  }
  return bget({
    url: "/getPatientList",
    query: {
      page,
      limit,
      filter,
    },
  })
}
/**
 * todo获取某分组的患者信息
 *    filter={
 *        name:"" || "患者名字"
 *     }
 */
export async function getAddressBoolPatientList({ page = -1, limit = -1, filter }: GetListParam) {
  return {
    data: {
      list: [
        {
          id: 4,
          patientId: 1,
          avatar: {
            id: -1,
            url: "",
            title: "",
          },
          age: 30,
          gender: GENDER.WOMAN,
          name: "孟雷",
          phone: "15096483854",
          time: "2019-03-22 10:10:10",
        },
        {
          id: 1,
          patientId: 2,
          avatar: {
            id: -1,
            url: "",
            title: "",
          },
          age: 24,
          gender: GENDER.MAN, //1:男;2:女'0:未知
          name: "吴亦凡",
          phone: "15096483854",
          time: "2019-03-22 10:10:10",
        },
      ],
    },
  }
  return bget({
    url: "/getAddressBoolPatientList",
    query: {
      page,
      limit,
      filter,
    },
  })
}
/**
 * 获取患者个人信息
 */
export function getPatientInfo({ id }: { id: number }) {
  return bpost({
    url: "/api/getPatientInfo",
    data: {
      id,
    },
  })
}
/**
 *todo  获取患者分组列表
 */
export async function getPatientGroupList({ page = -1, limit = -1, filter = {} }: GetListParam) {
  return {
    data: {
      list: [
        {
          id: 1,
          name: "亲人",
          patientList: [
            {
              id: 1,
              name: "李伟",
            },
            {
              id: 2,
              name: "吴伟",
            },
            {
              id: 3,
              name: "孟磊",
            },
            {
              id: 4,
              name: "吴大伟",
            },
            {
              id: 5,
              name: "吴二伟",
            },
          ],
        },
        {
          id: 2,
          name: "朋友",
          patientList: [
            {
              id: 6,
              name: "孟磊",
            },
            {
              id: 7,
              name: "吴大伟",
            },
            {
              id: 8,
              name: "吴二伟",
            },
            {
              id: 9,
              name: "吴二伟",
            },
            {
              id: 10,
              name: "吴二伟",
            },
            {
              id: 11,
              name: "吴二伟",
            },
            {
              id: 12,
              name: "吴二伟",
            },
            {
              id: 13,
              name: "吴二伟",
            },
            {
              id: 14,
              name: "吴二伟",
            },
            {
              id: 15,
              name: "吴二伟",
            },
            {
              id: 16,
              name: "吴二伟",
            },
          ],
        },
      ],
    },
  }
  return bget({
    url: "/getPatientGroupList",
    query: {
      page,
      limit,
      filter,
    },
  })
}
/**
 * todo 获取某分组中的患者列表
 *  filter={groupId:number}
 *
 */
export async function getGroupDetailPatientList({ page, limit, filter }: GetListParam) {
  return {
    data: {
      list: [
        {
          id: 1,
          avatar: "https://www.byhealth.net/uploads/20190322/e049282da2c90aa6e0866e66d42ad110.png",
          name: "吳大伟",
          gender: 1,
          age: "28岁",
        },
        {
          id: 2,
          avatar: "https://www.byhealth.net/uploads/20190322/e049282da2c90aa6e0866e66d42ad110.png",
          name: "吳二伟",
          gender: 0,
          age: "2个月大",
        },
        {
          id: 3,
          avatar: "",
          name: "吳三伟",
          gender: 2,
          age: "28岁",
        },
        {
          id: 4,
          avatar: "https://www.byhealth.net/uploads/20190322/e049282da2c90aa6e0866e66d42ad110.png",
          name: "吳思伟",
          gender: 1,
          age: "1岁11个月",
        },
      ],
    },
  }
  return bget({
    url: "/getGroupDetailPatientList",
    query: {
      page,
      limit,
      filter,
    },
  })
}
export default {
  getPatientInfo,
  getPatientList,
  getAddressBoolPatientList,
  getPatientGroupList,
  getGroupDetailPatientList,
}
