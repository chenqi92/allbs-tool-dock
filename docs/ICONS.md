# 应用图标指南

本文档详细说明了 KKAPE Gearbox 应用图标的管理和生成流程。

## 🎯 概述

KKAPE Gearbox 使用自动化脚本从单个源图标生成所有平台所需的图标格式：

- **源图标**: `icon.png` (根目录)
- **生成目录**: `apps/shell/icons/`
- **备份位置**: `assets/icon-original.png`

## 📁 图标文件结构

```
kkape-gearbox/
├── icon.png                    # 源图标 (你提供的)
├── assets/
│   └── icon-original.png       # 源图标备份
└── apps/shell/icons/
    ├── 32x32.png               # 32×32 PNG
    ├── 128x128.png             # 128×128 PNG
    ├── 128x128@2x.png          # 256×256 PNG (高分辨率)
    ├── icon.ico                # Windows 图标
    ├── icon.icns               # macOS 图标
    └── README.md               # 图标说明
```

## 🛠️ 快速开始

### 1. 准备源图标

将你的应用图标命名为 `icon.png` 并放在项目根目录。

**图标要求**:
- 格式: PNG
- 尺寸: 512×512 或更高 (推荐 1024×1024)
- 背景: 透明
- 设计: 简洁明了

### 2. 生成图标

```bash
# 生成所有平台的图标
pnpm generate:icons
```

### 3. 验证图标

```bash
# 检查图标状态
pnpm check:icons
```

### 4. 构建测试

```bash
# 构建应用测试图标
pnpm build
```

## 🎨 图标设计建议

### ✅ 推荐做法

- **简洁设计**: 使用简单的几何形状和图案
- **高对比度**: 确保在浅色和深色背景下都清晰可见
- **可缩放性**: 在 16×16 到 1024×1024 所有尺寸下都清晰
- **品牌一致**: 与应用的整体设计风格保持一致
- **透明背景**: 使用 PNG 格式的透明背景

### ❌ 避免事项

- **复杂细节**: 避免在小尺寸下无法辨识的细节
- **细小文字**: 文字在小图标中通常不清晰
- **过多颜色**: 保持颜色数量适中
- **边缘模糊**: 确保边缘清晰锐利

## 🔧 高级配置

### 安装 ImageMagick (推荐)

ImageMagick 可以生成更高质量的图标：

```bash
# 检查 ImageMagick 安装状态
pnpm install:imagemagick

# Windows
# 下载: https://imagemagick.org/script/download.php#windows

# macOS
brew install imagemagick

# Linux (Ubuntu/Debian)
sudo apt-get install imagemagick
```

### 手动生成图标

如果需要更精细的控制：

```bash
# 使用 ImageMagick 手动生成
magick icon.png -resize 32x32 apps/shell/icons/32x32.png
magick icon.png -resize 128x128 apps/shell/icons/128x128.png
magick icon.png -resize 256x256 apps/shell/icons/128x128@2x.png

# 生成 Windows ICO
magick icon.png \
  \( -clone 0 -resize 16x16 \) \
  \( -clone 0 -resize 32x32 \) \
  \( -clone 0 -resize 48x48 \) \
  \( -clone 0 -resize 64x64 \) \
  \( -clone 0 -resize 128x128 \) \
  \( -clone 0 -resize 256x256 \) \
  -delete 0 apps/shell/icons/icon.ico
```

## 📦 平台特定说明

### Windows (.msi)

- 使用 `icon.ico` 文件
- 包含多个尺寸 (16, 32, 48, 64, 128, 256)
- 显示在安装程序、任务栏、文件资源管理器中

### macOS (.dmg)

- 使用 `icon.icns` 文件
- 包含从 16×16 到 1024×1024 的所有尺寸
- 支持 Retina 显示器的高分辨率版本

### Linux (.AppImage)

- 使用 PNG 文件
- 主要使用 128×128 尺寸
- 显示在应用菜单和任务栏中

## 🔍 故障排除

### 图标不显示

1. **检查文件存在**:
   ```bash
   pnpm check:icons
   ```

2. **重新生成图标**:
   ```bash
   pnpm generate:icons
   ```

3. **清理构建缓存**:
   ```bash
   cd apps/shell
   cargo clean
   pnpm build
   ```

### 图标质量问题

1. **检查源图标质量**:
   - 确保源图标足够大 (≥512×512)
   - 使用矢量格式 (SVG) 作为源文件更佳

2. **安装 ImageMagick**:
   ```bash
   pnpm install:imagemagick
   pnpm generate:icons
   ```

3. **手动优化**:
   - 使用专业图像编辑软件 (Photoshop, GIMP)
   - 为不同尺寸单独优化

### 构建错误

1. **检查 Tauri 配置**:
   ```bash
   # 确保 tauri.conf.json 中的图标路径正确
   cat apps/shell/tauri.conf.json | grep -A 10 "icon"
   ```

2. **验证文件权限**:
   ```bash
   ls -la apps/shell/icons/
   ```

## 📋 检查清单

在发布前，确保：

- [ ] 源图标 (`icon.png`) 质量良好
- [ ] 所有平台图标已生成
- [ ] `pnpm check:icons` 通过
- [ ] 构建测试成功
- [ ] 在目标平台上验证图标显示

## 🔄 更新流程

当需要更新应用图标时：

1. **替换源图标**:
   ```bash
   # 用新图标替换 icon.png
   cp new-icon.png icon.png
   ```

2. **重新生成**:
   ```bash
   pnpm generate:icons
   ```

3. **验证更改**:
   ```bash
   pnpm check:icons
   ```

4. **测试构建**:
   ```bash
   pnpm build
   ```

5. **提交更改**:
   ```bash
   git add icon.png apps/shell/icons/ assets/
   git commit -m "Update application icon"
   ```

## 🎯 最佳实践

1. **版本控制**: 将生成的图标文件提交到版本控制
2. **备份源文件**: 保留高分辨率的源文件
3. **测试多平台**: 在所有目标平台上测试图标显示
4. **定期检查**: 使用 `pnpm check:icons` 定期验证图标状态
5. **文档更新**: 图标更改时更新相关文档

## 📚 相关资源

- [Tauri 图标指南](https://tauri.app/v1/guides/features/icons)
- [ImageMagick 文档](https://imagemagick.org/script/command-line-processing.php)
- [图标设计最佳实践](https://developer.apple.com/design/human-interface-guidelines/app-icons)
- [Windows 图标指南](https://docs.microsoft.com/en-us/windows/apps/design/style/iconography/app-icons)
