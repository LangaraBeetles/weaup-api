import express from "express";
import paths from "../constants/paths.const.js";
import controllers from "../controllers/notifications.controllers.js";

const router = express.Router();

// GET: /api/v1/notifications/user/:user_id
router.get(
  `${paths.notifications.base}/user/:user_id`,
  controllers.getNotificationsByUserId,
);

// GET: /api/v1/notifications/user/:user_id/:notification_id
router.get(
  `${paths.notifications.base}/user/:user_id/:notification_id`,
  controllers.getNotificationByUserAndId,
);

export default router;
