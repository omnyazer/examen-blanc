import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const passwordRulesMessage =
  "Le mot de passe doit contenir au moins 12 caracteres, une majuscule, une minuscule, un chiffre et un caractere special.";

const isStrongPassword = (password) =>
  password.length >= 12 &&
  /[A-Z]/.test(password) &&
  /[a-z]/.test(password) &&
  /\d/.test(password) &&
  /[^A-Za-z0-9]/.test(password);

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Merci de remplir tous les champs.");
      return;
    }

    if (!isStrongPassword(password)) {
      setError(passwordRulesMessage);
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);
      await api.post("/auth/register", { username, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.msg || "Inscription impossible.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h1>Inscription</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom d'utilisateur</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? "Creation..." : "Creer le compte"}
        </button>
      </form>
      <p className="auth-link">
        Deja un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </div>
  );
};

export default Register;
