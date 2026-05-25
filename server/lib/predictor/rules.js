/**
 * Configurable exam → rank band → recommendation strategy.
 * Bands map to MongoDB queries on College.examCutoffs.
 */
export const PREDICTOR_RULES = {
  JEE: {
    label: 'JEE Main / Advanced',
    bands: [
      { minRank: 1, maxRank: 1000, minRating: 4.5, limit: 8 },
      { minRank: 1001, maxRank: 10000, minRating: 4.0, limit: 10 },
      { minRank: 10001, maxRank: 50000, minRating: 3.5, limit: 12 },
      { minRank: 50001, maxRank: 200000, minRating: 3.0, limit: 15 },
      { minRank: 200001, maxRank: 9999999, minRating: 2.5, limit: 15 },
    ],
  },
  NEET: {
    label: 'NEET UG',
    bands: [
      { minRank: 1, maxRank: 5000, minRating: 4.3, limit: 8 },
      { minRank: 5001, maxRank: 25000, minRating: 3.8, limit: 10 },
      { minRank: 25001, maxRank: 100000, minRating: 3.3, limit: 12 },
      { minRank: 100001, maxRank: 9999999, minRating: 2.8, limit: 15 },
    ],
  },
  CUET: {
    label: 'CUET',
    bands: [
      { minRank: 1, maxRank: 5000, minRating: 4.0, limit: 10 },
      { minRank: 5001, maxRank: 50000, minRating: 3.5, limit: 12 },
      { minRank: 50001, maxRank: 9999999, minRating: 3.0, limit: 15 },
    ],
  },
};

export function getBandForRank(exam, rank) {
  const config = PREDICTOR_RULES[exam];
  if (!config) return null;
  return config.bands.find((b) => rank >= b.minRank && rank <= b.maxRank) || null;
}

export function getSupportedExams() {
  return Object.entries(PREDICTOR_RULES).map(([key, val]) => ({
    value: key,
    label: val.label,
  }));
}
