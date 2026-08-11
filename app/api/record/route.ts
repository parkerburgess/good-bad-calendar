import { NextResponse } from "next/server";
import { dal } from "@/lib/dal";
import { getUserId } from "@parkerburgess/wandering-parker-server";

export async function POST(request: Request) {
  const userId = await getUserId();
  const body = await request.json() as { date: string; category: string; value: boolean };
  const { date, category, value } = body;

  const existing = await dal.getDayEntry(userId, date);
  const updatedValues = { ...(existing?.values ?? {}), [category]: value };
  await dal.saveDayEntry(userId, { date, values: updatedValues });

  return NextResponse.json({ ok: true });
}
