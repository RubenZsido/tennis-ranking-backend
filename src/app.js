import express from "express";
import cors from "cors";
import { config } from "./config.js";
import apiRouter from "./routes/index.js";

const app = express();

app.use(cors({ origin: config.clientOrigin }));
app.use(express.json());

/** Service root — Render/browser hits `/`; real routes live under `/api`. */
app.get("/", (_req, res) => {
  res.json({
    name: "tennis-ranking-backend",
    health: "/api/health",
    players: "/api/players",
  });
});

app.use("/api", apiRouter);

/** JSON error responses for failed routes. */
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error." });
});

export default app;
