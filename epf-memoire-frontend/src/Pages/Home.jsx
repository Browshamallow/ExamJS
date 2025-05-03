import { Link } from 'react-router-dom';
import './Home.css';
import logo from '../assets/logo_transparent.png';

const Home = () => {
  return (
    <div className="home-container">
      <img src={logo} alt="EPF Africa" className="home-logo" />
      <h1>Bienvenue sur la plateforme de mémoire EPF Africa</h1>
      <div className="home-links">
        <Link to="/login" className="home-btn">Se connecter</Link>
        <Link to="/register" className="home-btn">S'inscrire</Link>
      </div>
    </div>
  );
};

export default Home;
