const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/data', (req, res) => {
    const data = db.prepare('SELECT * FROM data').all();
    res.json(data);
    console.log(data);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
