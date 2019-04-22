export interface WsInfo {
  status: number
}
export const CHANGE_STATUS = "改变websocket状态"

export function changeStatus({ status }: { status: number }) {
  return {
    type: CHANGE_STATUS,
    preload: {
      status,
    },
  }
}
