import { model, Schema, Document } from "mongoose";

export interface IBank extends Document {
  bankName: string;
  currencyType: string;
  createdAt: Date;
  updatedAt: Date;
}

const BankSchema = new Schema<IBank>(
  {
    bankName: { type: String, required: true },
    currencyType: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<IBank>("Bank", BankSchema);
