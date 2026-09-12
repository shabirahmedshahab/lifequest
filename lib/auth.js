import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET || "dev_only_insecure_secret_change_me";
const COOKIE_NAME = "lifequest_session";

export function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

export function signSession(userId) {
  return jwt.sign({ userId }, SECRET, { expiresIn: "30d" });
}

export function verifySession(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

export function getSessionUserId() {
  const store = cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = verifySession(token);
  return payload?.userId ?? null;
}

export function setSessionCookie(response, userId) {
  const token = signSession(userId);
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearSessionCookie(response) {
  response.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
}
