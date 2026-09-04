import React, { useState } from "react";
import api from "../api";

/**
 * Formulaire d'ajout de tache avec validation locale et gestion de session expiree.
 */
const TaskForm = ({ addTask, onAuthExpired }) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Le titre est obligatoire.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      setError("");
      setIsSubmitting(true);
      const res = await api.post(
        "/tasks",
        { title: trimmedTitle },
        {
          headers: { "x-auth-token": token },
        }
      );
      addTask(res.data);
      setTitle("");
    } catch (err) {
      if (err.response?.status === 401 && onAuthExpired) {
        onAuthExpired();
        return;
      }

      setError("Impossible d'ajouter la tache.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-group">
      <input
        type="text"
        placeholder="Ajouter une tache ..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isSubmitting}
      />
      {error && <p>{error}</p>}
      <button
        type="submit"
        className="btn"
        style={{ marginTop: "10px" }}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Ajout..." : "Ajouter Tache"}
      </button>
    </form>
  );
};

export default TaskForm;
