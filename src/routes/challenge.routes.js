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

// DELETE /api/v1/challenges/:id/members/:userId
router.delete(
  `${paths.challenge}/:id/members/:userId`,
  controllers.removeMember,
);

// POST /api/v1/challenges/:id/join
router.post(`${paths.challenge}/:id/join`, controllers.joinChallenge);

export default router;
