import { useEffect, useState } from 'react';
import './SessionPlanning.css';

const JurySoutenances = () => {
  const [soutenances, setSoutenances] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/sessions/jury', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setSoutenances(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="session-planning">
      <h2>🎓 Soutenances où je suis Jury</h2>
      {soutenances.length === 0 ? (
        <p>Aucune soutenance assignée.</p>
      ) : (
        <table className="session-table">
          <thead>
            <tr>
              <th>Étudiant</th>
              <th>Encadreur</th>
              <th>Titre</th>
              <th>Salle</th>
              <th>Date</th>
              <th>Heure</th>
            </tr>
          </thead>
          <tbody>
            {soutenances.map((s, index) => (
              <tr key={index}>
                <td>{s.studentName}</td>
                <td>{s.supervisorName}</td>
                <td>{s.titre}</td>
                <td>{s.salle}</td>
                <td>{new Date(s.date).toLocaleDateString()}</td>
                <td>{s.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default JurySoutenances;
