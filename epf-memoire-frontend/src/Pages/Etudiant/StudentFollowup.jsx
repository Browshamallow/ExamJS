// StudentFollowup.jsx
import { useEffect, useState } from 'react';
import './StudentFollowup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faExclamationTriangle, faCheckCircle, faTimesCircle, faClock, faDownload, faFileAlt } from '@fortawesome/free-solid-svg-icons';

const StudentFollowup = () => {
  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMemory = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/memoires/student/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Erreur lors du chargement du mémoire");

        const data = await res.json();
        setMemory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMemory();
  }, [user.id, token]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'valide':
        return <FontAwesomeIcon icon={faCheckCircle} className="status-icon valid" />;
      case 'refuse':
        return <FontAwesomeIcon icon={faTimesCircle} className="status-icon refused" />;
      case 'en_attente':
      default:
        return <FontAwesomeIcon icon={faClock} className="status-icon pending" />;
    }
  };

  if (loading) return <p className="loading"><FontAwesomeIcon icon={faSpinner} spin /> Chargement...</p>;
  if (error) return <p className="error"><FontAwesomeIcon icon={faExclamationTriangle} /> {error}</p>;

  return (
    <div className="supervision-followup">
      <h2><FontAwesomeIcon icon={faFileAlt} /> Suivi du mémoire</h2>

      {memory ? (
        <div className="memory-card">
          <h3>{memory.title}</h3>
          <p><strong>Description :</strong> {memory.description}</p>
          <p>
            <strong>Statut :</strong> {getStatusIcon(memory.validation_status)}
            <span className={`status-text ${memory.validation_status}`}>
              {memory.validation_status.replace('_', ' ')}
            </span>
          </p>
          {memory.commentaire_validation && (
            <p><strong>Commentaire :</strong> {memory.commentaire_validation}</p>
          )}
          <a
            href={`http://localhost:5000/uploads/${memory.filename}`}
            target="_blank"
            rel="noopener noreferrer"
            className="download-link"
          >
            <FontAwesomeIcon icon={faDownload} /> Télécharger le mémoire
          </a>
        </div>
      ) : (
        <p>Aucun mémoire soumis pour le moment.</p>
      )}
    </div>
  );
};

export default StudentFollowup;
