import { bget, GetListParam } from './api'
import { Picture } from '@/pages/advisory/Chat'
import { Drug as PopularDrug } from '@pages/advisory/SquareRoot'
export const TYPE = {
  chinese: 0x0,
  western: 0x1,
}
export const TYPE_ZH = {
  [TYPE.chinese]: '中药',
  [TYPE.western]: '西药',
}
// 内服中药id
export const ORAL_CHINESE_DRUG_ID = 1
// 扩展中药 -- 广东一方药业颗粒
export const EXTERN_CHINESE_DRUG_ID = 84
// 外用中药id
export const TOPICAL_CHINESE_DRUG_ID = 2
// 内服中药id
export const CHINESE_PATIENT_DRUG_CATEGORY_ID = 0x3
export interface Drug {
  id: number
  category: {
    id: number
    name: string
  }
  //药品名称
  name: string
  // 是否为内服中药
  isChinesePatentDrug: boolean
  // 西药还是中药
  type: number
  picture: Picture
  // 价格 厘 1000厘 = 1元
  price: number
  // 描述
  description: string
  // 规格
  standard: string
  // 厂商
  manufacturer: string
  // 用法用量
  signature: string
  // 不良反应
  untowardEffect: string
  // 禁忌
  taboo: string
  // 注意事项
  notes: string
  // 药物相互作用
  drugInteraction: string
  //单位
  unit: string
  ctime?: string
}
export async function getDetail(query: { id: number }) {
  return bget<{ detail: Drug }>({
    url: '/user/drug/detail',
    query,
  })
}
/**
 *   filter: {
        category: {
          condition: TYPE.eq,
          val: this.props.activeId,
        },
      },
 */
export async function listPopularDrug(query: GetListParam) {
  return bget<{ list: PopularDrug[] }>({
    url: 'hospital/listPopularDrug',
    query,
  })
}

export default {
  getDetail,
}
