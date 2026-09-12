"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
    } catch (err) {
      setError("Couldn't reach the server. Check your connection.");
      setLoading(false);
    }
  }

  return (
    <main id="main" className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-gold tracking-wide text-sm mb-2">⚔ LifeQuest</p>
          <h1 className="font-display text-4xl text-parchment leading-tight">
            Every day is<br />a quest log.
          </h1>
          <p className="text-parchment/60 mt-3 text-sm max-w-xs mx-auto">
            Turn what you already have to do into experience, gold, and levels.
          </p>
        </div>

        <div className="bg-panel border border-white/5 rounded-xl p-6 shadow-glow">
          <div className="flex mb-6 rounded-lg bg-panelLight p-1" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === "login" ? "bg-gold text-ink" : "text-parchment/70 hover:text-parchment"
              }`}
            >
              Return, Adventurer
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signup"}
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === "signup" ? "bg-gold text-ink" : "text-parchment/70 hover:text-parchment"
              }`}
            >
              Begin a New Saga
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-parchment/80 mb-1">
                {mode === "login" ? "Email or username" : "Email"}
              </label>
              <input
                id="email"
                type={mode === "login" ? "text" : "email"}
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-panelLight border border-white/10 rounded-lg px-3 py-2 text-parchment focus:border-gold outline-none"
                autoComplete={mode === "login" ? "username" : "email"}
              />
            </div>

            {mode === "signup" && (
              <div>
                <label htmlFor="username" className="block text-sm text-parchment/80 mb-1">
                  Character name
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full bg-panelLight border border-white/10 rounded-lg px-3 py-2 text-parchment focus:border-gold outline-none"
                  autoComplete="username"
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm text-parchment/80 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-panelLight border border-white/10 rounded-lg px-3 py-2 text-parchment focus:border-gold outline-none"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </div>

            {error && (
              <p role="alert" className="text-ember text-sm">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-gold/90 disabled:opacity-50 text-ink font-semibold py-2.5 rounded-lg transition-colors"
            >
              {loading
                ? "Casting..."
                : mode === "login"
                ? "Enter the Realm"
                : "Create Character"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
    }
