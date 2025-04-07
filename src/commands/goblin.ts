import { Command } from "commander";
import { colors, symbols } from "../utils/colors.js";
import {
  printHeader,
  printSuccess,
  printInfo,
  formatGold,
} from "../utils/helpers.js";
import { GoblinEngine } from "../systems/goblinEngine.js";

export function goblinCommand(program: Command, engine: GoblinEngine) {
  program
    .command("goblin <action> [options]")
    .description("Manage your goblin army")
    .action((action: string, options: any) => {
      const empire = engine.getEmpire();

      switch (action.toLowerCase()) {
        case "recruit":
          const newGoblin = engine.recruitGoblin();
          printHeader("🏚️ Goblin Recruited!");
          console.log(`${symbols.goblin} Name: ${colors.goblin(newGoblin.name)}`);
          console.log(`${symbols.check} Level: ${newGoblin.level}`);
          console.log(
            `${symbols.sword} Strength: ${newGoblin.strength}`
          );
          console.log(
            `${symbols.spell} Mischief: ${newGoblin.mischief}`
          );
          console.log(`${symbols.coin} Cost: ${formatGold(50)}`);
          printSuccess("Your goblin has joined the army!");
          break;

        case "list":
          printHeader("👹 Your Goblin Army");
          empire.goblins.forEach((goblin, idx) => {
            console.log(
              `${idx + 1}. ${colors.goblin(goblin.name)} (Level ${goblin.level})`
            );
            console.log(
              `   ${symbols.sword} Strength: ${goblin.strength} | ${symbols.spell} Mischief: ${goblin.mischief}`
            );
            console.log(`   Skills: ${goblin.skills.join(", ")}`);
          });
          break;

        case "status":
          printHeader("Empire Status");
          console.log(engine.getEmpire().name);
          console.log(
            `${symbols.goblin} Goblins: ${empire.goblins.length}`
          );
          console.log(
            `${symbols.coin} Gold: ${formatGold(empire.gold)}`
          );
          console.log(
            `${symbols.gem} Treasures: ${empire.hoard.length}`
          );
          console.log(
            `${symbols.lair} Lair Level: ${empire.lairLevel}`
          );
          break;

        default:
          console.log(
            colors.warning(`Unknown goblin action: ${action}`)
          );
      }
    });
}
