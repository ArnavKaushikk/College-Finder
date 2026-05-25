import { SignJWT, jwtVerify } from 'jose';

function getSecret() {
  return new TextEncoder().encode(
    process.env.JWT_SECRET || 'dev-secret-change-in-production'
  );
}

export async function signToken({ userId }) {
  return new SignJWT()
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(userId))
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}
