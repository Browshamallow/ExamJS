import { useEffect, useState } from 'react';
import Header from './../../Components/Header';
import SidebarEncadreur from './../../Components/sidebar/SidebarSupervisor';
import { FaFileAlt, FaUsers, FaCalendarAlt, FaGraduationCap } from 'react-icons/fa';
import './../Etudiant/EtudiantDashboard.css';

const EncadreurDashboard = () => {
  const [students, setStudents] = useState([]);
  const [memoires, setMemoires] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [soutenances, setSoutenances] = useState([]);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stuRes, memRes, sessRes, soutRes] = await Promise.all([
          fetch(`http://localhost:5000/api/encadreur/users/encadreur/students/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:5000/api/encadreur/memoires/encadreur/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:5000/api/encadreur/sessions/encadreur/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:5000/api/encadreur/soutenances/encadreur/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (stuRes.ok) setStudents(await stuRes.json());
        if (memRes.ok) setMemoires(await memRes.json());
        if (sessRes.ok) setSessions(await sessRes.json());
        if (soutRes.ok) setSoutenances(await soutRes.json());
      } catch (err) {
        console.error("Erreur lors du chargement des données encadreur :", err);
      }
    };

    fetchData();
  }, [user.id, token]);

  return (
    <div className="dashboard">
      <Header />
      <SidebarEncadreur />
      <main className="main">
        <h2>Tableau de bord Encadreur</h2>
        <div className="dashboard-grid">

          <div className="dashboard-card">
            <FaUsers className="icon students" />
            <h4>Étudiants encadrés</h4>
            <p>{students.length} étudiant(s)</p>
          </div>

          <div className="dashboard-card">
            <FaFileAlt className="icon memoires" />
            <h4>Mémoires reçus</h4>
            <p>{memoires.length} mémoire(s)</p>
          </div>

          <div className="dashboard-card">
            <FaCalendarAlt className="icon session" />
            <h4>Sessions prévues</h4>
            <p>{sessions.length} session(s)</p>
          </div>

          <div className="dashboard-card">
            <FaGraduationCap className="icon soutenance" />
            <h4>Soutenances assignées</h4>
            <p>{soutenances.length} soutenance(s)</p>
          </div>

        </div>
      </main>
    </div>
  );
};

export default EncadreurDashboard;
