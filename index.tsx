import "react-native-gesture-handler"
import React from "react"
import { AppRegistry } from "react-native"
import App from "./App"
import { name as appName } from "./app.json"
import { Provider } from "react-redux"
import store from "@redux/stores/store"
import { Provider as AntProvider } from "@ant-design/react-native"
import { Sentry } from "react-native-sentry"
Sentry.config("https://784ec19661794912bf90bc666a381694@sentry.buffge.com/8").install()

const Root = () => (
  <Provider store={store}>
    <AntProvider>
      <App />
    </AntProvider>
  </Provider>
)
console.disableYellowBox = true
AppRegistry.registerComponent(appName, () => Root)
