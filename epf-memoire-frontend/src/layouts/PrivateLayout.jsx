import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import SidebarStudent from '../Components/sidebar/SidebarStudent';
import SidebarAdmin from '../Components/sidebar/SidebarAdmin';
import SidebarSupervisor from '../Components/sidebar/SidebarSupervisor';

const PrivateLayout = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  if (!user) return null;

  let SidebarComponent;
  switch (user.role) {
    case 'admin':
      SidebarComponent = SidebarAdmin;
      break;
    case 'etudiant':
      SidebarComponent = SidebarStudent;
      break;
    case 'encadreur':
      SidebarComponent = SidebarSupervisor;
      break;
    default:
      SidebarComponent = () => null;
  }

  return (
    <div className="app-container">
      <Header user={user} />
      <div className="main-layout">
        <SidebarComponent />
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PrivateLayout;
