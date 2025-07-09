import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:uno.css'

export default function createJsonFormatterTool() {
  return createApp(App)
}

// 如果直接运行，则挂载到 DOM
if (import.meta.env.DEV) {
  const app = createJsonFormatterTool()
  app.mount('#app')
}
