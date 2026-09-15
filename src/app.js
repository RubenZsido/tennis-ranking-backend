import express from "express";
import cors from "cors";
import { config } from "./config.js";
import apiRouter from "./routes/index.js";

const app = express();

app.use(cors({ origin: config.clientOrigin }));
app.use(express.json());

app.use("/api", apiRouter);

/** JSON error responses for failed routes. */
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error." });
});

export default app;
