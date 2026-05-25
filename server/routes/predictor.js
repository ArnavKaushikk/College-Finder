import { Router } from 'express';
import { z } from 'zod';
import { connectDB } from '../lib/db/mongoose.js';
import { jsonOk, jsonError } from '../lib/api-response.js';
import { getRecommendations } from '../lib/services/predictorService.js';
import { PREDICTOR_RULES } from '../lib/predictor/rules.js';

const router = Router();

const bodySchema = z.object({
  exam: z.enum(Object.keys(PREDICTOR_RULES)),
  rank: z.coerce.number().int().min(1),
});

router.post('/', async (req, res) => {
  try {
    await connectDB();
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) {
      return jsonError(res, parsed.error.issues[0]?.message || 'Invalid input', 400);
    }
    const result = await getRecommendations(parsed.data.exam, parsed.data.rank);
    return jsonOk(res, result);
  } catch (err) {
    console.error('POST /predictor', err);
    return jsonError(res, 'Prediction failed', 500);
  }
});

export default router;
