import { bget, GetListParam } from './api'

export async function getList({ page = -1, limit = -1, filter = {} }: GetListParam) {
  return bget({
    url: '/hospital/getList',
    query: {
      page,
      limit,
      filter,
    },
  })
}
export async function getDepartmentList({ page = -1, limit = -1, filter = {} }: GetListParam) {
  return bget({
    url: '/hospital/getDepartmentList',
    query: {
      page,
      limit,
      filter,
    },
  })
}
export async function getAllSymptomList({ page = -1, limit = -1, filter = {} }: GetListParam) {
  return bget({
    url: '/hospital/getAllSymptomList',
    query: {
      page,
      limit,
      filter,
    },
  })
}
export async function getDrugCategoryList({ page = -1, limit = -1, filter = {} }: GetListParam) {
  return bget({
    url: '/hospital/getDrugCategoryList',
    query: {
      page,
      limit,
      filter,
    },
  })
}
export async function getDrugList({ page = -1, limit = -1, filter = {} }: GetListParam) {
  return bget({
    url: '/hospital/getDrugList',
    query: {
      page,
      limit,
      filter,
    },
  })
}
export async function getDrugStoreList({ page = -1, limit = -1, filter = {} }: GetListParam) {
  return bget({
    url: '/hospital/getDrugStoreList',
    query: {
      page,
      limit,
      filter,
    },
  })
}
export async function getStoreDrug({ page = -1, limit = -1, filter = {} }: GetListParam) {
  return bget({
    url: '/hospital/getStoreDrug',
    query: {
      page,
      limit,
      filter,
    },
  })
}
export async function getDrugStateList({ page = -1, limit = -1, filter = {} }: GetListParam) {
  return bget({
    url: '/hospital/getDrugStateList',
    query: {
      page,
      limit,
      filter,
    },
  })
}
export async function getStateStore(stateId: number, storeId: number) {
  return bget<{ status: boolean, price: number }>({
    url: '/hospital/getStateStore',
    query: {
      stateId,
      storeId,
    },
  })
}
export async function getDrugStoreDetail(id: number) {
  return bget({
    url: '/hospital/getDrugStoreDetail',
    query: {
      id,
    },
  })
}
export default {
  getList,
  getDepartmentList,
  getAllSymptomList,
  getDrugCategoryList,
  getDrugList,
  getDrugStoreList,
  getDrugStateList,
  getStoreDrug,
  getStateStore,
  getDrugStoreDetail,
}
