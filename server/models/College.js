import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const examCutoffSchema = new mongoose.Schema(
  {
    exam: { type: String, required: true },
    minRank: { type: Number, required: true },
    maxRank: { type: Number, required: true },
  },
  { _id: false }
);

const collegeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    fees: { type: Number, required: true, min: 0 },
    rating: { type: Number, required: true, min: 0, max: 5 },
    placementPercent: { type: Number, required: true, min: 0, max: 100 },
    overview: { type: String, required: true },
    type: { type: String, default: 'Private' },
    established: { type: Number },
    courses: [{ type: String, required: true }],
    placements: {
      averagePackage: { type: String },
      highestPackage: { type: String },
      topRecruiters: [{ type: String }],
      summary: { type: String },
    },
    reviews: [reviewSchema],
    examCutoffs: [examCutoffSchema],
  },
  { timestamps: true }
);

collegeSchema.index({ name: 'text' });
collegeSchema.index({ fees: 1 });
collegeSchema.index({ courses: 1 });
collegeSchema.index({ rating: -1 });
collegeSchema.index({ 'examCutoffs.exam': 1, 'examCutoffs.minRank': 1, 'examCutoffs.maxRank': 1 });

export default mongoose.models.College || mongoose.model('College', collegeSchema);
