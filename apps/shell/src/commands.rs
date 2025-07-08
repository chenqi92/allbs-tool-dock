use crate::{AppState, error::Result, plugin_manager::PluginInfo};
use serde::{Deserialize, Serialize};
use tauri::{State, AppHandle};
use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Serialize, Deserialize)]
pub struct AppInfo {
    pub name: String,
    pub version: String,
    pub description: String,
}

#[tauri::command]
pub async fn get_app_info() -> Result<AppInfo> {
    Ok(AppInfo {
        name: "KKAPE Gearbox".to_string(),
        version: "0.1.0".to_string(),
        description: "A modern tool collection platform".to_string(),
    })
}

#[tauri::command]
pub async fn list_plugins(state: State<'_, AppState>) -> Result<Vec<PluginInfo>> {
    let plugin_manager = state.plugin_manager.lock().await;
    let plugins = plugin_manager.list_plugins();
    Ok(plugins.into_iter().cloned().collect())
}

#[tauri::command]
pub async fn load_plugin(
    plugin_name: String,
    state: State<'_, AppState>,
) -> Result<String> {
    let mut plugin_manager = state.plugin_manager.lock().await;
    plugin_manager.load_plugin(&plugin_name)?;
    Ok(format!("Plugin {} loaded successfully", plugin_name))
}

#[tauri::command]
pub async fn unload_plugin(
    plugin_id: String,
    state: State<'_, AppState>,
) -> Result<String> {
    let mut plugin_manager = state.plugin_manager.lock().await;
    plugin_manager.unload_plugin(&plugin_id)?;
    Ok(format!("Plugin {} unloaded successfully", plugin_id))
}

#[tauri::command]
pub async fn get_plugin_status(
    plugin_id: String,
    state: State<'_, AppState>,
) -> Result<Option<String>> {
    let plugin_manager = state.plugin_manager.lock().await;
    let status = plugin_manager.get_plugin_status(&plugin_id);
    Ok(status.map(|s| serde_json::to_string(s).unwrap_or_default()))
}

#[tauri::command]
pub async fn restart_plugin(
    plugin_id: String,
    state: State<'_, AppState>,
) -> Result<String> {
    let mut plugin_manager = state.plugin_manager.lock().await;
    plugin_manager.restart_plugin(&plugin_id)?;
    Ok(format!("Plugin {} restarted successfully", plugin_id))
}
