import express from "express";
import postureRoutes from "./posture.routes.js";
import dailySummaryRoutes from "./daily_summary.routes.js";
import userRoutes from "./user.routes.js";

const router = express.Router({ mergeParams: true });

router.use(postureRoutes);
router.use(dailySummaryRoutes);
router.use(userRoutes);

export default router;
