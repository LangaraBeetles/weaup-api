import express from "express";
import challengeRoutes from "./challenge.routes";

const router = express.Router({ mergeParams: true });

router.use(challengeRoutes);

export default router;
