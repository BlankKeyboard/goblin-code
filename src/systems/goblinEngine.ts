import { getRandomItem } from "../utils/helpers.js";

export interface Goblin {
  name: string;
  level: number;
  strength: number;
  mischief: number;
  skills: string[];
}

export interface Treasure {
  name: string;
  rarity: "common" | "rare" | "legendary";
  value: number;
  description: string;
}

export interface GoblinEmpire {
  name: string;
  gold: number;
  goblins: Goblin[];
  hoard: Treasure[];
  lairLevel: number;
  spellsLearned: string[];
}

const names = ["Nib", "Grubwick", "Snazzle", "Mordle", "Pipfang", "Brisket", "Vim"];
const skills = ["lock whispering", "bug sniffing", "script polishing", "cache rattling", "tiny deploys"];

export class GoblinEngine {
  private readonly empire: GoblinEmpire = {
    name: "The Brass Burrow",
    gold: 250,
    goblins: [],
    hoard: [],
    lairLevel: 1,
    spellsLearned: []
  };

  getEmpire(): GoblinEmpire {
    return this.empire;
  }

  recruitGoblin(): Goblin {
    const goblin: Goblin = {
      name: getRandomItem(names),
      level: 1,
      strength: randomBetween(2, 9),
      mischief: randomBetween(4, 12),
      skills: [getRandomItem(skills), getRandomItem(skills)]
    };

    this.empire.goblins.push(goblin);
    this.empire.gold = Math.max(0, this.empire.gold - 50);

    return goblin;
  }
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
