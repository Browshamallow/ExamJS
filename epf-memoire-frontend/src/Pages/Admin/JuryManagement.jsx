import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JuryManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [availableJurys, setAvailableJurys] = useState([]);
  const [selectedJuryId, setSelectedJuryId] = useState('');
  const [assignedJurys, setAssignedJurys] = useState([]);

  // Charger toutes les sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/sessions');
        console.log('sessions response:', response.data);
        setSessions(response.data); // <- doit être un tableau
      } catch (error) {
        console.error('Erreur lors du chargement des sessions:', error);
      }
    };
  
    fetchSessions();
  }, []);
  

  // Charger tous les encadreurs (pouvant être jurys)
  useEffect(() => {
    axios.get('/api/users?role=encadreur') // adapte selon ton backend
      .then(res => setAvailableJurys(res.data))
      .catch(err => console.error(err));
  }, []);

  // Charger les jurys assignés à la session sélectionnée
  useEffect(() => {
    if (selectedSessionId) {
      axios.get(`/api/session-jurys/session/${selectedSessionId}`)
        .then(res => setAssignedJurys(res.data))
        .catch(err => console.error(err));
    } else {
      setAssignedJurys([]);
    }
  }, [selectedSessionId]);

  const handleAssignJury = () => {
    if (!selectedSessionId || !selectedJuryId) return;

    axios.post('/api/session-jurys', {
      sessionId: selectedSessionId,
      juryId: selectedJuryId
    })
      .then(() => {
        setSelectedJuryId('');
        // Rafraîchir les jurys
        return axios.get(`/api/session-jurys/session/${selectedSessionId}`);
      })
      .then(res => setAssignedJurys(res.data))
      .catch(err => alert("Ce jury est peut-être déjà assigné à cette session."));
  };

  const handleRemoveJury = (id) => {
    axios.delete(`/api/session-jurys/${id}`)
      .then(() => setAssignedJurys(prev => prev.filter(j => j.id !== id)))
      .catch(err => console.error(err));
  };

  return (
    <div className="jury-management">
      <h2>Gestion des jurys par session</h2>

      <div>
        <label>Session :</label>
        <select onChange={(e) => setSelectedSessionId(e.target.value)} value={selectedSessionId}>
          <option value="">-- Choisir une session --</option>
          {Array.isArray(sessions) && sessions.map((session) => (
  <option key={session.id} value={session.id}>{session.titre}</option>
))}

        </select>
      </div>

      {selectedSessionId && (
        <>
          <div style={{ marginTop: '1rem' }}>
            <label>Ajouter un jury :</label>
            <select onChange={(e) => setSelectedJuryId(e.target.value)} value={selectedJuryId}>
              <option value="">-- Choisir un jury --</option>
              {availableJurys.map(j => (
                <option key={j.id} value={j.id}>{j.name}</option>
              ))}
            </select>
            <button onClick={handleAssignJury}>Ajouter</button>
          </div>

          <h3>Jurys assignés</h3>
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignedJurys.map(j => (
                <tr key={j.id}>
                  <td>{j.name}</td>
                  <td>
                    <button onClick={() => handleRemoveJury(j.id)}>Retirer</button>
                  </td>
                </tr>
              ))}
              {assignedJurys.length === 0 && (
                <tr><td colSpan="2">Aucun jury assigné</td></tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default JuryManagement;
