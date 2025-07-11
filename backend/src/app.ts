import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./config/db";

import subscriptionRoute from "./routes/subscription.route";
import transactionRoute from "./routes/transaction.route";
import reminderRoutes from "./routes/reminder.route";
import banksRouter from "./routes/bank.route";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use("/api/v1", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/banks", banksRouter);
app.use("/api/v1/reminders", reminderRoutes);
app.use("/api/v1/transactions", transactionRoute);
app.use("/api/v1/subscriptions", subscriptionRoute);

app.get("/api/v1/health", (_req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date() });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Erro interno", error: err.message });
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
