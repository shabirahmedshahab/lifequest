import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { rewardsFor } from "@/lib/engine";

const VALID_ATTRIBUTES = ["intellect", "strength", "discipline", "creativity"];
const VALID_DIFFICULTIES = ["easy", "normal", "hard", "epic"];

export async function GET() {
  const userId = getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const tasks = db
    .prepare(
      "SELECT * FROM tasks WHERE user_id = ? ORDER BY status = 'active' DESC, created_at DESC"
    )
    .all(userId);
  return NextResponse.json({ tasks });
}

export async function POST(request) {
  const userId = getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const title = body?.title?.trim();
  const attribute = VALID_ATTRIBUTES.includes(body?.attribute)
    ? body.attribute
    : "discipline";
  const difficulty = VALID_DIFFICULTIES.includes(body?.difficulty)
    ? body.difficulty
    : "normal";

  if (!title) {
    return NextResponse.json(
      { error: "A quest needs a title." },
      { status: 400 }
    );
  }
  if (title.length > 140) {
    return NextResponse.json(
      { error: "Quest title is too long (140 characters max)." },
      { status: 400 }
    );
  }

  const { xp, gold } = rewardsFor(difficulty);

  const info = db
    .prepare(
      `INSERT INTO tasks (user_id, title, attribute, difficulty, xp_reward, gold_reward)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(userId, title, attribute, difficulty, xp, gold);

  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(info.lastInsertRowid);
  return NextResponse.json({ task });
}
