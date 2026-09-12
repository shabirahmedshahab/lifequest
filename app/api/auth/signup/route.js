import { NextResponse } from "next/server";
import db from "@/lib/db";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const email = body?.email?.trim().toLowerCase();
  const username = body?.username?.trim();
  const password = body?.password;

  if (!email || !username || !password) {
    return NextResponse.json(
      { error: "Email, username, and password are all required." },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters." },
      { status: 400 }
    );
  }

  const existing = db
    .prepare("SELECT id FROM users WHERE email = ? OR username = ?")
    .get(email, username);
  if (existing) {
    return NextResponse.json(
      { error: "An account with that email or username already exists." },
      { status: 409 }
    );
  }

  const passwordHash = hashPassword(password);
  const insertUser = db.prepare(
    "INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)"
  );
  const info = insertUser.run(email, username, passwordHash);
  const userId = info.lastInsertRowid;

  db.prepare("INSERT INTO characters (user_id) VALUES (?)").run(userId);

  const response = NextResponse.json({
    user: { id: userId, email, username },
  });
  setSessionCookie(response, userId);
  return response;
}
