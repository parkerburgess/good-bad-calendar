import { NextResponse } from "next/server";
import { createUser } from "@/lib/users";

export async function POST(request: Request) {
  const body = await request.json() as { username?: string; password?: string };
  const { username, password } = body;

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
  }

  try {
    await createUser(username, password);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
