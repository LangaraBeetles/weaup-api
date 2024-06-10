import express from "express";
import challengeRoutes from "../src/routes/challenge.routes";

const router = express.Router({ mergeParams: true });

router.use(challengeRoutes);

export default router;
