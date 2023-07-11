const mongoose = require("mongoose");
require("dotenv").config();
const USER = process.env.USER;
const SERVER = process.env.SERVER_CONN;
const PASS = process.env.PASS;
const DB = process.env.DB;
const PORT = process.env.PORT;
const ENDPOINT = process.env.ENDPOINT;
let connectionString = `${SERVER}://${USER}:${PASS}@${DB}.${PORT}.${ENDPOINT}`;
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
