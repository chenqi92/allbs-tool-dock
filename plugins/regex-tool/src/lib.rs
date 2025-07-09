use serde::{Deserialize, Serialize};
use tauri::{plugin::TauriPlugin, Runtime, Manager, AppHandle};
use tracing::info;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RegexToolConfig {
    pub enabled: bool,
}

impl Default for RegexToolConfig {
    fn default() -> Self {
        Self {
            enabled: true,
        }
    }
}

pub struct RegexToolState {
    config: RegexToolConfig,
}

impl RegexToolState {
    pub fn new(config: RegexToolConfig) -> Self {
        Self { config }
    }
}

#[tauri::command]
async fn get_config<R: Runtime>(
    app: AppHandle<R>,
) -> Result<RegexToolConfig, String> {
    let state = app.state::<RegexToolState>();
    Ok(state.config.clone())
}

#[tauri::command]
async fn update_config<R: Runtime>(
    app: AppHandle<R>,
    config: RegexToolConfig,
) -> Result<(), String> {
    let state = app.state::<RegexToolState>();
    // 这里应该实现配置更新逻辑
    info!("regex-tool config updated: {:?}", config);
    Ok(())
}

#[tauri::command]
async fn regexTool_action<R: Runtime>(
    app: AppHandle<R>,
    data: String,
) -> Result<String, String> {
    info!("regex-tool action called with data: {}", data);
    Ok(format!("regex-tool processed: {}", data))
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    tauri::plugin::Builder::new("regex-tool")
        .invoke_handler(tauri::generate_handler![
            get_config,
            update_config,
            regexTool_action
        ])
        .setup(|app, _api| {
            // 初始化插件状态
            let config = RegexToolConfig::default();
            let state = RegexToolState::new(config);
            app.manage(state);
            
            info!("regex-tool plugin initialized");
            Ok(())
        })
        .build()
}
