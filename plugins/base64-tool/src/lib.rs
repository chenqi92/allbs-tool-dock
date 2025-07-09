use serde::{Deserialize, Serialize};
use tauri::{plugin::TauriPlugin, Runtime, Manager, AppHandle};
use tracing::info;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Base64ToolConfig {
    pub enabled: bool,
}

impl Default for Base64ToolConfig {
    fn default() -> Self {
        Self {
            enabled: true,
        }
    }
}

pub struct Base64ToolState {
    config: Base64ToolConfig,
}

impl Base64ToolState {
    pub fn new(config: Base64ToolConfig) -> Self {
        Self { config }
    }
}

#[tauri::command]
async fn get_config<R: Runtime>(
    app: AppHandle<R>,
) -> Result<Base64ToolConfig, String> {
    let state = app.state::<Base64ToolState>();
    Ok(state.config.clone())
}

#[tauri::command]
async fn update_config<R: Runtime>(
    app: AppHandle<R>,
    config: Base64ToolConfig,
) -> Result<(), String> {
    let state = app.state::<Base64ToolState>();
    // 这里应该实现配置更新逻辑
    info!("base64-tool config updated: {:?}", config);
    Ok(())
}

#[tauri::command]
async fn base64Tool_action<R: Runtime>(
    app: AppHandle<R>,
    data: String,
) -> Result<String, String> {
    info!("base64-tool action called with data: {}", data);
    Ok(format!("base64-tool processed: {}", data))
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    tauri::plugin::Builder::new("base64-tool")
        .invoke_handler(tauri::generate_handler![
            get_config,
            update_config,
            base64Tool_action
        ])
        .setup(|app, _api| {
            // 初始化插件状态
            let config = Base64ToolConfig::default();
            let state = Base64ToolState::new(config);
            app.manage(state);
            
            info!("base64-tool plugin initialized");
            Ok(())
        })
        .build()
}
