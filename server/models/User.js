import mongoose from 'mongoose';

const savedComparisonSchema = new mongoose.Schema(
  {
    collegeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'College' }],
    label: { type: String, default: 'My comparison' },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    savedColleges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'College' }],
    savedComparisons: [savedComparisonSchema],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', userSchema);
