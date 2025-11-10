-- schema.sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  roll_no TEXT,
  class TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE tests (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  total_marks INT DEFAULT 100,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  test_id INT REFERENCES tests(id),
  student_id INT REFERENCES students(id),
  score NUMERIC,
  time_taken_sec INT,
  submitted_at TIMESTAMP DEFAULT now(),
  raw_payload JSONB
);
