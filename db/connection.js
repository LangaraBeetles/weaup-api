require('dotenv').config();

const mongoose = require("mongoose");

let mongoDB = process.env.DB_CONNECTION;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

module.exports = mongoose.connection;