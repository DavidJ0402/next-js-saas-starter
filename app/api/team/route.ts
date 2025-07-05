import { getTeamForUser } from '@/lib/db/queries';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const sessionCookie = (await cookies()).get('session');
    const sessionValue = sessionCookie?.value;
    
    const team = await getTeamForUser(sessionValue);
    return Response.json(team);
  } catch (error) {
    console.error('Error getting team:', error);
    return Response.json(null);
  }
}