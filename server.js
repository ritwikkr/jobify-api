import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { notFoundMiddleware } from "./middleware/notFound.js";
import errorHandlerMiddleware from "./middleware/errorHandler.js";
import connectDB from "./db/connectDB.js";
import userRouter from "./routes/userRoute.js";
import jobsRouter from "./routes/jobsRoute.js";

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();

app.use("/api/v1/user", userRouter);
app.use("/api/v1/jobs", jobsRouter);

app.use("*", notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is running at PORT: ${PORT}`);
    });
  } catch (error) {
    console.log(`Server:${error}`);
  }
}

start();
