import { jwtVerify } from 'jose';

function getSecret() {
  return new TextEncoder().encode(
    process.env.JWT_SECRET || 'dev-secret-change-in-production'
  );
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}
