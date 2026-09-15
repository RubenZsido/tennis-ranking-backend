import express from "express";
import cors from "cors";
import { config } from "./config.js";
import apiRouter from "./routes/index.js";

const app = express();

app.use(cors({ origin: config.clientOrigin }));
app.use(express.json());

app.use("/api", apiRouter);

export default app;
