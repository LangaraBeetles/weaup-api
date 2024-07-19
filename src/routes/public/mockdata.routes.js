import express from "express";
import paths from "../../constants/paths.const.js";
import mockdata from "../../controllers/mockdata.controllers.js";

const router = express.Router();

//POST /api/v1/mock/users
router.post(`${paths.mockdata}/users`, mockdata.createUsers);

//POST /api/v1/mock/impersonate
router.get(`${paths.mockdata}/impersonate`, mockdata.impersonate);

//POST /api/v1/mock/join_challenge:challenge_id
router.post(
  `${paths.mockdata}/join_challenge/:challenge_id`,
  mockdata.joinChallenge,
);

export default router;
