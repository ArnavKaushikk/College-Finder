import { Router } from 'express';
import { connectDB } from '../lib/db/mongoose.js';
import { jsonOk, jsonError } from '../lib/api-response.js';
import { parseCollegeListQuery } from '../lib/validators/collegeQuery.js';
import { listColleges, getCollegesByIds, getCollegeById, getDistinctCourses } from '../lib/services/collegeService.js';

const router = Router();

router.get('/courses', async (_req, res) => {
  try {
    await connectDB();
    const courses = await getDistinctCourses();
    return jsonOk(res, { courses: courses.sort() });
  } catch (err) {
    console.error('GET /courses', err);
    return jsonError(res, 'Failed to fetch courses', 500);
  }
});

router.get('/', async (req, res) => {
  try {
    await connectDB();
    const parsed = parseCollegeListQuery(new URL(req.url, 'http://x').searchParams);

    if (!parsed.success) {
      return jsonError(res, parsed.error.issues[0]?.message || 'Invalid query', 400);
    }

    const { ids, ...filters } = parsed.data;

    if (ids) {
      const idList = ids.split(',').filter(Boolean).slice(0, 3);
      if (idList.length === 0) return jsonError(res, 'No college IDs provided', 400);
      const colleges = await getCollegesByIds(idList);
      return jsonOk(res, { colleges });
    }

    const result = await listColleges(filters);
    return jsonOk(res, result);
  } catch (err) {
    console.error('GET /colleges', err);
    return jsonError(res, 'Failed to fetch colleges', 500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    await connectDB();
    const college = await getCollegeById(req.params.id);
    if (!college) return jsonError(res, 'College not found', 404);
    return jsonOk(res, { college });
  } catch (err) {
    console.error('GET /colleges/:id', err);
    return jsonError(res, 'Failed to fetch college', 500);
  }
});

export default router;
