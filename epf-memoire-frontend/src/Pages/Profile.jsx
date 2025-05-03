import { useEffect, useState } from 'react';
import axios from 'axios';
import "./Profile.css";


const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get('http://localhost:5000/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => setUser(res.data))
      .catch(err => {
        console.error(err);
        alert('Accès refusé. Veuillez vous reconnecter.');
      });
  }, []);

  return (
    <div>
      <h2>Profil</h2>
      {user ? (
        <div>
          <p><strong>Nom:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
};

export default Profile;
