/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Cinzel", "serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        ink: "#0e0b1a",
        parchment: "#f1e6c8",
        gold: "#e8b64b",
        ember: "#e0563a",
        arcane: "#7c5cff",
        emerald: "#3bb273",
        panel: "#171226",
        panelLight: "#221a38",
      },
      boxShadow: {
        glow: "0 0 20px rgba(232,182,75,0.35)",
        arcane: "0 0 20px rgba(124,92,255,0.4)",
      },
      keyframes: {
        popIn: {
          "0%": { transform: "scale(0.6)", opacity: 0 },
          "60%": { transform: "scale(1.08)", opacity: 1 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        floatUp: {
          "0%": { transform: "translateY(0)", opacity: 1 },
          "100%": { transform: "translateY(-40px)", opacity: 0 },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        popIn: "popIn 0.35s ease-out",
        floatUp: "floatUp 1s ease-out forwards",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};
