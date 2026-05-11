import { existsSync } from "node:fs";
import { colors, symbols } from "../utils/colors.js";
import { printHeader, printInfo } from "../utils/helpers.js";
import { askCodeOracle } from "../core/codeOracle.js";
import type { CliContext } from "../types.js";

export async function runOracle(context: CliContext): Promise<void> {
  const { question, target } = parseOracleArgs(context.args);

  if (!question) {
    throw new Error("Usage: goblin-code oracle <question> [path]");
  }

  if (!existsSync(target)) {
    throw new Error(`Cannot read "${target}" because it does not exist.`);
  }

  printHeader(`${symbols.spell} Consulting the code oracle`);
  const result = await askCodeOracle(question, target);
  printInfo(`Read ${result.filesRead} files from ${target}`);

  console.log(`\n${colors.title(colors.bold("Oracle Report"))}`);
  console.log(result.answer);
}

function parseOracleArgs(args: string[]): { question: string; target: string } {
  if (args.length === 0) {
    return { question: "", target: "." };
  }

  if (args.length === 1) {
    return { question: args[0], target: "." };
  }

  return {
    question: args.slice(0, -1).join(" "),
    target: args[args.length - 1]
  };
}
