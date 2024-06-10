import express from "express";
import challengeRouter from "./challenge.routes";

const router = express.Router({ mergeParams: true });

router.use(challengeRouter);

export default router;
