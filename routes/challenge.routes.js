import express from "express";
import challengeController from "../controllers/challenge.controllers";
import paths from "../shared/paths";

const router = express.Router();

// POST /api/v1/challenges
router.post(paths.challenge, challengeController.createChallenge);

export default router;
