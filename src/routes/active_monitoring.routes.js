import express from "express";
import paths from "../constants/paths.const.js";
import {
  getActiveMonitoring,
  createActiveMonitoring,
} from "../controllers/active_monitoring.controllers.js";

const router = express.Router();

// GET: /api/v1/active_monitoring
router.get(`${paths.active_monitoring}`, getActiveMonitoring);

// POST: /api/v1/active_monitoring
router.post(`${paths.active_monitoring}`, createActiveMonitoring);

export default router;
