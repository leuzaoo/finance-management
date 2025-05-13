import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.route";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", authRoutes);

app.get("/api/v1/health", (_req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date() });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Erro interno", error: err.message });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB conectado");
    app.listen(PORT, () =>
      console.log(`Servidor rodando em http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Erro ao conectar no MongoDB:", err);
  });
