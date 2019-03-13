import * as adminAction from '../actions/admin';
export interface AdminState {
    isLogin: boolean,
    nick: string,
    uid: number,
    lastSessiontime: string,
}
const initState: AdminState = {
    isLogin: false,
    nick: '',
    uid: 0,
    lastSessiontime: '',
}
interface Action {
    type: string,
    preload?: any
}
function adminLogin(state = initState, action: Action) {
    if (action.type === adminAction.ADMIN_LOGIN) {
        let newState = Object.assign({}, state);
        newState.isLogin = true;
        newState.nick = action.preload.nick;
        newState.uid = action.preload.uid;
        newState.lastSessiontime = action.preload.lastSessiontime;
        return newState;
    }
    return state;
}
function adminLogout(state = initState, action: Action) {
    if (action.type === adminAction.ADMIN_LOGOUT) {
        let newState = Object.assign({}, state);
        newState.isLogin = false;
        return newState;
    }
    return state;
}

export default function reducer(state = initState, action: Action) {
    switch (action.type) {
        case adminAction.ADMIN_LOGIN:
            return adminLogin(state, action)
        case adminAction.ADMIN_LOGOUT:
            return adminLogout(state, action)
        default:
            break;
    };
    return state;
}


