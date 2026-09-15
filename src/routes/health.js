import { Router } from "express";

const router = Router();

/** Liveness check for the API. */
router.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

export default router;
