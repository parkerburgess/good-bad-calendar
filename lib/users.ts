import bcrypt from "bcryptjs";
import { getPool } from "@/lib/db";

type UserRecord = {
  id: string;
  username: string;
  passwordHash: string;
};

export async function verifyUser(
  username: string,
  password: string
): Promise<Pick<UserRecord, "id" | "username"> | null> {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("username", username)
    .query(`
      SELECT Id, Username, PasswordHash
      FROM goodbad.User
      WHERE Username = @username
    `);

  if (result.recordset.length === 0) return null;
  const user = result.recordset[0];
  const match = await bcrypt.compare(password, user.PasswordHash as string);
  return match
    ? { id: user.Id as string, username: user.Username as string }
    : null;
}

export async function createUser(
  username: string,
  password: string
): Promise<UserRecord> {
  const pool = await getPool();

  const existing = await pool
    .request()
    .input("username", username)
    .query(`SELECT Id FROM goodbad.User WHERE Username = @username`);

  if (existing.recordset.length > 0) {
    throw new Error("Username already taken");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const id = crypto.randomUUID();

  await pool
    .request()
    .input("id", id)
    .input("username", username)
    .input("passwordHash", passwordHash)
    .query(`
      INSERT INTO goodbad.User (Id, Username, PasswordHash)
      VALUES (@id, @username, @passwordHash)
    `);

  return { id, username, passwordHash };
}
