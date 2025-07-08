# 自动化发布流程

## 🚀 概述

项目现在支持基于 `package.json` 版本变更的自动化发布流程。当版本号发生变化并推送到 GitHub 时，会自动触发构建和发布。

## 📋 工作流程

### 1. 版本升级
```bash
# 选择合适的版本类型
pnpm bump:patch    # 修复 bug (0.1.0 -> 0.1.1)
pnpm bump:minor    # 新功能 (0.1.0 -> 0.2.0)
pnpm bump:major    # 重大更改 (0.1.0 -> 1.0.0)
```

### 2. 编辑变更日志
编辑 `CHANGELOG.md`，在对应版本下添加变更内容：

```markdown
## [0.1.2] - 2025-07-08

### 新增
- 添加了新的插件管理功能
- 支持自定义主题配置

### 修复
- 修复了插件加载时的内存泄漏问题
- 解决了暗黑模式下的显示异常

### 改进
- 优化了应用启动速度
- 改进了错误提示信息
```

### 3. 一键发布
```bash
pnpm release
```

这个命令会自动：
- ✅ 检查 Git 状态
- ✅ 运行测试
- ✅ 同步版本号到所有相关文件
- ✅ 提交版本变更
- ✅ 推送到 GitHub

### 4. 自动化构建
GitHub Actions 会自动检测到 `package.json` 版本变更并：
- 🏷️ 创建 Git 标签 (如 `v0.1.2`)
- 🔨 并行构建多平台应用包
- 📦 创建 GitHub Release
- ⬆️ 上传所有构建产物

## 🎯 支持的平台

自动构建包括以下平台：

### Windows
- **可执行文件**: `kkape-gearbox.exe`
- **安装包**: MSI 安装程序
- **架构**: x86_64

### macOS
- **可执行文件**: `kkape-gearbox`
- **安装包**: DMG 镜像文件
- **架构**: Intel (x86_64) 和 Apple Silicon (aarch64)

### Linux
- **可执行文件**: `kkape-gearbox`
- **安装包**: AppImage 便携应用
- **架构**: x86_64

## 🔧 技术细节

### 触发条件
自动发布工作流在以下条件下触发：
- 推送到 `main` 或 `master` 分支
- `package.json` 文件发生变化
- 版本号确实发生了变更（与上一次提交对比）
- 对应的 Git 标签尚不存在

### 版本检测逻辑
```bash
# 获取当前版本
CURRENT_VERSION=$(node -p "require('./package.json').version")

# 获取上一次提交的版本
git checkout HEAD~1 -- package.json
PREVIOUS_VERSION=$(node -p "require('./package.json').version")

# 比较版本是否变化
if [ "$CURRENT_VERSION" != "$PREVIOUS_VERSION" ]; then
  # 触发发布流程
fi
```

### 预发布版本支持
系统自动识别预发布版本（包含 `alpha`、`beta`、`rc` 的版本）并标记为预发布：
- `1.0.0-alpha.1` → 预发布
- `1.0.0-beta.2` → 预发布
- `1.0.0-rc.1` → 预发布
- `1.0.0` → 正式发布

## 📊 监控和调试

### 查看构建状态
- 访问 GitHub 仓库的 Actions 页面
- 查看 "Auto Release" 工作流的运行状态
- 每个平台的构建都是并行进行的

### 常见问题排查

#### 1. 版本未触发发布
**可能原因**：
- 版本号没有实际变化
- 对应的 Git 标签已存在
- 推送的不是 `main` 或 `master` 分支

**解决方案**：
```bash
# 检查当前分支
git branch --show-current

# 检查版本变更
git log --oneline -2

# 检查现有标签
git tag -l
```

#### 2. 构建失败
**可能原因**：
- 依赖安装失败
- 代码编译错误
- 测试未通过

**解决方案**：
- 查看 GitHub Actions 日志
- 本地运行 `pnpm test` 和 `pnpm build` 确保无误
- 检查所有平台的依赖是否正确

#### 3. 文件上传失败
**可能原因**：
- 构建产物路径不正确
- GitHub token 权限不足

**解决方案**：
- 检查 `apps/shell/src-tauri/target/` 目录结构
- 确认 GitHub Actions 有写入 Releases 的权限

## 🎉 优势

### 相比手动发布的优势：
1. **自动化程度高** - 只需运行一个命令
2. **减少人为错误** - 自动检测版本变更，避免重复发布
3. **并行构建** - 多平台同时构建，节省时间
4. **一致性保证** - 所有平台使用相同的代码和配置
5. **可追溯性** - 每次发布都有完整的构建日志

### 相比原有标签触发的优势：
1. **更直观** - 直接基于版本号变更触发
2. **更安全** - 自动检查标签是否已存在，避免冲突
3. **更灵活** - 支持任何分支的版本变更（配置为 main/master）
4. **更智能** - 只有真正的版本变更才会触发发布

## 📝 最佳实践

1. **版本号管理**
   - 使用语义化版本规范
   - 通过脚本统一升级版本号
   - 及时更新 CHANGELOG.md

2. **发布前检查**
   - 确保所有测试通过
   - 检查代码已合并到主分支
   - 验证功能完整性

3. **发布后验证**
   - 检查 GitHub Release 是否创建成功
   - 验证所有平台的构建产物
   - 测试下载和安装流程

## 🔗 相关文件

- `.github/workflows/auto-release.yml` - 自动发布工作流
- `scripts/release.js` - 发布脚本
- `scripts/bump-version.js` - 版本升级脚本
- `scripts/sync-version.js` - 版本同步脚本
