const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./students.db');

// Create a sample table if not exists
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER
    )
  `);
});
module.exports = db;