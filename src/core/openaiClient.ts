export interface OpenAiTextOptions {
  instructions: string;
  input: string;
  model?: string;
}

interface OpenAiResponseBody {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      text?: string;
      type?: string;
    }>;
    type?: string;
  }>;
  error?: {
    message?: string;
  };
}

const responsesUrl = "https://api.openai.com/v1/responses";

export async function createOpenAiText(options: OpenAiTextOptions): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set. Export it first, then run the command again.");
  }

  const response = await fetch(responsesUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: options.model ?? process.env.GOBLIN_OPENAI_MODEL ?? "gpt-5",
      instructions: options.instructions,
      input: options.input
    })
  });

  const body = await response.json() as OpenAiResponseBody;

  if (!response.ok) {
    throw new Error(body.error?.message ?? `OpenAI request failed with status ${response.status}.`);
  }

  const text = extractResponseText(body);

  if (!text) {
    throw new Error("OpenAI returned no text output.");
  }

  return text.trim();
}

function extractResponseText(body: OpenAiResponseBody): string {
  if (body.output_text) {
    return body.output_text;
  }

  const chunks: string[] = [];

  for (const item of body.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.text) {
        chunks.push(content.text);
      }
    }
  }

  return chunks.join("\n");
}
