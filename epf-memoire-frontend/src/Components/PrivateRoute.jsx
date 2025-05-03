import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();

  // Si l'utilisateur n'est pas connecté, redirige vers login
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si des rôles sont spécifiés et que le rôle ne correspond pas
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  // Accès autorisé
  return children;
};

export default PrivateRoute;
