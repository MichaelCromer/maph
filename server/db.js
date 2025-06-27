const fs = require('fs');
const Database = require('better-sqlite3');

const db = new Database('./server/database');

db.prepare(`
    CREATE TABLE IF NOT EXISTS vertices (
        id INTEGER NOT NULL,
        type INTEGER NOT NULL,
        title TEXT NOT NULL,
        body TEXT NOT NULL,

        PRIMARY KEY (id)
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS edges (
        source INTEGER REFERENCES vertices(id),
        target INTEGER REFERENCES vertices(id),
        number INTEGER NOT NULL,

        PRIMARY KEY (target, number),
        UNIQUE (source, target)
   )
`).run();


const db_vertices_insert = db.prepare(`
    INSERT OR IGNORE INTO vertices (id, type, title, body) VALUES (?, ?, ?, ?)
`);

const db_edges_insert = db.prepare(`
    INSERT OR IGNORE INTO edges (source, target, number) VALUES (?, ?, ?)
`);


const vertices_file = "./server/vertices.json";
const vertices_json = JSON.parse(fs.readFileSync(vertices_file, 'utf-8'));
for (const item of vertices_json) {
    db_vertices_insert.run(item.id, item.type, item.title, item.body);
}

const edges_file = "./server/edges.json";
const edges_json = JSON.parse(fs.readFileSync(edges_file, 'utf-8'));
for (const item of edges_json) {
    db_edges_insert.run(item.source, item.target, item.number);
}
