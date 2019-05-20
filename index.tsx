/**
 * @format
 */
import React from "react"
import { AppRegistry } from "react-native"
import App from "./App"
import { name as appName } from "./app.json"
import { Provider } from "react-redux"
import store from "@redux/stores/store"
import { Provider as AntProvider } from "@ant-design/react-native"
import BackgroundJob from "react-native-background-job"
import Buff from "@utils/Buff"

const Root = () => (
  <Provider store={store}>
    <AntProvider>
      <App />
    </AntProvider>
  </Provider>
)
AppRegistry.registerComponent(appName, () => Root)

const backgroundJob = {
  jobKey: "检查是否有新消息",
  period: 5000,
  job: () => {
    console.log("这是后台任务,正在更新角标")
    Buff.setShortcutBadger(parseInt(Math.random() * 100 + ""))
  },
}

BackgroundJob.register(backgroundJob)
