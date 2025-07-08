use serde::{Deserialize, Serialize};
use thiserror::Error;

pub type Result<T> = std::result::Result<T, AppError>;

#[derive(Error, Debug, Serialize, Deserialize)]
pub enum AppError {
    #[error("Plugin error: {message}")]
    Plugin { message: String },
    
    #[error("IO error: {message}")]
    Io { message: String },
    
    #[error("Serialization error: {message}")]
    Serialization { message: String },
    
    #[error("Configuration error: {message}")]
    Config { message: String },
    
    #[error("Unknown error: {message}")]
    Unknown { message: String },
}

impl From<std::io::Error> for AppError {
    fn from(err: std::io::Error) -> Self {
        AppError::Io {
            message: err.to_string(),
        }
    }
}

impl From<serde_json::Error> for AppError {
    fn from(err: serde_json::Error) -> Self {
        AppError::Serialization {
            message: err.to_string(),
        }
    }
}

impl From<anyhow::Error> for AppError {
    fn from(err: anyhow::Error) -> Self {
        AppError::Unknown {
            message: err.to_string(),
        }
    }
}
