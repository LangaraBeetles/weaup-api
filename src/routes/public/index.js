import express from "express";

import accesAuthRoutes from "./accesAuth.routes.js";
import idAuthRoutes from "./idAuth.routes.js";

const router = express.Router({ mergeParams: true });

router.use(accesAuthRoutes);
router.use(idAuthRoutes);

export default router;
