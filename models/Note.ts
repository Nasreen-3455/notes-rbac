import mongoose, { Document, Model, Schema } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  user: mongoose.Types.ObjectId;
}

const NoteSchema = new Schema<INote>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
);

const Note: Model<INote> =
  (mongoose.models.Note as Model<INote>) || mongoose.model<INote>('Note', NoteSchema);

export default Note;
