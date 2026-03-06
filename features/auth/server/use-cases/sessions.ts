import { cookies, headers } from "next/headers";
import { getIP } from "./location";
import { prisma } from "@/lib/prisma";
import crypto from "node:crypto";

type CreateSessionData = {
  token: string;
  userId: number;
  userAgent: string;
  ip: string;
  expiresAt: Date;
};

const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const generateSessionToken = () => {
  return crypto.randomUUID();
};

const createUserSession = async ({
  token,
  userId,
  userAgent,
  ip,
  expiresAt,
}: CreateSessionData) => {
  const hashedToken = hashToken(token);

  const result = await prisma.sessions.upsert({
    where: {
      user_id: userId,
    },
    update: {
      session_id: hashedToken,
      user_agent: userAgent,
      ip_address: ip,
      expires_at: expiresAt,
    },
    create: {
      session_id: hashedToken,
      user_id: userId,
      user_agent: userAgent,
      ip_address: ip,
      expires_at: expiresAt,
    },
  });
  return result;
};

export const createSessionAndSetCookies = async (
  userId: number,
  isRememberMe?: boolean,
) => {
  const token = generateSessionToken();
  const ip = await getIP();
  const headerList = await headers();

  const sessionDuration = isRememberMe
    ? 30 * 24 * 60 * 60 * 1000 // 30 days
    : 1 * 24 * 60 * 60 * 1000; // 1 day

  const expiresAt = new Date(Date.now() + sessionDuration);

  await createUserSession({
    token,
    ip,
    userAgent: headerList.get("user-agent") || "unknown",
    userId: userId,
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
};

const invalidateSession = async (id: string) => {
  await prisma.sessions.delete({
    where: {
      session_id: id,
    },
  });
};

export const validateSessionAndGetUser = async (session: string) => {
  const hashedToken = hashToken(session);

  const sessionData = await prisma.sessions.findUnique({
    where: {
      session_id: hashedToken,
    },
    include: {
      user: true,
    },
  });

  if (!sessionData || !sessionData.user) {
    throw new Error("Invalid session or user not found");
  }

  if (sessionData.expires_at.getTime() <= Date.now()) {
    await invalidateSession(sessionData.session_id);
    return null;
  }

  if(Date.now() >= sessionData.expires_at.getTime() - 15 * 24 * 60 * 60 * 1000) {
    return sessionData.user;
  }
 
  return sessionData.user;
};
