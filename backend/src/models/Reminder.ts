import mongoose, { Document, model, Schema } from "mongoose";

export interface IReminder extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  date?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReminderSchema: Schema = new Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    date: { type: Date },
  },
  {
    timestamps: true,
  }
);

export default model<IReminder>("Reminder", ReminderSchema);
