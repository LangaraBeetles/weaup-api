import express from "express";
import controllers from "../controllers/challenge.controllers.js";
import paths from "../constants/paths.const.js";

const router = express.Router();

// POST /api/v1/challenges
router.post(`${paths.challenge}`, controllers.createChallenge);

// GET /api/v1/challenges
router.get(`${paths.challenge}`, controllers.getChallenges);

// GET /api/v1/challenges/:id
router.get(`${paths.challenge}/:id`, controllers.getChallengeById);

export default router;
