"use client";

const ATTRIBUTE_LABELS = {
  intellect: { label: "Intellect", color: "bg-arcane" },
  strength: { label: "Strength", color: "bg-ember" },
  discipline: { label: "Discipline", color: "bg-gold" },
  creativity: { label: "Creativity", color: "bg-emerald" },
};

export default function CharacterPanel({ character, username }) {
  if (!character) return null;
  const pct = Math.min(
    100,
    Math.round((character.xpIntoLevel / character.xpForNextLevel) * 100)
  );

  return (
    <section
      aria-label="Character status"
      className="bg-panel border border-white/5 rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-parchment/50 text-xs uppercase tracking-wide">Adventurer</p>
          <h2 className="font-display text-xl text-parchment">{username}</h2>
        </div>
        <div className="text-right">
          <p className="text-parchment/50 text-xs uppercase tracking-wide">Level</p>
          <p className="font-display text-3xl text-gold leading-none">
            {character.level}
          </p>
        </div>
      </div>

      <div className="mb-1 flex justify-between text-xs text-parchment/60">
        <span>{character.xpIntoLevel} XP</span>
        <span>{character.xpForNextLevel} XP to next level</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Experience progress to next level"
        className="h-3 rounded-full bg-panelLight overflow-hidden"
      >
        <div
          className="h-full rounded-full xp-bar-shimmer animate-shimmer transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">
        {Object.entries(ATTRIBUTE_LABELS).map(([key, meta]) => (
          <div key={key} className="bg-panelLight rounded-lg px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-parchment/70">{meta.label}</span>
              <span className="text-sm font-semibold text-parchment">
                {character[key]}
              </span>
            </div>
            <div className="h-1.5 mt-1.5 rounded-full bg-ink overflow-hidden">
              <div
                className={`h-full ${meta.color}`}
                style={{ width: `${Math.min(100, character[key] * 4)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <span aria-hidden="true">🔥</span>
          <div>
            <p className="text-sm text-parchment font-medium">
              {character.current_streak}-day streak
            </p>
            <p className="text-xs text-parchment/50">
              Best: {character.longest_streak} days
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span aria-hidden="true">🪙</span>
          <span className="font-display text-lg text-gold">{character.gold}</span>
        </div>
      </div>
    </section>
  );
          }
