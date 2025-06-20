const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const db = new Database('server/database');

db.prepare(`
    CREATE TABLE IF NOT EXISTS data (
        id INTEGER PRIMARY KEY,
        title TEXT,
        body TEXT
    )
`).run();

const db_data_insert = db.prepare(`
    INSERT OR IGNORE INTO data (id, title, body) VALUES (?, ?, ?)
`);

const db_data_insert_many = db.transaction((items) => {
    for (const item of items) {
        db_data_insert.run(item.id, item.title, item.body);
    }
});

const data_file = path.join(__dirname, 'db.json');
const data_json = JSON.parse(fs.readFileSync(data_file, 'utf-8'));

db_data_insert_many(data_json);

module.exports = db;
