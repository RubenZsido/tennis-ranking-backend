import { Router } from "express";
import healthRouter from "./health.js";
import playersRouter from "./players.js";

const router = Router();

router.use("/health", healthRouter);
router.use("/players", playersRouter);

export default router;
