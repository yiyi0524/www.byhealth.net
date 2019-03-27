import * as userAction from "../actions/user";
export interface UserState {
  isLogin: boolean;
  name: string;
  uid: number;
}
const initState: UserState = {
  isLogin: false,
  uid: 1,
  name: "buffge"
};
export interface Action<T> {
  type: string;
  preload: T;
}
function userLogin(state = initState, action: Action<userAction.UserInfo>) {
  if (action.type === userAction.USER_LOGIN) {
    let newState = Object.assign({}, state);
    newState.isLogin = true;
    newState.name = action.preload.name;
    newState.uid = action.preload.uid;
    return newState;
  }
  return state;
}

export default function reducer(state = initState, action: Action<any>) {
  switch (action.type) {
    case userAction.USER_LOGIN:
      return userLogin(state, action);
    default:
      break;
  }
  return state;
}
