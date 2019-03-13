import { createStore, combineReducers, } from 'redux';
import adminReducer, { AdminState } from '../reducers/admin';
import { composeWithDevTools } from 'redux-devtools-extension';
export interface AppState {
  admin: AdminState,
}
export default createStore(combineReducers({ admin: adminReducer }),
  composeWithDevTools())
