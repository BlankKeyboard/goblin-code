import { Command } from "commander";
import { colors, symbols } from "../utils/colors.js";
import {
  printHeader,
  printSuccess,
  printInfo,
  formatGold,
} from "../utils/helpers.js";
import { TreasureSystem } from "../systems/treasureSystem.js";
import { GoblinEngine } from "../systems/goblinEngine.js";

export function hoardCommand(program: Command, engine: GoblinEngine) {
  const treasureSystem = new TreasureSystem();

  program
    .command("hoard <action>")
    .description("Manage your treasure hoard")
    .action((action: string) => {
      const empire = engine.getEmpire();

      switch (action.toLowerCase()) {
        case "steal":
          const newTreasure = treasureSystem.generateTreasure();
          empire.hoard.push(newTreasure);
          printHeader("💰 Treasure Stolen!");
          console.log(
            `${symbols.treasure} Found: ${colors.treasure(newTreasure.name)}`
          );
          console.log(`${symbols.gem} Rarity: ${colors.mystical(newTreasure.rarity.toUpperCase())}`);
          console.log(
            `${symbols.coin} Value: ${formatGold(newTreasure.value)}`
          );
          console.log(
            `${symbols.check} Description: ${newTreasure.description}`
          );
          empire.gold += newTreasure.value;
          printSuccess("Added to your hoard!");
          break;

        case "list":
          printHeader("💎 Your Treasure Hoard");
          if (empire.hoard.length === 0) {
            printInfo("Your hoard is empty. Time to steal some treasure!");
            break;
          }
          empire.hoard.forEach((treasure, idx) => {
            const rarityColor =
              treasure.rarity === "legendary"
                ? colors.treasure
                : treasure.rarity === "rare"
                ? colors.mystical
                : colors.goblin;
            console.log(
              `${idx + 1}. ${colors.goblin(treasure.name)} ${rarityColor(`[${treasure.rarity.toUpperCase()}]`)}`
            );
            console.log(`   Value: ${formatGold(treasure.value)}`);
            console.log(`   ${treasure.description}`);
          });
          const totalValue = treasureSystem.calculateTotalValue(
            empire.hoard
          );
          console.log(
            `\n${symbols.coin} Total Hoard Value: ${formatGold(totalValue)}`
          );
          break;

        case "value":
          const value = treasureSystem.calculateTotalValue(empire.hoard);
          printHeader("💰 Hoard Value");
          console.log(
            `Your hoard is worth: ${colors.treasure(`${value} gold pieces`)}`
          );
          break;

        default:
          console.log(colors.warning(`Unknown hoard action: ${action}`));
      }
    });
}
