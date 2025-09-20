exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS recurring_invoices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        frequency TEXT NOT NULL,
        next_due_date DATE NOT NULL,
        amount REAL NOT NULL,
        currency TEXT NOT NULL,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS recurring_invoice_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recurring_invoice_id INTEGER NOT NULL,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        FOREIGN KEY (recurring_invoice_id) REFERENCES recurring_invoices(id) ON DELETE CASCADE
    );
  `);
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE IF EXISTS recurring_invoice_items;
    DROP TABLE IF EXISTS recurring_invoices;
  `);
};
