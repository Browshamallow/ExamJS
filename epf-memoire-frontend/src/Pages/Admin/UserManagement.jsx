import { useState, useEffect } from 'react';
import './UserManagement.css';
import SidebarAdmin from '../../Components/sidebar/SidebarAdmin';
import Header from '../../Components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus,
  faEnvelope,
  faLock,
  faUserShield,
  faTrashAlt,
  faSave,
} from '@fortawesome/free-solid-svg-icons';

const UserManagement = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'encadreur',
  });

  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const editableUsers = data.map((u) => ({
          ...u,
          editingName: u.name,
          editingEmail: u.email,
          editingRole: u.role,
        }));
        setUsers(editableUsers);
      } else {
        console.error('Erreur récupération utilisateurs:', data);
      }
    } catch (err) {
      console.error('Erreur serveur:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Utilisateur créé');
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'encadreur',
        });
        fetchUsers();
      } else {
        setMessage(data.message || '❌ Erreur');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Erreur serveur');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setUsers(users.filter((u) => u.id !== id));
        setMessage('Utilisateur supprimé');
      } else {
        const data = await res.json();
        setMessage(data.message || 'Erreur suppression');
      }
    } catch (err) {
      console.error(err);
      setMessage('Erreur serveur');
    }
  };

  const handleUpdate = async (id, user) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: user.editingName,
          email: user.editingEmail,
          role: user.editingRole,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Utilisateur mis à jour');
        fetchUsers();
      } else {
        setMessage(data.message || '❌ Erreur mise à jour');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Erreur serveur');
    }
  };

  return (
    <div className="user-management-container">
      <Header />
      <SidebarAdmin />
      <div className="user-management-content">
        <h2><FontAwesomeIcon icon={faUserPlus} /> Créer un utilisateur</h2>
        <div className="user-management-grid">
          <form className="user-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <FontAwesomeIcon icon={faUserPlus} />
              <input
                type="text"
                name="name"
                placeholder="Nom complet"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <FontAwesomeIcon icon={faEnvelope} />
              <input
                type="email"
                name="email"
                placeholder="Adresse email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <FontAwesomeIcon icon={faLock} />
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <FontAwesomeIcon icon={faUserShield} />
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="encadreur">Encadreur</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
            <button type="submit">Créer l'utilisateur</button>
            {message && <p className="form-message">{message}</p>}
          </form>

          <div className="user-list">
            <h3>Utilisateurs existants</h3>
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <input
                        type="text"
                        value={user.editingName}
                        onChange={(e) =>
                          setUsers((prev) =>
                            prev.map((u) =>
                              u.id === user.id ? { ...u, editingName: e.target.value } : u
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        value={user.editingEmail}
                        onChange={(e) =>
                          setUsers((prev) =>
                            prev.map((u) =>
                              u.id === user.id ? { ...u, editingEmail: e.target.value } : u
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      <select
                        value={user.editingRole}
                        onChange={(e) =>
                          setUsers((prev) =>
                            prev.map((u) =>
                              u.id === user.id ? { ...u, editingRole: e.target.value } : u
                            )
                          )
                        }
                      >
                        <option value="etudiant">Étudiant</option>
                        <option value="encadreur">Encadreur</option>
                        <option value="admin">Administrateur</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={() => handleUpdate(user.id, user)} title="Sauvegarder">
                        <FontAwesomeIcon icon={faSave} />
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(user.id)}
                        title="Supprimer"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
