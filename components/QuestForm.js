"use client";

import { useState } from "react";

const ATTRIBUTES = [
  { value: "intellect", label: "Intellect" },
  { value: "strength", label: "Strength" },
  { value: "discipline", label: "Discipline" },
  { value: "creativity", label: "Creativity" },
];

const DIFFICULTIES = [
  { value: "easy", label: "Easy" },
  { value: "normal", label: "Normal" },
  { value: "hard", label: "Hard" },
  { value: "epic", label: "Epic" },
];

export default function QuestForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [attribute, setAttribute] = useState("discipline");
  const [difficulty, setDifficulty] = useState("normal");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const trimmed = title.trim();
    if (!trimmed) {
      setError("Name your quest before setting out.");
      return;
    }
    setSubmitting(true);
    const ok = await onCreate({ title: trimmed, attribute, difficulty });
    setSubmitting(false);
    if (ok) {
      setTitle("");
    } else {
      setError("Couldn't add that quest. Try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-panel border border-white/5 rounded-xl p-4">
      <label htmlFor="quest-title" className="sr-only">
        New quest
      </label>
      <div className="flex gap-2">
        <input
          id="quest-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a quest... (e.g. Read 20 pages)"
          maxLength={140}
          className="flex-1 bg-panelLight border border-white/10 rounded-lg px-3 py-2.5 text-parchment placeholder:text-parchment/40 focus:border-gold outline-none"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-gold hover:bg-gold/90 disabled:opacity-50 text-ink font-semibold px-4 rounded-lg transition-colors"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mt-3">
        <fieldset className="flex items-center gap-1.5">
          <legend className="sr-only">Attribute</legend>
          {ATTRIBUTES.map((a) => (
            <button
              type="button"
              key={a.value}
              onClick={() => setAttribute(a.value)}
              aria-pressed={attribute === a.value}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                attribute === a.value
                  ? "bg-arcane/20 border-arcane text-parchment"
                  : "border-white/10 text-parchment/50 hover:text-parchment/80"
              }`}
            >
              {a.label}
            </button>
          ))}
        </fieldset>

        <fieldset className="flex items-center gap-1.5">
          <legend className="sr-only">Difficulty</legend>
          {DIFFICULTIES.map((d) => (
            <button
              type="button"
              key={d.value}
              onClick={() => setDifficulty(d.value)}
              aria-pressed={difficulty === d.value}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                difficulty === d.value
                  ? "bg-gold/20 border-gold text-parchment"
                  : "border-white/10 text-parchment/50 hover:text-parchment/80"
              }`}
            >
              {d.label}
            </button>
          ))}
        </fieldset>
      </div>

      {error && (
        <p role="alert" className="text-ember text-sm mt-2">
          {error}
        </p>
      )}
    </form>
  );
                }
