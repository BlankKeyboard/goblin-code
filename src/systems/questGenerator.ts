import { getRandomItem } from "../utils/helpers.js";

export interface Quest {
  title: string;
  description: string;
  difficulty: "easy" | "hard" | "legendary";
  reward: number;
}

const questTitles = [
  "Polish the One Command",
  "Name the Nameless Module",
  "Banish the Dead Branch",
  "Teach the README to Speak",
  "Trap the Flaky Test"
];

const descriptions = [
  "Make one small workflow feel strangely satisfying.",
  "Remove one source of confusion from the burrow.",
  "Turn an annoying manual step into a repeatable command.",
  "Write down the thing future-you will forget.",
  "Find a brittle edge and make it boring."
];

export class QuestGenerator {
  generateQuest(): Quest {
    const difficulty = getRandomItem(["easy", "hard", "legendary"] as const);
    const multiplier = difficulty === "legendary" ? 5 : difficulty === "hard" ? 3 : 1;

    return {
      title: getRandomItem(questTitles),
      description: getRandomItem(descriptions),
      difficulty,
      reward: 75 * multiplier
    };
  }
}
