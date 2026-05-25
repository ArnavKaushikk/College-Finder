import { Router } from 'express';
import { connectDB } from '../lib/db/mongoose.js';
import { jsonOk, jsonError } from '../lib/api-response.js';
import { getUserFromRequest } from '../lib/auth/session.js';
import { createQuestionSchema, createAnswerSchema } from '../lib/validators/question.js';
import {
  listQuestions,
  createQuestion,
  getQuestionById,
  addAnswer,
} from '../lib/services/questionService.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    await connectDB();
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await listQuestions({ page, limit });
    return jsonOk(res, result);
  } catch (err) {
    console.error('GET /questions', err);
    return jsonError(res, 'Failed to fetch questions', 500);
  }
});

router.post('/', async (req, res) => {
  const user = await getUserFromRequest(req);
  if (!user) return jsonError(res, 'Login required to ask questions', 401);

  try {
    await connectDB();
    const parsed = createQuestionSchema.safeParse(req.body);
    if (!parsed.success) {
      return jsonError(res, parsed.error.issues[0]?.message || 'Invalid input', 400);
    }
    const question = await createQuestion({
      ...parsed.data,
      authorId: user.id,
      authorName: user.name,
    });
    return jsonOk(res, { question }, 201);
  } catch (err) {
    console.error('POST /questions', err);
    return jsonError(res, 'Failed to create question', 500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    await connectDB();
    const question = await getQuestionById(req.params.id);
    if (!question) return jsonError(res, 'Question not found', 404);
    return jsonOk(res, { question });
  } catch (err) {
    console.error('GET /questions/:id', err);
    return jsonError(res, 'Failed to fetch question', 500);
  }
});

router.post('/:id/answers', async (req, res) => {
  const user = await getUserFromRequest(req);
  if (!user) return jsonError(res, 'Login required to post answers', 401);

  try {
    await connectDB();
    const parsed = createAnswerSchema.safeParse(req.body);
    if (!parsed.success) {
      return jsonError(res, parsed.error.issues[0]?.message || 'Invalid input', 400);
    }
    const question = await addAnswer({
      questionId: req.params.id,
      body: parsed.data.body,
      authorId: user.id,
      authorName: user.name,
    });
    if (!question) return jsonError(res, 'Question not found', 404);
    return jsonOk(res, { question });
  } catch (err) {
    console.error('POST /questions/:id/answers', err);
    return jsonError(res, 'Failed to post answer', 500);
  }
});

export default router;
