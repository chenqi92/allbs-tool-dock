# 开发指南

## 环境要求

### 必需软件

- **Rust** 1.70+
  ```bash
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  ```

- **Node.js** 18+
  ```bash
  # 推荐使用 nvm 管理 Node.js 版本
  nvm install 18
  nvm use 18
  ```

- **pnpm** 8+
  ```bash
  npm install -g pnpm
  ```

- **Tauri CLI**
  ```bash
  cargo install tauri-cli
  ```

### 可选软件

- **VS Code** + Rust Analyzer + Vetur/Volar 扩展
- **Git** 版本控制

## 项目结构

```
kkape-gearbox/
├─ apps/shell/           # Tauri 主应用
│  ├─ src/              # Rust 源码
│  ├─ tauri.conf.json   # Tauri 配置
│  └─ Cargo.toml        # Rust 依赖
├─ plugins/             # 插件目录
│  ├─ logger/           # 日志插件
│  └─ influx-client/    # InfluxDB 客户端插件
├─ ui/                  # 前端应用
│  ├─ shell/            # 主界面
│  ├─ tool-logger/      # 日志工具 UI
│  └─ shared-design/    # 共享设计系统
├─ scripts/             # 构建脚本
└─ docs/                # 文档
```

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd kkape-gearbox
```

### 2. 安装依赖

```bash
# 安装前端依赖
pnpm install

# 安装 Rust 依赖（自动）
cd apps/shell
cargo check
```

### 3. 启动开发服务器

```bash
# 方式 1: 使用开发脚本（推荐）
pnpm dev

# 方式 2: 手动启动
# 终端 1: 启动前端
cd ui/shell
pnpm dev

# 终端 2: 启动 Tauri
cd apps/shell
cargo tauri dev
```

### 4. 生成应用图标

```bash
# 生成图标（从根目录的 icon.png）
pnpm generate:icons

# 检查图标状态
pnpm check:icons

# 安装 ImageMagick（可选，用于高质量图标）
pnpm install:imagemagick
```

### 5. 构建应用

```bash
# 构建生产版本
pnpm build

# 或者手动构建
cd ui/shell
pnpm build
cd ../../apps/shell
cargo tauri build
```

## 版本管理和发布

### 版本升级

```bash
# 升级补丁版本 (0.1.0 -> 0.1.1)
pnpm bump:patch

# 升级次版本 (0.1.0 -> 0.2.0)
pnpm bump:minor

# 升级主版本 (0.1.0 -> 1.0.0)
pnpm bump:major

# 创建预发布版本 (0.1.0 -> 0.1.0-beta.1)
pnpm bump:prerelease
```

### 发布流程

```bash
# 1. 升级版本并同步到所有文件
pnpm bump:patch

# 2. 编辑 CHANGELOG.md 添加变更内容

# 3. 一键发布
pnpm release
```

### 自动化构建

推送带有 `v*` 标签时，GitHub Actions 会自动：
- 构建多平台应用包
- 创建 GitHub Release
- 上传构建产物

详细信息请参考 [发布指南](./RELEASE.md)。

## 插件开发

### 创建新插件

```bash
# 创建 Rust 插件
pnpm create:plugin my-tool

# 创建对应的 UI
pnpm create:ui my-tool
```

### 插件结构

每个插件包含两部分：

1. **Rust 插件** (`plugins/<name>/`)
   - `Cargo.toml` - 依赖配置
   - `src/lib.rs` - 插件逻辑

2. **Vue UI** (`ui/tool-<name>/`)
   - `package.json` - 前端依赖
   - `src/` - Vue 组件

### 插件注册

1. 在 `apps/shell/Cargo.toml` 中添加插件依赖：
   ```toml
   [dependencies]
   tauri-plugin-my-tool = { path = "../../plugins/my-tool", optional = true }
   
   [features]
   tool-my-tool = ["tauri-plugin-my-tool"]
   ```

2. 在 `apps/shell/src/main.rs` 中注册插件：
   ```rust
   #[cfg(feature = "tool-my-tool")]
   {
       app = app.plugin(tauri_plugin_my_tool::init());
   }
   ```

## 前端开发

### 技术栈

- **Vue 3** + **TypeScript**
- **Naive UI** 组件库
- **UnoCSS** 原子化 CSS
- **Pinia** 状态管理
- **Vue Router** 路由
- **@vueuse/motion** 动画

### 设计系统

使用 UnoCSS 提供的原子化类名：

```vue
<template>
  <!-- 卡片 -->
  <div class="card p-6">
    <!-- 按钮 -->
    <button class="btn-primary">主要按钮</button>
    <button class="btn-secondary">次要按钮</button>
    
    <!-- 布局 -->
    <div class="flex-center">居中内容</div>
    <div class="flex-col-center">垂直居中</div>
  </div>
</template>
```

### API 调用

使用 Tauri 的 `invoke` API 调用后端：

```typescript
import { invoke } from '@tauri-apps/api/core'

// 调用插件命令
const result = await invoke('plugin:my-tool|my_command', {
  param1: 'value1',
  param2: 'value2'
})
```

## 后端开发

### Tauri 命令

定义 Tauri 命令：

```rust
#[tauri::command]
async fn my_command(param1: String, param2: String) -> Result<String, String> {
    // 处理逻辑
    Ok(format!("Processed: {} {}", param1, param2))
}

// 注册命令
.invoke_handler(tauri::generate_handler![my_command])
```

### 插件开发

插件模板：

```rust
use tauri::{plugin::TauriPlugin, Runtime};

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    tauri::plugin::Builder::new("my-tool")
        .invoke_handler(tauri::generate_handler![
            my_command
        ])
        .setup(|app, _api| {
            // 初始化逻辑
            Ok(())
        })
        .build()
}
```

## 调试

### 前端调试

1. 浏览器开发者工具（开发模式）
2. Vue DevTools 扩展
3. VS Code 调试配置

### 后端调试

1. 使用 `tracing` 日志：
   ```rust
   use tracing::{info, warn, error};
   
   info!("This is an info message");
   error!("This is an error message");
   ```

2. 设置日志级别：
   ```bash
   RUST_LOG=debug cargo tauri dev
   ```

## 测试

### 前端测试

```bash
# 运行测试
cd ui/shell
pnpm test

# 运行测试 UI
pnpm test:ui
```

### 后端测试

```bash
# 运行 Rust 测试
cd apps/shell
cargo test

# 运行特定插件测试
cd plugins/logger
cargo test
```

## 构建和发布

### 本地构建

```bash
# 构建所有平台
pnpm build

# 构建特定平台
cargo tauri build --target x86_64-pc-windows-msvc
```

### CI/CD

项目使用 GitHub Actions 进行自动构建和发布。

配置文件位于 `.github/workflows/`。

## 常见问题

### 1. Tauri 启动失败

检查 Rust 工具链和依赖：
```bash
rustup update
cargo clean
cargo check
```

### 2. 前端编译错误

清理缓存并重新安装：
```bash
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### 3. 插件加载失败

检查插件是否正确注册：
1. `Cargo.toml` 中的依赖
2. `main.rs` 中的插件注册
3. 特性标志是否启用

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 创建 Pull Request

### 代码规范

- Rust: 使用 `cargo fmt` 和 `cargo clippy`
- TypeScript: 使用 ESLint 和 Prettier
- 提交信息: 使用 Conventional Commits 格式
