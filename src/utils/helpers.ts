import { colors } from "./colors.js";

export function printHeader(title: string): void {
  console.log(`\n${colors.goblin(title)}`);
  console.log(colors.goblin("=".repeat(stripAnsi(title).length)));
}

export function printSuccess(message: string): void {
  console.log(colors.success(message));
}

export function printInfo(message: string): void {
  console.log(colors.info(message));
}

export function printWarning(message: string): void {
  console.log(colors.warning(message));
}

export function formatGold(value: number): string {
  return colors.treasure(`${value} gold`);
}

export function getRandomItem<T>(items: readonly T[]): T {
  if (items.length === 0) {
    throw new Error("Cannot pick from an empty list.");
  }

  return items[Math.floor(Math.random() * items.length)];
}

function stripAnsi(value: string): string {
  return value.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, "");
}
