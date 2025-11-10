import React, { useEffect, useState } from 'react';
const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';

function App() {
  const [students, setStudents] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/students`).then(r => r.json()).then(data => {
      if (data.ok) setStudents(data.students || []);
    });
    fetch(`${API}/api/admin/progress`).then(r => r.json()).then(data => {
      if (data.ok) setProgress(data.data || []);
    });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard — Students Progress</h1>

      <h2>Students</h2>
      <table border="1" cellPadding="8">
        <thead><tr><th>Name</th><th>Roll No</th><th>Class</th></tr></thead>
        <tbody>
          {students.map(s => <tr key={s.id}><td>{s.name}</td><td>{s.roll_no}</td><td>{s.class}</td></tr>)}
        </tbody>
      </table>

      <h2 style={{ marginTop: 20 }}>Latest Progress</h2>
      <table border="1" cellPadding="8">
        <thead><tr><th>Name</th><th>Last Score</th><th>Submitted At</th></tr></thead>
        <tbody>
          {progress.map(p => <tr key={p.id}><td>{p.name}</td><td>{p.score ?? '—'}</td><td>{p.submitted_at ?? '—'}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}

export default App;
