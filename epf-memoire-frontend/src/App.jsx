import { Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Home from './Pages/Home';
import EtudiantDashboard from './Pages/Etudiant/EtudiantDashboard';
import EncadreurDashboard from './Pages/Encadreur/EncadreurDashboard';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import PrivateRoute from './Components/PrivateRoute';
import DashboardRedirect from './Pages/DashboardRedirect';
import SupervisionFollowup from './Pages/Encadreur/SupervisionFollowup.jsx';
import StudentFollowup from './Pages/Etudiant/StudentFollowup.jsx';
import MemoryUpload from './Pages/Etudiant/MemoryUpload.jsx';
import UserManagement from './Pages/Admin/UserManagement';
import Library from './Pages/Library';
import SupervisorSelection from './Pages/Etudiant/SupervisorSelection.jsx';
import ValidationList from './Pages/Encadreur/ValidationList.jsx';
import SessionPlanning from './Pages/Admin/SessionPlanning.jsx';
import StudentSessions from './Pages/Etudiant/StudentSessions.jsx';
import SessionFollowup from './Pages/Encadreur/SessionFollowup.jsx';
import JuryManagement from './Pages/Admin/JuryManagement.jsx'; 
import SoutenancePlanning from './Pages/Admin/SoutenancePlanning.jsx'; 
import JurySoutenances from './Pages/Admin/JurySoutenances.jsx'; 
import NotFound from './Pages/NotFound';
import Forbidden from './Pages/Forbidden';

import PrivateLayout from './layouts/PrivateLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
     


      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <PrivateLayout><DashboardRedirect /></PrivateLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard/student"
        element={
          <PrivateRoute>
            <PrivateLayout><EtudiantDashboard /></PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/supervisor"
        element={
          <PrivateRoute>
            <PrivateLayout><EncadreurDashboard /></PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/admin"
        element={
          <PrivateRoute>
            <PrivateLayout><AdminDashboard /></PrivateLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/library"
        element={
          <PrivateRoute>
            <PrivateLayout><Library /></PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/supervision-followup"
        element={
          <PrivateRoute>
            <PrivateLayout><SupervisionFollowup /></PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/user-management"
        element={
          <PrivateRoute>
            <PrivateLayout><UserManagement /></PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/memory-upload"
        element={
          <PrivateRoute>
            <PrivateLayout><MemoryUpload /></PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/supervisor-selection"
        element={
          <PrivateRoute>
            <PrivateLayout><SupervisorSelection /></PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/student-supervision"
        element={
          <PrivateRoute>
            <PrivateLayout><StudentFollowup /></PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/validation-list"
        element={
          <PrivateRoute>
            <PrivateLayout><ValidationList /></PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/session-planning"
        element={
          <PrivateRoute>
            <PrivateLayout><SessionPlanning /></PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/my-sessions"
        element={
          <PrivateRoute>
            <PrivateLayout><StudentSessions /></PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/encadreur-sessions"
        element={
          <PrivateRoute>
            <PrivateLayout><SessionFollowup /></PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/jury-management"
        element={
          <PrivateRoute>
            <PrivateLayout><JuryManagement /></PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/soutenance-planning"
        element={
          <PrivateRoute>
            <PrivateLayout><SoutenancePlanning /></PrivateLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/jury-soutenances"
        element={
          <PrivateRoute>
            <PrivateLayout><JurySoutenances /></PrivateLayout>
          </PrivateRoute>
        }
      />

      {/* Error routes */}
      <Route path="/forbidden" element={<Forbidden />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
