import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaUserPlus,
  FaClipboardCheck,
} from "react-icons/fa";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    etudiants: 0,
    encadreurs: 0,
    memoires: 0,
    valides: 0,
  });

  const [recents, setRecents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resStats = await axios.get("http://localhost:5000/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setStats(resStats.data.stats);
        setRecents(resStats.data.recents);
      } catch (error) {
        console.error("Erreur lors de la récupération du tableau de bord admin :", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="admin-dashboard-container">
      <h2>📊 Tableau de bord administrateur</h2>

      <div className="cards-container">
        <div className="card violet">
          <FaUserGraduate className="icon" />
          <div>
            <h3>{stats.etudiants}</h3>
            <p>Étudiants</p>
          </div>
        </div>

        <div className="card red">
          <FaChalkboardTeacher className="icon" />
          <div>
            <h3>{stats.encadreurs}</h3>
            <p>Encadreurs</p>
          </div>
        </div>

        <div className="card dark">
          <FaBook className="icon" />
          <div>
            <h3>{stats.memoires}</h3>
            <p>Mémoires</p>
          </div>
        </div>

        <div className="card green">
          <FaClipboardCheck className="icon" />
          <div>
            <h3>{stats.valides}</h3>
            <p>Mémoires validés</p>
          </div>
        </div>
      </div>

      <div className="recent-section">
        <h3>🕒 Dernières inscriptions</h3>
        {recents.length === 0 ? (
          <p>Aucune donnée récente.</p>
        ) : (
          <table className="recent-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recents.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
