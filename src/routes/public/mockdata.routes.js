import express from "express";
import paths from "../../constants/paths.const.js";
import mockdata from "../../controllers/mockdata.controllers.js";

const router = express.Router();

//POST /api/v1/mock/users
router.post(`${paths.mockdata}/users`, mockdata.createUsers);

//POST /api/v1/mock/impersonate
router.get(`${paths.mockdata}/impersonate`, mockdata.impersonate);

export default router;
