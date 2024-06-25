import express from "express";
import paths from "../constants/paths.const.js";
import controllers from "../controllers/daily_summary.controllers.js";

const router = express.Router();

// POST: /api/v1/daily_summary/:date
router.post(`${paths.daily_summary}/:date`, controllers.createDailySummary);

// GET: /api/v1/daily_summary
router.get(`${paths.daily_summary}`, controllers.getAll);

// GET: /api/v1/daily_summary/:date
router.get(`${paths.daily_summary}/:date`, controllers.getAll);

export default router;
