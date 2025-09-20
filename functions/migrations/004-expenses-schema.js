exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER,
        user_id INTEGER NOT NULL,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        date DATE NOT NULL,
        is_billed BOOLEAN DEFAULT FALSE,
        is_billable BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE IF EXISTS expenses;
  `);
};
