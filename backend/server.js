// server.js
require('dotenv').config();
const express = require('express');
const pool = require('./db');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Health
app.get('/', (req, res) => res.json({ ok: true }));

// Get all students with last submission for a given test (optional ?testId=)
app.get('/api/students', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM students ORDER BY name');
    res.json({ ok: true, students: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

// Create a student
app.post('/api/students', async (req, res) => {
  const { name, roll_no, class: className } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO students (name, roll_no, class) VALUES ($1,$2,$3) RETURNING *',
      [name, roll_no, className]
    );
    res.json({ ok: true, student: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

// Get test list
app.get('/api/tests', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tests ORDER BY created_at DESC');
    res.json({ ok: true, tests: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

// Submit test result (for student)
app.post('/api/submissions', async (req, res) => {
  const { test_id, student_id, score, time_taken_sec, raw_payload } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO submissions (test_id, student_id, score, time_taken_sec, raw_payload)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [test_id, student_id, score, time_taken_sec, raw_payload || {}]
    );
    res.json({ ok: true, submission: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

// Admin endpoint: all students with latest submission for a test (if testId provided)
app.get('/api/admin/progress', async (req, res) => {
  const testId = req.query.testId;
  try {
    const q = testId ?
      `SELECT st.id, st.name, st.roll_no, sub.score, sub.submitted_at
       FROM students st
       LEFT JOIN LATERAL (
         SELECT * FROM submissions WHERE student_id = st.id AND test_id = $1
         ORDER BY submitted_at DESC LIMIT 1
       ) sub ON true
       ORDER BY st.name` :
      `SELECT st.id, st.name, st.roll_no, sub.score, sub.submitted_at
       FROM students st
       LEFT JOIN LATERAL (
         SELECT * FROM submissions WHERE student_id = st.id
         ORDER BY submitted_at DESC LIMIT 1
       ) sub ON true
       ORDER BY st.name`;
    const params = testId ? [testId] : [];
    const { rows } = await pool.query(q, params);
    res.json({ ok: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Server running on', port));
