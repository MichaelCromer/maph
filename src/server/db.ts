import { readFileSync } from 'fs';
import Database from 'better-sqlite3';

const db = new Database('bld/database');

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
`).run();


const db_nodes_insert = db.prepare(`
    INSERT OR IGNORE INTO nodes (id, type, title, body) VALUES (?, ?, ?, ?)
`);

const db_edges_insert = db.prepare(`
    INSERT OR IGNORE INTO edges (source, target, number) VALUES (?, ?, ?)
`);


const nodes_file = "./src/server/nodes.json";
const nodes_json = JSON.parse(readFileSync(nodes_file, 'utf-8'));
for (const item of nodes_json) {
    db_nodes_insert.run(item.id, item.type, item.title, item.body);
}

const edges_file = "./src/server/edges.json";
const edges_json = JSON.parse(readFileSync(edges_file, 'utf-8'));
for (const item of edges_json) {
    db_edges_insert.run(item.source, item.target, item.number);
}
