import mongoose, { Schema, models } from "mongoose";

const NoteSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.Note || mongoose.model("Note", NoteSchema);