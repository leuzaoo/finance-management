import { Schema, model, Document, Types } from "mongoose";
import bcrypt from "bcrypt";

export const allowedCurrencies = ["USD", "EUR", "GBP", "BRL"] as const;
export type Currency = (typeof allowedCurrencies)[number];

export interface IUser extends Document {
  firstName: string;
  email: string;
  password: string;
  banks?: {
    _id: Types.ObjectId;
    bankName: string;
    currencyType: string;
    createdAt: Date;
  }[];

  primaryCurrency: Currency | null;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    primaryCurrency: {
      type: String,
      enum: allowedCurrencies,
      default: null,
      required: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

UserSchema.virtual("banks", {
  ref: "Bank",
  localField: "_id",
  foreignField: "user",
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function (
  candidate: string
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export default model<IUser>("User", UserSchema);
