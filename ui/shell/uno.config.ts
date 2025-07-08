import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

export default defineConfig({
  shortcuts: [
    // 布局相关
    ['flex-center', 'flex items-center justify-center'],
    ['flex-col-center', 'flex flex-col items-center justify-center'],
    ['absolute-center', 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'],
    
    // 卡片样式
    ['card', 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'],
    ['card-hover', 'card hover:shadow-md transition-shadow duration-200'],
    
    // 按钮样式
    ['btn', 'px-4 py-2 rounded-md font-medium transition-colors duration-200'],
    ['btn-primary', 'btn bg-blue-600 hover:bg-blue-700 text-white'],
    ['btn-secondary', 'btn bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100'],
    
    // 文本样式
    ['text-muted', 'text-gray-600 dark:text-gray-400'],
    ['text-primary', 'text-blue-600 dark:text-blue-400'],
    
    // 动画
    ['animate-fade-in', 'animate-duration-300 animate-ease-out animate-fade-in'],
    ['animate-slide-up', 'animate-duration-300 animate-ease-out animate-slide-in-up']
  ],
  
  theme: {
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      }
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Consolas', 'monospace']
    }
  },
  
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      collections: {
        carbon: () => import('@iconify-json/carbon/icons.json').then(i => i.default),
        mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
        tabler: () => import('@iconify-json/tabler/icons.json').then(i => i.default)
      }
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'Inter:400,500,600,700',
        mono: 'JetBrains Mono:400,500,600'
      }
    })
  ],
  
  transformers: [
    transformerDirectives(),
    transformerVariantGroup()
  ]
})
