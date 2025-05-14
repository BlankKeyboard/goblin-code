import type { Treasure } from "./goblinEngine.js";
import { getRandomItem } from "../utils/helpers.js";

const treasures: Treasure[] = [
  {
    name: "Self-documenting config shard",
    rarity: "rare",
    value: 120,
    description: "It hums softly when defaults are sensible."
  },
  {
    name: "Prototype spark",
    rarity: "common",
    value: 60,
    description: "Small, bright, and actually shippable."
  },
  {
    name: "Legendary delete key",
    rarity: "legendary",
    value: 350,
    description: "Removes dead code without causing meetings."
  },
  {
    name: "Polished command alias",
    rarity: "common",
    value: 80,
    description: "Fits perfectly under the fingers."
  }
];

export class TreasureSystem {
  generateTreasure(): Treasure {
    return { ...getRandomItem(treasures) };
  }

  calculateTotalValue(hoard: Treasure[]): number {
    return hoard.reduce((sum, treasure) => sum + treasure.value, 0);
  }
}
