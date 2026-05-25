import User from '../../models/User.js';
import College from '../../models/College.js';

export async function getSavedColleges(userId) {
  const user = await User.findById(userId).populate({
    path: 'savedColleges',
    select: 'name location fees rating placementPercent',
  });

  if (!user) return [];

  return user.savedColleges.filter(Boolean).map((c) => ({
    id: c._id.toString(),
    name: c.name,
    location: c.location,
    fees: c.fees,
    rating: c.rating,
    placementPercent: c.placementPercent,
  }));
}

export async function saveCollege(userId, collegeId) {
  const exists = await College.exists({ _id: collegeId });
  if (!exists) return { error: 'College not found' };

  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { savedColleges: collegeId } },
    { returnDocument: 'after' }
  );

  if (!user) return { error: 'User not found' };
  return { success: true };
}

export async function unsaveCollege(userId, collegeId) {
  await User.findByIdAndUpdate(userId, {
    $pull: { savedColleges: collegeId },
  });
  return { success: true };
}

export async function getSavedComparisons(userId) {
  const user = await User.findById(userId).populate({
    path: 'savedComparisons.collegeIds',
    select: 'name location fees rating placementPercent',
  });

  if (!user) return [];

  return user.savedComparisons.map((comp) => {
    const validColleges = (comp.collegeIds || []).filter(Boolean);
    return {
    id: comp._id.toString(),
    label: comp.label,
    collegeIds: validColleges.map((c) => c._id.toString()),
    colleges: validColleges.map((c) => ({
      id: c._id.toString(),
      name: c.name,
      location: c.location,
      fees: c.fees,
      rating: c.rating,
      placementPercent: c.placementPercent,
    })),
    createdAt: comp.createdAt,
  };
  });
}

export async function saveComparison(userId, collegeIds, label) {
  if (!collegeIds || collegeIds.length < 2 || collegeIds.length > 3) {
    return { error: 'Provide 2 to 3 college IDs' };
  }

  const count = await College.countDocuments({ _id: { $in: collegeIds } });
  if (count !== collegeIds.length) {
    return { error: 'One or more colleges not found' };
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $push: {
        savedComparisons: {
          collegeIds,
          label: label || 'My comparison',
        },
      },
    },
    { returnDocument: 'after' }
  );

  if (!user) return { error: 'User not found' };
  return { success: true };
}

export async function unsaveComparison(userId, comparisonId) {
  await User.findByIdAndUpdate(userId, {
    $pull: { savedComparisons: { _id: comparisonId } },
  });
  return { success: true };
}
