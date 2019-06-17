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

const Root = () => (
  <Provider store={store}>
    <AntProvider>
      <App />
    </AntProvider>
  </Provider>
)
AppRegistry.registerComponent(appName, () => Root)

// if (Platform.OS === "android") {
//   const backgroundJob = {
//     jobKey: "检查是否有新消息",
//     job: async () => {
//       console.log("这是后台任务,正在更新角标")
//       let {
//         data: { unreadMsgCount },
//       } = await getUnreadMsgCount()
//       Buff.setShortcutBadger(unreadMsgCount)
//     },
//   }

//   BackgroundJob.register(backgroundJob)
//   const backgroundSchedule = {
//     jobKey: "检查是否有新消息",
//     period: 50000,
//     // exact: true,
//     allowWhileIdle: true,
//   }
//   BackgroundJob.schedule(backgroundSchedule)
// }
