import { createStore, combineReducers } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"

import userReducer, { UserState } from "../reducers/user"
import wsReducer, { WsState } from "../reducers/ws"
export interface AppState {
  user: UserState
  ws: WsState
}
export default createStore(
  combineReducers({ user: userReducer, ws: wsReducer }),
  composeWithDevTools(),
)
