import express from "express";
import paths from "../constants/paths.const.js";
import controllers from "../controllers/user.controllers.js";

const router = express.Router();

//POST /api/v1/user/
router.post(`${paths.user}`, controllers.createUser);

//PATCH /api/v1/user/:_id
router.patch(`${paths.user}/:id`, controllers.updateUser);

export default router;
