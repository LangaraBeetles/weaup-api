import express from "express";
import paths from "../constants/paths.const.js";
import controllers from "../controllers/analytics.controllers.js";

const router = express.Router();

// GET: /api/v1/analytics
router.get(`${paths.analytics}`, controllers.getAnalytics);

export default router;
