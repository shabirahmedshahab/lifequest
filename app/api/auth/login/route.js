import { NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyPassword, setSessionCookie } from "@/lib/auth";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const identifier = body?.email?.trim().toLowerCase();
  const password = body?.password;

  if (!identifier || !password) {
    return NextResponse.json(
      { error: "Email/username and password are required." },
      { status: 400 }
    );
  }

  const user = db
    .prepare("SELECT * FROM users WHERE email = ? OR username = ?")
    .get(identifier, body?.email?.trim());

  if (!user || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json(
      { error: "Invalid credentials." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({
    user: { id: user.id, email: user.email, username: user.username },
  });
  setSessionCookie(response, user.id);
  return response;
}
