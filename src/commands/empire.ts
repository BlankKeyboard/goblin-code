import { Command } from "commander";
import { goblinCommand } from "./goblin.js";
import { hoardCommand } from "./hoard.js";
import { lairCommand } from "./lair.js";
import { questCommand } from "./quest.js";
import { spellCommand } from "./spells.js";
import { runGoblinMode } from "./goblinMode.js";
import { GoblinEngine } from "../systems/goblinEngine.js";

export async function runEmpireCommand(args: string[]): Promise<void> {
  const engine = new GoblinEngine();

  if (args[0] === "goblin" && args[1] === "mode") {
    await runGoblinMode(engine);
    return;
  }

  const program = new Command();

  program
    .name("goblin-code")
    .description("A tiny goblin empire simulator tucked inside the developer CLI.")
    .exitOverride();

  goblinCommand(program, engine);
  hoardCommand(program, engine);
  lairCommand(program, engine);
  questCommand(program, engine);
  spellCommand(program, engine);

  program.parse(["node", "goblin-code", ...args]);
}
