use serde::{Deserialize, Serialize};
use tauri::{plugin::TauriPlugin, Runtime, Manager, AppHandle};
use tracing::info;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JsonFormatterConfig {
    pub enabled: bool,
}

impl Default for JsonFormatterConfig {
    fn default() -> Self {
        Self {
            enabled: true,
        }
    }
}

pub struct JsonFormatterState {
    config: JsonFormatterConfig,
}

impl JsonFormatterState {
    pub fn new(config: JsonFormatterConfig) -> Self {
        Self { config }
    }
}

#[tauri::command]
async fn get_config<R: Runtime>(
    app: AppHandle<R>,
) -> Result<JsonFormatterConfig, String> {
    let state = app.state::<JsonFormatterState>();
    Ok(state.config.clone())
}

#[tauri::command]
async fn update_config<R: Runtime>(
    app: AppHandle<R>,
    config: JsonFormatterConfig,
) -> Result<(), String> {
    let state = app.state::<JsonFormatterState>();
    // 这里应该实现配置更新逻辑
    info!("json-formatter config updated: {:?}", config);
    Ok(())
}

#[tauri::command]
async fn jsonFormatter_action<R: Runtime>(
    app: AppHandle<R>,
    data: String,
) -> Result<String, String> {
    info!("json-formatter action called with data: {}", data);
    Ok(format!("json-formatter processed: {}", data))
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    tauri::plugin::Builder::new("json-formatter")
        .invoke_handler(tauri::generate_handler![
            get_config,
            update_config,
            jsonFormatter_action
        ])
        .setup(|app, _api| {
            // 初始化插件状态
            let config = JsonFormatterConfig::default();
            let state = JsonFormatterState::new(config);
            app.manage(state);
            
            info!("json-formatter plugin initialized");
            Ok(())
        })
        .build()
}
