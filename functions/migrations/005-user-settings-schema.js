exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE users ADD COLUMN company_name TEXT;
    ALTER TABLE users ADD COLUMN company_email TEXT;
    ALTER TABLE users ADD COLUMN company_address TEXT;
    ALTER TABLE users ADD COLUMN logo_url TEXT;
    ALTER TABLE users ADD COLUMN tax_rate REAL;
    ALTER TABLE users ADD COLUMN default_currency TEXT;
  `);
};

exports.down = pgm => {
  pgm.sql(`
    ALTER TABLE users DROP COLUMN company_name;
    ALTER TABLE users DROP COLUMN company_email;
    ALTER TABLE users DROP COLUMN company_address;
    ALTER TABLE users DROP COLUMN logo_url;
    ALTER TABLE users DROP COLUMN tax_rate;
    ALTER TABLE users DROP COLUMN default_currency;
  `);
};
