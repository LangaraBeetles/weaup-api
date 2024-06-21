import express from "express";

import google from "./google_auth.routes.js";

const router = express.Router({ mergeParams: true });

router.use(google);

export default router;
