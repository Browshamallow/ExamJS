import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SoutenancePlanning.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faChalkboardTeacher,
  faClock,
  faUserCheck,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';

const SoutenancePlanning = () => {
  const [sessions, setSessions] = useState([]);
  const [availableJurys, setAvailableJurys] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedJurys, setSelectedJurys] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:5000/api/sessions', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setSessions(res.data))
      .catch(err => console.error('Erreur sessions:', err));

    axios.get('http://localhost:5000/api/users?role=encadreur', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setAvailableJurys(res.data))
      .catch(err => console.error('Erreur jurys:', err));
  }, []);

  const handleJuryChange = (juryId) => {
    if (selectedJurys.includes(juryId)) {
      setSelectedJurys(selectedJurys.filter(id => id !== juryId));
    } else {
      setSelectedJurys([...selectedJurys, juryId]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedSessionId || !selectedDate || selectedJurys.length < 3) {
      return setMessage('❗ Veuillez sélectionner une session, une date et au moins 3 jurys.');
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/session-jurys/planify', {
        sessionId: selectedSessionId,
        dateSoutenance: selectedDate,
        juryIds: selectedJurys,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage('✅ Soutenance planifiée avec succès.');
      setSelectedSessionId('');
      setSelectedDate('');
      setSelectedJurys([]);
    } catch (err) {
      console.error(err);
      setMessage('❌ Erreur lors de la planification.');
    }
  };

  return (
    <div className="soutenance-planning">
      <h2><FontAwesomeIcon icon={faCalendarAlt} /> Planification de soutenance</h2>

      <div className="form-group">
        <label><FontAwesomeIcon icon={faChalkboardTeacher} /> Session :</label>
        <select value={selectedSessionId} onChange={(e) => setSelectedSessionId(e.target.value)}>
          <option value="">-- Choisir une session --</option>
          {sessions.map(s => (
            <option key={s.id} value={s.id}>{s.titre}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label><FontAwesomeIcon icon={faClock} /> Date de soutenance :</label>
        <input
          type="datetime-local"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="form-group jury-group">
        <label><FontAwesomeIcon icon={faUserCheck} /> Choisir les jurys (min. 3) :</label>
        <div className="jury-list">
          {availableJurys.map(j => (
            <div key={j.id} className="jury-item">
              <input
                type="checkbox"
                id={`jury-${j.id}`}
                checked={selectedJurys.includes(j.id)}
                onChange={() => handleJuryChange(j.id)}
              />
              <label htmlFor={`jury-${j.id}`}>{j.name}</label>
            </div>
          ))}
        </div>
      </div>

      <button className="submit-btn" onClick={handleSubmit}>
        <FontAwesomeIcon icon={faCheckCircle} /> Planifier
      </button>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default SoutenancePlanning;
