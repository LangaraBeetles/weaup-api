import express from "express";

import google from "./google_auth.routes.js";
import auth from "./auth.routes.js";
import mockdata from "./mockdata.routes.js";

const router = express.Router({ mergeParams: true });

router.use(auth);
router.use(google);
router.use(mockdata);

router.get("/test", (req, res) => {
  res.type("text/plain");
  res.status(200);
  res.send("Working!");
});

export default router;
