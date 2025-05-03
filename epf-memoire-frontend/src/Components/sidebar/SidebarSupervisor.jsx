import { Link } from 'react-router-dom';
import { FaHome, FaClipboardList, FaBook, FaSignOutAlt, FaTimes, FaGavel } from 'react-icons/fa';
import './../../App.css';

const SidebarSupervisor=() => {
  return (
    <aside className="sidebar">
      <h3>Encadreur</h3>
      <nav>
        <Link to="/dashboard/supervisor">
          <FaHome /> Accueil
        </Link>
        <Link to="/supervision-followup">
          <FaClipboardList /> Suivi d'encadrement
        </Link>
        <Link to="/library">
          <FaBook /> Bibliothèque
        </Link>
        <Link to="/encadreur-sessions">
          <FaTimes /> Sessions
        </Link>
        <Link to="/jury-soutenances">
          <FaGavel /> Soutenances à juger
        </Link>
    

        <Link to="/login">
          <FaSignOutAlt /> Déconnexion
        </Link>
      </nav>
    </aside>
  );
};

export default SidebarSupervisor
