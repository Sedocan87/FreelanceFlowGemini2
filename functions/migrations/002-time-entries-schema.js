exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS time_entries (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        hours NUMERIC(5, 2) NOT NULL,
        date DATE NOT NULL,
        description TEXT,
        member_id INTEGER,
        is_billed BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE IF EXISTS time_entries;
  `);
};
