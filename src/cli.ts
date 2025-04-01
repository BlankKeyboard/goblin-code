#!/usr/bin/env node
import { runConjure } from "./commands/conjure.js";
import { runHorde } from "./commands/horde.js";
import { runInspect } from "./commands/inspect.js";
import { runName, runRune } from "./commands/name.js";
import { runEmpireCommand } from "./commands/empire.js";
import { banner } from "./core/format.js";
import type { CliContext } from "./types.js";

const help = `${banner()}Usage:
  goblin-code conjure <idea> [--json]
  goblin-code name <words> [--json]
  goblin-code rune <words> [--json]
  goblin-code inspect [path] [--json]
  goblin-code horde
  goblin-code goblin recruit
  goblin-code quest generate
  goblin-code hoard steal
  goblin-code lair view
  goblin-code spell learn

Examples:
  goblin-code conjure "a CLI for finishing side projects"
  goblin-code name "terminal habit tracker"
  goblin-code inspect .
  goblin-code goblin recruit
`;

main(process.argv.slice(2));

function main(rawArgs: string[]): void {
  const { command, context } = parse(rawArgs);

  try {
    switch (command) {
      case "conjure":
        runConjure(context);
        break;
      case "name":
        runName(context);
        break;
      case "rune":
        runRune(context);
        break;
      case "inspect":
        runInspect(context);
        break;
      case "horde":
        runHorde();
        break;
      case "goblin":
      case "quest":
      case "hoard":
      case "lair":
      case "spell":
        runEmpireCommand(rawArgs);
        break;
      case "help":
      case "--help":
      case "-h":
      case undefined:
        console.log(help);
        break;
      case "version":
      case "--version":
      case "-v":
        console.log("0.1.0");
        break;
      default:
        throw new Error(`Unknown command "${command}". Run goblin-code --help.`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Goblin-code tripped over a wire: ${message}`);
    process.exitCode = 1;
  }
}

function parse(rawArgs: string[]): { command: string | undefined; context: CliContext } {
  const json = rawArgs.includes("--json");
  const args = rawArgs.filter((arg) => arg !== "--json");
  const [command, ...rest] = args;

  return {
    command,
    context: {
      args: rest,
      json
    }
  };
}
