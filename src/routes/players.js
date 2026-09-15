import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  createPlayer,
  deletePlayer,
  getPlayerById,
  listPlayers,
  updatePlayer,
  validatePlayer,
} from "../repositories/playersRepository.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const players = await listPlayers();
    res.json(players);
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const player = await getPlayerById(req.params.id);
    if (!player) {
      res.status(404).json({ error: "Player not found." });
      return;
    }
    res.json(player);
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const err = validatePlayer(req.body);
    if (err) {
      res.status(400).json({ error: err });
      return;
    }
    try {
      const created = await createPlayer(req.body);
      res.status(201).json(created);
    } catch (e) {
      if (e.code === "23505") {
        res.status(409).json({ error: "A player with this id already exists." });
        return;
      }
      throw e;
    }
  }),
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    if (req.body?.id && req.body.id !== req.params.id) {
      res.status(400).json({ error: "URL id must match body id." });
      return;
    }
    const err = validatePlayer({ ...req.body, id: req.params.id });
    if (err) {
      res.status(400).json({ error: err });
      return;
    }
    const updated = await updatePlayer(req.params.id, { ...req.body, id: req.params.id });
    if (!updated) {
      res.status(404).json({ error: "Player not found." });
      return;
    }
    res.json(updated);
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const removed = await deletePlayer(req.params.id);
    if (!removed) {
      res.status(404).json({ error: "Player not found." });
      return;
    }
    res.status(204).send();
  }),
);

export default router;
