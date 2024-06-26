import express from "express";
import paths from "../constants/paths.const.js";
import controllers from "../controllers/user.controllers.js";

const router = express.Router();

//POST /api/v1/user/
// included in public routes

//PATCH /api/v1/user/:id
router.patch(`${paths.user}/:id`, controllers.updateUser);

//GET /api/v1/user/:id
router.get(`${paths.user}/:id`, controllers.getUserById);

//GET /api/v1/users
router.get(`${paths.user}`, controllers.getUsers);

export default router;
