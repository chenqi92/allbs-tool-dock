import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS()
  ],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@shared': resolve(__dirname, '../shared-design/src')
    }
  },

  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'JsonFormatterTool',
      fileName: (format) => `tool-json-formatter.${format}.js`
    },
    rollupOptions: {
      external: ['vue', '@tauri-apps/api'],
      output: {
        globals: {
          vue: 'Vue',
          '@tauri-apps/api': 'TauriAPI'
        }
      }
    }
  }
})
