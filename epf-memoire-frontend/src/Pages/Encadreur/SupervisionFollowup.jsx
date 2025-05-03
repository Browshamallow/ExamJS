import { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle, FaFilePdf, FaFilter } from "react-icons/fa";
import './SupervisionFollowup.css';

const SupervisionFollowup = () => {
  const [memoires, setMemoires] = useState([]);
  const [commentaires, setCommentaires] = useState({});
  const [filtreStatut, setFiltreStatut] = useState("tous");

  const fetchMemoires = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/memoires/encadreur", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMemoires(response.data);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des mémoires :", error);
    }
  };

  useEffect(() => {
    fetchMemoires();
  }, []);

  const handleCommentChange = (memoireId, value) => {
    setCommentaires((prev) => ({ ...prev, [memoireId]: value }));
  };

  const handleValidation = async (memoireId, statut) => {
    const commentaire = commentaires[memoireId] || "";
    const confirmation = window.confirm(`Confirmer la validation comme "${statut}" ?`);
    if (!confirmation) return;

    try {
      await axios.put(
        `http://localhost:5000/api/memoires/${memoireId}/validation`,
        { statut, commentaire },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      await fetchMemoires();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mémoire :", error);
    }
  };

  const memoiresFiltres =
    filtreStatut === "tous"
      ? memoires
      : memoires.filter((m) => m.statut === filtreStatut);

  return (
    <div className="supervision-container">
      <h2>📘 Suivi des mémoires encadrés</h2>

      <div className="filtre-section">
        <FaFilter className="filtre-icon" />
        <label htmlFor="filtre">Filtrer par statut :</label>
        <select
          id="filtre"
          value={filtreStatut}
          onChange={(e) => setFiltreStatut(e.target.value)}
        >
          <option value="tous">Tous</option>
          <option value="en_attente">En attente</option>
          <option value="valide">Validé</option>
          <option value="refuse">Refusé</option>
        </select>
      </div>

      {memoiresFiltres.length === 0 ? (
        <p>Aucun mémoire à afficher.</p>
      ) : (
        <div className="table-container">
          <table className="memoire-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Étudiant</th>
                <th>Date de soumission</th>
                <th>Fichier</th>
                <th>Statut</th>
                <th>Commentaire</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {memoiresFiltres.map((memoire) => (
                <tr key={memoire.id}>
                  <td>{memoire.titre}</td>
                  <td>{memoire.etudiant_nom}</td>
                  <td>
                    {memoire.date_soumission
                      ? new Date(memoire.date_soumission).toLocaleDateString()
                      : "Non défini"}
                  </td>
                  <td>
                    <a
                      href={`http://localhost:5000/uploads/memoires/${memoire.fichier}`}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pdf-link"
                    >
                      <FaFilePdf /> Télécharger
                    </a>
                  </td>
                  <td>
                    <span
                      className={`badge ${memoire.statut}`}
                    >
                      {memoire.statut}
                    </span>
                  </td>
                  <td>
                    <textarea
                      rows="2"
                      placeholder="Votre commentaire ici..."
                      value={commentaires[memoire.id] || ""}
                      onChange={(e) => handleCommentChange(memoire.id, e.target.value)}
                    />
                  </td>
                  <td>
                    <button
                      className="btn-valider"
                      onClick={() => handleValidation(memoire.id, "valide")}
                    >
                      <FaCheckCircle /> Valider
                    </button>
                    <button
                      className="btn-refuser"
                      onClick={() => handleValidation(memoire.id, "refuse")}
                    >
                      <FaTimesCircle /> Refuser
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SupervisionFollowup;
