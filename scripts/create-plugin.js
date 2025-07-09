#!/usr/bin/env node

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

function createPlugin(pluginName) {
  if (!pluginName) {
    console.error('请提供插件名称')
    console.log('用法: pnpm create:plugin <plugin-name>')
    process.exit(1)
  }

  const pluginDir = join(rootDir, 'plugins', pluginName)
  const srcDir = join(pluginDir, 'src')

  // 检查插件是否已存在
  if (existsSync(pluginDir)) {
    console.error(`插件 ${pluginName} 已存在`)
    process.exit(1)
  }

  // 创建目录
  mkdirSync(pluginDir, { recursive: true })
  mkdirSync(srcDir, { recursive: true })

  // 创建 Cargo.toml
  const cargoToml = `[package]
name = "tauri-plugin-${pluginName}"
version = "0.1.0"
description = "${pluginName} plugin for KKAPE Gearbox"
authors = ["KKAPE Team"]
license = "MIT"
edition = "2021"

[dependencies]
# Tauri 插件框架
tauri = { workspace = true }
serde = { workspace = true }
serde_json = { workspace = true }

# 日志
tracing = { workspace = true }

# 错误处理
anyhow = { workspace = true }
thiserror = { workspace = true }

# 异步运行时
tokio = { workspace = true }

[lib]
name = "tauri_plugin_${pluginName.replace(/-/g, '_')}"
crate-type = ["cdylib", "rlib"]
`

  // 创建 lib.rs
  const libRs = `use serde::{Deserialize, Serialize};
use tauri::{plugin::TauriPlugin, Runtime, Manager, AppHandle};
use tracing::info;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ${toPascalCase(pluginName)}Config {
    pub enabled: bool,
}

impl Default for ${toPascalCase(pluginName)}Config {
    fn default() -> Self {
        Self {
            enabled: true,
        }
    }
}

pub struct ${toPascalCase(pluginName)}State {
    config: ${toPascalCase(pluginName)}Config,
}

impl ${toPascalCase(pluginName)}State {
    pub fn new(config: ${toPascalCase(pluginName)}Config) -> Self {
        Self { config }
    }
}

#[tauri::command]
async fn get_config<R: Runtime>(
    app: AppHandle<R>,
) -> Result<${toPascalCase(pluginName)}Config, String> {
    let state = app.state::<${toPascalCase(pluginName)}State>();
    Ok(state.config.clone())
}

#[tauri::command]
async fn update_config<R: Runtime>(
    app: AppHandle<R>,
    config: ${toPascalCase(pluginName)}Config,
) -> Result<(), String> {
    let state = app.state::<${toPascalCase(pluginName)}State>();
    // 这里应该实现配置更新逻辑
    info!("${pluginName} config updated: {:?}", config);
    Ok(())
}

#[tauri::command]
async fn ${toCamelCase(pluginName)}_action<R: Runtime>(
    app: AppHandle<R>,
    data: String,
) -> Result<String, String> {
    info!("${pluginName} action called with data: {}", data);
    Ok(format!("${pluginName} processed: {}", data))
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    tauri::plugin::Builder::new("${pluginName}")
        .invoke_handler(tauri::generate_handler![
            get_config,
            update_config,
            ${toCamelCase(pluginName)}_action
        ])
        .setup(|app, _api| {
            // 初始化插件状态
            let config = ${toPascalCase(pluginName)}Config::default();
            let state = ${toPascalCase(pluginName)}State::new(config);
            app.manage(state);
            
            info!("${pluginName} plugin initialized");
            Ok(())
        })
        .build()
}
`

  // 写入文件
  writeFileSync(join(pluginDir, 'Cargo.toml'), cargoToml)
  writeFileSync(join(srcDir, 'lib.rs'), libRs)

  console.log(`✅ 插件 ${pluginName} 创建成功！`)
  console.log(`📁 位置: ${pluginDir}`)
  console.log(`\n下一步:`)
  console.log(`1. 在 apps/shell/Cargo.toml 中添加插件依赖`)
  console.log(`2. 在 apps/shell/src/main.rs 中注册插件`)
  console.log(`3. 运行 pnpm create:ui ${pluginName} 创建对应的 UI`)
}

function toPascalCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

function toCamelCase(str) {
  const pascal = toPascalCase(str)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

// 获取命令行参数
const pluginName = process.argv[2]
createPlugin(pluginName)
