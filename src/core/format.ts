import type { InspectionReport, QuestPlan } from "../types.js";

const accent = "\x1b[32m";
const dim = "\x1b[2m";
const bold = "\x1b[1m";
const reset = "\x1b[0m";

export function banner(): string {
  return [
    `${accent}${bold}Goblin-code${reset} ${dim}workshop CLI for unruly ideas${reset}`,
    ""
  ].join("\n");
}

export function formatPlan(plan: QuestPlan): string {
  return [
    banner(),
    `${bold}${plan.codename}${reset}`,
    plan.pitch,
    "",
    `${accent}Omen${reset}: ${plan.omen}`,
    "",
    section("Quests", plan.quests),
    section("Rules of the Burrow", plan.constraints),
    `${accent}Starter Structure${reset}`,
    ...plan.structure.map((file) => `  ${file.path.padEnd(24)} ${dim}${file.purpose}${reset}`),
    "",
    section("Next Commands", plan.nextCommands)
  ].join("\n");
}

export function formatInspection(report: InspectionReport): string {
  return [
    banner(),
    `${bold}Inspection: ${report.target}${reset}`,
    `Files: ${report.filesSeen}  Directories: ${report.directoriesSeen}`,
    "",
    section("Signals", report.signals),
    section("Suggestions", report.suggestions)
  ].join("\n");
}

export function section(title: string, rows: string[]): string {
  return [
    `${accent}${title}${reset}`,
    ...rows.map((row) => `  - ${row}`),
    ""
  ].join("\n");
}

export function printJson(value: unknown): void {
  console.log(JSON.stringify(value, null, 2));
}
