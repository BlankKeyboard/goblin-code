import { readFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { colors, symbols } from "../utils/colors.js";
import { formatGold, getRandomItem } from "../utils/helpers.js";
import { GoblinEngine } from "../systems/goblinEngine.js";
import { QuestGenerator } from "../systems/questGenerator.js";
import { TreasureSystem } from "../systems/treasureSystem.js";
import { LairBuilder } from "../systems/lairBuilder.js";
import { askCodeOracle } from "../core/codeOracle.js";
import spellsData from "../data/spells.json" with { type: "json" };

type ModeCommand = {
  command: string;
  description: string;
};

const commands: ModeCommand[] = [
  { command: "status", description: "show empire dashboard" },
  { command: "recruit", description: "hire a new goblin for 50 gold" },
  { command: "goblins", description: "list your current crew" },
  { command: "quest", description: "generate a new quest" },
  { command: "complete", description: "complete the latest quest" },
  { command: "quests", description: "list active quests" },
  { command: "steal", description: "grab treasure for the hoard" },
  { command: "hoard", description: "list treasure and total value" },
  { command: "upgrade", description: "upgrade the lair if you can afford it" },
  { command: "learn", description: "learn a random spell" },
  { command: "cast", description: "cast a learned spell" },
  { command: "ask <q>", description: "ask OpenAI about this repo" },
  { command: "clear", description: "redraw the interface" },
  { command: "help", description: "show this command menu" },
  { command: "exit", description: "leave goblin mode" }
];

const questGenerator = new QuestGenerator();
const treasureSystem = new TreasureSystem();
const lair = new LairBuilder("The Brass Burrow");

export async function runGoblinMode(engine: GoblinEngine): Promise<void> {
  const activeQuests: ReturnType<QuestGenerator["generateQuest"]>[] = [];

  if (!input.isTTY) {
    await runScriptedMode(engine, activeQuests);
    return;
  }

  const rl = createInterface({ input, output });

  drawSplash(engine);

  try {
    while (true) {
      const answer = await rl.question(colors.goblin("\ngoblin-mode> "));
      const command = answer.trim();
      const normalizedCommand = command.toLowerCase();

      if (command.length === 0) {
        continue;
      }

      if (normalizedCommand === "exit" || normalizedCommand === "quit") {
        console.log(colors.dim("The burrow lanterns dim. Session closed."));
        break;
      }

      await handleModeCommand(command, engine, activeQuests);
    }
  } finally {
    rl.close();
  }
}

async function runScriptedMode(
  engine: GoblinEngine,
  activeQuests: ReturnType<QuestGenerator["generateQuest"]>[]
): Promise<void> {
  drawSplash(engine);
  const script = readFileSync(0, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const command of script) {
    const normalizedCommand = command.toLowerCase();
    console.log(colors.goblin(`\ngoblin-mode> ${command}`));
    if (normalizedCommand === "exit" || normalizedCommand === "quit") {
      console.log(colors.dim("The burrow lanterns dim. Session closed."));
      return;
    }
    await handleModeCommand(command, engine, activeQuests);
  }
}

async function handleModeCommand(
  command: string,
  engine: GoblinEngine,
  activeQuests: ReturnType<QuestGenerator["generateQuest"]>[]
): Promise<void> {
  const normalizedCommand = command.toLowerCase();

  if (normalizedCommand.startsWith("ask ")) {
    await askOracleFromMode(command.slice(4).trim());
    return;
  }

  switch (normalizedCommand) {
    case "status":
      printDashboard(engine, activeQuests.length);
      break;
    case "recruit":
      recruit(engine);
      break;
    case "goblins":
      listGoblins(engine);
      break;
    case "quest":
      generateQuest(activeQuests);
      break;
    case "complete":
      completeQuest(engine, activeQuests);
      break;
    case "quests":
      listQuests(activeQuests);
      break;
    case "steal":
      stealTreasure(engine);
      break;
    case "hoard":
      listHoard(engine);
      break;
    case "upgrade":
      upgradeLair(engine);
      break;
    case "learn":
      learnSpell(engine);
      break;
    case "cast":
      castSpell(engine);
      break;
    case "clear":
      drawSplash(engine);
      break;
    case "help":
      printCommandMenu();
      break;
    default:
      console.log(colors.warning(`Unknown command "${command}". Type help to see options.`));
  }
}

function drawSplash(engine: GoblinEngine): void {
  process.stdout.write("\x1Bc");
  console.log(colors.goblin("╔════════════════════════════════════════════════════════════╗"));
  console.log(colors.goblin("║") + colors.title(colors.bold("              GOBLIN MODE: THE BRASS BURROW              ")) + colors.goblin("║"));
  console.log(colors.goblin("║") + colors.dim("       an interactive terminal lair for tiny progress       ") + colors.goblin("║"));
  console.log(colors.goblin("╚════════════════════════════════════════════════════════════╝"));
  printDashboard(engine, 0);
  printCommandMenu();
}

function printDashboard(engine: GoblinEngine, activeQuestCount: number): void {
  const empire = engine.getEmpire();
  console.log(`\n${colors.frame("┌─ Empire Status ───────────────────────────────────────────┐")}`);
  console.log(`${colors.frame("│")} ${colors.bold(empire.name.padEnd(30))} ${symbols.coin} ${formatGold(empire.gold).padEnd(22)}${colors.frame("│")}`);
  console.log(`${colors.frame("│")} ${symbols.goblin} Goblins: ${String(empire.goblins.length).padEnd(8)} ${symbols.quest} Quests: ${String(activeQuestCount).padEnd(8)} ${symbols.lair} Lair: ${String(empire.lairLevel).padEnd(10)}${colors.frame("│")}`);
  console.log(`${colors.frame("│")} ${symbols.gem} Treasures: ${String(empire.hoard.length).padEnd(7)} ${symbols.spell} Spells: ${String(empire.spellsLearned.length).padEnd(27)}${colors.frame("│")}`);
  console.log(colors.frame("└────────────────────────────────────────────────────────────┘"));
}

function printCommandMenu(): void {
  console.log(`\n${colors.title(colors.bold("Commands"))}`);
  for (const item of commands) {
    console.log(`  ${colors.goblin(item.command.padEnd(10))} ${colors.dim(item.description)}`);
  }
}

function recruit(engine: GoblinEngine): void {
  const goblin = engine.recruitGoblin();
  console.log(`\n${colors.success("New recruit joined the crew")}`);
  console.log(`  ${symbols.goblin} ${colors.goblin(colors.bold(goblin.name))}  level ${goblin.level}`);
  console.log(`  ${symbols.sword} strength ${goblin.strength}  ${symbols.spell} mischief ${goblin.mischief}`);
  console.log(`  skills: ${goblin.skills.join(", ")}`);
}

function listGoblins(engine: GoblinEngine): void {
  const { goblins } = engine.getEmpire();
  console.log(`\n${colors.title(colors.bold("Goblin Crew"))}`);
  if (goblins.length === 0) {
    console.log(colors.dim("  Nobody is here yet. Try recruit."));
    return;
  }
  goblins.forEach((goblin, index) => {
    console.log(`  ${index + 1}. ${colors.goblin(goblin.name)}  lvl ${goblin.level}  str ${goblin.strength}  mischief ${goblin.mischief}`);
    console.log(`     ${colors.dim(goblin.skills.join(" / "))}`);
  });
}

function generateQuest(activeQuests: ReturnType<QuestGenerator["generateQuest"]>[]): void {
  const quest = questGenerator.generateQuest();
  activeQuests.push(quest);
  console.log(`\n${symbols.quest} ${colors.mystical(colors.bold(quest.title))}`);
  console.log(`  ${quest.description}`);
  console.log(`  difficulty: ${colors.warning(quest.difficulty)}  reward: ${formatGold(quest.reward)}`);
}

function completeQuest(
  engine: GoblinEngine,
  activeQuests: ReturnType<QuestGenerator["generateQuest"]>[]
): void {
  const quest = activeQuests.pop();
  if (!quest) {
    console.log(colors.warning("No active quests. Try quest first."));
    return;
  }
  engine.getEmpire().gold += quest.reward;
  console.log(`\n${colors.success("Quest complete")}: ${colors.mystical(quest.title)}`);
  console.log(`  reward added: ${formatGold(quest.reward)}`);
}

function listQuests(activeQuests: ReturnType<QuestGenerator["generateQuest"]>[]): void {
  console.log(`\n${colors.title(colors.bold("Active Quests"))}`);
  if (activeQuests.length === 0) {
    console.log(colors.dim("  No quests yet. Try quest."));
    return;
  }
  activeQuests.forEach((quest, index) => {
    console.log(`  ${index + 1}. ${colors.mystical(quest.title)} ${colors.warning(`[${quest.difficulty}]`)}`);
    console.log(`     ${quest.description}`);
  });
}

function stealTreasure(engine: GoblinEngine): void {
  const treasure = treasureSystem.generateTreasure();
  const empire = engine.getEmpire();
  empire.hoard.push(treasure);
  empire.gold += treasure.value;
  console.log(`\n${symbols.treasure} ${colors.treasure(colors.bold(treasure.name))}`);
  console.log(`  rarity: ${colors.mystical(treasure.rarity)}  value: ${formatGold(treasure.value)}`);
  console.log(`  ${treasure.description}`);
}

function listHoard(engine: GoblinEngine): void {
  const { hoard } = engine.getEmpire();
  console.log(`\n${colors.title(colors.bold("Treasure Hoard"))}`);
  if (hoard.length === 0) {
    console.log(colors.dim("  Empty. Try steal."));
    return;
  }
  hoard.forEach((treasure, index) => {
    console.log(`  ${index + 1}. ${colors.treasure(treasure.name)} ${colors.mystical(`[${treasure.rarity}]`)} ${formatGold(treasure.value)}`);
  });
  console.log(`  total: ${formatGold(treasureSystem.calculateTotalValue(hoard))}`);
}

function upgradeLair(engine: GoblinEngine): void {
  const empire = engine.getEmpire();
  const cost = empire.lairLevel * 200;
  if (empire.gold < cost) {
    console.log(colors.warning(`Need ${formatGold(cost)} to upgrade. You have ${formatGold(empire.gold)}.`));
    return;
  }
  empire.gold -= cost;
  empire.lairLevel = lair.upgradeLair();
  console.log(`\n${colors.success("Lair upgraded")} to level ${empire.lairLevel}. Cost: ${formatGold(cost)}`);
}

function learnSpell(engine: GoblinEngine): void {
  const empire = engine.getEmpire();
  const unknownSpells = spellsData.filter((spell) => !empire.spellsLearned.includes(spell.name));
  if (unknownSpells.length === 0) {
    console.log(colors.warning("You already know every spell in this grimoire."));
    return;
  }
  const spell = getRandomItem(unknownSpells);
  empire.spellsLearned.push(spell.name);
  console.log(`\n${symbols.spell} learned ${colors.mystical(colors.bold(spell.name))}`);
  console.log(`  ${spell.effect}`);
}

function castSpell(engine: GoblinEngine): void {
  const empire = engine.getEmpire();
  if (empire.spellsLearned.length === 0) {
    console.log(colors.warning("No spells learned. Try learn."));
    return;
  }
  const spellName = getRandomItem(empire.spellsLearned);
  const spell = spellsData.find((item) => item.name === spellName);
  if (!spell) {
    console.log(colors.warning("That spell fizzled in the index."));
    return;
  }
  if (empire.gold < spell.cost) {
    console.log(colors.warning(`Need ${formatGold(spell.cost)} to cast ${spell.name}. You have ${formatGold(empire.gold)}.`));
    return;
  }
  empire.gold -= spell.cost;
  console.log(`\n${symbols.sparkles} cast ${colors.mystical(colors.bold(spell.name))}`);
  console.log(`  ${spell.effect}`);
  console.log(`  cost: ${formatGold(spell.cost)}`);
}

async function askOracleFromMode(question: string): Promise<void> {
  if (!question) {
    console.log(colors.warning("Ask needs a question. Example: ask review this repo for missing tests"));
    return;
  }

  console.log(`\n${symbols.spell} ${colors.title(colors.bold("OpenAI code oracle"))}`);
  console.log(colors.dim("Reading this repo and preparing a practical report..."));

  try {
    const result = await askCodeOracle(question, ".");
    console.log(colors.dim(`Read ${result.filesRead} files.`));
    console.log(`\n${colors.title(colors.bold("Oracle Report"))}`);
    console.log(result.answer);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(colors.warning(message));
    if (message.includes("OPENAI_API_KEY")) {
      console.log(colors.dim('Set it with: export OPENAI_API_KEY="your_api_key_here"'));
    }
  }
}
