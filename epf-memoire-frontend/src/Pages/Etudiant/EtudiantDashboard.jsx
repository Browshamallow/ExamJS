import { useEffect, useState } from 'react';
import Header from './../../Components/Header';
import SidebarStudent from './../../Components/sidebar/SidebarStudent';
import { FaFileAlt, FaCheck, FaCalendarAlt, FaGraduationCap } from 'react-icons/fa';
import './EtudiantDashboard.css';

const EtudiantDashboard = () => {
  const [memory, setMemory] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [soutenance, setSoutenance] = useState(null);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [memRes, sessRes] = await Promise.all([
          fetch(`http://localhost:5000/api/memoires/student/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:5000/api/sessions/student`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (memRes.ok) {
          const memData = await memRes.json();
          setMemory(memData);
        }

        if (sessRes.ok) {
          const sessData = await sessRes.json();
          setSessions(sessData.sessions || []);
          setSoutenance(sessData.soutenance || null);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données :", err);
      }
    };

    fetchDashboardData();
  }, [user.id, token]);

  return (
    <div className="dashboard">
      <Header />
      <SidebarStudent />
      <main className="main">
        <h2>Tableau de bord Étudiant</h2>
        <div className="dashboard-grid">

          <div className="dashboard-card">
            <FaFileAlt className="icon file" />
            <h4>Mémoire</h4>
            <p>{memory ? memory.title : 'Aucun mémoire'}</p>
          </div>

          <div className="dashboard-card">
            <FaCheck className="icon check" />
            <h4>Statut</h4>
            <p style={{ color: memory?.validation_status === 'valide' ? 'green' : memory?.validation_status === 'refuse' ? 'red' : 'orange' }}>
              {memory ? memory.validation_status : 'N/A'}
            </p>
          </div>

          <div className="dashboard-card">
            <FaCalendarAlt className="icon calendar" />
            <h4>Sessions</h4>
            <p>{sessions.length > 0 ? `${sessions.length} session(s)` : 'Aucune session'}</p>
          </div>

          <div className="dashboard-card">
            <FaGraduationCap className="icon graduation" />
            <h4>Soutenance</h4>
            <p>{soutenance ? 'Planifiée' : 'Non planifiée'}</p>
          </div>

        </div>
      </main>
    </div>
  );
};

export default EtudiantDashboard;
