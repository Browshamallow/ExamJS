import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaCalendarAlt, FaFileAlt, FaGraduationCap } from 'react-icons/fa';
import './../../App.css';
import { FaUserGroup } from 'react-icons/fa6';
function AdminSidebar() {
  return (
     <aside className="sidebar">
      <h3>Administrateur</h3>
      <nav>
          <Link to="/dashboard">
            <FaTachometerAlt /> Tableau de bord
          </Link>
     
          <Link to="/user-management">
            <FaUsers /> Gestion des utilisateurs
          </Link>
    
  
          <Link to="/session-planning">
            <FaUserGroup /> Sessions d'encadrement
            </Link>
      
          <Link to="/soutenance-planning">
            <FaGraduationCap /> Planification des soutenances
          </Link>
    
          <Link to="/library">
            <FaFileAlt /> Bibliothèque
          </Link>
       
       </nav>
    </aside>
  );
}

export default AdminSidebar;
