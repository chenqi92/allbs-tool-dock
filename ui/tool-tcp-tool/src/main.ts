import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:uno.css'

export default function createTcpToolTool() {
  return createApp(App)
}

// 如果直接运行，则挂载到 DOM
if (import.meta.env.DEV) {
  const app = createTcpToolTool()
  app.mount('#app')
}
