use serde::{Deserialize, Serialize};
use tauri::{plugin::TauriPlugin, Runtime, Manager, AppHandle};
use tracing::{info, error};
use std::collections::VecDeque;
use std::sync::{Arc, Mutex};
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LogEntry {
    pub id: String,
    pub timestamp: DateTime<Utc>,
    pub level: String,
    pub message: String,
    pub target: String,
    pub file: Option<String>,
    pub line: Option<u32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LogFilter {
    pub level: Option<String>,
    pub target: Option<String>,
    pub search: Option<String>,
    pub limit: Option<usize>,
}

pub struct LoggerState {
    logs: Arc<Mutex<VecDeque<LogEntry>>>,
    max_logs: usize,
}

impl LoggerState {
    pub fn new(max_logs: usize) -> Self {
        Self {
            logs: Arc::new(Mutex::new(VecDeque::new())),
            max_logs,
        }
    }

    pub fn add_log(&self, entry: LogEntry) {
        let mut logs = self.logs.lock().unwrap();
        logs.push_back(entry);
        
        // 保持日志数量在限制内
        while logs.len() > self.max_logs {
            logs.pop_front();
        }
    }

    pub fn get_logs(&self, filter: Option<LogFilter>) -> Vec<LogEntry> {
        let logs = self.logs.lock().unwrap();
        let mut filtered_logs: Vec<LogEntry> = logs.iter().cloned().collect();

        if let Some(filter) = filter {
            // 按级别过滤
            if let Some(level) = filter.level {
                filtered_logs.retain(|log| log.level == level);
            }

            // 按目标过滤
            if let Some(target) = filter.target {
                filtered_logs.retain(|log| log.target.contains(&target));
            }

            // 按搜索词过滤
            if let Some(search) = filter.search {
                let search_lower = search.to_lowercase();
                filtered_logs.retain(|log| {
                    log.message.to_lowercase().contains(&search_lower)
                        || log.target.to_lowercase().contains(&search_lower)
                });
            }

            // 限制数量
            if let Some(limit) = filter.limit {
                filtered_logs.truncate(limit);
            }
        }

        // 按时间倒序排列（最新的在前）
        filtered_logs.reverse();
        filtered_logs
    }

    pub fn clear_logs(&self) {
        let mut logs = self.logs.lock().unwrap();
        logs.clear();
    }
}

#[tauri::command]
async fn get_logs<R: Runtime>(
    app: AppHandle<R>,
    filter: Option<LogFilter>,
) -> Result<Vec<LogEntry>, String> {
    let state = app.state::<LoggerState>();
    Ok(state.get_logs(filter))
}

#[tauri::command]
async fn clear_logs<R: Runtime>(app: AppHandle<R>) -> Result<(), String> {
    let state = app.state::<LoggerState>();
    state.clear_logs();
    info!("Logs cleared");
    Ok(())
}

#[tauri::command]
async fn add_log<R: Runtime>(
    app: AppHandle<R>,
    level: String,
    message: String,
    target: String,
) -> Result<(), String> {
    let state = app.state::<LoggerState>();
    let entry = LogEntry {
        id: uuid::Uuid::new_v4().to_string(),
        timestamp: Utc::now(),
        level,
        message,
        target,
        file: None,
        line: None,
    };
    
    state.add_log(entry);
    Ok(())
}

#[tauri::command]
async fn export_logs<R: Runtime>(
    app: AppHandle<R>,
    format: String,
) -> Result<String, String> {
    let state = app.state::<LoggerState>();
    let logs = state.get_logs(None);
    
    match format.as_str() {
        "json" => {
            serde_json::to_string_pretty(&logs)
                .map_err(|e| format!("Failed to serialize logs: {}", e))
        }
        "csv" => {
            let mut csv = String::from("timestamp,level,target,message\n");
            for log in logs {
                csv.push_str(&format!(
                    "{},{},{},\"{}\"\n",
                    log.timestamp.format("%Y-%m-%d %H:%M:%S UTC"),
                    log.level,
                    log.target,
                    log.message.replace("\"", "\"\"")
                ));
            }
            Ok(csv)
        }
        _ => Err("Unsupported format".to_string()),
    }
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    tauri::plugin::Builder::new("logger")
        .invoke_handler(tauri::generate_handler![
            get_logs,
            clear_logs,
            add_log,
            export_logs
        ])
        .setup(|app, _api| {
            // 初始化日志状态
            let logger_state = LoggerState::new(10000); // 最多保存 10000 条日志
            app.manage(logger_state);
            
            info!("Logger plugin initialized");
            Ok(())
        })
        .build()
}
