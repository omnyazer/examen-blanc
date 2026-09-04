const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");

const normalizeUsername = (value = "") => value.trim();
const usernameRulesMessage =
  "Le nom d'utilisateur doit contenir entre 3 et 50 caracteres alphanumeriques.";
const passwordRulesMessage =
  "Le mot de passe doit contenir au moins 12 caracteres, une majuscule, une minuscule, un chiffre et un caractere special.";
const authAttempts = new Map();
const maxAttempts = 5;
const windowMs = 15 * 60 * 1000;

const getClientKey = (req) => `${req.ip}:${req.path}`;

const authRateLimit = (req, res, next) => {
  const now = Date.now();
  const key = getClientKey(req);
  const current = authAttempts.get(key);

  if (!current || current.resetAt <= now) {
    authAttempts.set(key, { count: 1, resetAt: now + windowMs });
    return next();
  }

  if (current.count >= maxAttempts) {
    return res.status(429).json({
      msg: "Trop de tentatives. Merci de reessayer dans quelques minutes.",
    });
  }

  current.count += 1;
  authAttempts.set(key, current);
  next();
};

const isValidUsername = (username) => /^[A-Za-z0-9]{3,50}$/.test(username);

const isStrongPassword = (password) =>
  password.length >= 12 &&
  /[A-Z]/.test(password) &&
  /[a-z]/.test(password) &&
  /\d/.test(password) &&
  /[^A-Za-z0-9]/.test(password);

const createToken = (userId) =>
  new Promise((resolve, reject) => {
    const payload = { user: { id: userId } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
      if (err) {
        return reject(err);
      }

      resolve(token);
    });
  });

router.post("/register", authRateLimit, async (req, res) => {
  const username = normalizeUsername(req.body.username);
  const password = typeof req.body.password === "string" ? req.body.password.trim() : "";

  if (!username || !password) {
    return res.status(400).json({ msg: "Merci de remplir tous les champs." });
  }

  if (!isValidUsername(username)) {
    return res.status(400).json({ msg: usernameRulesMessage });
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({ msg: passwordRulesMessage });
  }

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: "Cet utilisateur existe deja." });
    }

    user = new User({ username, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const token = await createToken(user.id);
    res.status(201).json({ token });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ msg: "Erreur serveur." });
  }
});

router.post("/login", authRateLimit, async (req, res) => {
  const username = normalizeUsername(req.body.username);
  const password = typeof req.body.password === "string" ? req.body.password.trim() : "";

  if (!username || !password) {
    return res.status(400).json({ msg: "Merci de remplir tous les champs." });
  }

  if (!isValidUsername(username)) {
    return res.status(400).json({ msg: "Identifiants invalides." });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "Identifiants invalides." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Identifiants invalides." });
    }

    const token = await createToken(user.id);
    res.json({ token });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ msg: "Erreur serveur." });
  }
});

module.exports = router;
module.exports.__test = {
  authRateLimit,
  isStrongPassword,
  isValidUsername,
  passwordRulesMessage,
  usernameRulesMessage,
};
