import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { completeTaskTransaction, getCharacterView } from "@/lib/engine";

export async function POST(request) {
  const userId = getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const taskId = body?.taskId;
  if (!taskId) {
    return NextResponse.json({ error: "taskId is required." }, { status: 400 });
  }

  const task = db
    .prepare("SELECT * FROM tasks WHERE id = ? AND user_id = ?")
    .get(taskId, userId);

  if (!task) {
    return NextResponse.json({ error: "Quest not found." }, { status: 404 });
  }
  if (task.status === "completed") {
    return NextResponse.json(
      { error: "This quest is already completed." },
      { status: 409 }
    );
  }

  const result = completeTaskTransaction(userId, task);
  const character = getCharacterView(userId);

  return NextResponse.json({ result, character });
}
