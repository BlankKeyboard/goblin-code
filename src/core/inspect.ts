import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import type { InspectionReport } from "../types.js";

const ignored = new Set([".git", "node_modules", "dist", ".next", "coverage"]);

export function inspectProject(target: string): InspectionReport {
  let filesSeen = 0;
  let directoriesSeen = 0;
  const names = new Set<string>();

  walk(target, target, (entry, isDirectory) => {
    names.add(entry);
    if (isDirectory) {
      directoriesSeen += 1;
    } else {
      filesSeen += 1;
    }
  });

  const packageScripts = readPackageScripts(target);
  const signals = buildSignals(names, filesSeen, packageScripts);

  return {
    target,
    filesSeen,
    directoriesSeen,
    signals,
    suggestions: buildSuggestions(names, signals, packageScripts)
  };
}

function walk(root: string, current: string, visit: (entry: string, isDirectory: boolean) => void): void {
  for (const dirent of readdirSync(current, { withFileTypes: true })) {
    if (ignored.has(dirent.name)) {
      continue;
    }

    const fullPath = join(current, dirent.name);
    const display = relative(root, fullPath) || dirent.name;
    visit(display, dirent.isDirectory());

    if (dirent.isDirectory()) {
      walk(root, fullPath, visit);
    } else {
      statSync(fullPath);
    }
  }
}

function buildSignals(names: Set<string>, filesSeen: number, packageScripts: Set<string>): string[] {
  const signals: string[] = [];

  if (names.has("package.json")) signals.push("Node project detected.");
  if (names.has("tsconfig.json")) signals.push("TypeScript configuration detected.");
  if (names.has("README.md")) signals.push("README present.");
  if (hasPrefix(names, "src/")) signals.push("Source directory present.");
  if (packageScripts.has("smoke")) signals.push("Smoke script present.");
  if (hasPrefix(names, "test/") || hasPrefix(names, "tests/")) signals.push("Test directory present.");
  if (filesSeen === 0) signals.push("The burrow is empty.");

  return signals.length > 0 ? signals : ["No obvious project markers found yet."];
}

function buildSuggestions(names: Set<string>, signals: string[], packageScripts: Set<string>): string[] {
  const suggestions: string[] = [];

  if (!names.has("README.md")) suggestions.push("Add a README with one install command and three examples.");
  if (!names.has("package.json")) suggestions.push("Add package metadata so the CLI can be installed.");
  if (!hasPrefix(names, "src/")) suggestions.push("Create src/ and keep command logic out of the entrypoint.");
  if (!signals.some((signal) => signal.includes("Test")) && !packageScripts.has("smoke")) {
    suggestions.push("Add one smoke test command that proves the CLI boots.");
  }

  suggestions.push("Keep one weird, memorable command. That is where the goblin charm lives.");
  return suggestions;
}

function readPackageScripts(target: string): Set<string> {
  const scripts = new Set<string>();

  try {
    const packageJson = JSON.parse(readFileSync(join(target, "package.json"), "utf8")) as {
      scripts?: Record<string, string>;
    };

    for (const script of Object.keys(packageJson.scripts ?? {})) {
      scripts.add(script);
    }
  } catch {
    return scripts;
  }

  return scripts;
}

function hasPrefix(names: Set<string>, prefix: string): boolean {
  for (const name of names) {
    if (name.startsWith(prefix)) return true;
  }

  return false;
}
