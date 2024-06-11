import express from "express";
import postureRoutes from "./posture.routes.js";
import notificationsRoutes from "./notifications.routes.js";

const router = express.Router({ mergeParams: true });

router.use(postureRoutes);
router.use(notificationsRoutes);

export default router;
