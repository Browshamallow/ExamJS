import { useEffect, useState } from 'react';

const SessionFollowup = () => {
  const [sessions, setSessions] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:5000/api/sessions/encadreur', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Erreur récupération des sessions");
        return res.json();
      })
      .then(data => setSessions(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="session-followup">
      <h2>📋 Mes Sessions de Supervision</h2>
      <table className="session-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Étudiant</th>
            <th>Date</th>
            <th>Heure</th>
            <th>Salle</th>
          </tr>
        </thead>
        <tbody>
          {sessions.length === 0 ? (
            <tr><td colSpan="5">Aucune session trouvée</td></tr>
          ) : (
            sessions.map((s, index) => (
              <tr key={index}>
                <td>{s.titre}</td>
                <td>{s.studentName}</td>
                <td>{s.date?.split('T')[0]}</td>
                <td>{s.time}</td>
                <td>{s.salle}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SessionFollowup;
