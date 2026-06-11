import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { sessionOptions } from "@/lib/session";
import type { SessionData } from "@/lib/session";

export async function POST(request: Request) {
  const body = await request.json() as { password?: string; username?: string };
  const { password, username } = body;

  // Level 1: shared app password
  if (!username) {
    if (password !== process.env.APP_PASSWORD) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    session.isAuthenticated = true;
    await session.save();
    return NextResponse.json({ ok: true });
  }

  // Level 2: per-user login (username + password against users.json)
  const { verifyUser } = await import("@/lib/users");
  const user = await verifyUser(username, password ?? "");
  if (!user) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  session.isAuthenticated = true;
  session.userId = user.id;
  session.username = user.username;
  await session.save();
  return NextResponse.json({ ok: true });
}
