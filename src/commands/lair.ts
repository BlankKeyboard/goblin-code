import { Command } from "commander";
import { colors, symbols } from "../utils/colors.js";
import {
  printHeader,
  printSuccess,
  printWarning,
  formatGold,
} from "../utils/helpers.js";
import { LairBuilder } from "../systems/lairBuilder.js";
import { GoblinEngine } from "../systems/goblinEngine.js";

const lair = new LairBuilder("Goblin's Lair");

export function lairCommand(program: Command, engine: GoblinEngine) {
  program
    .command("lair <action>")
    .description("Build and upgrade your lair")
    .action((action: string) => {
      const empire = engine.getEmpire();

      switch (action.toLowerCase()) {
        case "view":
          printHeader("🏚️ Your Lair");
          console.log(lair.getLairStatus());
          break;

        case "upgrade":
          const upgradeCost = empire.lairLevel * 200;
          if (empire.gold >= upgradeCost) {
            empire.gold -= upgradeCost;
            empire.lairLevel = lair.upgradeLair();
            printHeader("🏚️ Lair Upgraded!");
            console.log(
              `${symbols.check} Lair is now Level ${empire.lairLevel}`
            );
            console.log(
              `${symbols.coin} Cost: ${formatGold(upgradeCost)}`
            );
            printSuccess("Your lair has been upgraded!");
          } else {
            printWarning(
              `Not enough gold! Need ${formatGold(upgradeCost)}, have ${formatGold(empire.gold)}`
            );
          }
          break;

        case "features":
          printHeader("🏚️ Lair Features");
          const features = lair.getFeatures();
          if (features.length === 0) {
            console.log("No features yet. Upgrade your lair to add features!");
          } else {
            features.forEach((feature, idx) => {
              console.log(`${idx + 1}. ${colors.goblin(feature)}`);
            });
          }
          break;

        default:
          console.log(colors.warning(`Unknown lair action: ${action}`));
      }
    });
}
