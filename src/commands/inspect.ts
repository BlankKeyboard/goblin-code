import { existsSync } from "node:fs";
import { inspectProject } from "../core/inspect.js";
import { formatInspection, printJson } from "../core/format.js";
import type { CliContext } from "../types.js";

export function runInspect(context: CliContext): void {
  const target = context.args[0] ?? ".";

  if (!existsSync(target)) {
    throw new Error(`Cannot inspect "${target}" because it does not exist.`);
  }

  const report = inspectProject(target);

  if (context.json) {
    printJson(report);
    return;
  }

  console.log(formatInspection(report));
}
