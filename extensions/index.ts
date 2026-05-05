import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

const DEFAULT_BASE_URL = process.env.NAN_BUILDERS_URL ?? "https://api.nan.builders/v1";
const API_KEY = process.env.NAN_BUILDERS_API_KEY;

async function fetchAvailableModels(): Promise<
  Array<{ id: string; name?: string }>
> {
  const response = await fetch(`${DEFAULT_BASE_URL}/models`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`);
  }
  const payload = (await response.json()) as {
    data: Array<{ id: string; name?: string }>;
  };
  return payload.data;
}

export default async function (pi: ExtensionAPI) {
  let models: Array<{
    id: string;
    name: string;
    reasoning: boolean;
    input: ("text" | "image")[];
    cost: { input: number; output: number; cacheRead: number; cacheWrite: number };
    contextWindow: number;
    maxTokens: number;
    compat?: {
      supportsDeveloperRole: boolean;
      supportsReasoningEffort: boolean;
    };
  }>;

  try {
    const remoteModels = await fetchAvailableModels();
    models = remoteModels.map((model) => ({
      id: model.id,
      name: model.name ?? model.id,
      reasoning: true,
      input: ["text", "image"],
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 262144,
      maxTokens: 131072,
      compat: {
        supportsDeveloperRole: false,
        supportsReasoningEffort: false,
      },
    }));
    console.log(`[nan-builders] Discovered ${models.length} model(s) from ${DEFAULT_BASE_URL}`);
  } catch (error) {
    console.error(
      "[nan-builders] Model endpoint unreachable at",
      DEFAULT_BASE_URL,
      "- provider will have no models available.",
      error instanceof Error ? error.message : "",
    );
    models = [];
  }

  pi.registerProvider("nan-builders", {
    baseUrl: DEFAULT_BASE_URL,
    apiKey: API_KEY,
    api: "openai-completions",
    models,
  });
}
