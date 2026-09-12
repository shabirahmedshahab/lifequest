import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

export async function GET() {
  const userId = getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const items = db.prepare("SELECT * FROM shop_items ORDER BY cost ASC").all();
  const owned = db
    .prepare("SELECT item_id FROM inventory WHERE user_id = ?")
    .all(userId)
    .map((r) => r.item_id);
  return NextResponse.json({ items, owned });
}
