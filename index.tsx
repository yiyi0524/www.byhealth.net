import React from "react"
import { AppRegistry } from "react-native"
import App from "./App"
import { name as appName } from "./app.json"
import { Provider } from "react-redux"
import store from "@redux/stores/store"
import { Provider as AntProvider } from "@ant-design/react-native"
import { disableFontScale } from "@/utils/utils"

const Root = () => (
  <Provider store={store}>
    <AntProvider>
      <App />
    </AntProvider>
  </Provider>
)
disableFontScale()
AppRegistry.registerComponent(appName, () => Root)
