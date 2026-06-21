import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { hashPin } from "./crypto";

const COOKIE_NAME = "live-schedule-session";
const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "dev-secret-change-in-production"
);

export type SessionRole = "admin" | "streamer";

export interface Session {
  role: SessionRole;
  streamerId?: number;
  streamerName?: string;
}

export async function createSession(session: Session): Promise<void> {
  const token = await new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as Session;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export function verifyAdminPin(pin: string): boolean {
  const adminPin = process.env.ADMIN_PIN ?? "1234";
  return hashPin(pin) === hashPin(adminPin);
}

export async function requireAdmin(): Promise<Session> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function requireStreamer(): Promise<Session & { streamerId: number }> {
  const session = await getSession();
  if (!session || session.role !== "streamer" || !session.streamerId) {
    throw new Error("UNAUTHORIZED");
  }
  return session as Session & { streamerId: number };
}
