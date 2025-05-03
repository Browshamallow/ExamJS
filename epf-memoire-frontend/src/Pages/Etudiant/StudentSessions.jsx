import { useEffect, useState } from 'react';
import './StudentSessions.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faGraduationCap, faUsers } from '@fortawesome/free-solid-svg-icons';

const StudentSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [soutenance, setSoutenance] = useState(null);
  const [jurys, setJurys] = useState([]);
  const user = JSON.parse(localStorage.getItem('user')); // ← utile pour afficher nom

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:5000/api/sessions/student', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setSessions(data.sessions || []);
        setSoutenance(data.soutenance || null);
        setJurys(data.jurys || []);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="session-planning">
   
      <h2><FontAwesomeIcon icon={faBook} /> Mes Sessions de Supervision</h2>

      <table className="session-table">
        <thead>
          <tr>
            <th>Encadreur</th>
            <th>Titre</th>
            <th>Salle</th>
            <th>Date</th>
            <th>Heure</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s, index) => (
            <tr key={index}>
              <td>{s.supervisorName}</td>
              <td>{s.titre}</td>
              <td>{s.salle}</td>
              <td>{new Date(s.date).toLocaleDateString()}</td>
              <td>{s.time}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {soutenance && (
        <div className="soutenance-section">
          <h2 className="soutenance-title">
            <FontAwesomeIcon icon={faGraduationCap} /> Ma Soutenance
          </h2>
          <table className="session-table">
            <thead>
              <tr>
                <th>Encadreur</th>
                <th>Titre</th>
                <th>Salle</th>
                <th>Date</th>
                <th>Heure</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{soutenance.supervisorName}</td>
                <td>{soutenance.titre}</td>
                <td>{soutenance.salle}</td>
                <td>{new Date(soutenance.date).toLocaleDateString()}</td>
                <td>{soutenance.time}</td>
              </tr>
            </tbody>
          </table>

          {jurys.length > 0 && (
            <div className="jury-list">
              <h3><FontAwesomeIcon icon={faUsers} /> Jurys assignés</h3>
              <ul>
                {jurys.map(jury => (
                  <li key={jury.id}>{jury.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentSessions;
