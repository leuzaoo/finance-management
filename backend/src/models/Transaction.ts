import mongoose, { model, Schema, type Types } from "mongoose";

export type TransactionType = "expense" | "income";

export interface ITransaction extends Document {
  bank: Types.ObjectId;
  type: TransactionType;
  amount: number;
  description?: string;
  category: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    bank: { type: mongoose.Schema.Types.ObjectId, ref: "Bank", required: true },
    type: {
      type: String,
      required: true,
      enum: ["expense", "income"],
    },
    amount: { type: Number, required: true },
    description: { type: String },
    category: { type: String, required: true },
    date: { type: Date, required: true, default: () => new Date() },
  },
  { timestamps: true }
);

export default model<ITransaction>("Transaction", TransactionSchema);
