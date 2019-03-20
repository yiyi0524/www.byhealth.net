import { createStore, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import userReducer, { UserState } from "../reducers/user";
export interface AppState {
  user: UserState;
}
export default createStore(combineReducers({ user: userReducer }), composeWithDevTools());
