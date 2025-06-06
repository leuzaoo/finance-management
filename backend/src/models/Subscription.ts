import { Schema, model, Document, Types } from "mongoose";

export interface ISubscription extends Document {
  bank: Types.ObjectId;
  platform: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    bank: { type: Schema.Types.ObjectId, ref: "Bank", required: true },
    platform: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default model<ISubscription>("Subscription", SubscriptionSchema);
