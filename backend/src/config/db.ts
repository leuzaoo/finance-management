import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("The variable MONGO_URI was not defined.");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`Database has been connected: ${conn.connection.host}`);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error to trying to connect on database: ${message}`);
    process.exit(1);
  }
};
