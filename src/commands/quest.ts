import { Command } from "commander";
import { colors, symbols } from "../utils/colors.js";
import {
  printHeader,
  printSuccess,
  printWarning,
  formatGold,
  getRandomItem,
} from "../utils/helpers.js";
import { QuestGenerator } from "../systems/questGenerator.js";
import { GoblinEngine } from "../systems/goblinEngine.js";

const questGenerator = new QuestGenerator();
const activeQuests: any[] = [];

export function questCommand(program: Command, engine: GoblinEngine) {
  program
    .command("quest <action>")
    .description("Generate and manage quests")
    .action((action: string) => {
      const empire = engine.getEmpire();

      switch (action.toLowerCase()) {
        case "generate":
          const newQuest = questGenerator.generateQuest();
          activeQuests.push(newQuest);
          printHeader("📜 Quest Generated!");
          console.log(`${symbols.quest} Title: ${colors.mystical(newQuest.title)}`);
          console.log(`${symbols.scroll} Description: ${newQuest.description}`);
          console.log(
            `${symbols.sword} Difficulty: ${colors.danger(newQuest.difficulty.toUpperCase())}`
          );
          console.log(
            `${symbols.coin} Reward: ${formatGold(newQuest.reward)}`
          );
          printSuccess("Quest added to your list!");
          break;

        case "list":
          printHeader("📜 Active Quests");
          if (activeQuests.length === 0) {
            console.log("No active quests. Generate one!");
            break;
          }
          activeQuests.forEach((quest, idx) => {
            const difficultyColor =
              quest.difficulty === "legendary"
                ? colors.danger
                : quest.difficulty === "hard"
                ? colors.warning
                : colors.info;
            console.log(
              `${idx + 1}. ${colors.mystical(quest.title)} ${difficultyColor(`[${quest.difficulty.toUpperCase()}]`)}`
            );
            console.log(`   ${quest.description}`);
            console.log(`   Reward: ${formatGold(quest.reward)}`);
          });
          break;

        case "complete":
          if (activeQuests.length === 0) {
            printWarning("No quests to complete!");
            break;
          }
          const completedQuest = activeQuests.pop();
          empire.gold += completedQuest.reward;
          printHeader("🎉 Quest Complete!");
          console.log(
            `${symbols.check} Completed: ${colors.success(completedQuest.title)}`
          );
          console.log(
            `${symbols.coin} Reward: ${formatGold(completedQuest.reward)}`
          );
          printSuccess("Quest completed!");
          break;

        default:
          console.log(colors.warning(`Unknown quest action: ${action}`));
      }
    });
}
