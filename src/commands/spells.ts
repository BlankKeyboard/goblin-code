import { Command } from "commander";
import { colors, symbols } from "../utils/colors.js";
import {
  printHeader,
  printSuccess,
  printWarning,
  formatGold,
  getRandomItem,
} from "../utils/helpers.js";
import { GoblinEngine } from "../systems/goblinEngine.js";
import spellsData from "../data/spells.json" with { type: "json" };

export function spellCommand(program: Command, engine: GoblinEngine) {
  program
    .command("spell <action>")
    .description("Cast spells and manage your grimoire")
    .action((action: string) => {
      const empire = engine.getEmpire();

      switch (action.toLowerCase()) {
        case "learn":
          const spellToLearn = getRandomItem(spellsData);
          if (!empire.spellsLearned.includes(spellToLearn.name)) {
            empire.spellsLearned.push(spellToLearn.name);
            printHeader("✨ Spell Learned!");
            console.log(
              `${symbols.spell} Spell: ${colors.mystical(spellToLearn.name)}`
            );
            console.log(
              `${symbols.scroll} Effect: ${spellToLearn.effect}`
            );
            console.log(
              `${symbols.coin} Cost: ${formatGold(spellToLearn.cost)}`
            );
            printSuccess("New spell added to your grimoire!");
          } else {
            printWarning("You already know that spell!");
          }
          break;

        case "cast":
          if (empire.spellsLearned.length === 0) {
            printWarning("You don't know any spells yet!");
            break;
          }
          const spellName = getRandomItem(empire.spellsLearned);
          const spell = spellsData.find((s: any) => s.name === spellName);
          if (spell && empire.gold >= spell.cost) {
            empire.gold -= spell.cost;
            printHeader("✨ Spell Cast!");
            console.log(`${symbols.spell} Cast: ${colors.mystical(spell.name)}`);
            console.log(`${symbols.sparkles} Effect: ${spell.effect}`);
            console.log(`${symbols.coin} Cost: ${formatGold(spell.cost)}`);
            printSuccess("Spell successfully cast!");
          } else {
            printWarning("Not enough gold to cast this spell!");
          }
          break;

        case "grimoire":
          printHeader("📖 Your Grimoire");
          if (empire.spellsLearned.length === 0) {
            console.log("No spells in your grimoire yet.");
            break;
          }
          empire.spellsLearned.forEach((spellName, idx) => {
            const spell = spellsData.find((s: any) => s.name === spellName);
            console.log(
              `${idx + 1}. ${colors.mystical(spellName)}`
            );
            if (spell) {
              console.log(`   Effect: ${spell.effect}`);
              console.log(`   Cost: ${formatGold(spell.cost)}`);
            }
          });
          break;

        default:
          console.log(colors.warning(`Unknown spell action: ${action}`));
      }
    });
}
