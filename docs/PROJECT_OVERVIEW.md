# KKAPE Gearbox 项目总览

## 🎯 项目目标

KKAPE Gearbox 是一个基于 **Rust + Tauri 2 + Vue3** 的现代化工具集合平台，采用微前端插件架构，旨在提供：

- **功能隔离**：单个工具崩溃不影响主程序
- **界面优美**：统一视觉设计，流畅动效
- **易扩展**：任何人都能轻松开发插件

## 🏗️ 技术架构

### 核心技术栈

| 层级 | 技术选择 | 说明 |
|------|----------|------|
| **前端框架** | Vue 3 + TypeScript | 现代响应式框架 |
| **UI 组件库** | Naive UI | 原生 Vue3 组件库 |
| **CSS 框架** | UnoCSS | 原子化 CSS，高性能 |
| **状态管理** | Pinia | Vue 官方推荐 |
| **路由** | Vue Router 4 | 单页应用路由 |
| **动画** | @vueuse/motion | 声明式动画 |
| **后端框架** | Tauri 2 | Rust + Web 混合应用 |
| **插件系统** | Tauri Plugin | 原生插件隔离 |
| **构建工具** | Vite | 快速构建和热重载 |

### 架构分层

```
┌─────────────────────────────────┐
│         用户界面层               │
│  Vue3 + Naive UI + UnoCSS      │
├─────────────────────────────────┤
│         应用核心层               │
│  Tauri Shell + Plugin Manager  │
├─────────────────────────────────┤
│        插件运行时层              │
│  Rust Crates + WASM Modules    │
├─────────────────────────────────┤
│          系统层                 │
│  OS APIs + File System + Network│
└─────────────────────────────────┘
```

## 📁 项目结构

```
kkape-gearbox/
├── 📁 apps/                    # 应用程序
│   └── 📁 shell/              # Tauri 主应用
│       ├── 📄 Cargo.toml      # Rust 依赖配置
│       ├── 📄 tauri.conf.json # Tauri 配置
│       └── 📁 src/            # Rust 源码
├── 📁 plugins/                # 插件目录
│   └── 📁 logger/             # 日志插件示例
├── 📁 ui/                     # 前端应用
│   ├── 📁 shell/              # 主界面
│   └── 📁 tool-*/             # 工具界面
├── 📁 scripts/                # 构建脚本
│   ├── 📄 create-plugin.js    # 创建插件脚本
│   ├── 📄 create-ui.js        # 创建 UI 脚本
│   └── 📄 setup.js            # 环境设置脚本
├── 📁 docs/                   # 文档
├── 📁 .github/workflows/      # CI/CD 配置
├── 📁 .vscode/                # VS Code 配置
├── 📄 package.json            # 项目配置
├── 📄 pnpm-workspace.yaml     # Monorepo 配置
└── 📄 Cargo.toml              # Rust 工作空间
```

## 🔌 插件系统

### 插件架构

每个插件包含两部分：

1. **Rust 后端** (`plugins/<name>/`)
   - 业务逻辑处理
   - 系统 API 调用
   - 数据持久化

2. **Vue 前端** (`ui/tool-<name>/`)
   - 用户界面
   - 交互逻辑
   - 状态管理

### 通信机制

```rust
// Rust 端定义命令
#[tauri::command]
async fn my_command(data: String) -> Result<String, String> {
    // 处理逻辑
    Ok(result)
}
```

```typescript
// Vue 端调用命令
import { invoke } from '@tauri-apps/api/core'

const result = await invoke('plugin:my-tool|my_command', { data })
```

## 🎨 设计系统

### 颜色系统

- **主色调**：蓝色系 (#3b82f6)
- **辅助色**：灰色系
- **状态色**：绿色(成功)、红色(错误)、黄色(警告)
- **暗黑模式**：自动适配系统主题

### 组件规范

- **卡片**：`card` 类名，统一圆角和阴影
- **按钮**：`btn-primary`、`btn-secondary` 类名
- **布局**：`flex-center`、`flex-col-center` 等工具类
- **动画**：统一的过渡效果和微交互

## 🛠️ 开发工作流

### 环境设置

```bash
# 1. 克隆项目
git clone <repository>
cd kkape-gearbox

# 2. 运行设置脚本
pnpm setup

# 3. 启动开发服务器
pnpm dev
```

### 插件开发

```bash
# 1. 创建新插件
pnpm create:plugin my-tool

# 2. 创建对应 UI
pnpm create:ui my-tool

# 3. 开发和测试
pnpm dev
```

### 构建发布

```bash
# 开发构建
pnpm build

# 生产构建（通过 CI/CD）
git tag v1.0.0
git push origin v1.0.0
```

## 📦 部署策略

### 支持平台

- **Windows**：MSI 安装包
- **macOS**：DMG 镜像文件
- **Linux**：AppImage 便携应用

### 自动更新

- 基于 Tauri Updater
- 增量更新支持
- 插件独立更新

### CI/CD 流程

1. **代码检查**：ESLint + Clippy
2. **自动测试**：前端 + 后端测试
3. **多平台构建**：GitHub Actions
4. **自动发布**：Tag 触发发布

## 🔒 安全考虑

### 沙箱隔离

- 每个插件独立进程
- 限制系统 API 访问
- CSP 内容安全策略

### 权限管理

- 最小权限原则
- 用户授权确认
- 敏感操作审计

## 📈 性能优化

### 前端优化

- **懒加载**：按需加载插件 UI
- **代码分割**：Vite 自动分割
- **缓存策略**：浏览器缓存 + Service Worker

### 后端优化

- **异步处理**：Tokio 异步运行时
- **内存管理**：Rust 零成本抽象
- **编译优化**：Release 模式优化

## 🧪 测试策略

### 前端测试

- **单元测试**：Vitest + Vue Test Utils
- **组件测试**：Vue Testing Library
- **E2E 测试**：Playwright（计划中）

### 后端测试

- **单元测试**：Rust 内置测试框架
- **集成测试**：Tauri 测试工具
- **性能测试**：Criterion（计划中）

## 🚀 未来规划

### 短期目标（1-3 个月）

- [ ] 完善核心插件（日志、数据库客户端）
- [ ] 优化用户体验和界面设计
- [ ] 添加更多示例插件
- [ ] 完善文档和教程

### 中期目标（3-6 个月）

- [ ] 插件市场和分发机制
- [ ] 主题系统和自定义
- [ ] 多语言支持
- [ ] 云同步功能

### 长期目标（6-12 个月）

- [ ] 插件开发 IDE 集成
- [ ] 企业版功能
- [ ] 移动端支持
- [ ] 社区生态建设

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 创建 Pull Request

详细信息请参考 [DEVELOPMENT.md](./DEVELOPMENT.md)。
