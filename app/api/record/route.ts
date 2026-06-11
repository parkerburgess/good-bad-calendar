import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { NextResponse } from "next/server";
import { dal } from "@/lib/dal";
import { sessionOptions } from "@/lib/session";
import type { SessionData } from "@/lib/session";

export async function POST(request: Request) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.userId ?? "default";
  const body = await request.json() as { date: string; category: string; value: boolean };
  const { date, category, value } = body;

  const existing = await dal.getDayEntry(userId, date);
  const updatedValues = { ...(existing?.values ?? {}), [category]: value };
  await dal.saveDayEntry(userId, { date, values: updatedValues });

  return NextResponse.json({ ok: true });
}
