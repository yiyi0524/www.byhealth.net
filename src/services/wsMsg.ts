import { bget, GetListParam } from "./api"

/**
 * 获取消息列表
 */
async function getMsgList({ page, limit, filter = {} }: GetListParam) {
  return {
    data: {
      list: [
        {
          id: 1,
          sendUser: {
            uid: 5,
            avatar: {
              id: 0,
              title: "",
              url: "",
            },
            name: "吴大伟",
          },
          receiveUser: {
            uid: 2,
            avatar: {
              id: 0,
              title: "",
              url: "",
            },
            name: "吴伟伟",
          },
          type: 0,
          msg: "您好",
          pic: {
            id: 0,
            title: "",
            url: "",
          },
          sendTime: "2018-12-12 12:00:00",
        },
        {
          id: 2,
          sendUser: {
            uid: 2,
            avatar: {
              id: 0,
              title: "",
              url: "/uploads/20190315/1cec476d9eaef31971abef5e16716365.png",
            },
            name: "吴大伟",
          },
          receiveUser: {
            uid: 2,
            avatar: {
              id: 0,
              title: "",
              url: "",
            },
            name: "吴伟伟",
          },
          type: 1,
          msg: "您好",
          pic: {
            id: 1,
            title: "十一",
            url: "/uploads/20190315/1cec476d9eaef31971abef5e16716365.png",
          },
          sendTime: "2018-12-12 12:00:00",
        },
        {
          id: 3,
          sendUser: {
            uid: 5,
            avatar: {
              id: 0,
              title: "",
              url: "",
            },
            name: "吴大伟",
          },
          receiveUser: {
            uid: 2,
            avatar: {
              id: 0,
              title: "",
              url: "",
            },
            name: "吴伟伟",
          },
          type: 2,
          msg: "",
          pic: {
            id: 0,
            title: "",
            url: "",
          },
          extraData: {
            patient: {
              id: 1,
              name: "小小小",
              gender: 1,
              yearAge: 0,
              monthAge: 25,
            },
            orderId: 2,
            ctime: "2018-12-16 16:06:00",
          },
          sendTime: "2018-12-12 12:00:00",
        },
      ],
      count: 10,
    },
  }
  return bget({
    url: "/ws/getMsgList",
    query: {
      page,
      limit,
      filter,
    },
  })
}

export default {
  getMsgList,
}
