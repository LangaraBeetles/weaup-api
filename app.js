const express = require('express');
const app = express();

const connection = require("./db/connection.js");

connection.once("open", () => {
    const server = app.listen(process.env.PORT || 8080, () => {
      console.log("Connected and listening");
    });
  });

//   Test the API, only plain text.
  app.use('/api/v1/test', (req, res) => {
    res.type('text/plain');
    res.status(200);
    res.send('Hello World');
  });
//   End test API