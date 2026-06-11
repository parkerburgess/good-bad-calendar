import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import { DATA_DIR } from "@/lib/config";

const USERS_FILE = path.join(DATA_DIR, "users.json");

type UserRecord = {
  id: string;
  username: string;
  passwordHash: string;
};

async function readUsers(): Promise<UserRecord[]> {
  try {
    const raw = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(raw) as UserRecord[];
  } catch {
    return [];
  }
}

async function writeUsers(users: UserRecord[]): Promise<void> {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

export async function verifyUser(
  username: string,
  password: string
): Promise<Pick<UserRecord, "id" | "username"> | null> {
  const users = await readUsers();
  const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  if (!user) return null;
  const match = await bcrypt.compare(password, user.passwordHash);
  return match ? { id: user.id, username: user.username } : null;
}

export async function createUser(username: string, password: string): Promise<UserRecord> {
  const users = await readUsers();
  if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    throw new Error("Username already taken");
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const newUser: UserRecord = {
    id: crypto.randomUUID(),
    username,
    passwordHash,
  };
  users.push(newUser);
  await writeUsers(users);
  return newUser;
}
