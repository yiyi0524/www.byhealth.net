import bottomNav from './bottomNav'
import { StackNavigationOptions } from '@react-navigation/stack'
import { InitialState } from '@react-navigation/routers'
import Login from '@pages/user/Login'
import Register from '@pages/user/Register'
import ForgetPwd from '@pages/user/ForgetPwd'
import { RouteConfig } from '@react-navigation/native'
import { StackCardMode, StackHeaderMode } from '@react-navigation/stack/lib/typescript/src/types'
type ParamList = {
  [key: string]: undefined
}
type AnyRouteName = any
type AnyScreenOptions = any
const config: {
  screens: {
    [key: string]: RouteConfig<ParamList, AnyRouteName, AnyScreenOptions>
  }
  initState?: InitialState
  stackNavConfig: {
    initialRouteName: string
    mode?: StackCardMode
    headerMode?: StackHeaderMode
    navigationOptions?: StackNavigationOptions
  }
} = {
  screens: {
    Index: {
      name: 'Index',
      component: bottomNav,
    },
    Login: {
      name: 'Login',
      component: Login,
    },
    Register: {
      name: 'Register',
      component: Register,
    },
    ForgetPwd: {
      name: 'ForgetPwd',
      component: ForgetPwd,
    },
  },
  stackNavConfig: {
    headerMode: 'none',
    initialRouteName: 'Index',
    navigationOptions: {
      headerTitleAllowFontScaling: false,
    },
  },
}
export default config
