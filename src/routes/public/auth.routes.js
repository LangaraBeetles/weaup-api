import express from "express";
import paths from "../../constants/paths.const.js";
import user from "../../controllers/user.controllers.js";
import auth from "../../controllers/auth.controller.js";

const router = express.Router();

//POST /api/v1/auth
router.post(`${paths.auth}`, user.createUser);

//TODO: deprecate
//POST /api/v1/user
router.post(`${paths.user}`, user.createUser);

//POST /api/v1/auth/refresh/:token
router.post(`${paths.refresh}/:token`, auth.refresh);

export default router;
