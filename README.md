# KKAPE Gearbox

一个基于 Rust + Tauri 2 + Vue3 的现代化工具集合平台，采用微前端插件架构。

## 🚀 特性

- **插件隔离**: 每个工具独立运行，单个工具崩溃不影响主程序
- **现代界面**: Vue3 + Naive UI + UnoCSS，统一设计系统
- **易扩展**: 基于 Tauri Plugin 的插件系统，支持热插拔
- **跨平台**: 支持 Windows、macOS、Linux
- **自动更新**: 内置增量更新机制

## 🏗️ 架构

```
┌──────────────────────────────┐
│        App Shell (Rust)      │ ① 主窗口/菜单/插件调度
│  • Tauri Core & Updater      │
│  • Global Event Bus (IPC)    │
└────────────┬─────────────────┘
             │
┌────────────▼─────────────┐
│    Plugin Runtime Layer   │ ② 每个插件各自为政
│  • Rust Crate (tauri-plugin)│
│  • Optional WASM module    │
│  • JS/TS API Bindings      │
└────────────┬──────────────┘
             │  invoke/emit
┌────────────▼──────────────┐
│    Micro Front-end (UI)    │ ③ Vue3 SPA
│  • Vite + Module Federation│
│  • Naive UI + UnoCSS       │
│  • @vueuse/motion          │
└────────────────────────────┘
```

## 📁 项目结构

```
kkape-gearbox/
├─ apps/
│  └─ shell/             # Tauri 主应用
├─ plugins/
│  ├─ logger/            # 日志工具插件
│  ├─ influx-client/     # InfluxDB 客户端插件
│  └─ ...
├─ ui/
│  ├─ shell/             # 主界面
│  ├─ tool-logger/       # 日志工具 UI
│  ├─ tool-influx/       # InfluxDB 工具 UI
│  └─ shared-design/     # 共享设计系统
├─ scripts/
│  ├─ build.js           # 构建脚本
│  └─ release.js         # 发布脚本
└─ docs/                 # 文档
```

## 🛠️ 开发环境

### 前置要求

- Rust 1.70+
- Node.js 18+
- pnpm 8+

### 快速开始

```bash
# 1. 克隆项目
git clone <repository-url>
cd kkape-gearbox

# 2. 环境设置
pnpm setup

# 3. 启动开发服务器
pnpm dev
```

### 常用命令

```bash
# 开发
pnpm dev              # 启动开发服务器
pnpm build            # 构建应用
pnpm test             # 运行测试

# 插件开发
pnpm create:plugin    # 创建新插件
pnpm create:ui        # 创建插件 UI

# 版本管理和自动发布
pnpm bump:patch       # 升级补丁版本 (0.1.0 -> 0.1.1)
pnpm bump:minor       # 升级次版本 (0.1.0 -> 0.2.0)
pnpm bump:major       # 升级主版本 (0.1.0 -> 1.0.0)
pnpm release          # 自动发布 (推送后 GitHub Actions 自动构建)
```

## 📦 插件开发

### 创建新插件

```bash
# 创建 Rust 插件
pnpm create:plugin <plugin-name>

# 创建对应的 UI
pnpm create:ui <plugin-name>
```

### 插件结构

每个插件包含：
- Rust crate (`plugins/<name>/`)
- Vue3 微前端 (`ui/tool-<name>/`)
- TypeScript 类型定义

## 🎨 设计系统

基于 Naive UI + UnoCSS，提供：
- 统一的颜色系统
- 响应式布局
- 暗黑模式支持
- 动画效果

## 🚀 自动化发布

项目支持基于版本变更的自动化发布流程：

### 快速发布
```bash
# 1. 升级版本
pnpm bump:patch  # 或 minor/major

# 2. 编辑 CHANGELOG.md 添加变更内容

# 3. 一键发布
pnpm release
```

### 自动化流程
当 `package.json` 版本变更推送到 GitHub 时，会自动：
- 🏷️ 创建 Git 标签
- 🔨 构建多平台应用包 (Windows/macOS/Linux)
- 📦 创建 GitHub Release
- ⬆️ 上传所有构建产物

详细说明请参考 [自动化发布文档](docs/AUTO_RELEASE.md)

## 📄 许可证

MIT License
