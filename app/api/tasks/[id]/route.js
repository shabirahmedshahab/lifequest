import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

export async function DELETE(request, { params }) {
  const userId = getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const task = db
    .prepare("SELECT * FROM tasks WHERE id = ? AND user_id = ?")
    .get(params.id, userId);
  if (!task) {
    return NextResponse.json({ error: "Quest not found." }, { status: 404 });
  }
  db.prepare("DELETE FROM tasks WHERE id = ?").run(params.id);
  return NextResponse.json({ ok: true });
}
