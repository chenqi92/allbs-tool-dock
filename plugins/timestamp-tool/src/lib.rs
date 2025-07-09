use serde::{Deserialize, Serialize};
use tauri::{plugin::TauriPlugin, Runtime, Manager, AppHandle};
use tracing::info;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TimestampToolConfig {
    pub enabled: bool,
}

impl Default for TimestampToolConfig {
    fn default() -> Self {
        Self {
            enabled: true,
        }
    }
}

pub struct TimestampToolState {
    config: TimestampToolConfig,
}

impl TimestampToolState {
    pub fn new(config: TimestampToolConfig) -> Self {
        Self { config }
    }
}

#[tauri::command]
async fn get_config<R: Runtime>(
    app: AppHandle<R>,
) -> Result<TimestampToolConfig, String> {
    let state = app.state::<TimestampToolState>();
    Ok(state.config.clone())
}

#[tauri::command]
async fn update_config<R: Runtime>(
    app: AppHandle<R>,
    config: TimestampToolConfig,
) -> Result<(), String> {
    let state = app.state::<TimestampToolState>();
    // 这里应该实现配置更新逻辑
    info!("timestamp-tool config updated: {:?}", config);
    Ok(())
}

#[tauri::command]
async fn timestampTool_action<R: Runtime>(
    app: AppHandle<R>,
    data: String,
) -> Result<String, String> {
    info!("timestamp-tool action called with data: {}", data);
    Ok(format!("timestamp-tool processed: {}", data))
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    tauri::plugin::Builder::new("timestamp-tool")
        .invoke_handler(tauri::generate_handler![
            get_config,
            update_config,
            timestampTool_action
        ])
        .setup(|app, _api| {
            // 初始化插件状态
            let config = TimestampToolConfig::default();
            let state = TimestampToolState::new(config);
            app.manage(state);
            
            info!("timestamp-tool plugin initialized");
            Ok(())
        })
        .build()
}
