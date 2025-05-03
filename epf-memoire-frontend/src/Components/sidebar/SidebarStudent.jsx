import { Link } from 'react-router-dom';
import { FaHome, FaUpload, FaBook, FaSignOutAlt,FaUser, FaArrowAltCircleRight, FaCalendarAlt } from 'react-icons/fa';
import './../../App.css';

const SidebarStudent = () => {
  return (
    <aside className="sidebar">
      <h3>Étudiant</h3>
      <nav>
        <Link to="/dashboard/student">
          <FaHome /> Accueil
        </Link>
        <Link to="/memory-upload">
          <FaUpload /> Dépôt mémoire
        </Link>
        <Link to="/library">
          <FaBook /> Bibliothèque
        </Link>
        <Link to="/supervisor-selection">
        <FaUser />Choix encadreur
        </Link>
        <Link to="/student-supervision">
        <FaArrowAltCircleRight />Suivi
        </Link>
        <Link to="/my-sessions">
        <FaCalendarAlt />Mes Sessions
        </Link>

        <Link to="/login">
          <FaSignOutAlt /> Déconnexion
        </Link>

      </nav>
    </aside>
  );
};

export default SidebarStudent;
