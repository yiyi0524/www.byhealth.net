import { bget, } from './api';

/**
 * 获取所有科室和科室治疗的症状
 */
async function getAllSymptomList() {
  return {
    data: {
      list: [
        {
          name: '妇科',
          symptomList: [
            {
              id: 1,
              name: '月经不调',
            },
            {
              id: 2,
              name: '痛经',
            },
            {
              id: 3,
              name: '带下症',
            },
            {
              id: 4,
              name: '妇科炎症',
            },
            {
              id: 5,
              name: '卵巢囊肿',
            },
            {
              id: 6,
              name: '产后调理',
            },
            {
              id: 7,
              name: '不孕',
            },
          ],
        },
        {
          name: '呼吸科',
          symptomList: [
            {
              id: 8,
              name: '胃痛',
            },
            {
              id: 9,
              name: '胃炎',
            },
            {
              id: 10,
              name: '消化性溃疡',
            },
            {
              id: 11,
              name: '腹泻',
            },
            {
              id: 12,
              name: '便秘',
            },
            {
              id: 13,
              name: '便血',
            },
            {
              id: 14,
              name: '腹痛',
            },
          ],
        },
      ],
    }
  }
  return bget({
    url: 'getAllSymptomList',
  })
}

export default {
  getAllSymptomList,
}
