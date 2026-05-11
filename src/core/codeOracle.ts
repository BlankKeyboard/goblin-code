import { collectRepoContext, formatRepoContext } from "./repoContext.js";
import { createOpenAiText } from "./openaiClient.js";

export interface CodeOracleResult {
  answer: string;
  filesRead: number;
}

const instructions = `You are Goblin-code's practical code oracle.
Answer like a clever goblin engineer: punchy, mischievous, practical.
Use goblin-flavored labels such as "Burrow Read", "Shiny Fixes", "First Spell", or "Risky Runes".
Keep the goblin style present, but make the advice genuinely useful.
Do not pretend you inspected files that are not in the provided context.
Prefer specific file paths, concrete next steps, and small safe changes.
Limit the response to 180 words.
Use at most 4 bullets.
Do not include long code blocks.
Do not write a normal corporate review.
End with exactly one concrete next command or file to open.`;

export async function askCodeOracle(question: string, target = "."): Promise<CodeOracleResult> {
  const repoContext = collectRepoContext(target);
  const input = [
    `User request: ${question}`,
    "",
    "Codebase context:",
    formatRepoContext(repoContext)
  ].join("\n");

  const answer = clampOracleAnswer(await createOpenAiText({
    instructions,
    input
  }));

  return {
    answer,
    filesRead: repoContext.files.length
  };
}

function clampOracleAnswer(answer: string): string {
  const words = answer.trim().split(/\s+/);

  if (words.length <= 220) {
    return answer.trim();
  }

  return `${words.slice(0, 220).join(" ")}\n\n${"[snip] Oracle got too chatty. Ask a narrower question for more."}`;
}
