use serde::{Deserialize, Serialize};
use tauri::{plugin::TauriPlugin, Runtime, Manager, AppHandle};
use tracing::info;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HashToolConfig {
    pub enabled: bool,
}

impl Default for HashToolConfig {
    fn default() -> Self {
        Self {
            enabled: true,
        }
    }
}

pub struct HashToolState {
    config: HashToolConfig,
}

impl HashToolState {
    pub fn new(config: HashToolConfig) -> Self {
        Self { config }
    }
}

#[tauri::command]
async fn get_config<R: Runtime>(
    app: AppHandle<R>,
) -> Result<HashToolConfig, String> {
    let state = app.state::<HashToolState>();
    Ok(state.config.clone())
}

#[tauri::command]
async fn update_config<R: Runtime>(
    app: AppHandle<R>,
    config: HashToolConfig,
) -> Result<(), String> {
    let state = app.state::<HashToolState>();
    // 这里应该实现配置更新逻辑
    info!("hash-tool config updated: {:?}", config);
    Ok(())
}

#[tauri::command]
async fn hashTool_action<R: Runtime>(
    app: AppHandle<R>,
    data: String,
) -> Result<String, String> {
    info!("hash-tool action called with data: {}", data);
    Ok(format!("hash-tool processed: {}", data))
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    tauri::plugin::Builder::new("hash-tool")
        .invoke_handler(tauri::generate_handler![
            get_config,
            update_config,
            hashTool_action
        ])
        .setup(|app, _api| {
            // 初始化插件状态
            let config = HashToolConfig::default();
            let state = HashToolState::new(config);
            app.manage(state);
            
            info!("hash-tool plugin initialized");
            Ok(())
        })
        .build()
}
