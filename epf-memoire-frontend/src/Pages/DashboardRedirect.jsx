import { Navigate } from "react-router-dom";

const DashboardRedirect = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/login" />;

  switch (user.role) {
    case "student":
      return <Navigate to="/dashboard/student" />;
    case "supervisor":
      return <Navigate to="/dashboard/supervisor" />;
    case "admin":
      return <Navigate to="/dashboard/admin" />;
    default:
      return <Navigate to="/login" />;
  }
};

export default DashboardRedirect;
