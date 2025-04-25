import { goblinAdjectives, goblinNouns, omens } from "../data/goblinWords.js";
import type { QuestPlan } from "../types.js";
import { pick, stableHash } from "./hash.js";

export function conjurePlan(idea: string): QuestPlan {
  const cleanIdea = idea.trim() || "a mysterious tool";
  const seed = stableHash(cleanIdea.toLowerCase());
  const adjective = pick(goblinAdjectives, seed, 1);
  const noun = pick(goblinNouns, seed, 7);
  const codename = `${capitalize(adjective)} ${capitalize(noun)}`;

  return {
    codename,
    pitch: `A CLI concept that turns "${cleanIdea}" into a tangible, shippable artifact.`,
    omen: pick(omens, seed, 3),
    quests: [
      `Forge one delightful command around: ${cleanIdea}.`,
      "Add a plain JSON mode so the magic can feed other tools.",
      "Make the default output beautiful enough that people want to run it twice.",
      "Create one inspection command that helps users understand their current workspace."
    ],
    constraints: [
      "No network required for the core experience.",
      "Every command must have a useful non-interactive path.",
      "Prefer small composable modules over one giant spellbook.",
      "Keep the first run under ten seconds, even on a sleepy laptop."
    ],
    structure: [
      { path: "src/cli.ts", purpose: "entrypoint and command routing" },
      { path: "src/commands/", purpose: "one file per command" },
      { path: "src/core/", purpose: "reusable workshop logic" },
      { path: "src/data/", purpose: "names, omens, templates" },
      { path: "README.md", purpose: "quickstart and examples" }
    ],
    nextCommands: [
      "npm install",
      "npm run build",
      `node dist/cli.js conjure ${JSON.stringify(cleanIdea)}`,
      "node dist/cli.js inspect ."
    ]
  };
}

export function goblinName(input: string): string {
  const seed = stableHash(input.trim().toLowerCase() || "nameless");
  return `${capitalize(pick(goblinAdjectives, seed, 2))} ${capitalize(pick(goblinNouns, seed, 5))}`;
}

export function rune(input: string): string {
  const alphabet = ["ka", "zu", "mog", "rik", "ven", "lo", "brak", "tin", "sha", "gur"];
  const seed = stableHash(input.trim().toLowerCase() || "rune");
  const parts = Array.from({ length: 4 }, (_, index) => pick(alphabet, seed, index * 3));
  return parts.join("-");
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
