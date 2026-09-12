"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import CharacterPanel from "@/components/CharacterPanel";
import QuestForm from "@/components/QuestForm";
import QuestList from "@/components/QuestList";
import Shop from "@/components/Shop";
import LevelUpModal from "@/components/LevelUpModal";

function TaskSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-16 rounded-xl bg-panel border border-white/5 animate-pulse"
        />
      ))}
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [character, setCharacter] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [shopItems, setShopItems] = useState([]);
  const [owned, setOwned] = useState([]);
  const [shopError, setShopError] = useState("");
  const [levelUpTo, setLevelUpTo] = useState(null);
  const [completingId, setCompletingId] = useState(null);
  const [loadError, setLoadError] = useState("");

  const loadAll = useCallback(async () => {
    try {
      const [meRes, tasksRes, shopRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/tasks"),
        fetch("/api/shop"),
      ]);
      if (meRes.status === 401) {
        router.replace("/");
        return;
      }
      const me = await meRes.json();
      const tasksData = await tasksRes.json();
      const shopData = await shopRes.json();
      setUser(me.user);
      setCharacter(me.character);
      setTasks(tasksData.tasks);
      setShopItems(shopData.items);
      setOwned(shopData.owned);
    } catch (err) {
      setLoadError("Couldn't reach the server. Check your connection and reload.");
    }
  }, [router]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  async function handleCreateTask(payload) {
    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      status: "active",
      xp_reward: payload.difficulty === "hard" ? 16 : payload.difficulty === "epic" ? 24 : payload.difficulty === "easy" ? 7 : 10,
      gold_reward: payload.difficulty === "hard" ? 8 : payload.difficulty === "epic" ? 12 : payload.difficulty === "easy" ? 4 : 5,
      ...payload,
    };
    setTasks((prev) => [optimistic, ...prev]);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== tempId));
        return false;
      }
      const data = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === tempId ? data.task : t)));
      return true;
    } catch {
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
      return false;
    }
  }

  async function handleComplete(taskId) {
    setCompletingId(taskId);
    const previousTasks = tasks;
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "completed" } : t))
    );
    try {
      const res = await fetch("/api/tasks/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
      });
      if (!res.ok) {
        setTasks(previousTasks);
        setCompletingId(null);
        return;
      }
      const data = await res.json();
      setCharacter(data.character);
      if (data.result.leveledUp) {
        setLevelUpTo(data.result.newLevel);
      }
    } catch {
      setTasks(previousTasks);
    } finally {
      setCompletingId(null);
    }
  }

  async function handleDelete(taskId) {
    const previousTasks = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (!res.ok) setTasks(previousTasks);
    } catch {
      setTasks(previousTasks);
    }
  }

  async function handleBuy(itemId) {
    setShopError("");
    try {
      const res = await fetch("/api/shop/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setShopError(data.error || "Purchase failed.");
        return;
      }
      setCharacter(data.character);
      setOwned((prev) => [...prev, itemId]);
    } catch {
      setShopError("Couldn't reach the server.");
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
  }

  if (loadError) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <p className="text-ember text-center">{loadError}</p>
      </main>
    );
  }

  return (
    <main id="main" className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <p className="font-display text-lg text-gold">⚔ LifeQuest</p>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-parchment/50 hover:text-parchment transition-colors"
        >
          Log out
        </button>
      </header>

      <div className="space-y-5">
        {character && user ? (
          <CharacterPanel character={character} username={user.username} />
        ) : (
          <div className="h-40 rounded-xl bg-panel border border-white/5 animate-pulse" />
        )}

        <QuestForm onCreate={handleCreateTask} />

        {tasks === null ? (
          <TaskSkeleton />
        ) : (
          <QuestList
            tasks={tasks}
            onComplete={handleComplete}
            onDelete={handleDelete}
            completingId={completingId}
          />
        )}

        {shopItems.length > 0 && character && (
          <Shop
            items={shopItems}
            owned={owned}
            gold={character.gold}
            onBuy={handleBuy}
            error={shopError}
          />
        )}
      </div>

      <LevelUpModal level={levelUpTo} onClose={() => setLevelUpTo(null)} />
    </main>
  );
    }
