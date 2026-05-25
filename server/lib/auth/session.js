import { connectDB } from '../db/mongoose.js';
import User from '../../models/User.js';
import { verifyToken } from './jwt.js';
import { getSessionCookieName } from './cookies.js';

export async function getUserFromRequest(req) {
  const token = req.cookies?.[getSessionCookieName()];
  if (!token) return null;

  const payload = await verifyToken(token);
  const userId = payload?.sub || payload?.userId;
  if (!userId) return null;

  await connectDB();
  const user = await User.findById(String(userId)).select('-passwordHash').lean();
  if (!user) return null;

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}
