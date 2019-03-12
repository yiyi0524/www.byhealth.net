import appAction from '../constants/app';
const initState = {
    admin: {
        isLogin: false,
    },
}
interface Action {
    type: string,
}
function adminLogin(state = initState, action: Action) {
    if (action.type === appAction.ADMIN_LOGIN) {
        let newState = Object.assign({}, state);
        newState.admin.isLogin = true;
        return newState;
    }
    return state;
}
function adminLogout(state = initState, action: Action) {
    if (action.type === appAction.ADMIN_LOGOUT) {
        let newState = Object.assign({}, state);
        newState.admin.isLogin = false;
        return newState;
    }
    return state;
}

export default function reducer(state = initState, action: Action) {
    switch (action.type) {
        case appAction.ADMIN_LOGIN:
            return adminLogin(state, action)
        case appAction.ADMIN_LOGOUT:
            return adminLogout(state, action)
        default:
            break;
    };
    return state;
}


