CREATE DATABASE IF NOT EXISTS healthcare_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE healthcare_db;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  username VARCHAR(191) NOT NULL,
  primary_email VARCHAR(255) NOT NULL,
  display_identifier VARCHAR(255) NOT NULL UNIQUE,
  profile_json JSON NULL,
  settings_json JSON NOT NULL,
  health_metrics_json JSON NOT NULL,
  goals_json JSON NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  roles_json JSON NOT NULL,
  last_login_at VARCHAR(32) NULL,
  created_at VARCHAR(32) NOT NULL,
  updated_at VARCHAR(32) NOT NULL,
  INDEX idx_users_primary_email (primary_email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS auth_tokens (
  token VARCHAR(96) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  created_at VARCHAR(32) NOT NULL,
  CONSTRAINT fk_auth_tokens_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS refresh_tokens (
  token VARCHAR(96) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  created_at VARCHAR(32) NOT NULL,
  CONSTRAINT fk_refresh_tokens_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS otp_requests (
  id VARCHAR(64) PRIMARY KEY,
  identifier VARCHAR(255) NOT NULL,
  channel VARCHAR(16) NOT NULL,
  code VARCHAR(16) NOT NULL,
  expires_at BIGINT NOT NULL,
  created_at VARCHAR(32) NOT NULL,
  INDEX idx_otp_identifier (identifier),
  INDEX idx_otp_expires_at (expires_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS uploads (
  object_key VARCHAR(255) PRIMARY KEY,
  content_type VARCHAR(191) NOT NULL,
  size_bytes INT NOT NULL DEFAULT 0,
  uploaded_at VARCHAR(32) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS ai_feedback (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NULL,
  rating INT NOT NULL,
  comment TEXT NULL,
  context VARCHAR(191) NOT NULL,
  created_at VARCHAR(32) NOT NULL,
  CONSTRAINT fk_ai_feedback_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS food_logs (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  food_code VARCHAR(64) NOT NULL,
  payload_json JSON NOT NULL,
  logged_at VARCHAR(32) NOT NULL,
  CONSTRAINT fk_food_logs_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  INDEX idx_food_logs_user_logged_at (user_id, logged_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS medication_plans (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  medicine_name VARCHAR(255) NOT NULL,
  dosage VARCHAR(191) NOT NULL,
  total_quantity INT NOT NULL,
  quantity_remaining INT NOT NULL,
  reminder_time VARCHAR(16) NOT NULL,
  notes TEXT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  created_at VARCHAR(32) NOT NULL,
  updated_at VARCHAR(32) NOT NULL,
  completed_at VARCHAR(32) NULL,
  CONSTRAINT fk_medication_plans_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  INDEX idx_medication_plans_user_time (user_id, reminder_time),
  INDEX idx_medication_plans_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS chat_sessions (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NULL,
  title VARCHAR(255) NOT NULL,
  created_at VARCHAR(32) NOT NULL,
  updated_at VARCHAR(32) NOT NULL,
  CONSTRAINT fk_chat_sessions_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL,
  INDEX idx_chat_sessions_updated_at (updated_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS chat_messages (
  auto_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id VARCHAR(64) NOT NULL UNIQUE,
  session_id VARCHAR(64) NOT NULL,
  role VARCHAR(32) NOT NULL,
  content TEXT NOT NULL,
  image_object_key VARCHAR(255) NULL,
  created_at VARCHAR(32) NOT NULL,
  CONSTRAINT fk_chat_messages_session
    FOREIGN KEY (session_id) REFERENCES chat_sessions(id)
    ON DELETE CASCADE,
  INDEX idx_chat_messages_session_created (session_id, created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS active_workouts (
  tracking_id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NULL,
  workout_type VARCHAR(32) NOT NULL,
  started_at VARCHAR(32) NOT NULL,
  ended_at VARCHAR(32) NULL,
  points_json JSON NOT NULL,
  distance_km DECIMAL(10,3) NOT NULL DEFAULT 0,
  steps INT NOT NULL DEFAULT 0,
  paused_at BIGINT NULL,
  paused_duration_ms BIGINT NOT NULL DEFAULT 0,
  CONSTRAINT fk_active_workouts_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL,
  INDEX idx_active_workouts_started_at (started_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS workouts (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NULL,
  workout_type VARCHAR(32) NOT NULL,
  started_at VARCHAR(32) NOT NULL,
  ended_at VARCHAR(32) NOT NULL,
  distance_km DECIMAL(10,3) NOT NULL DEFAULT 0,
  steps INT NOT NULL DEFAULT 0,
  calories_out INT NOT NULL DEFAULT 0,
  avg_pace_sec_per_km INT NULL,
  record_json JSON NOT NULL,
  CONSTRAINT fk_workouts_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL,
  INDEX idx_workouts_started_at (started_at),
  INDEX idx_workouts_user_started_at (user_id, started_at)
) ENGINE=InnoDB;