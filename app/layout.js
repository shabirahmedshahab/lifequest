import "./globals.css";

export const metadata = {
  title: "LifeQuest — Turn your days into a saga",
  description:
    "LifeQuest turns your habits and to-dos into an RPG: earn XP, level up, and build streaks by completing quests drawn from your real life.",
  keywords: ["habit tracker", "productivity RPG", "gamified todo list", "life RPG"],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0e0b1a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-body min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-gold focus:text-ink focus:px-3 focus:py-2 focus:rounded"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
