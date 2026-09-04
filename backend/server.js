require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const logger = require("./utils/logger");

const requiredEnv = ["MONGO_URI", "JWT_SECRET"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  logger.error(`Variables d'environnement manquantes: ${missingEnv.join(", ")}`);
  process.exit(1);
}

connectDB();

const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      const error = new Error("Origin non autorisee par CORS.");
      error.status = 403;
      return callback(error);
    },
  })
);
app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks"));

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = status >= 500 ? "Erreur serveur." : err.message;

  logger.error(err.message || err);
  res.status(status).json({ msg: message || "Erreur serveur." });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
