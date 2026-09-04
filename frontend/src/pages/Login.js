import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const Login = ({ onLogin }) => {
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

    try {
      setError("");
      setIsSubmitting(true);
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      if (onLogin) onLogin();
      navigate("/tasks");
    } catch (err) {
      setError(err.response?.data?.msg || "Connexion impossible.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h1>Connexion</h1>
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
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </button>
      </form>
      <p className="auth-link">
        Pas encore de compte ? <Link to="/register">Creer un compte</Link>
      </p>
    </div>
  );
};

export default Login;
