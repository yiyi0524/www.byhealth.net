import { createStore, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import adminReducer, { AdminState } from "../reducers/admin";
export interface AppState {
  admin: AdminState;
}
export default createStore(
  combineReducers({ admin: adminReducer }),
  composeWithDevTools()
);
