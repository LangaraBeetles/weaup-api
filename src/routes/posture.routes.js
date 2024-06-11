import express from "express";
import paths from "../constants/paths.const.js";
import controllers from "../controllers/posture.controllers.js";

const router = express.Router();

// RECORDS
// POST: /api/v1/posture/records
router.post(paths.posture.records, controllers.createPostureRecord);

// GET: /api/v1/posture/records
router.get(paths.posture.records, controllers.getAllRecords);

// GET: /api/v1/posture/records/:id
router.get(`${paths.posture.records}/:id`, controllers.getRecordById);

// SESSIONS
// POST: /api/v1/posture/sessions
router.post(paths.posture.sessions, controllers.createPostureSession);

// GET: /api/v1/posture/sessions
router.get(paths.posture.sessions, controllers.getAllSessions);

// GET: /api/v1/posture/sessions/:id
router.get(`${paths.posture.sessions}/:id`, controllers.getSessionById);

export default router;
