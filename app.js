import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import router from "./src/routes/index.js";
import connection from "./src/models/db.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

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

app.use("/api/v1", router);

router.get("/test", (req, res) => {
  res.type("text/plain");
  res.status(200);
  res.send("Working! Testing Automatic Deploy 5");
});
