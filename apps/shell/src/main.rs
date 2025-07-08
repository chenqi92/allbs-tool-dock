// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod plugin_manager;
mod error;

use commands::*;
use plugin_manager::PluginManager;
use error::Result;

use tauri::{Manager, State};
use tracing::{info, error};
use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Default)]
pub struct AppState {
    plugin_manager: Arc<Mutex<PluginManager>>,
}

fn main() {
    // 初始化日志
    tracing_subscriber::fmt()
        .with_env_filter(tracing_subscriber::EnvFilter::from_default_env())
        .init();

    info!("Starting KKAPE Gearbox...");

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        // 条件性加载插件
        .setup(|app| {
            let app_state = AppState::default();
            app.manage(app_state);

            // 初始化插件管理器
            let mut plugin_manager = PluginManager::new();

            // 预加载一些示例插件
            if let Err(e) = plugin_manager.load_plugin("logger") {
                error!("Failed to load logger plugin: {}", e);
            }

            if let Err(e) = plugin_manager.load_plugin("influx-client") {
                error!("Failed to load influx client plugin: {}", e);
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_app_info,
            list_plugins,
            load_plugin,
            unload_plugin,
            get_plugin_status,
            restart_plugin
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
