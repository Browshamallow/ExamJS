import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MemoryUpload.css';

const MemoryUpload = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    fichier: null,
  });
  const [message, setMessage] = useState('');

  const encadreurId = localStorage.getItem('encadreur_id');
  const encadreurName = localStorage.getItem('encadreur_name');

  useEffect(() => {
    if (!encadreurId) {
      alert("Veuillez d'abord sélectionner un encadreur.");
      navigate('/supervisor-selection');
    }
  }, [encadreurId, navigate]);

  const handleChange = (e) => {
    if (e.target.name === 'fichier') {
      setFormData({ ...formData, fichier: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Utilisateur non authentifié.');
      return;
    }

    if (!encadreurId) {
      setMessage("Aucun encadreur sélectionné.");
      return;
    }

    const form = new FormData();
    form.append('titre', formData.titre);
    form.append('description', formData.description);
    form.append('fichier', formData.fichier);
    form.append('encadreur_id', encadreurId); // 👈 Ajouter l’encadreur ici

    try {
      const res = await fetch('http://localhost:5000/api/memoires', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(text);
      }

      if (res.ok) {
        setMessage('Mémoire envoyé avec succès ✅');
        setFormData({ titre: '', description: '', fichier: null });
      } else {
        setMessage(data.message || 'Erreur lors de l’envoi');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setMessage(err.message || 'Erreur serveur');
    }
  };

  return (
      <div className="memory-upload-container">
        <h2>Déposer un mémoire</h2>
        {encadreurName && (
          <p style={{ fontStyle: 'italic' }}>
            Encadreur sélectionné : <strong>{encadreurName}</strong>
          </p>
        )}
        <form onSubmit={handleSubmit} className="upload-form">
          <input
            type="text"
            name="titre"
            placeholder="Titre du mémoire"
            value={formData.titre}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="fichier"
            accept=".pdf"
            onChange={handleChange}
            required
          />
          <button type="submit">Soumettre</button>
        </form>
        {message && <p className="form-message">{message}</p>}
      </div>
  );
};

export default MemoryUpload;
