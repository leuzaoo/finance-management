import { model, Schema, Document, Types } from "mongoose";

export interface IBank extends Document {
  user: Types.ObjectId;
  bankName: string;
  currencyType: string;
  currencyValue: number;
  createdAt: Date;
  updatedAt: Date;
}

const BankSchema = new Schema<IBank>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bankName: { type: String, required: true },
    currencyType: { type: String, required: true },
    currencyValue: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export default model<IBank>("Bank", BankSchema);
