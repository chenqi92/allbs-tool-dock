<template>
  <div class="min-h-screen p-8">
    <div class="max-w-6xl mx-auto">
      <header class="mb-12">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-4">
          样式系统演示
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400">
          展示KKAPE Gearbox的现代化设计系统
        </p>
      </header>

      <!-- 按钮演示 -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">按钮样式</h2>
        <div class="flex flex-wrap gap-4">
          <button class="btn-primary">主要按钮</button>
          <button class="btn-secondary">次要按钮</button>
          <button class="btn-success">成功按钮</button>
          <button class="btn-danger">危险按钮</button>
          <button class="btn-warning">警告按钮</button>
          <button class="btn-ghost">幽灵按钮</button>
        </div>
      </section>

      <!-- 卡片演示 -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">卡片样式</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="card p-6">
            <h3 class="text-lg font-semibold mb-2">基础卡片</h3>
            <p class="text-gray-600 dark:text-gray-400">这是一个基础的卡片样式</p>
          </div>
          <div class="card-hover p-6">
            <h3 class="text-lg font-semibold mb-2">悬浮卡片</h3>
            <p class="text-gray-600 dark:text-gray-400">鼠标悬浮时有动画效果</p>
          </div>
          <div class="card-gradient p-6">
            <h3 class="text-lg font-semibold mb-2">渐变卡片</h3>
            <p class="text-gray-600 dark:text-gray-400">带有渐变背景的卡片</p>
          </div>
        </div>
      </section>

      <!-- 工具卡片演示 -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">工具卡片</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="tool-card group">
            <div class="flex items-start justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all duration-300">
                <div class="i-carbon-network-3 text-white text-xl"></div>
              </div>
              <div class="px-3 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-400">
                已启用
              </div>
            </div>
            
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                TCP 工具
              </h3>
              
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                专业的TCP客户端/服务端调试工具，支持实时消息收发和连接管理
              </p>
              
              <div class="flex items-center gap-2 mb-3">
                <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md">
                  网络工具
                </span>
              </div>
            </div>
            
            <div class="flex items-center justify-between mt-auto">
              <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                <div class="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                <span>专业工具</span>
              </div>
              <button class="btn-primary text-sm px-4 py-2">
                <div class="i-carbon-launch mr-2"></div>
                打开
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 表单演示 -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">表单元素</h2>
        <div class="card p-6 max-w-md">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                输入框
              </label>
              <input type="text" placeholder="请输入内容..." class="input-base w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                文本域
              </label>
              <textarea placeholder="请输入多行内容..." class="textarea-base w-full"></textarea>
            </div>
          </div>
        </div>
      </section>

      <!-- 状态指示器演示 -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">状态指示器</h2>
        <div class="flex flex-wrap gap-6">
          <div class="flex items-center gap-2">
            <div class="status-connected"></div>
            <span>已连接</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="status-disconnected"></div>
            <span>已断开</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="status-connecting"></div>
            <span>连接中</span>
          </div>
        </div>
      </section>

      <!-- 工具栏演示 -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">工具栏</h2>
        <div class="toolbar">
          <div class="flex items-center gap-4">
            <div class="toolbar-group">
              <button class="btn-primary text-sm">连接</button>
              <button class="btn-success text-sm">启动</button>
            </div>
            <div class="toolbar-group">
              <button class="btn-secondary text-sm">清空</button>
              <button class="btn-secondary text-sm">导出</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// 样式演示页面
</script>
