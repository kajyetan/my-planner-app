const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3001;

// Database connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'planner_db',
  password: 'newpoint',
  port: 5432,
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000'  // Allow requests from this origin
}));
app.use(bodyParser.json());

// Routes
app.get('/plans', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM plans');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.post('/plans', async (req, res) => {
  const { name, data } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO plans (name, data) VALUES ($1, $2) RETURNING *',
      [name, data]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.put('/plans/:id', async (req, res) => {
  const { id } = req.params;
  const { name, data } = req.body;
  try {
    const result = await pool.query(
      'UPDATE plans SET name = $1, data = $2 WHERE id = $3 RETURNING *',
      [name, data, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
