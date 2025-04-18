import { goblinName, rune } from "../core/conjure.js";
import { banner, printJson } from "../core/format.js";
import type { CliContext } from "../types.js";

export function runName(context: CliContext): void {
  const input = context.args.join(" ");
  const name = goblinName(input);

  if (context.json) {
    printJson({ input, name });
    return;
  }

  console.log(`${banner()}${name}`);
}

export function runRune(context: CliContext): void {
  const input = context.args.join(" ");
  const value = rune(input);

  if (context.json) {
    printJson({ input, rune: value });
    return;
  }

  console.log(`${banner()}${value}`);
}
