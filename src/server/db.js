const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const db = new Database('src/server/database');

db.prepare(`
    CREATE TABLE IF NOT EXISTS nodes (
        id INTEGER NOT NULL,
        type INTEGER NOT NULL,
        title TEXT NOT NULL,
        body TEXT NOT NULL,

        PRIMARY KEY (id)
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS edges (
        source INTEGER REFERENCES nodes(id),
        target INTEGER REFERENCES nodes(id),
        number INTEGER NOT NULL,

        PRIMARY KEY (target, number),
        UNIQUE (source, target)
   )
`);


const db_nodes_insert = db.prepare(`
    INSERT OR IGNORE INTO nodes (id, type, title, body) VALUES (?, ?, ?, ?)
`);

const db_edges_insert = db.prepare(`
    INSERT OR IGNORE INTO edges (source, target, number) VALUES (?, ?, ?)
`);


const nodes_file = path.join(__dirname, 'nodes.json');
const nodes_json = JSON.parse(fs.readFileSync(nodes_file, 'utf-8'));
for (const item of nodes_json) {
    db_nodes_insert.run(item.id, item.type, item.title, item.body);
}


const edges_file = path.join(__dirname, 'edges.json');
const edges_json = JSON.parse(fs.readFileSync(edges_file, 'utf-8'));
for (const item of edges_json) {
    db_edges_insert.run(item.source, item.taget, item.number);
}


module.exports = db;
