import Question from '../../models/Question.js';

function formatQuestion(doc, includeAnswers = false) {
  const base = {
    id: doc._id.toString(),
    title: doc.title,
    body: doc.body,
    authorName: doc.authorName,
    authorId: doc.authorId?.toString(),
    answerCount: doc.answers?.length || 0,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };

  if (includeAnswers) {
    base.answers = (doc.answers || []).map((a) => ({
      id: a._id.toString(),
      body: a.body,
      authorName: a.authorName,
      authorId: a.authorId?.toString(),
      createdAt: a.createdAt,
    }));
  }

  return base;
}

export async function listQuestions({ page = 1, limit = 10 }) {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Question.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('title body authorName authorId answers createdAt updatedAt')
      .lean(),
    Question.countDocuments(),
  ]);

  return {
    questions: items.map((q) => formatQuestion(q)),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getQuestionById(id) {
  const question = await Question.findById(id).lean();
  if (!question) return null;
  return formatQuestion(question, true);
}

export async function createQuestion({ title, body, authorId, authorName }) {
  const question = await Question.create({
    title,
    body,
    authorId,
    authorName,
    answers: [],
  });
  return formatQuestion(question.toObject(), true);
}

export async function addAnswer({ questionId, body, authorId, authorName }) {
  const question = await Question.findByIdAndUpdate(
    questionId,
    {
      $push: {
        answers: { body, authorId, authorName },
      },
    },
    { new: true }
  ).lean();

  if (!question) return null;
  return formatQuestion(question, true);
}
