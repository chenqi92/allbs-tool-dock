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
  rules: [
    // Custom line-clamp rules
    ['line-clamp-2', {
      'overflow': 'hidden',
      'display': '-webkit-box',
      '-webkit-line-clamp': '2',
      '-webkit-box-orient': 'vertical'
    }],
    ['line-clamp-3', {
      'overflow': 'hidden',
      'display': '-webkit-box',
      '-webkit-line-clamp': '3',
      '-webkit-box-orient': 'vertical'
    }]
  ],

  shortcuts: [
    // 布局相关
    ['flex-center', 'flex items-center justify-center'],
    ['flex-col-center', 'flex flex-col items-center justify-center'],
    ['absolute-center', 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'],

    // 卡片样式
    ['card', 'bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200/60 dark:border-gray-700/60'],
    ['card-hover', 'card hover:shadow-medium hover:border-gray-300/60 dark:hover:border-gray-600/60 transition-all duration-300 hover:-translate-y-1'],
    ['card-glass', 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-soft border border-gray-200/50 dark:border-gray-700/50'],
    ['card-gradient', 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-medium border border-gray-200/60 dark:border-gray-700/60'],

    // 按钮样式
    ['btn', 'px-4 py-2.5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'],
    ['btn-primary', 'btn bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-soft hover:shadow-medium focus:ring-primary-500'],
    ['btn-secondary', 'btn bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 border border-gray-300 dark:border-gray-600'],
    ['btn-success', 'btn bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white shadow-soft hover:shadow-medium focus:ring-success-500'],
    ['btn-danger', 'btn bg-gradient-to-r from-danger-500 to-danger-600 hover:from-danger-600 hover:to-danger-700 text-white shadow-soft hover:shadow-medium focus:ring-danger-500'],
    ['btn-warning', 'btn bg-gradient-to-r from-warning-500 to-warning-600 hover:from-warning-600 hover:to-warning-700 text-white shadow-soft hover:shadow-medium focus:ring-warning-500'],
    ['btn-ghost', 'btn border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'],

    // 状态指示器
    ['status-dot', 'w-2 h-2 rounded-full'],
    ['status-connected', 'status-dot bg-green-500'],
    ['status-disconnected', 'status-dot bg-red-500'],
    ['status-connecting', 'status-dot bg-yellow-500 animate-pulse'],

    // 输入框样式
    ['input-base', 'px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 placeholder:text-gray-400'],
    ['textarea-base', 'input-base resize-none min-h-20'],

    // 文本样式
    ['text-muted', 'text-gray-600 dark:text-gray-400'],
    ['text-primary', 'text-blue-600 dark:text-blue-400'],
    ['text-success', 'text-green-600 dark:text-green-400'],
    ['text-danger', 'text-red-600 dark:text-red-400'],
    ['text-warning', 'text-yellow-600 dark:text-yellow-400'],

    // 代码样式
    ['code-block', 'bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-4 font-mono text-sm'],
    ['code-inline', 'bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono'],

    // 工具栏样式
    ['toolbar', 'flex items-center gap-4 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/60 dark:border-gray-700/60'],
    ['toolbar-group', 'flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600'],

    // 导航样式
    ['nav-item', 'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-all duration-200'],
    ['nav-item-active', 'bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 text-primary-700 dark:text-primary-300 shadow-soft'],

    // 工具卡片样式
    ['tool-card', 'card-hover p-6 cursor-pointer flex flex-col h-full min-h-48 relative overflow-hidden'],

    // 实用样式

    // 动画
    ['animate-fade-in', 'animate-duration-300 animate-ease-out animate-fade-in'],
    ['animate-slide-up', 'animate-duration-300 animate-ease-out animate-slide-in-up'],
    ['animate-bounce-in', 'animate-duration-500 animate-ease-out animate-bounce-in']
  ],
  
  theme: {
    colors: {
      primary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
      },
      gray: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
      },
      success: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
      },
      warning: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
      },
      danger: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
      }
    },
    fontFamily: {
      sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace']
    },
    boxShadow: {
      'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.05)',
      'medium': '0 4px 16px 0 rgba(0, 0, 0, 0.08)',
      'large': '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
      'glow': '0 0 20px rgba(59, 130, 246, 0.15)',
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
