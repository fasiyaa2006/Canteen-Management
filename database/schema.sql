-- ========================================================
-- Campus Food Pre-Order & Canteen Management System
-- Database: canteen_db
-- Phase 1: Database Schema & Seed Data
-- ========================================================

CREATE DATABASE IF NOT EXISTS canteen_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE canteen_db;

-- 1. Drop existing tables in reverse dependency order
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS menu_items;
DROP TABLE IF EXISTS users;

-- 2. Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('STUDENT', 'CANTEEN_STAFF', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Menu Items Table
CREATE TABLE menu_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    category VARCHAR(60) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. Orders Table
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_status ENUM('PLACED', 'PREPARING', 'READY', 'COLLECTED', 'CANCELLED') NOT NULL DEFAULT 'PLACED',
    total_amount DECIMAL(10, 2) NOT NULL,
    pickup_time DATETIME NOT NULL,
    special_instructions VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Order Items Table
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    menu_item_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price_at_order DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_menu_item FOREIGN KEY (menu_item_id) REFERENCES menu_items (id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ========================================================
-- Seed Initial Sample Data for Testing & Verification
-- ========================================================

-- Insert Sample Users (One for each role)
INSERT INTO users (name, email, password, phone, role) VALUES
('Alex Student', 'alex@campus.edu', 'student123', '9876543210', 'STUDENT'),
('Chef Mario', 'mario@canteen.com', 'staff123', '9876543211', 'CANTEEN_STAFF'),
('Admin Sarah', 'admin@campus.edu', 'admin123', '9876543212', 'ADMIN');

-- Insert Sample Menu Items
INSERT INTO menu_items (name, description, category, price, image_url, available) VALUES
('Veggie Burger Deluxe', 'Crispy spiced vegetable patty with fresh lettuce, tomato, and mayo', 'Burgers', 5.50, 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400', TRUE),
('Chicken Teriyaki Rice Bowl', 'Grilled chicken with glazed teriyaki sauce served over steamed jasmine rice', 'Meals', 8.99, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', TRUE),
('Iced Caramel Latte', 'Espresso chilled with milk, sweet caramel syrup, and crushed ice', 'Beverages', 3.75, 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=400', TRUE),
('Paneer Tikka Roll', 'Grilled spiced cottage cheese wrapped in a fresh flaky paratha', 'Snacks', 6.25, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400', TRUE),
('Fresh Fruit Smoothie', 'Blended seasonal berries, banana, and Greek yogurt', 'Beverages', 4.50, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400', FALSE);

-- Insert Sample Order
INSERT INTO orders (user_id, order_status, total_amount, pickup_time, special_instructions) VALUES
(1, 'PLACED', 9.25, DATE_ADD(NOW(), INTERVAL 30 MINUTE), 'Less spicy please');

-- Insert Sample Order Items for the Order above
INSERT INTO order_items (order_id, menu_item_id, quantity, price_at_order) VALUES
(1, 1, 1, 5.50),
(1, 3, 1, 3.75);
