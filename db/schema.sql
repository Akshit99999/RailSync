-- ============================================================================
-- RAILSYNC — INDIAN RAILWAYS PRS & TELEMETRY ENGINE
-- RELATIONAL DATABASE MANAGEMENT SYSTEM (DBMS) SCHEMA
-- Compliant with 3rd Normal Form (3NF) & ACID Principles
-- ============================================================================

-- 1. STATIONS TABLE (Master Directory)
CREATE TABLE IF NOT EXISTS stations (
  station_code VARCHAR(10) PRIMARY KEY,
  station_name VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  railway_zone VARCHAR(10) NOT NULL,
  division VARCHAR(50),
  latitude DECIMAL(9, 6) NOT NULL,
  longitude DECIMAL(9, 6) NOT NULL,
  elevation_meters INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stations_zone ON stations(railway_zone);
CREATE INDEX idx_stations_state ON stations(state);

-- 2. USERS TABLE (Passenger Profiles & Auth)
CREATE TABLE IF NOT EXISTS users (
  user_id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(120) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(15),
  irctc_username VARCHAR(50) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- 3. TRAINS TABLE (Master Locomotive & Service Directory)
CREATE TABLE IF NOT EXISTS trains (
  train_number VARCHAR(5) PRIMARY KEY,
  train_name VARCHAR(120) NOT NULL,
  train_type VARCHAR(30) NOT NULL, -- 'RAJDHANI', 'VANDE_BHARAT', 'SHATABDI', 'SUPERFAST'
  origin_station_code VARCHAR(10) NOT NULL,
  destination_station_code VARCHAR(10) NOT NULL,
  total_distance_km INT NOT NULL,
  has_pantry BOOLEAN DEFAULT TRUE,
  days_of_run VARCHAR(20) DEFAULT '1,2,3,4,5,6,7',
  FOREIGN KEY (origin_station_code) REFERENCES stations(station_code) ON DELETE RESTRICT,
  FOREIGN KEY (destination_station_code) REFERENCES stations(station_code) ON DELETE RESTRICT
);

CREATE INDEX idx_trains_type ON trains(train_type);

-- 4. TRAIN SCHEDULES TABLE (Intermediate Halts & Permanent Way Progression)
CREATE TABLE IF NOT EXISTS train_schedules (
  schedule_id SERIAL PRIMARY KEY,
  train_number VARCHAR(5) NOT NULL,
  station_code VARCHAR(10) NOT NULL,
  stop_number INT NOT NULL,
  scheduled_arrival TIME,
  scheduled_departure TIME,
  distance_from_origin_km INT NOT NULL,
  day_count INT DEFAULT 1,
  platform_number VARCHAR(5) DEFAULT '1',
  FOREIGN KEY (train_number) REFERENCES trains(train_number) ON DELETE CASCADE,
  FOREIGN KEY (station_code) REFERENCES stations(station_code) ON DELETE RESTRICT,
  UNIQUE(train_number, stop_number)
);

CREATE INDEX idx_schedules_train ON train_schedules(train_number);
CREATE INDEX idx_schedules_station ON train_schedules(station_code);

-- 5. BOOKINGS TABLE (PRS Reservations & Electronic PNR Master)
CREATE TABLE IF NOT EXISTS bookings (
  pnr_number VARCHAR(10) PRIMARY KEY,
  user_id VARCHAR(36),
  train_number VARCHAR(5) NOT NULL,
  from_station_code VARCHAR(10) NOT NULL,
  to_station_code VARCHAR(10) NOT NULL,
  journey_date DATE NOT NULL,
  travel_class VARCHAR(5) NOT NULL, -- '1A', '2A', '3A', 'SL', 'CC', '2S'
  quota VARCHAR(5) DEFAULT 'GN',     -- 'GN', 'TQ', 'PT', 'LD', 'SS'
  total_base_fare DECIMAL(10, 2) NOT NULL,
  superfast_charges DECIMAL(8, 2) DEFAULT 45.00,
  reservation_fee DECIMAL(8, 2) DEFAULT 40.00,
  gst_amount DECIMAL(8, 2) DEFAULT 0.00,
  total_fare DECIMAL(10, 2) NOT NULL,
  booking_status VARCHAR(20) DEFAULT 'CONFIRMED', -- 'CONFIRMED', 'RAC', 'WL', 'CANCELLED'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
  FOREIGN KEY (train_number) REFERENCES trains(train_number) ON DELETE RESTRICT,
  FOREIGN KEY (from_station_code) REFERENCES stations(station_code) ON DELETE RESTRICT,
  FOREIGN KEY (to_station_code) REFERENCES stations(station_code) ON DELETE RESTRICT
);

CREATE INDEX idx_bookings_train_date ON bookings(train_number, journey_date);

-- 6. PASSENGERS TABLE (Per-Berth Passenger Details)
CREATE TABLE IF NOT EXISTS passengers (
  passenger_id SERIAL PRIMARY KEY,
  pnr_number VARCHAR(10) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  age INT NOT NULL,
  gender VARCHAR(10) NOT NULL,
  coach_number VARCHAR(5) NOT NULL,
  berth_number INT NOT NULL,
  berth_type VARCHAR(15) NOT NULL, -- 'LOWER', 'MIDDLE', 'UPPER', 'SIDE_LOWER', 'SIDE_UPPER'
  booking_status VARCHAR(20) DEFAULT 'CNF',
  FOREIGN KEY (pnr_number) REFERENCES bookings(pnr_number) ON DELETE CASCADE
);

CREATE INDEX idx_passengers_pnr ON passengers(pnr_number);

-- 7. TRAIN REVIEWS & DELAY REPORTS (Crowdsourced Feedback)
CREATE TABLE IF NOT EXISTS train_reviews (
  review_id SERIAL PRIMARY KEY,
  train_number VARCHAR(5) NOT NULL,
  station_code VARCHAR(10),
  delay_minutes INT DEFAULT 0,
  cleanliness_rating INT CHECK(cleanliness_rating BETWEEN 1 AND 5),
  punctuality_rating INT CHECK(punctuality_rating BETWEEN 1 AND 5),
  food_rating INT CHECK(food_rating BETWEEN 1 AND 5),
  comments TEXT,
  reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (train_number) REFERENCES trains(train_number) ON DELETE CASCADE,
  FOREIGN KEY (station_code) REFERENCES stations(station_code) ON DELETE SET NULL
);

-- ============================================================================
-- SAMPLE RELATIONAL QUERIES FOR VIVA / EXAMINATION DEMONSTRATIONS
-- ============================================================================

-- Q1: Find all direct trains between two stations with departure times
-- SELECT t.train_number, t.train_name, s1.scheduled_departure, s2.scheduled_arrival,
--        (s2.distance_from_origin_km - s1.distance_from_origin_km) AS journey_km
-- FROM trains t
-- JOIN train_schedules s1 ON t.train_number = s1.train_number
-- JOIN train_schedules s2 ON t.train_number = s2.train_number
-- WHERE s1.station_code = 'NDLS' 
--   AND s2.station_code = 'MMCT' 
--   AND s1.stop_number < s2.stop_number;

-- Q2: Calculate Zonal Punctuality percentage
-- SELECT s.railway_zone, 
--        COUNT(r.review_id) AS total_reports,
--        AVG(r.delay_minutes) AS avg_delay_mins,
--        (SUM(CASE WHEN r.delay_minutes <= 15 THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) AS on_time_pct
-- FROM train_reviews r
-- JOIN stations s ON r.station_code = s.station_code
-- GROUP BY s.railway_zone;
