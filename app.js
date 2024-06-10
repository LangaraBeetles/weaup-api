const express = require("express");
const app = express();

try {
  const connection = require("./models/db");

  connection.once("open", () => {
    const server = app.listen(process.env.PORT || 3000, () => {
      console.log(
        `Connected and listening http://localhost:${process.env.PORT || 3000}`
      );
      console.log(
        `Test endpoint http://localhost:${process.env.PORT || 3000}/api/v1/test`
      );
    });
  });
} catch (error) {
  console.error({ error });
}

//   Test the API, only plain text.
app.get("/api/v1/test", (req, res) => {
  res.type("text/plain");
  res.status(200);
  res.send("Working!");
});
//   End test API
