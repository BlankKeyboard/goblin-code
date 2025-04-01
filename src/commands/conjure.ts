import { conjurePlan } from "../core/conjure.js";
import { formatPlan, printJson } from "../core/format.js";
import type { CliContext } from "../types.js";

export function runConjure(context: CliContext): void {
  const idea = context.args.join(" ");
  const plan = conjurePlan(idea);

  if (context.json) {
    printJson(plan);
    return;
  }

  console.log(formatPlan(plan));
}
