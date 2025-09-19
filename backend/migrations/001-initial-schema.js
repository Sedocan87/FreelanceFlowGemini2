exports.up = pgm => {
  pgm.sql(`
    -- Users Table
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        firebase_uid VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        stripe_customer_id VARCHAR(255) UNIQUE,
        subscription_status VARCHAR(50)
    );

    -- Clients Table
    CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        user_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Projects Table
    CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        client_id INTEGER,
        user_id INTEGER NOT NULL,
        status VARCHAR(50),
        tracked NUMERIC(10, 2) DEFAULT 0.00,
        assigned_to INTEGER,
        billing_type VARCHAR(50),
        billing_rate NUMERIC(10, 2),
        budget NUMERIC(10, 2),
        currency VARCHAR(3),
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
    );
  `);
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE IF EXISTS projects;
    DROP TABLE IF EXISTS clients;
    DROP TABLE IF EXISTS users;
  `);
};
