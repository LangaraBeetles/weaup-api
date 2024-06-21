import express from "express";
import paths from "../../constants/paths.const.js";
import controllers from "../../controllers/google_auth.controllers.js";

const router = express.Router();

// GET: /api/v1/auth/google
router.get(`${paths.auth}/google`, controllers.googleAuthRedirect);

// GET: /api/v1/auth/google/callback
router.get(`${paths.auth}/google/callback`, controllers.googleAuthCallback);

export default router;
