import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ci3rhos.mongodb.net/${process.env.DB_DEFAULT}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT || 8080);
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err);
  });
