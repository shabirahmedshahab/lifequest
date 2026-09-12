"use client";

const ATTRIBUTE_ICON = {
  intellect: "🧠",
  strength: "💪",
  discipline: "🛡",
  creativity: "🎨",
};

const DIFFICULTY_STYLE = {
  easy: "text-emerald",
  normal: "text-parchment/70",
  hard: "text-gold",
  epic: "text-ember",
};

export default function QuestList({ tasks, onComplete, onDelete, completingId }) {
  const active = tasks.filter((t) => t.status === "active");
  const completed = tasks.filter((t) => t.status === "completed");

  if (tasks.length === 0) {
    return (
      <div className="bg-panel border border-white/5 rounded-xl p-8 text-center">
        <p className="text-parchment/60">
          Your quest log is empty. Add your first quest above to begin earning XP.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ul className="space-y-2">
        {active.map((task) => (
          <li
            key={task.id}
            className="bg-panel border border-white/5 rounded-xl p-3.5 flex items-center gap-3 animate-popIn"
          >
            <button
              type="button"
              onClick={() => onComplete(task.id)}
              disabled={completingId === task.id}
              aria-label={`Complete quest: ${task.title}`}
              className="shrink-0 w-6 h-6 rounded-full border-2 border-gold/60 hover:bg-gold/20 disabled:opacity-40 transition-colors"
            />
            <div className="flex-1 min-w-0">
              <p className="text-parchment truncate">{task.title}</p>
              <p className="text-xs text-parchment/50 flex items-center gap-2 mt-0.5">
                <span>{ATTRIBUTE_ICON[task.attribute]} {task.attribute}</span>
                <span className={DIFFICULTY_STYLE[task.difficulty]}>
                  {task.difficulty}
                </span>
                <span>+{task.xp_reward} XP</span>
                <span>+{task.gold_reward}g</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => onDelete(task.id)}
              aria-label={`Delete quest: ${task.title}`}
              className="text-parchment/30 hover:text-ember transition-colors px-2"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {completed.length > 0 && (
        <details className="text-sm">
          <summary className="text-parchment/50 cursor-pointer hover:text-parchment/80">
            Completed ({completed.length})
          </summary>
          <ul className="space-y-1.5 mt-2">
            {completed.map((task) => (
              <li
                key={task.id}
                className="text-parchment/40 line-through px-3.5 py-2 bg-panel/50 rounded-lg"
              >
                {task.title}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
                }
