import { bpost } from "./api"

//医生统计
export interface InviteDoctorStatistics {
  totalInviteCount: number //医生总数
  firstLevelInviteCount: number
  secondLevelInviteCount: number
  thirdLevelInviteCount: number
  fourthLevelInviteCount: number
}
//订单金额统计
export interface InviteDoctorOrderMoneyInfo {
  total: number
  firstLevelMoney: number
  secondLevelMoney: number
  thirdLevelMoney: number
  fourthLevelMoney: number
}
//订单数量统计
export interface InviteDoctorOrderInfo {
  total: number
  firstLevelCount: number
  secondLevelCount: number
  thirdLevelCount: number
  fourthLevelCount: number
}

//邀请的医生详情
export interface InviteDoctorChildInfo {
  name: string
  doctorId: number
  firstLevelDoctorCount: number
  secondLevelDoctorCount: number
  thirdLevelDoctorCount: number
  firstLevelMoneyCount: number
  secondLevelMoneyCount: number
  thirdLevelMoneyCount: number
  firstLevelOrderCount: number
  secondLevelOrderCount: number
  thirdLevelOrderCount: number
}
//获取一级子医生的子医生订单信息
export interface FirstLevelDoctorChildOrderInfo {
  doctorId: number
  doctorName: string
  orderCount: number
  moneyCount: number
}

//获取医生统计信息
export async function getInviteDoctorStatistics() {
  return bpost({
    url: "doctor/getInviteDoctorStatistics",
    data: {},
  })
}
//获取金额统计信息
export async function getInviteDoctorOrderMoneyInfo(data: { year: number; month: number }) {
  return bpost({
    url: "doctor/getInviteDoctorOrderMoneyInfo",
    data,
  })
}
//获取订单数量信息
export async function getInviteDoctorOrderInfo(data: { year: number; month: number }) {
  return bpost({
    url: "doctor/getInviteDoctorOrderInfo",
    data,
  })
}
//获取邀请医生列表
export async function listInviteDoctorChildInfo(data: { year: number; month: number }) {
  return bpost<{ list: InviteDoctorChildInfo[] }>({
    url: "doctor/getInviteDoctorChildInfo",
    data,
  })
}
//获取一级子医生的子医生订单信息
export async function listFirstLevelDoctorChildOrderInfo(data: {
  year: number
  month: number
  doctorId: number
  level: number
}) {
  return bpost<{ list: FirstLevelDoctorChildOrderInfo[] }>({
    url: "doctor/getFirstLevelDoctorChildOrderInfo",
    data,
  })
}
//获取某个邀请的医生某月订单列表
export async function listInviteDoctorOrder(data: {
  year: number
  month: number
  doctorId: number
}) {
  return bpost({
    url: "doctor/getInviteDoctorOrderList",
    data,
  })
}
