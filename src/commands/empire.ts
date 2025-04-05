import { Command } from "commander";
import { goblinCommand } from "./goblin.js";
import { hoardCommand } from "./hoard.js";
import { lairCommand } from "./lair.js";
import { questCommand } from "./quest.js";
import { spellCommand } from "./spells.js";
import { GoblinEngine } from "../systems/goblinEngine.js";

export function runEmpireCommand(args: string[]): void {
  const program = new Command();
  const engine = new GoblinEngine();

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
