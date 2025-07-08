use crate::error::{AppError, Result};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tracing::{info, warn, error};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PluginStatus {
    Loaded,
    Unloaded,
    Error(String),
    Loading,
    Unloading,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PluginInfo {
    pub id: String,
    pub name: String,
    pub version: String,
    pub description: String,
    pub status: PluginStatus,
    pub features: Vec<String>,
}

#[derive(Default)]
pub struct PluginManager {
    plugins: HashMap<String, PluginInfo>,
}

impl PluginManager {
    pub fn new() -> Self {
        Self {
            plugins: HashMap::new(),
        }
    }

    pub fn load_plugin(&mut self, plugin_name: &str) -> Result<()> {
        info!("Loading plugin: {}", plugin_name);
        
        let plugin_id = Uuid::new_v4().to_string();
        let plugin_info = PluginInfo {
            id: plugin_id.clone(),
            name: plugin_name.to_string(),
            version: "0.1.0".to_string(),
            description: format!("{} plugin", plugin_name),
            status: PluginStatus::Loading,
            features: vec![],
        };

        self.plugins.insert(plugin_id.clone(), plugin_info.clone());

        // 模拟插件加载过程
        match plugin_name {
            "logger" => {
                // 实际的插件加载逻辑将在这里实现
                self.plugins.get_mut(&plugin_id).unwrap().status = PluginStatus::Loaded;
                info!("Logger plugin loaded successfully");
            }
            "influx-client" => {
                // 实际的插件加载逻辑将在这里实现
                self.plugins.get_mut(&plugin_id).unwrap().status = PluginStatus::Loaded;
                info!("InfluxDB client plugin loaded successfully");
            }
            _ => {
                let error_msg = format!("Unknown plugin: {}", plugin_name);
                error!("{}", error_msg);
                self.plugins.get_mut(&plugin_id).unwrap().status = PluginStatus::Error(error_msg.clone());
                return Err(AppError::Plugin { message: error_msg });
            }
        }

        Ok(())
    }

    pub fn unload_plugin(&mut self, plugin_id: &str) -> Result<()> {
        if let Some(plugin) = self.plugins.get_mut(plugin_id) {
            plugin.status = PluginStatus::Unloading;
            info!("Unloading plugin: {}", plugin.name);
            
            // 实际的插件卸载逻辑
            plugin.status = PluginStatus::Unloaded;
            Ok(())
        } else {
            Err(AppError::Plugin {
                message: format!("Plugin not found: {}", plugin_id),
            })
        }
    }

    pub fn get_plugin_status(&self, plugin_id: &str) -> Option<&PluginStatus> {
        self.plugins.get(plugin_id).map(|p| &p.status)
    }

    pub fn list_plugins(&self) -> Vec<&PluginInfo> {
        self.plugins.values().collect()
    }

    pub fn restart_plugin(&mut self, plugin_id: &str) -> Result<()> {
        if let Some(plugin) = self.plugins.get(plugin_id) {
            let plugin_name = plugin.name.clone();
            self.unload_plugin(plugin_id)?;
            self.load_plugin(&plugin_name)?;
            Ok(())
        } else {
            Err(AppError::Plugin {
                message: format!("Plugin not found: {}", plugin_id),
            })
        }
    }
}
