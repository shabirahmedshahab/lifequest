import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { getCharacterView } from "@/lib/engine";

export async function POST(request) {
  const userId = getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const itemId = body?.itemId;
  if (!itemId) {
    return NextResponse.json({ error: "itemId is required." }, { status: 400 });
  }

  const item = db.prepare("SELECT * FROM shop_items WHERE id = ?").get(itemId);
  if (!item) {
    return NextResponse.json({ error: "Item not found." }, { status: 404 });
  }

  const alreadyOwned = db
    .prepare("SELECT 1 FROM inventory WHERE user_id = ? AND item_id = ?")
    .get(userId, itemId);
  if (alreadyOwned) {
    return NextResponse.json({ error: "You already own this." }, { status: 409 });
  }

  const buy = db.transaction(() => {
    const character = db
      .prepare("SELECT gold FROM characters WHERE user_id = ?")
      .get(userId);
    if (character.gold < item.cost) {
      throw new Error("INSUFFICIENT_GOLD");
    }
    db.prepare("UPDATE characters SET gold = gold - ? WHERE user_id = ?").run(
      item.cost,
      userId
    );
    db.prepare("INSERT INTO inventory (user_id, item_id) VALUES (?, ?)").run(
      userId,
      itemId
    );
  });

  try {
    buy();
  } catch (err) {
    if (err.message === "INSUFFICIENT_GOLD") {
      return NextResponse.json({ error: "Not enough gold." }, { status: 402 });
    }
    return NextResponse.json({ error: "Purchase failed." }, { status: 500 });
  }

  const character = getCharacterView(userId);
  return NextResponse.json({ ok: true, character });
}
