import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema(
  {
    body: { type: String, required: true, trim: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    authorName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String, required: true },
    answers: [answerSchema],
  },
  { timestamps: true }
);

questionSchema.index({ createdAt: -1 });
questionSchema.index({ title: 'text', body: 'text' });

export default mongoose.models.Question || mongoose.model('Question', questionSchema);
