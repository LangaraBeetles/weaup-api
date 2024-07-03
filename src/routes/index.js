import express from "express";
import postureRoutes from "./posture.routes.js";

import dailySummaryRoutes from "./daily_summary.routes.js";
import challengeRoutes from "./challenge.routes.js";
import userRoutes from "./user.routes.js";
import notificationsRoutes from "./notifications.routes.js";
import analyticsRoutes from "./analytics.routes.js";

const router = express.Router({ mergeParams: true });

router.use(postureRoutes);

router.use(dailySummaryRoutes);
router.use(challengeRoutes);
router.use(userRoutes);
router.use(notificationsRoutes);
router.use(analyticsRoutes);

export default router;
