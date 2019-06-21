import { GetListParam, bget, bpost } from "./api"

/**
 * 医生银行卡模型
 */
export interface DoctorBankCard {
  id: number
  uid: number
  doctorId: number
  name: number
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
  bankCardId: number
  status: CashOutApplyStatus
}

/**
 * 提现申请的状态
 */
export enum CashOutApplyStatus {
  "wait" = 0x0,
  "pass" = 0x1,
  "reject" = 0x2,
}
export const CashOutApplyStatusZh = {
  [CashOutApplyStatus.wait]: "审核中",
  [CashOutApplyStatus.pass]: "提现通过",
  [CashOutApplyStatus.reject]: "提现拒绝",
}
/**
 * 获取银行卡列表
 */
export async function list({ page = -1, limit = -1, filter }: GetListParam) {
  return bget<{ list: DoctorBankCard[] }>({
    url: "listBankCard",
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
export async function add(data: Omit<DoctorBankCard, "id" | "uid" | "doctorId">) {
  return bpost({
    url: "addBankCard",
    data,
  })
}
/**
 * 编辑银行卡
 */
export async function edit(data: Omit<DoctorBankCard, "id">) {
  return bpost({
    url: "editBankCard",
    data,
  })
}
/**
 * 提现
 */
export async function cashOut(data: { money: number }) {
  return bpost({
    url: "cashOut",
    data,
  })
}
/**
 * 获取提现申请列表
 */
export async function listCashOutApply(query: GetListParam) {
  return bget<{ list: CashOutApply[] }>({
    url: "listCashOutApply",
    query,
  })
}
