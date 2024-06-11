import express from "express";
import paths from "../constants/paths.const.js";
import controllers from "../controllers/posture.controllers.js";

const router = express.Router();

// POST: /api/v1/posture/records
router.post(paths.posture.records, controllers.createPostureRecord);

// GET: /api/v1/posture/records
router.get(paths.posture.records, controllers.getAll);

// GET: /api/v1/posture/records/:id
router.get(`${paths.posture.records}/:id`, controllers.getById);

export default router;
