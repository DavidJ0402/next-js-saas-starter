import { compare, hash } from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { NewUser } from '@/lib/db/schema';

const key = new TextEncoder().encode(process.env.AUTH_SECRET);
const SALT_ROUNDS = 10;

export async function hashPassword(password: string) {
  return hash(password, SALT_ROUNDS);
}

export async function comparePasswords(
  plainTextPassword: string,
  hashedPassword: string
) {
  return compare(plainTextPassword, hashedPassword);
}

type SessionData = {
  user: { id: number };
  expires: string;
};

export async function signToken(payload: SessionData) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1 day from now')
    .sign(key);
}

export async function verifyToken(input: string) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload as SessionData;
}

export async function getSession() {
  // Solo importamos cookies cuando realmente lo necesitamos en el servidor
  if (typeof window !== 'undefined') {
    // En el cliente, no podemos acceder a cookies del servidor
    return null;
  }
  
  try {
    const { cookies } = await import('next/headers');
    const session = (await cookies()).get('session')?.value;
    if (!session) return null;
    return await verifyToken(session);
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export async function setSession(user: NewUser) {
  // Solo importamos cookies cuando realmente lo necesitamos en el servidor
  if (typeof window !== 'undefined') {
    throw new Error('setSession can only be called on the server');
  }
  
  const { cookies } = await import('next/headers');
  const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session: SessionData = {
    user: { id: user.id! },
    expires: expiresInOneDay.toISOString(),
  };
  const encryptedSession = await signToken(session);
  (await cookies()).set('session', encryptedSession, {
    expires: expiresInOneDay,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  });
}