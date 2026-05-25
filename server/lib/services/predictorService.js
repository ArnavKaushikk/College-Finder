import College from '../../models/College.js';
import { getBandForRank } from '../predictor/rules.js';

export async function getRecommendations(exam, rank) {
  const band = getBandForRank(exam, rank);
  if (!band) {
    return { colleges: [], band: null, message: 'Invalid exam or rank' };
  }

  const colleges = await College.find({
    examCutoffs: {
      $elemMatch: {
        exam,
        minRank: { $lte: rank },
        maxRank: { $gte: rank },
      },
    },
    rating: { $gte: band.minRating },
  })
    .sort({ rating: -1, placementPercent: -1 })
    .limit(band.limit)
    .select('name location fees rating placementPercent courses')
    .lean();

  if (colleges.length === 0) {
    const fallback = await College.find({ rating: { $gte: band.minRating } })
      .sort({ rating: -1, placementPercent: -1 })
      .limit(band.limit)
      .select('name location fees rating placementPercent courses')
      .lean();

    return {
      colleges: fallback.map(formatShort),
      band,
      message: 'Showing top-rated colleges for your rank band (no exact cutoff match).',
    };
  }

  return {
    colleges: colleges.map(formatShort),
    band,
    message: null,
  };
}

function formatShort(c) {
  return {
    id: c._id.toString(),
    name: c.name,
    location: c.location,
    fees: c.fees,
    rating: c.rating,
    placementPercent: c.placementPercent,
    courses: c.courses,
  };
}
