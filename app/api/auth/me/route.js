import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { getCharacterView } from "@/lib/engine";

export async function GET() {
  const userId = getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const user = db
    .prepare("SELECT id, email, username FROM users WHERE id = ?")
    .get(userId);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const character = getCharacterView(userId);
  return NextResponse.json({ user, character });
}
