import { getUser } from '@/lib/db/queries';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const sessionCookie = (await cookies()).get('session');
    const sessionValue = sessionCookie?.value;
    
    const user = await getUser(sessionValue);
    return Response.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    return Response.json(null);
  }
}