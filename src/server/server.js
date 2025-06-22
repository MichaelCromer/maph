const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/nodes', (req, res) => {
    const nodes = db.prepare('SELECT * FROM nodes').all();
    res.json(nodes);
    console.log(nodes);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
