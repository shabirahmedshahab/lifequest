import db from "./db";

export function xpToReachLevel(level) {
  return Math.round(80 * Math.pow(level, 1.55));
}

export function computeLevel(totalXp) {
  let level = 1;
  let remaining = totalXp;
  while (remaining >= xpToReachLevel(level)) {
    remaining -= xpToReachLevel(level);
    level += 1;
  }
  return {
    level,
    xpIntoLevel: remaining,
    xpForNextLevel: xpToReachLevel(level),
  };
}

const DIFFICULTY_MULTIPLIER = {
  easy: 0.7,
  normal: 1,
  hard: 1.6,
  epic: 2.4,
};

export function rewardsFor(difficulty) {
  const mult = DIFFICULTY_MULTIPLIER[difficulty] ?? 1;
  return {
    xp: Math.round(10 * mult),
    gold: Math.round(5 * mult),
  };
}

const ATTRIBUTE_COLUMNS = ["intellect", "strength", "discipline", "creativity"];

export const completeTaskTransaction = db.transaction((userId, task) => {
  const character = db
    .prepare("SELECT * FROM characters WHERE user_id = ?")
    .get(userId);

  const beforeLevel = computeLevel(character.xp).level;
  const newXp = character.xp + task.xp_reward;
  const afterLevel = computeLevel(newXp).level;

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  let currentStreak = character.current_streak;
  if (character.last_completed_date === today) {
    // already active today, streak unchanged
  } else if (character.last_completed_date === yesterday) {
    currentStreak += 1;
  } else {
    currentStreak = 1;
  }
  const longestStreak = Math.max(character.longest_streak, currentStreak);

  const attrColumn = ATTRIBUTE_COLUMNS.includes(task.attribute)
    ? task.attribute
    : "discipline";

  db.prepare(
    `UPDATE characters SET
      xp = ?, gold = gold + ?, ${attrColumn} = ${attrColumn} + 1,
      current_streak = ?, longest_streak = ?, last_completed_date = ?
     WHERE user_id = ?`
  ).run(newXp, task.gold_reward, currentStreak, longestStreak, today, userId);

  db.prepare(
    "UPDATE tasks SET status = 'completed', completed_at = datetime('now') WHERE id = ?"
  ).run(task.id);

  return {
    leveledUp: afterLevel > beforeLevel,
    newLevel: afterLevel,
    xpGained: task.xp_reward,
    goldGained: task.gold_reward,
    currentStreak,
  };
});

export function getCharacterView(userId) {
  const character = db
    .prepare("SELECT * FROM characters WHERE user_id = ?")
    .get(userId);
  const { level, xpIntoLevel, xpForNextLevel } = computeLevel(character.xp);
  return { ...character, level, xpIntoLevel, xpForNextLevel };
}
