import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { connectDB } from '../lib/db/mongoose.js';
import User from '../models/User.js';
import { jsonOk, jsonError } from '../lib/api-response.js';
import { registerSchema, loginSchema } from '../lib/validators/auth.js';
import { signToken } from '../lib/auth/jwt.js';
import { buildSessionCookie, clearSessionCookie } from '../lib/auth/cookies.js';
import { setSessionCookie, clearSessionCookie as clearCookie } from '../lib/auth/expressHelpers.js';
import { getUserFromRequest } from '../lib/auth/session.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    await connectDB();
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return jsonError(res, parsed.error.issues[0]?.message || 'Invalid input', 400);
    }

    const { name, email, password } = parsed.data;
    const existing = await User.findOne({ email });
    if (existing) return jsonError(res, 'Email already registered', 409);

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    const token = await signToken({ userId: user._id.toString() });
    setSessionCookie(res, buildSessionCookie(token));
    return jsonOk(res, {
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('POST /auth/register', err);
    return jsonError(res, 'Registration failed', 500);
  }
});

router.post('/login', async (req, res) => {
  try {
    await connectDB();
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return jsonError(res, parsed.error.issues[0]?.message || 'Invalid input', 400);
    }

    const { email, password } = parsed.data;
    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) {
      return jsonError(res, 'Invalid email or password', 401);
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return jsonError(res, 'Invalid email or password', 401);

    const token = await signToken({ userId: user._id.toString() });
    setSessionCookie(res, buildSessionCookie(token));
    return jsonOk(res, {
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('POST /auth/login', err);
    return jsonError(res, 'Login failed', 500);
  }
});

router.post('/logout', (_req, res) => {
  clearCookie(res, clearSessionCookie());
  return jsonOk(res, { message: 'Logged out' });
});

router.get('/me', async (req, res) => {
  const user = await getUserFromRequest(req);
  if (!user) return jsonError(res, 'Not authenticated', 401);
  return jsonOk(res, { user });
});

export default router;
