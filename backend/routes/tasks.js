const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/Task");
const logger = require("../utils/logger");

const escapeHtml = (value = "") =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const sanitizeTaskInput = ({ title = "", description = "" }) => ({
  title: escapeHtml(title.trim()),
  description: escapeHtml(description.trim()),
});

const isValidTaskId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * GET /api/tasks
 * Retourne uniquement les taches de l'utilisateur authentifie.
 */
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ msg: "Erreur serveur." });
  }
});

router.post("/", auth, async (req, res) => {
  const { title, description } = sanitizeTaskInput(req.body);

  if (!title) {
    return res.status(400).json({ msg: "Le titre est obligatoire." });
  }

  try {
    const newTask = new Task({
      title,
      description,
      user: req.user.id,
    });

    const task = await newTask.save();
    res.status(201).json(task);
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ msg: "Erreur serveur." });
  }
});

router.put("/:id", auth, async (req, res) => {
  if (!isValidTaskId(req.params.id)) {
    return res.status(400).json({ msg: "Identifiant de tache invalide." });
  }

  const updates = {};

  if (typeof req.body.title === "string") {
    updates.title = escapeHtml(req.body.title.trim());
    if (!updates.title) {
      return res.status(400).json({ msg: "Le titre est obligatoire." });
    }
  }

  if (typeof req.body.description === "string") {
    updates.description = escapeHtml(req.body.description.trim());
  }

  if (typeof req.body.isCompleted === "boolean") {
    updates.isCompleted = req.body.isCompleted;
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ msg: "Aucune modification fournie." });
  }

  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Tache introuvable." });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Acces interdit." });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json(updatedTask);
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ msg: "Erreur serveur." });
  }
});

router.delete("/:id", auth, async (req, res) => {
  if (!isValidTaskId(req.params.id)) {
    return res.status(400).json({ msg: "Identifiant de tache invalide." });
  }

  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Tache introuvable." });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Acces interdit." });
    }

    await task.deleteOne();

    res.json({ msg: "Tache supprimee." });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ msg: "Erreur serveur." });
  }
});

module.exports = router;
module.exports.__test = {
  isValidTaskId,
  sanitizeTaskInput,
};
