exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        owner_id INTEGER NOT NULL,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
    );

    ALTER TABLE users ADD COLUMN company_id INTEGER;
    ALTER TABLE users ADD COLUMN role TEXT;
    ALTER TABLE users ADD COLUMN rate REAL;

    -- Add a foreign key constraint after adding the column
    -- Note: This is a simplified approach. In a real application, you'd need to handle existing rows.
    -- ALTER TABLE users ADD FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL;
  `);
};

exports.down = pgm => {
  pgm.sql(`
    ALTER TABLE users DROP COLUMN company_id;
    ALTER TABLE users DROP COLUMN role;
    ALTER TABLE users DROP COLUMN rate;
    DROP TABLE IF EXISTS companies;
  `);
};
