import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectionString = process.env.DB_CONNECTION ?? "";

let connection;

try {
  mongoose.connect(connectionString);
  connection = mongoose.connection;
  connection.once("open", () => {
    console.log("Successfully connected to the database");
  });
} catch (error) {
  console.error("Error connecting to the database", error);
}

export default connection;
