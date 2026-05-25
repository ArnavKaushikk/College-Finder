import mongoose from 'mongoose';
import College from '../../models/College.js';

function formatCollege(doc) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    location: doc.location,
    fees: doc.fees,
    rating: doc.rating,
    placementPercent: doc.placementPercent,
    overview: doc.overview,
    type: doc.type,
    established: doc.established,
    courses: doc.courses,
    placements: doc.placements,
    reviews: doc.reviews,
    examCutoffs: doc.examCutoffs,
  };
}

export function buildCollegeFilter({ q, minFees, maxFees, course }) {
  const filter = {};

  if (q && q.trim()) {
    filter.name = { $regex: q.trim(), $options: 'i' };
  }

  if (minFees !== undefined && minFees !== null && minFees !== '') {
    filter.fees = { ...filter.fees, $gte: Number(minFees) };
  }

  if (maxFees !== undefined && maxFees !== null && maxFees !== '') {
    filter.fees = { ...filter.fees, $lte: Number(maxFees) };
  }

  if (course && course.trim()) {
    filter.courses = { $regex: new RegExp(`^${course.trim()}$`, 'i') };
  }

  return filter;
}

export async function listColleges({ q, minFees, maxFees, course, page = 1, limit = 12 }) {
  const filter = buildCollegeFilter({ q, minFees, maxFees, course });
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    College.find(filter)
      .sort({ rating: -1, name: 1 })
      .skip(skip)
      .limit(limit)
      .select('name location fees rating placementPercent courses')
      .lean(),
    College.countDocuments(filter),
  ]);

  return {
    colleges: items.map((c) => ({
      id: c._id.toString(),
      name: c.name,
      location: c.location,
      fees: c.fees,
      rating: c.rating,
      placementPercent: c.placementPercent,
      courses: c.courses,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getCollegeById(id) {
  const college = await College.findById(id).lean();
  if (!college) return null;
  return formatCollege(college);
}

export async function getCollegesByIds(ids) {
  const objectIds = ids
    .filter((id) => mongoose.Types.ObjectId.isValid(id))
    .map((id) => new mongoose.Types.ObjectId(id));

  const colleges = await College.find({ _id: { $in: objectIds } })
    .select('name location fees rating placementPercent')
    .lean();

  return colleges.map((c) => ({
    id: c._id.toString(),
    name: c.name,
    location: c.location,
    fees: c.fees,
    rating: c.rating,
    placementPercent: c.placementPercent,
  }));
}

export async function getDistinctCourses() {
  return College.distinct('courses');
}
