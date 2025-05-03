import { useEffect, useState } from 'react';
import './SessionPlanning.css';

const SessionPlanning = () => {
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [form, setForm] = useState({
    titre: '',
    studentId: '',
    supervisorId: '',
    date: '',
    time: '',
    salle: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [sessionsRes, studentsRes, supervisorsRes] = await Promise.all([
        fetch('http://localhost:5000/api/sessions', { headers }),
        fetch('http://localhost:5000/api/users/etudiants', { headers }),
        fetch('http://localhost:5000/api/users/encadreurs', { headers })
      ]);

      const [sessionsData, studentsData, supervisorsData] = await Promise.all([
        sessionsRes.json(),
        studentsRes.json(),
        supervisorsRes.json()
      ]);

      setSessions(sessionsData);
      setStudents(studentsData);
      setSupervisors(supervisorsData);
    } catch (err) {
      console.error('Erreur chargement données :', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(form)
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur création session');
        return res.json();
      })
      .then(newSession => {
        setSessions(prev => [...prev, {
          ...newSession,
          studentName: students.find(s => s.id == newSession.studentId)?.name,
          supervisorName: supervisors.find(s => s.id == newSession.supervisorId)?.name
        }]);
        setForm({ titre: '', studentId: '', supervisorId: '', date: '', time: '', salle: '' });
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="session-planning">
      <h2>🗓️ Supervision Sessions Planning</h2>

      <form onSubmit={handleSubmit} className="session-form">
        <input
          type="text"
          name="titre"
          placeholder="Titre"
          value={form.titre}
          onChange={handleChange}
          required
        />

        <select name="studentId" value={form.studentId} onChange={handleChange} required>
          <option value="">-- Select Student --</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <select name="supervisorId" value={form.supervisorId} onChange={handleChange} required>
          <option value="">-- Select Supervisor --</option>
          {supervisors.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <input type="date" name="date" value={form.date} onChange={handleChange} required />
        <input type="time" name="time" value={form.time} onChange={handleChange} required />
        <input type="text" name="salle" placeholder="Salle" value={form.salle} onChange={handleChange} required />

        <button type="submit">Ajouter la session</button>
      </form>

      <table className="session-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Étudiant</th>
            <th>Encadreur</th>
            <th>Date</th>
            <th>Heure</th>
            <th>Salle</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s, i) => (
            <tr key={i}>
              <td>{s.titre}</td>
              <td>{s.studentName}</td>
              <td>{s.supervisorName}</td>
              <td>{new Date(s.date).toLocaleDateString()}</td>
              <td>{s.time}</td>
              <td>{s.salle}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SessionPlanning;
