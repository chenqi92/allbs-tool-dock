import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS()
  ],

  server: {
    port: 5174,
    strictPort: true
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@shared': resolve(__dirname, '../shared-design/src')
    }
  },

  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'TcpToolTool',
      fileName: (format) => `tool-tcp-tool.${format}.js`
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
