import express from "express";
import paths from "../../constants/paths.const.js";
import controllers from "../../controllers/auth.controllers.js";

const router = express.Router();

// POST: /api/v1/auth/api
router.post(`${paths.auth}/api`, controllers.getAuthToken);

export default router;
