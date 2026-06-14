import type {
  AcademicLevel,
  DebatePaper,
  DebateSide,
  ResearchDebate,
  ResearchMap,
  ResearchPaper,
} from "@/types/research";

type ChatCompletionsResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
};

type DebateAgentResponse = {
  debates?: DebateAgentDebate[];
};

type DebateAgentDebate = {
  question?: unknown;
  explanation?: unknown;
  sides?: DebateAgentSide[];
};

type DebateAgentSide = {
  stance?: unknown;
  paperIds?: unknown;
};

const MODEL_REQUEST_TIMEOUT_MS = Number(
  process.env.DEBATE_AGENT_TIMEOUT_MS ?? 20_000,
);
const MAX_DEBATE_PAPERS = 8;

export async function generateDebates(
  topic: string,
  researchMap: ResearchMap,
  papers: ResearchPaper[],
  academicLevel: AcademicLevel,
): Promise<ResearchDebate[]> {
  const agentDebates = await callConfiguredDebateAgent(
    topic,
    researchMap,
    papers,
    academicLevel,
  ).catch((error: unknown) => {
    console.error("Debate Agent unavailable:", error);
    return null;
  });

  return normalizeDebates(
    topic,
    researchMap,
    papers,
    agentDebates,
    academicLevel,
  );
}

async function callConfiguredDebateAgent(
  topic: string,
  researchMap: ResearchMap,
  papers: ResearchPaper[],
  academicLevel: AcademicLevel,
) {
  const githubToken = getGitHubModelsToken();

  if (githubToken) {
    return callChatCompletionsDebateAgent({
      apiKey: githubToken,
      endpoint:
        process.env.GITHUB_MODELS_ENDPOINT ?? "https://models.github.ai/inference",
      label: "GitHub Models Debate Agent",
      model: getGitHubModelsModel(),
      papers,
      researchMap,
      topic,
      academicLevel,
    });
  }

  if (
    process.env.AZURE_AI_FOUNDRY_ENDPOINT &&
    process.env.AZURE_AI_FOUNDRY_API_KEY &&
    process.env.AZURE_AI_FOUNDRY_MODEL
  ) {
    return callChatCompletionsDebateAgent({
      apiKey: process.env.AZURE_AI_FOUNDRY_API_KEY,
      endpoint: process.env.AZURE_AI_FOUNDRY_ENDPOINT,
      label: "Azure Debate Agent",
      model: process.env.AZURE_AI_FOUNDRY_MODEL,
      papers,
      researchMap,
      topic,
      academicLevel,
    });
  }

  return null;
}

async function callChatCompletionsDebateAgent({
  academicLevel,
  apiKey,
  endpoint,
  label,
  model,
  papers,
  researchMap,
  topic,
}: {
  academicLevel: AcademicLevel;
  apiKey: string;
  endpoint: string;
  label: string;
  model: string;
  papers: ResearchPaper[];
  researchMap: ResearchMap;
  topic: string;
}) {
  const response = await fetch(getChatCompletionsUrl(endpoint), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(MODEL_REQUEST_TIMEOUT_MS),
    body: JSON.stringify({
      model,
      messages: createDebateMessages(topic, researchMap, papers, academicLevel),
      temperature: 0.2,
      max_tokens: 850,
    }),
  });

  if (!response.ok) {
    throw new Error(await createModelErrorMessage(label, response));
  }

  const data = (await response.json()) as ChatCompletionsResponse;
  const outputText = data.choices?.[0]?.message?.content;

  if (!outputText) {
    return null;
  }

  return JSON.parse(extractJsonObject(outputText)) as DebateAgentResponse;
}

function createDebateMessages(
  topic: string,
  researchMap: ResearchMap,
  papers: ResearchPaper[],
  academicLevel: AcademicLevel,
) {
  return [
    {
      role: "system",
      content:
        "You are the SourceWise Debate Agent. Return only JSON. Create 3 debates that reveal meaningful disagreement, tension, or uncertainty in the research landscape. Each debate must have question, explanation, and sides. Each side must include stance and paperIds. Never claim certainty.",
    },
    {
      role: "user",
      content: JSON.stringify({
        topic,
        academicLevel,
        themes: researchMap.themes.map((theme) => ({
          name: theme.name,
          explanation: theme.explanation,
          debateQuestions: theme.debateQuestions,
          paperTitles: theme.paperTitles,
        })),
        papers: papers.slice(0, MAX_DEBATE_PAPERS).map((paper, index) => ({
          id: getPaperId(paper, index),
          title: paper.title,
          year: paper.year,
          citations: paper.citations,
          type: paper.type,
          summary: paper.whyItMatters,
        })),
        outputShape:
          "{\"debates\":[{\"question\":\"question\",\"explanation\":\"short explanation\",\"sides\":[{\"stance\":\"stance label\",\"paperIds\":[\"paper id\"]},{\"stance\":\"opposing or complicating stance\",\"paperIds\":[\"paper id\"]}]}]}",
      }),
    },
  ];
}

function normalizeDebates(
  topic: string,
  researchMap: ResearchMap,
  papers: ResearchPaper[],
  response: DebateAgentResponse | null,
  academicLevel: AcademicLevel,
): ResearchDebate[] {
  const paperIds = new Set(papers.map((paper, index) => getPaperId(paper, index)));
  const debates = response?.debates ?? [];
  const normalizedDebates = debates
    .slice(0, 3)
    .map((debate, index) => {
      const sides = normalizeSides(debate.sides, paperIds, papers, index);
      const flattenedPapers = sidesToDebatePapers(sides, papers);

      return {
        question: getText(
          debate.question,
          researchMap.themes[index]?.debateQuestions[0] ??
            `What is still debated in research on ${topic}?`,
        ),
        explanation: getText(
          debate.explanation,
          getFallbackDebateExplanation(topic, academicLevel),
        ),
        sides,
        papers: flattenedPapers,
      };
    })
    .filter((debate) => debate.sides.length >= 2 && debate.papers.length > 0);

  if (normalizedDebates.length >= 3) {
    return normalizedDebates;
  }

  return createFallbackDebates(topic, researchMap, papers, academicLevel);
}

function normalizeSides(
  sides: DebateAgentSide[] | undefined,
  validPaperIds: Set<string>,
  papers: ResearchPaper[],
  debateIndex: number,
): DebateSide[] {
  const normalizedSides = Array.isArray(sides)
    ? sides
        .slice(0, 3)
        .map((side, sideIndex) => {
          const paperIds = Array.isArray(side.paperIds)
            ? side.paperIds
                .filter((paperId): paperId is string => typeof paperId === "string")
                .filter((paperId) => validPaperIds.has(paperId))
                .slice(0, 3)
            : [];

          return {
            stance: getText(side.stance, `Side ${sideIndex + 1}`),
            paperIds,
          };
        })
        .filter((side) => side.paperIds.length > 0)
    : [];

  if (normalizedSides.length >= 2) {
    return normalizedSides;
  }

  return [
    {
      stance: "Supports one interpretation",
      paperIds: papers
        .slice(debateIndex * 2, debateIndex * 2 + 2)
        .map((paper, index) => getPaperId(paper, debateIndex * 2 + index)),
    },
    {
      stance: "Complicates or challenges it",
      paperIds: papers
        .slice(debateIndex * 2 + 2, debateIndex * 2 + 4)
        .map((paper, index) => getPaperId(paper, debateIndex * 2 + 2 + index)),
    },
  ].filter((side) => side.paperIds.length > 0);
}

function createFallbackDebates(
  topic: string,
  researchMap: ResearchMap,
  papers: ResearchPaper[],
  academicLevel: AcademicLevel,
): ResearchDebate[] {
  return researchMap.themes.slice(0, 3).map((theme, index) => {
    const sides = normalizeSides(undefined, new Set(), papers, index);

    return {
      question:
        theme.debateQuestions[0] ??
        `What should a ${academicLevel} student question about ${theme.name}?`,
      explanation: getFallbackDebateExplanation(topic, academicLevel),
      sides,
      papers: sidesToDebatePapers(sides, papers),
    };
  });
}

function sidesToDebatePapers(
  sides: DebateSide[],
  papers: ResearchPaper[],
): DebatePaper[] {
  return sides.flatMap((side) =>
    side.paperIds
      .map((paperId) => papers.find((paper, index) => getPaperId(paper, index) === paperId))
      .filter((paper): paper is ResearchPaper => Boolean(paper))
      .map((paper) => ({
        title: paper.title,
        stance: side.stance,
      })),
  );
}

function getFallbackDebateExplanation(
  topic: string,
  academicLevel: AcademicLevel,
) {
  if (academicLevel === "PhD") {
    return `This debate points to a possible research gap or methodological tension in ${topic}.`;
  }

  if (academicLevel === "Master's") {
    return `This debate helps compare evidence quality and competing interpretations in ${topic}.`;
  }

  return `This debate helps show that researchers may frame ${topic} in different ways.`;
}

function getPaperId(paper: ResearchPaper, index: number) {
  return paper.id ?? createPaperId(paper.title, index);
}

function createPaperId(title: string, index: number) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  return slug || `paper-${index + 1}`;
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
    throw new Error("Debate Agent did not return JSON.");
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
