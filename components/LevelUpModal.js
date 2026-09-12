"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function LevelUpModal({ level, onClose }) {
  return (
    <AnimatePresence>
      {level && (
        <motion.div
          role="alertdialog"
          aria-modal="true"
          aria-label="Level up"
          className="fixed inset-0 bg-ink/80 flex items-center justify-center z-50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-panel border border-gold/40 rounded-2xl p-8 text-center shadow-glow max-w-xs"
          >
            <p className="text-gold text-sm tracking-wide mb-1">LEVEL UP</p>
            <p className="font-display text-6xl text-parchment mb-2">{level}</p>
            <p className="text-parchment/60 text-sm mb-5">
              Your legend grows. New strength awaits.
            </p>
            <button
              type="button"
              onClick={onClose}
              autoFocus
              className="bg-gold hover:bg-gold/90 text-ink font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              Continue
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
