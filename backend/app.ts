import express, { NextFunction, Response, Request } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import cors from "cors";
import { DB_USERNAME, DB_PASSWORD, DB_DEFAULT } from "./dev-vars";
import CustomError from "./types/Error";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());

app.use("/auth", authRouter);

class Test {
  test: string;
  constructor(test: string) {
    this.test = test;
  }
}

class ExtendsTest extends Test {
  test2: string;
  constructor(test: string, test2: string) {
    super(test);
    this.test2 = test2;
  }
}

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  setTimeout(() => {
    if (err instanceof CustomError) {
      res.status(err.status).json({ message: err.message });
    } else {
      res.status(500).json({ message: err.message });
    }
  }, 2000);
});

mongoose
  .connect(
    `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.ci3rhos.mongodb.net/${DB_DEFAULT}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT || 8080);
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err);
  });
