import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import dbConnection from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import { removeUnverifiedUsers } from "./automation/removeUnverifiedUsers.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

dbConnection();

app.listen(process.env.PORT, () => {
  console.log(`Server Started at ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello from AuthToolKit Backend");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

removeUnverifiedUsers();

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
