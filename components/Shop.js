"use client";

export default function Shop({ items, owned, gold, onBuy, error }) {
  return (
    <section aria-label="Item shop" className="bg-panel border border-white/5 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg text-parchment">The Shop</h2>
        <span className="text-sm text-gold">🪙 {gold}</span>
      </div>
      {error && (
        <p role="alert" className="text-ember text-sm mb-3">
          {error}
        </p>
      )}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => {
          const isOwned = owned.includes(item.id);
          const canAfford = gold >= item.cost;
          return (
            <li
              key={item.id}
              className="bg-panelLight rounded-lg p-3 flex flex-col justify-between"
            >
              <div>
                <p className="text-parchment text-sm font-medium">{item.name}</p>
                <p className="text-parchment/50 text-xs mt-0.5">{item.description}</p>
              </div>
              <button
                type="button"
                disabled={isOwned || !canAfford}
                onClick={() => onBuy(item.id)}
                className="mt-3 text-xs font-semibold rounded-md py-1.5 transition-colors disabled:opacity-40 bg-gold/90 hover:bg-gold text-ink disabled:hover:bg-gold/90"
              >
                {isOwned ? "Owned" : `${item.cost} gold`}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
        }
