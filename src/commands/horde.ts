import { hordeItems } from "../data/goblinWords.js";
import { banner, section } from "../core/format.js";

export function runHorde(): void {
  console.log([
    banner(),
    section("Horde Inventory", hordeItems),
    "Spend one item by turning it into a real feature today."
  ].join("\n"));
}
