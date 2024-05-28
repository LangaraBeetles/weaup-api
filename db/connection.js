require('dotenv').config();

const mongoose = require("mongoose");

let mongoDB = process.env.DB_CONNECTION;
mongoose.connect(mongoDB);

module.exports = mongoose.connection;