-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- Clients Table
CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    client_id INTEGER,
    user_id INTEGER,
    status TEXT,
    tracked REAL,
    assigned_to INTEGER,
    billing_type TEXT,
    billing_rate REAL,
    budget REAL,
    currency TEXT,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- Default user for development
-- The password is 'password123'
INSERT INTO users (id, name, email, password) VALUES (1, 'Test User', 'test@example.com', '$2b$10$FkyBFURb5xwzTfUdS/cM5OzWmuQwnEA38wu82YcqDCgBPiGsziTHq')
ON CONFLICT(id) DO NOTHING;
