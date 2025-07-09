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

    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_window_state::Builder::default().build());

    // 条件性加载插件
    #[cfg(feature = "tool-logger")]
    {
        builder = builder.plugin(tauri_plugin_logger::init());
    }

    #[cfg(feature = "tool-tcp-tool")]
    {
        builder = builder.plugin(tauri_plugin_tcp_tool::init());
    }

    #[cfg(feature = "tool-json-formatter")]
    {
        builder = builder.plugin(tauri_plugin_json_formatter::init());
    }

    #[cfg(feature = "tool-base64-tool")]
    {
        builder = builder.plugin(tauri_plugin_base64_tool::init());
    }

    #[cfg(feature = "tool-hash-tool")]
    {
        builder = builder.plugin(tauri_plugin_hash_tool::init());
    }

    #[cfg(feature = "tool-timestamp-tool")]
    {
        builder = builder.plugin(tauri_plugin_timestamp_tool::init());
    }

    #[cfg(feature = "tool-regex-tool")]
    {
        builder = builder.plugin(tauri_plugin_regex_tool::init());
    }

    builder.setup(|app| {
            let app_state = AppState::default();
            app.manage(app_state);

            // 初始化插件管理器
            let mut plugin_manager = PluginManager::new();

            // 预加载插件
            #[cfg(feature = "tool-logger")]
            if let Err(e) = plugin_manager.load_plugin("logger") {
                error!("Failed to load logger plugin: {}", e);
            }

            #[cfg(feature = "tool-tcp-tool")]
            if let Err(e) = plugin_manager.load_plugin("tcp-tool") {
                error!("Failed to load tcp-tool plugin: {}", e);
            }

            #[cfg(feature = "tool-json-formatter")]
            if let Err(e) = plugin_manager.load_plugin("json-formatter") {
                error!("Failed to load json-formatter plugin: {}", e);
            }

            #[cfg(feature = "tool-base64-tool")]
            if let Err(e) = plugin_manager.load_plugin("base64-tool") {
                error!("Failed to load base64-tool plugin: {}", e);
            }

            #[cfg(feature = "tool-hash-tool")]
            if let Err(e) = plugin_manager.load_plugin("hash-tool") {
                error!("Failed to load hash-tool plugin: {}", e);
            }

            #[cfg(feature = "tool-timestamp-tool")]
            if let Err(e) = plugin_manager.load_plugin("timestamp-tool") {
                error!("Failed to load timestamp-tool plugin: {}", e);
            }

            #[cfg(feature = "tool-regex-tool")]
            if let Err(e) = plugin_manager.load_plugin("regex-tool") {
                error!("Failed to load regex-tool plugin: {}", e);
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
