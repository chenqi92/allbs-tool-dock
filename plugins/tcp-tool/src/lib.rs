use serde::{Deserialize, Serialize};
use tauri::{plugin::TauriPlugin, Runtime, Manager, AppHandle, Emitter};
use tracing::{info, error, warn};
use tokio::net::{TcpListener, TcpStream};
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::{Mutex, RwLock};
use std::net::SocketAddr;
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TcpToolConfig {
    pub enabled: bool,
    pub default_client_host: String,
    pub default_client_port: u16,
    pub default_server_port: u16,
    pub auto_reconnect: bool,
    pub connection_timeout: u64,
}

impl Default for TcpToolConfig {
    fn default() -> Self {
        Self {
            enabled: true,
            default_client_host: "127.0.0.1".to_string(),
            default_client_port: 8080,
            default_server_port: 8080,
            auto_reconnect: false,
            connection_timeout: 5000,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConnectionInfo {
    pub id: String,
    pub connection_type: String, // "client" or "server"
    pub local_addr: String,
    pub remote_addr: Option<String>,
    pub status: String, // "connected", "disconnected", "connecting", "listening"
    pub created_at: String,
    pub bytes_sent: u64,
    pub bytes_received: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MessageData {
    pub connection_id: String,
    pub content: String,
    pub timestamp: String,
    pub direction: String, // "sent" or "received"
    pub size: usize,
}

type ConnectionMap = Arc<RwLock<HashMap<String, Arc<Mutex<TcpStream>>>>>;
type ServerMap = Arc<RwLock<HashMap<String, Arc<Mutex<TcpListener>>>>>;

pub struct TcpToolState {
    config: TcpToolConfig,
    connections: ConnectionMap,
    servers: ServerMap,
    connection_info: Arc<RwLock<HashMap<String, ConnectionInfo>>>,
}

impl TcpToolState {
    pub fn new(config: TcpToolConfig) -> Self {
        Self {
            config,
            connections: Arc::new(RwLock::new(HashMap::new())),
            servers: Arc::new(RwLock::new(HashMap::new())),
            connection_info: Arc::new(RwLock::new(HashMap::new())),
        }
    }
}

#[tauri::command]
async fn get_config<R: Runtime>(
    app: AppHandle<R>,
) -> Result<TcpToolConfig, String> {
    let state = app.state::<TcpToolState>();
    Ok(state.config.clone())
}

#[tauri::command]
async fn update_config<R: Runtime>(
    app: AppHandle<R>,
    config: TcpToolConfig,
) -> Result<(), String> {
    let state = app.state::<TcpToolState>();
    // 这里应该实现配置更新逻辑
    info!("tcp-tool config updated: {:?}", config);
    Ok(())
}

#[tauri::command]
async fn tcp_client_connect<R: Runtime>(
    app: AppHandle<R>,
    host: String,
    port: u16,
) -> Result<String, String> {
    let state = app.state::<TcpToolState>();
    let connection_id = format!("client_{}_{}", host, port);

    info!("Attempting to connect to {}:{}", host, port);

    match TcpStream::connect(format!("{}:{}", host, port)).await {
        Ok(stream) => {
            let local_addr = stream.local_addr().map_err(|e| e.to_string())?;
            let remote_addr = stream.peer_addr().map_err(|e| e.to_string())?;

            let connection_info = ConnectionInfo {
                id: connection_id.clone(),
                connection_type: "client".to_string(),
                local_addr: local_addr.to_string(),
                remote_addr: Some(remote_addr.to_string()),
                status: "connected".to_string(),
                created_at: Utc::now().to_rfc3339(),
                bytes_sent: 0,
                bytes_received: 0,
            };

            // 存储连接
            state.connections.write().await.insert(connection_id.clone(), Arc::new(Mutex::new(stream)));
            state.connection_info.write().await.insert(connection_id.clone(), connection_info.clone());

            // 发送连接事件到前端
            app.emit("tcp_connection_established", &connection_info).map_err(|e| e.to_string())?;

            info!("Successfully connected to {}:{}", host, port);
            Ok(connection_id)
        }
        Err(e) => {
            error!("Failed to connect to {}:{}: {}", host, port, e);
            Err(format!("Connection failed: {}", e))
        }
    }
}

#[tauri::command]
async fn tcp_server_start<R: Runtime>(
    app: AppHandle<R>,
    port: u16,
) -> Result<String, String> {
    let state = app.state::<TcpToolState>();
    let server_id = format!("server_{}", port);

    info!("Starting TCP server on port {}", port);

    match TcpListener::bind(format!("0.0.0.0:{}", port)).await {
        Ok(listener) => {
            let local_addr = listener.local_addr().map_err(|e| e.to_string())?;

            let connection_info = ConnectionInfo {
                id: server_id.clone(),
                connection_type: "server".to_string(),
                local_addr: local_addr.to_string(),
                remote_addr: None,
                status: "listening".to_string(),
                created_at: Utc::now().to_rfc3339(),
                bytes_sent: 0,
                bytes_received: 0,
            };

            // 存储服务器
            state.servers.write().await.insert(server_id.clone(), Arc::new(Mutex::new(listener)));
            state.connection_info.write().await.insert(server_id.clone(), connection_info.clone());

            // 发送服务器启动事件到前端
            app.emit("tcp_server_started", &connection_info).map_err(|e| e.to_string())?;

            info!("TCP server started on port {}", port);
            Ok(server_id)
        }
        Err(e) => {
            error!("Failed to start server on port {}: {}", port, e);
            Err(format!("Server start failed: {}", e))
        }
    }
}

#[tauri::command]
async fn tcp_send_message<R: Runtime>(
    app: AppHandle<R>,
    connection_id: String,
    message: String,
) -> Result<(), String> {
    let state = app.state::<TcpToolState>();

    if let Some(stream_arc) = state.connections.read().await.get(&connection_id) {
        let mut stream = stream_arc.lock().await;

        match stream.write_all(message.as_bytes()).await {
            Ok(_) => {
                let message_data = MessageData {
                    connection_id: connection_id.clone(),
                    content: message.clone(),
                    timestamp: Utc::now().to_rfc3339(),
                    direction: "sent".to_string(),
                    size: message.len(),
                };

                // 更新发送字节数
                if let Some(info) = state.connection_info.write().await.get_mut(&connection_id) {
                    info.bytes_sent += message.len() as u64;
                }

                // 发送消息事件到前端
                app.emit("tcp_message_sent", &message_data).map_err(|e| e.to_string())?;

                info!("Message sent to {}: {}", connection_id, message);
                Ok(())
            }
            Err(e) => {
                error!("Failed to send message to {}: {}", connection_id, e);
                Err(format!("Send failed: {}", e))
            }
        }
    } else {
        Err("Connection not found".to_string())
    }
}

#[tauri::command]
async fn tcp_disconnect<R: Runtime>(
    app: AppHandle<R>,
    connection_id: String,
) -> Result<(), String> {
    let state = app.state::<TcpToolState>();

    // 移除连接
    state.connections.write().await.remove(&connection_id);

    // 更新连接状态
    if let Some(info) = state.connection_info.write().await.get_mut(&connection_id) {
        info.status = "disconnected".to_string();

        // 发送断开连接事件到前端
        app.emit("tcp_connection_closed", info).map_err(|e| e.to_string())?;
    }

    info!("Connection {} disconnected", connection_id);
    Ok(())
}

#[tauri::command]
async fn tcp_get_connections<R: Runtime>(
    app: AppHandle<R>,
) -> Result<Vec<ConnectionInfo>, String> {
    let state = app.state::<TcpToolState>();
    let connections = state.connection_info.read().await;
    Ok(connections.values().cloned().collect())
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    tauri::plugin::Builder::new("tcp-tool")
        .invoke_handler(tauri::generate_handler![
            get_config,
            update_config,
            tcp_client_connect,
            tcp_server_start,
            tcp_send_message,
            tcp_disconnect,
            tcp_get_connections
        ])
        .setup(|app, _api| {
            // 初始化插件状态
            let config = TcpToolConfig::default();
            let state = TcpToolState::new(config);
            app.manage(state);

            info!("tcp-tool plugin initialized");
            Ok(())
        })
        .build()
}
