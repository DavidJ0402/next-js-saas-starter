
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { teams, teamMembers } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
// No se necesita randomUUID, los IDs son autoincrementales

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const user = session?.user;
    if (!user || !user.id) {
      return NextResponse.json({ success: false, error: "No autenticado" }, { status: 401 });
    }
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ success: false, error: "Nombre requerido" }, { status: 400 });
    }
    // Crear equipo (ID autoincremental)
    const [team] = await db.insert(teams).values({
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    // Asociar usuario al equipo como owner
    await db.insert(teamMembers).values({
      userId: user.id,
      teamId: team.id,
      role: "owner",
      joinedAt: new Date(),
    });
    return NextResponse.json({ success: true, team });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message });
  }
}
