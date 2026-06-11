import type { SessionOptions } from "iron-session";

export type SessionData = {
  isAuthenticated: boolean;
  userId?: string;
  username?: string;
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "gbc-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  },
};
