const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const db = new Database('./server/database');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


app.get('/api/nodes', (req, res) => {
    const nodes = db.prepare('SELECT * FROM nodes').all();
    console.log(`Server recieved GET request /nodes`);
    res.json(nodes);
    console.log(nodes);
});


app.get('/api/edges', (req, res) => {
    const edges = db.prepare('SELECT * FROM edges').all();
    console.log(`Server recieved GET request /edges`);
    console.log(edges);
    res.json(edges);
});


app.get('/api/search', (req, res) => {
    const s = req.query.string
    console.log(`Server recieved GET request /search?string=${s}`);

    const results = db.prepare(`
        SELECT * FROM nodes WHERE title LIKE ('%' || ? || '%')
    `).all(s);

    res.json(results);
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
