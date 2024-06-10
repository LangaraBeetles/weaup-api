import express from "express";
import postureRoutes from "./posture.routes.js";
import dailySummaryRoutes from "./daily_summary.routes.js";

const router = express.Router({ mergeParams: true });

router.use(postureRoutes);
router.use(dailySummaryRoutes);

export default router;
