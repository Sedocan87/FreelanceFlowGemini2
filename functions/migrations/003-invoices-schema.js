exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS invoices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        invoice_number TEXT,
        issue_date DATE NOT NULL,
        due_date DATE NOT NULL,
        amount REAL NOT NULL,
        status TEXT NOT NULL,
        currency TEXT NOT NULL,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS invoice_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        invoice_id INTEGER NOT NULL,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
    );
  `);
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE IF EXISTS invoice_items;
    DROP TABLE IF EXISTS invoices;
  `);
};
