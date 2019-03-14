import { bpost, bget, GetListParam, } from './api';

export interface Operation {
  id?: number,
  name: string,
  action: string,
  description: string,
}
export async function addOperation({ name, action, description, }: Operation) {
  return bpost({
    url: 'addOperation',
    data: {
      name, action, description,
    },
  })
}
export async function deleteOperation({ id }: { id: number }) {
  return bpost({
    url: 'deleteOperation',
    data: {
      id,
    }
  })
}
export async function deleteOperationList(idArr: number[]) {
  return bpost({
    url: 'deleteOperation',
    data: {
      idArr,
    }
  })
}
export async function editOperation({ id, name, action, description, }: Operation) {
  return bpost({
    url: 'editOperation', data: {
      id, name, action, description,
    },
  })
}
export async function getDetail(id: number) {
  return bget({
    url: 'operationDetail', query: {
      id,
    }
  })
}
export async function getOperationList({ page, limit, filter = {} }: GetListParam) {
  return bget({
    url: 'operationList', query: {
      page,
      limit,
      filter,
    }
  })
}
interface OperationGroupParam {
  id: number,
  name: string,
  description: string,
  operationList: number[],
  operationGroupList: number[],
}

/// 操作组
export async function addOperationGroup({ name, description, operationList, operationGroupList, }: OperationGroupParam) {
  return bpost({
    url: 'addOperationGroup',
    data: {
      name, description, operationList, operationGroupList,
    },
  })
}
export async function deleteOperationGroup(id: number) {
  return bpost({
    url: 'deleteOperationGroup',
    data: {
      id,
    }
  })
}
export async function deleteOperationGroupList(idArr: number[]) {
  return bpost({
    url: 'deleteOperationGroup',
    data: {
      idArr,
    }
  })
}
export async function editOperationGroup({ id, name, description, operationList, operationGroupList, }: OperationGroupParam
) {
  return bpost({
    url: 'editOperationGroup',
    data: {
      id, name, description, operationList, operationGroupList,
    },
  })
}
export async function getGroupDetail(id: number) {
  return bget({
    url: 'operationGroupDetail', query: {
      id,
    }
  })
}

export async function getGroupList({ page, limit, filter = {} }: GetListParam) {
  return bget({
    url: 'operationGroupList', query: {
      page,
      limit,
      filter,
    },
  })
}

export default {
  addOperation,
  deleteOperation,
  deleteOperationList,
  editOperation,
  getDetail,
  getOperationList,
  addOperationGroup,
  deleteOperationGroup,
  deleteOperationGroupList,
  editOperationGroup,
  getGroupDetail,
  getGroupList,
}
