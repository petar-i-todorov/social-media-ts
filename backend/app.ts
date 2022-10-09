import express, { NextFunction, Response, Request } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import cors from "cors";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());

app.use("/auth", authRouter);

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
