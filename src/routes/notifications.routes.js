import express from "express";
import paths from "../constants/paths.const.js";
import controllers from "../controllers/notifications.controllers.js";

const router = express.Router();

// GET: /api/v1/notifications
router.get(`${paths.notifications}`, controllers.getNotifications);

export default router;
