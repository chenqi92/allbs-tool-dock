# 更新日志

本文档记录了 KKAPE Gearbox 的所有重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [未发布]

### 计划中
- 插件市场功能
- 主题系统
- 多语言支持
- 云同步功能

## [0.1.0] - 2024-07-08

### 新增
- 🎉 初始版本发布
- 🏗️ 基于 Rust + Tauri 2 + Vue3 的微前端插件架构
- 🎨 现代化 UI 设计，支持暗黑模式
- 🔌 插件系统，支持动态加载/卸载
- 🛠️ 完整的开发工具链和脚手架
- 📦 多平台构建支持 (Windows, macOS, Linux)
- 🔄 自动更新机制
- 📚 完整的文档和开发指南

### 核心功能
- **应用 Shell**: Tauri 2 主应用框架
- **插件管理器**: 动态插件加载和隔离
- **UI 框架**: Vue 3 + Naive UI + UnoCSS
- **状态管理**: Pinia 全局状态管理
- **路由系统**: Vue Router 4 单页应用路由
- **动画系统**: @vueuse/motion 流畅动画效果

### 开发工具
- **脚手架工具**: 快速创建插件和 UI 组件
- **图标生成**: 自动生成多平台应用图标
- **版本管理**: 自动化版本同步和发布
- **CI/CD**: GitHub Actions 自动构建和发布
- **代码规范**: ESLint + Prettier + Clippy

### 示例插件
- **Logger Plugin**: 日志查看和管理工具
- **InfluxDB Client**: 数据库连接客户端（计划中）

### 技术特性
- ✅ 插件隔离：单个工具崩溃不影响主程序
- ✅ 类型安全：TypeScript + Rust 全栈类型安全
- ✅ 现代构建：Vite + Cargo 快速构建
- ✅ 跨平台：支持 Windows、macOS、Linux
- ✅ 自动更新：内置增量更新机制
- ✅ 开发友好：完整的开发工具和文档

---

## 版本说明

### 版本格式
- **主版本号 (Major)**: 不兼容的 API 修改
- **次版本号 (Minor)**: 向下兼容的功能性新增
- **修订号 (Patch)**: 向下兼容的问题修正
- **预发布版本**: alpha, beta, rc 等标识

### 变更类型
- **新增 (Added)**: 新功能
- **变更 (Changed)**: 对现有功能的变更
- **弃用 (Deprecated)**: 即将移除的功能
- **移除 (Removed)**: 已移除的功能
- **修复 (Fixed)**: 任何 bug 修复
- **安全 (Security)**: 安全相关的修复

### 发布流程
1. 更新版本号：`pnpm bump:patch|minor|major`
2. 编辑此文件添加变更内容
3. 提交更改：`git add . && git commit -m "chore: release vX.X.X"`
4. 发布版本：`pnpm release`
5. GitHub Actions 自动构建和发布

### 下载地址
- **GitHub Releases**: https://github.com/your-repo/releases
- **自动更新**: 应用内自动检查更新
