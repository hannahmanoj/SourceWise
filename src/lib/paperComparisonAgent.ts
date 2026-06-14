import type { PaperComparison, ResearchPaper } from "@/types/research";

type ChatCompletionsResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
};

const MODEL_REQUEST_TIMEOUT_MS = Number(
  process.env.COMPARISON_AGENT_TIMEOUT_MS ?? 20_000,
);

export async function comparePapersWithAI(
  topic: string,
  papers: [ResearchPaper, ResearchPaper],
): Promise<PaperComparison> {
  const comparison = await callConfiguredComparisonAgent(topic, papers).catch(
    (error: unknown) => {
      console.error("Paper Comparison Agent unavailable:", error);
      return null;
    },
  );

  return comparison ?? createFallbackComparison(topic, papers);
}

async function callConfiguredComparisonAgent(
  topic: string,
  papers: [ResearchPaper, ResearchPaper],
) {
  const githubToken = getGitHubModelsToken();

  if (githubToken) {
    return callChatCompletionsComparisonAgent({
      apiKey: githubToken,
      endpoint:
        process.env.GITHUB_MODELS_ENDPOINT ?? "https://models.github.ai/inference",
      label: "GitHub Models Paper Comparison Agent",
      model: getGitHubModelsModel(),
      papers,
      topic,
    });
  }

  if (
    process.env.AZURE_AI_FOUNDRY_ENDPOINT &&
    process.env.AZURE_AI_FOUNDRY_API_KEY &&
    process.env.AZURE_AI_FOUNDRY_MODEL
  ) {
    return callChatCompletionsComparisonAgent({
      apiKey: process.env.AZURE_AI_FOUNDRY_API_KEY,
      endpoint: process.env.AZURE_AI_FOUNDRY_ENDPOINT,
      label: "Azure Paper Comparison Agent",
      model: process.env.AZURE_AI_FOUNDRY_MODEL,
      papers,
      topic,
    });
  }

  return null;
}

async function callChatCompletionsComparisonAgent({
  apiKey,
  endpoint,
  label,
  model,
  papers,
  topic,
}: {
  apiKey: string;
  endpoint: string;
  label: string;
  model: string;
  papers: [ResearchPaper, ResearchPaper];
  topic: string;
}): Promise<PaperComparison> {
  const response = await fetch(getChatCompletionsUrl(endpoint), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(MODEL_REQUEST_TIMEOUT_MS),
    body: JSON.stringify({
      model,
      messages: createComparisonMessages(topic, papers),
      temperature: 0.2,
      max_tokens: 650,
    }),
  });

  if (!response.ok) {
    throw new Error(await createModelErrorMessage(label, response));
  }

  const data = (await response.json()) as ChatCompletionsResponse;
  const outputText = data.choices?.[0]?.message?.content;

  if (!outputText) {
    throw new Error(`${label} returned no comparison text.`);
  }

  return normalizeComparison(JSON.parse(extractJsonObject(outputText)), topic, papers);
}

function createComparisonMessages(
  topic: string,
  papers: [ResearchPaper, ResearchPaper],
) {
  return [
    {
      role: "system",
      content:
        "You compare two academic papers for a student. Return only valid JSON with these keys: agreement, disagreement, methodDifference, dissertationUse. Be concise, concrete, and do not invent methods beyond the supplied summaries.",
    },
    {
      role: "user",
      content: JSON.stringify({
        topic,
        instruction:
          "Compare these two papers. Explain how they agree, how they differ, what method/evidence difference a student should check, and how each could be used in a dissertation or research essay.",
        papers: papers.map((paper) => ({
          title: paper.title,
          year: paper.year,
          authors: paper.authors,
          venue: paper.venue,
          type: paper.type,
          citations: paper.citations,
          summary: paper.whyItMatters,
        })),
      }),
    },
  ];
}

function normalizeComparison(
  value: unknown,
  topic: string,
  papers: [ResearchPaper, ResearchPaper],
): PaperComparison {
  const payload =
    value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const fallback = createFallbackComparison(topic, papers);

  return {
    agreement: getText(payload.agreement, fallback.agreement),
    disagreement: getText(payload.disagreement, fallback.disagreement),
    methodDifference: getText(
      payload.methodDifference,
      fallback.methodDifference,
    ),
    dissertationUse: getText(payload.dissertationUse, fallback.dissertationUse),
  };
}

function createFallbackComparison(
  topic: string,
  papers: [ResearchPaper, ResearchPaper],
): PaperComparison {
  const [firstPaper, secondPaper] = papers;

  return {
    agreement: `Both papers can support research on ${topic}, but they appear to approach the topic from different source contexts.`,
    disagreement: `${firstPaper.title} is stronger for claims connected to ${firstPaper.type.toLowerCase()}, while ${secondPaper.title} may be more useful for a different angle or evidence base.`,
    methodDifference:
      "Compare the abstracts, methods, sample, and publication venue before deciding which paper carries the stronger evidence.",
    dissertationUse: `Use ${firstPaper.title} to establish one side of the argument and ${secondPaper.title} to add contrast, context, or a second evidence stream.`,
  };
}

function getGitHubModelsToken() {
  return (
    process.env.GITHUB_MODELS_TOKEN ??
    process.env.GITHUB_TOKEN ??
    process.env.GH_TOKEN ??
    null
  );
}

function getGitHubModelsModel() {
  const configuredModel =
    process.env.GITHUB_MODELS_MODEL ?? "microsoft/Phi-4-mini-instruct";
  const normalizedModel = configuredModel.trim().toLowerCase();

  if (
    normalizedModel === "gpt-4o mini" ||
    normalizedModel === "gpt-4o-mini" ||
    normalizedModel === "microsoft/gpt-4o mini" ||
    normalizedModel === "microsoft/gpt-4o-mini" ||
    normalizedModel === "openai/gpt-4o mini"
  ) {
    return "openai/gpt-4o-mini";
  }

  return configuredModel.trim();
}

function getChatCompletionsUrl(endpoint: string) {
  const normalizedEndpoint = endpoint.replace(/\/$/, "");

  if (normalizedEndpoint.endsWith("/chat/completions")) {
    return normalizedEndpoint;
  }

  return `${normalizedEndpoint}/chat/completions`;
}

function extractJsonObject(text: string) {
  const trimmedText = text.trim();

  if (trimmedText.startsWith("{") && trimmedText.endsWith("}")) {
    return trimmedText;
  }

  const startIndex = trimmedText.indexOf("{");
  const endIndex = trimmedText.lastIndexOf("}");

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    throw new Error("Paper Comparison Agent did not return JSON.");
  }

  return trimmedText.slice(startIndex, endIndex + 1);
}

async function createModelErrorMessage(label: string, response: Response) {
  const retryAfter = response.headers.get("retry-after");
  const details = truncateErrorDetails(await response.text().catch(() => ""));
  const retryMessage = retryAfter ? ` Retry after: ${retryAfter}s.` : "";
  const detailMessage = details ? ` Details: ${details}` : "";

  return `${label} failed: ${response.status}.${retryMessage}${detailMessage}`;
}

function truncateErrorDetails(text: string) {
  const compactText = text.replace(/\s+/g, " ").trim();

  if (compactText.length <= 300) {
    return compactText;
  }

  return `${compactText.slice(0, 297)}...`;
}

function getText(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : fallback;
}
