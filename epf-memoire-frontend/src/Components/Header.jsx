// src/components/Header.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import './../App.css';
import logo from "../assets/logo_transparent.png"; 


const Header = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUsername(storedUser.name || storedUser.username || "Utilisateur");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="main-header">
      <div className="logo">
        <img src={logo} alt="EPF Africa" />
        <h1>EPF Africa</h1>
      </div>
      <div className="user-info">
        <span>Bienvenue, <strong>{username}</strong></span>
        <button onClick={handleLogout} title="Déconnexion">
          <FaSignOutAlt />
        </button>
      </div>
    </header>
  );
};

export default Header;
