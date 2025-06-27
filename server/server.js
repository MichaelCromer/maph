const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const db = new Database('./server/database');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


app.get('/api/vertices', (req, res) => {
    const vertices = db.prepare('SELECT * FROM vertices').all();
    console.log(`Server recieved GET request /vertices`);
    res.json(vertices);
    console.log(vertices);
});


app.get('/api/edges', (req, res) => {
    const edges = db.prepare('SELECT * FROM edges').all();
    console.log(`Server recieved GET request /edges`);
    console.log(edges);
    res.json(edges);
});


app.get('/api/search', (req, res) => {
    // TODO man get some proper parsing upindisbish
    const str_search = req.query.string?.toString().trim() ?? '';
    console.log(`Server recieved GET request /search?string=${str_search}`);

    const json_vertices = db.prepare(`
        SELECT id, type, title, body FROM json_vertices WHERE title LIKE ('%' || ? || '%')
    `).all(str_search);

    if (json_vertices.length === 0) { return res.json([]); }

    const vertex_ids = json_vertices.map((v) => v.id);
    const placeholders = vertex_ids.map(() => '?').join(',');
    const json_edges = db.prepare(`
        SELECT source, target, number FROM json_edges WHERE source IN (${placeholders})
    `).all(...vertex_ids)

    const results = json_vertices.map((v) => ({
        ...v,
        edges: json_edges
            .filter((e) => e.source === v.id)
            .sort((x, y) => x.number - y.number)
            .map((e) => e.target)
    }));

    res.json(results);
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
