import { Router } from 'express';
import { connectDB } from '../lib/db/mongoose.js';
import { jsonOk, jsonError } from '../lib/api-response.js';
import { getUserFromRequest } from '../lib/auth/session.js';
import {
  getSavedColleges,
  saveCollege,
  unsaveCollege,
  getSavedComparisons,
  saveComparison,
  unsaveComparison,
} from '../lib/services/userService.js';

const router = Router();

function requireAuth(req, res) {
  return getUserFromRequest(req).then((user) => {
    if (!user) {
      jsonError(res, 'Not authenticated', 401);
      return null;
    }
    return user;
  });
}

router.get('/saved-colleges', async (req, res) => {
  const user = await requireAuth(req, res);
  if (!user) return;
  try {
    await connectDB();
    const colleges = await getSavedColleges(user.id);
    return jsonOk(res, { colleges });
  } catch (err) {
    console.error('GET saved-colleges', err);
    return jsonError(res, 'Failed to fetch saved colleges', 500);
  }
});

router.post('/saved-colleges', async (req, res) => {
  const user = await requireAuth(req, res);
  if (!user) return;
  try {
    await connectDB();
    const { collegeId } = req.body;
    if (!collegeId) return jsonError(res, 'collegeId is required', 400);
    const result = await saveCollege(user.id, collegeId);
    if (result.error) return jsonError(res, result.error, 404);
    return jsonOk(res, { message: 'College saved' });
  } catch (err) {
    console.error('POST saved-colleges', err);
    return jsonError(res, 'Failed to save college', 500);
  }
});

router.delete('/saved-colleges', async (req, res) => {
  const user = await requireAuth(req, res);
  if (!user) return;
  try {
    await connectDB();
    const collegeId = req.query.collegeId;
    if (!collegeId) return jsonError(res, 'collegeId is required', 400);
    await unsaveCollege(user.id, collegeId);
    return jsonOk(res, { message: 'College removed' });
  } catch (err) {
    console.error('DELETE saved-colleges', err);
    return jsonError(res, 'Failed to remove college', 500);
  }
});

router.get('/saved-comparisons', async (req, res) => {
  const user = await requireAuth(req, res);
  if (!user) return;
  try {
    await connectDB();
    const comparisons = await getSavedComparisons(user.id);
    return jsonOk(res, { comparisons });
  } catch (err) {
    console.error('GET saved-comparisons', err);
    return jsonError(res, 'Failed to fetch comparisons', 500);
  }
});

router.post('/saved-comparisons', async (req, res) => {
  const user = await requireAuth(req, res);
  if (!user) return;
  try {
    await connectDB();
    const { collegeIds, label } = req.body;
    const result = await saveComparison(user.id, collegeIds, label);
    if (result.error) return jsonError(res, result.error, 400);
    return jsonOk(res, { message: 'Comparison saved' });
  } catch (err) {
    console.error('POST saved-comparisons', err);
    return jsonError(res, 'Failed to save comparison', 500);
  }
});

router.delete('/saved-comparisons', async (req, res) => {
  const user = await requireAuth(req, res);
  if (!user) return;
  try {
    await connectDB();
    const comparisonId = req.query.comparisonId;
    if (!comparisonId) return jsonError(res, 'comparisonId is required', 400);
    await unsaveComparison(user.id, comparisonId);
    return jsonOk(res, { message: 'Comparison removed' });
  } catch (err) {
    console.error('DELETE saved-comparisons', err);
    return jsonError(res, 'Failed to remove comparison', 500);
  }
});

export default router;
