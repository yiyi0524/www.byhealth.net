import { GetListParam, bget, bpost } from "./api"
export type Type = "bankCard" | "aliPay" | "wxPay"
/**
 * 医生银行卡模型
 */
export interface DoctorBankCard {
  id: number
  uid: number
  doctorId: number
  name: string
  idCardNo: string
  // 银行名
  bankName: string
  cardNo: string
  // 开户名
  openingBank: string
  phone: string
}
/**
 * 提现申请模型
 */
export interface CashOutApply {
  id: number
  uid: number
  doctorId: number
  money: number
  type: Type
  aliAccount: string
  aliName: string
  wxAccount: string
  bankCard: Omit<DoctorBankCard, "uid" | "doctorId"> | null
  status: number
  ctime: string
}

/**
 * 提现申请的状态
 */
export const CASH_OUT_APPLY_STATUS = {
  wait: 0x0,
  pass: 0x1,
  reject: 0x2,
}
export const CASH_OUT_APPLY_STATUS_ZH = {
  [CASH_OUT_APPLY_STATUS.wait]: "审核中",
  [CASH_OUT_APPLY_STATUS.pass]: "提现通过",
  [CASH_OUT_APPLY_STATUS.reject]: "提现拒绝",
}
/**
 * 获取银行卡列表
 */
export function list({ page = -1, limit = -1, filter }: GetListParam) {
  return bget<{ list: DoctorBankCard[] }>({
    url: "api/listBankCard",
    query: {
      page,
      limit,
      filter,
    },
  })
}
/**
 * 添加银行卡
 */
export function add(data: Omit<DoctorBankCard, "id" | "uid" | "doctorId">) {
  return bpost({
    url: "api/addBankCard",
    data,
  })
}
/**
 * 编辑银行卡
 */
export function edit(data: Omit<DoctorBankCard, "uid" | "doctorId">) {
  return bpost({
    url: "api/editBankCard",
    data,
  })
}
export interface CashOutData {
  type: Type
  aliAccount?: string
  aliName?: string
  wxAccount?: string
  money: number
}
/**
 * 提现
 */
export function cashOut(data: CashOutData) {
  return bpost({
    url: "api/cashOut",
    data,
  })
}
/**
 * 获取提现申请列表
 */
export function listCashOutApply(query: GetListParam) {
  return bget<{ list: CashOutApply[] }>({
    url: "api/listCashOutApply",
    query,
  })
}
export default {
  list,
  add,
  edit,
  cashOut,
  listCashOutApply,
}
