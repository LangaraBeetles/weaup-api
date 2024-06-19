import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import session from 'express-session';

import router from "./src/routes/index.js";
import connection from "./src/models/db.js";
import checkGoogleAccessToken from "./src/middleware/auth.middleware.js";
import { getAuthToken } from "./src/controllers/auth.controllers.js";
import { googleAuthRedirect, googleAuthCallback } from './src/controllers/googleAuth.controllers.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

// Session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

// DB connection
try {
  connection.once("open", () => {
    const server = app.listen(port, () => {
      console.log(`Connected and listening http://localhost:${port}`);
      console.log(`Test endpoint http://localhost:${port}/api/v1/test`);
    });
  });
} catch (error) {
  console.error({ error });
}

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Public routes which don't require a TOKEN
app.post("/api/v1/auth/api", getAuthToken)
app.get("/api/v1/auth/google", googleAuthRedirect);
app.get("/api/v1/auth/google/callback", googleAuthCallback);

// Routes required to have a valid TOKEN
app.use("/api/v1", checkGoogleAccessToken, router); //TODO For development, comment this line
// app.use("/api/v1", router); //TODO For development, uncomment this line

router.get("/test", (req, res) => {
  res.type("text/plain");
  res.status(200);
  res.send("Working! Demo Auto Deploy");
});
