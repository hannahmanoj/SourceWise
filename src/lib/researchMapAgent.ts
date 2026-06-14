import type {
  AcademicLevel,
  ResearchMap,
  ResearchPaper,
  ResearchTheme,
} from "@/types/research";

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      text?: string;
      type?: string;
    }>;
  }>;
};

type ChatCompletionsResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
};

type FallbackThemeTemplate = Omit<ResearchTheme, "paperTitles"> & {
  keywords: string[];
};

const RESEARCH_MAP_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    themes: {
      type: "array",
      minItems: 4,
      maxItems: 4,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          explanation: { type: "string" },
          debateStatus: {
            type: "string",
            enum: ["emerging", "mixed evidence", "mostly agreed"],
          },
          paperTitles: {
            type: "array",
            minItems: 1,
            maxItems: 4,
            items: { type: "string" },
          },
          debateQuestions: {
            type: "array",
            minItems: 1,
            maxItems: 2,
            items: { type: "string" },
          },
        },
        required: [
          "name",
          "explanation",
          "debateStatus",
          "paperTitles",
          "debateQuestions",
        ],
      },
    },
  },
  required: ["themes"],
} as const;

const MODEL_REQUEST_TIMEOUT_MS = Number(
  process.env.RESEARCH_MAP_AGENT_TIMEOUT_MS ?? 20_000,
);
const MAX_AGENT_PAPERS = 4;
const MAX_GITHUB_AGENT_PAPERS = 8;
const MAX_AGENT_ABSTRACT_LENGTH = 120;
const MIN_THEME_PAPERS = 2;
const MAX_THEME_PAPERS = 3;
const researchMapCache = new Map<string, ResearchMap>();

export async function generateResearchMap(
  topic: string,
  papers: ResearchPaper[],
  academicLevel: AcademicLevel,
): Promise<ResearchMap> {
  const cacheKey = createResearchMapCacheKey(topic, papers, academicLevel);
  const cachedMap = researchMapCache.get(cacheKey);

  if (cachedMap) {
    return cachedMap;
  }

  const agentMap = await callConfiguredResearchMapAgent(
    topic,
    papers,
    academicLevel,
  ).catch((error: unknown) => {
    console.error("Research Map Agent unavailable:", error);
    return null;
  });

  if (!agentMap) {
    return createFallbackResearchMap(topic, papers, academicLevel);
  }

  const normalizedMap = normalizeResearchMap(topic, papers, agentMap, academicLevel);
  researchMapCache.set(cacheKey, normalizedMap);
  return normalizedMap;
}

async function callConfiguredResearchMapAgent(
  topic: string,
  papers: ResearchPaper[],
  academicLevel: AcademicLevel,
) {
  if (getGitHubModelsToken()) {
    return callGitHubModelsResearchMapAgent(topic, papers, academicLevel);
  }

  if (
    process.env.AZURE_AI_FOUNDRY_ENDPOINT &&
    process.env.AZURE_AI_FOUNDRY_API_KEY &&
    process.env.AZURE_AI_FOUNDRY_MODEL
  ) {
    return callAzureFoundryResearchMapAgent(topic, papers, academicLevel);
  }

  if (process.env.OPENAI_API_KEY) {
    return callOpenAIResearchMapAgent(topic, papers, academicLevel);
  }

  return null;
}

async function callGitHubModelsResearchMapAgent(
  topic: string,
  papers: ResearchPaper[],
  academicLevel: AcademicLevel,
): Promise<ResearchMap | null> {
  const token = getGitHubModelsToken();
  const endpoint =
    process.env.GITHUB_MODELS_ENDPOINT ?? "https://models.github.ai/inference";
  const model = getGitHubModelsModel();

  if (!token) {
    return null;
  }

  const chatCompletionsUrl = getChatCompletionsUrl(endpoint);
  let lastError = "GitHub Models Research Map Agent failed.";

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const response = await fetch(chatCompletionsUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(MODEL_REQUEST_TIMEOUT_MS),
      body: JSON.stringify(
        createGitHubModelsChatBody(model, topic, papers, academicLevel),
      ),
    });

    if (response.ok) {
      return parseChatCompletionsResponse(response);
    }

    lastError = await createModelErrorMessage(
      "GitHub Models Research Map Agent",
      response,
    );

    if (response.status === 429 && attempt === 0) {
      await wait(getRetryDelayMs(response));
      continue;
    }

    throw new Error(lastError);
  }

  throw new Error(lastError);
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

async function callAzureFoundryResearchMapAgent(
  topic: string,
  papers: ResearchPaper[],
  academicLevel: AcademicLevel,
): Promise<ResearchMap | null> {
  const endpoint = process.env.AZURE_AI_FOUNDRY_ENDPOINT;
  const apiKey = process.env.AZURE_AI_FOUNDRY_API_KEY;
  const model = process.env.AZURE_AI_FOUNDRY_MODEL;

  if (!endpoint || !apiKey || !model) {
    return null;
  }

  const chatCompletionsUrl = getChatCompletionsUrl(endpoint);
  let lastError = "Azure Research Map Agent failed.";

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const response = await fetch(chatCompletionsUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(MODEL_REQUEST_TIMEOUT_MS),
      body: JSON.stringify(
        createChatCompletionsBody(model, topic, papers, academicLevel),
      ),
    });

    if (response.ok) {
      return parseChatCompletionsResponse(response);
    }

    lastError = await createModelErrorMessage("Azure Research Map Agent", response);

    if (response.status === 429 && attempt === 0) {
      await wait(getRetryDelayMs(response));
      continue;
    }

    throw new Error(lastError);
  }

  throw new Error(lastError);
}

function createChatCompletionsBody(
  model: string,
  topic: string,
  papers: ResearchPaper[],
  academicLevel: AcademicLevel,
) {
  return {
    model,
    messages: createResearchMapMessages(topic, papers, academicLevel),
    temperature: 0.2,
    max_tokens: 350,
    response_format: { type: "json_object" },
  };
}

function createGitHubModelsChatBody(
  model: string,
  topic: string,
  papers: ResearchPaper[],
  academicLevel: AcademicLevel,
) {
  return {
    model,
    messages: createCompactResearchMapMessages(topic, papers, academicLevel),
    temperature: 0,
    max_tokens: 650,
  };
}

function getChatCompletionsUrl(endpoint: string) {
  const normalizedEndpoint = endpoint.replace(/\/$/, "");

  if (normalizedEndpoint.endsWith("/chat/completions")) {
    return normalizedEndpoint;
  }

  return `${normalizedEndpoint}/chat/completions`;
}

async function callOpenAIResearchMapAgent(
  topic: string,
  papers: ResearchPaper[],
  academicLevel: AcademicLevel,
): Promise<ResearchMap | null> {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(MODEL_REQUEST_TIMEOUT_MS),
    body: JSON.stringify({
      model: process.env.OPENAI_RESEARCH_MAP_MODEL ?? "gpt-4o-mini",
      input: createResearchMapMessages(topic, papers, academicLevel),
      text: {
        format: {
          type: "json_schema",
          name: "research_map",
          strict: true,
          schema: RESEARCH_MAP_SCHEMA,
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(await createModelErrorMessage("Research Map Agent", response));
  }

  const data = (await response.json()) as OpenAIResponse;
  const outputText = extractOutputText(data);

  if (!outputText) {
    return null;
  }

  return JSON.parse(outputText) as ResearchMap;
}

function createResearchMapMessages(
  topic: string,
  papers: ResearchPaper[],
  academicLevel: AcademicLevel,
) {
  const agentPapers = papers.slice(0, MAX_AGENT_PAPERS);
  const levelInstruction = getAcademicLevelInstruction(academicLevel);

  return [
    {
      role: "system",
      content:
        `You create research maps for ${academicLevel} students. ${levelInstruction} Return only valid JSON with exactly 4 themes. Use specific theme names, never placeholders like Theme 1. Each theme must include name, explanation, debateStatus, paperTitles, and debateQuestions. Use only exact supplied paper titles.`,
    },
    {
      role: "user",
      content: JSON.stringify({
        topic,
        academicLevel,
        instruction:
          `Create exactly 4 short, meaningful themes for a ${academicLevel} student. Each theme must include 2 or 3 related paperTitles when possible. Good theme names are specific, like Productivity effects, Code quality risks, Security vulnerabilities, or Developer learning. Do not use generic names.`,
        outputShape:
          "{\"themes\":[{\"name\":\"specific theme name\",\"explanation\":\"one sentence\",\"debateStatus\":\"emerging|mixed evidence|mostly agreed\",\"paperTitles\":[\"exact supplied title\",\"exact supplied title\"],\"debateQuestions\":[\"one question\"]}]}",
        papers: agentPapers.map((paper) => ({
          title: paper.title,
          year: paper.year,
          abstract: firstSentenceForAgent(paper.whyItMatters),
        })),
      }),
    },
  ];
}

function createCompactResearchMapMessages(
  topic: string,
  papers: ResearchPaper[],
  academicLevel: AcademicLevel,
) {
  const levelInstruction = getAcademicLevelInstruction(academicLevel);

  return [
    {
      role: "system",
      content:
        `Return only JSON. Create 4 specific research themes for a ${academicLevel} student. ${levelInstruction} Each theme must include 2 or 3 exact paper titles when possible. Never use Theme 1, Theme 2, Core concepts, Methods and evidence, Applications and outcomes, or Open questions.`,
    },
    {
      role: "user",
      content: JSON.stringify({
        topic,
        academicLevel,
        titles: papers
          .slice(0, MAX_GITHUB_AGENT_PAPERS)
          .map((paper) => paper.title),
        json:
          "{\"themes\":[{\"name\":\"specific theme\",\"explanation\":\"short sentence\",\"debateStatus\":\"emerging\",\"paperTitles\":[\"exact supplied title\",\"exact supplied title\"],\"debateQuestions\":[\"short question\"]}]}",
      }),
    },
  ];
}

function truncateForAgent(text: string) {
  const compactText = text.replace(/\s+/g, " ").trim();

  if (compactText.length <= MAX_AGENT_ABSTRACT_LENGTH) {
    return compactText;
  }

  return `${compactText.slice(0, MAX_AGENT_ABSTRACT_LENGTH - 3)}...`;
}

function firstSentenceForAgent(text: string) {
  const compactText = text.replace(/\s+/g, " ").trim();
  const firstSentence = compactText.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim();

  return truncateForAgent(firstSentence || compactText);
}

function getAcademicLevelInstruction(academicLevel: AcademicLevel) {
  if (academicLevel === "Bachelor's") {
    return "Use accessible language, define the landscape clearly, avoid dense jargon, and favor overview themes a student can understand quickly.";
  }

  if (academicLevel === "Master's") {
    return "Emphasize research methods, evidence quality, disagreements, and how themes could support a focused literature review.";
  }

  return "Emphasize research gaps, theoretical or methodological tensions, limitations, and possible original contribution areas.";
}

function getFallbackThemeExplanation(
  topic: string,
  academicLevel: AcademicLevel,
) {
  if (academicLevel === "Bachelor's") {
    return `Accessible papers that explain the main ideas, background, and vocabulary around ${topic}.`;
  }

  if (academicLevel === "Master's") {
    return `Papers that help compare concepts, evidence quality, and methods in research on ${topic}.`;
  }

  return `Papers that help identify research gaps, methodological tensions, and possible contribution areas in ${topic}.`;
}

function createResearchMapCacheKey(
  topic: string,
  papers: ResearchPaper[],
  academicLevel: AcademicLevel,
) {
  return JSON.stringify({
    academicLevel,
    topic: topic.toLowerCase().trim(),
    papers: papers.slice(0, MAX_AGENT_PAPERS).map((paper) => paper.title),
  });
}

async function parseChatCompletionsResponse(response: Response) {
  const data = (await response.json()) as ChatCompletionsResponse;
  const outputText = data.choices?.[0]?.message?.content;

  if (!outputText) {
    return null;
  }

  return parseResearchMapOutput(outputText);
}

function parseResearchMapOutput(outputText: string): ResearchMap {
  try {
    return JSON.parse(extractJsonObject(outputText)) as ResearchMap;
  } catch {
    const proseMap = parseNumberedThemeList(outputText);

    if (proseMap) {
      return proseMap;
    }

    throw new Error("Research Map Agent did not return a usable map.");
  }
}

function extractJsonObject(text: string) {
  const trimmedText = text.trim();

  if (trimmedText.startsWith("{") && trimmedText.endsWith("}")) {
    return trimmedText;
  }

  const startIndex = trimmedText.indexOf("{");
  const endIndex = trimmedText.lastIndexOf("}");

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    throw new Error("Research Map Agent did not return JSON.");
  }

  return trimmedText.slice(startIndex, endIndex + 1);
}

function extractOutputText(response: OpenAIResponse) {
  if (response.output_text) {
    return response.output_text;
  }

  for (const item of response.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.text) {
        return content.text;
      }
    }
  }

  return null;
}

function parseNumberedThemeList(text: string): ResearchMap | null {
  const blocks = text
    .split(/(?=\n?\s*\d+\.\s*Theme\s*:)/i)
    .map((block) => block.trim())
    .filter(Boolean);

  const themes = blocks
    .map((block) => {
      const name = matchLine(block, /Theme\s*:\s*(.+)/i);
      const paperTitle = matchLine(block, /Paper\s*:\s*(.+)/i);
      const explanation = matchLine(block, /Focus\s*:\s*(.+)/i);

      if (!name || !paperTitle || !explanation) {
        return null;
      }

      const theme: ResearchTheme = {
        name: cleanModelLine(name),
        explanation: cleanModelLine(explanation),
        debateStatus: "emerging",
        paperTitles: [cleanPaperTitle(paperTitle)],
        debateQuestions: [
          `What evidence supports this theme, and where is it still uncertain?`,
        ],
      };

      return theme;
    })
    .filter((theme): theme is ResearchTheme => Boolean(theme))
    .slice(0, 4);

  if (themes.length !== 4) {
    return null;
  }

  return { themes };
}

function matchLine(text: string, pattern: RegExp) {
  return text.match(pattern)?.[1]?.trim() ?? null;
}

function cleanModelLine(text: string) {
  return text.replace(/^[-*]\s*/, "").trim();
}

function cleanPaperTitle(text: string) {
  return cleanModelLine(text)
    .replace(/\s*\(\d{4}\)\s*$/, "")
    .trim();
}

async function createModelErrorMessage(label: string, response: Response) {
  const retryAfter = response.headers.get("retry-after");
  const details = truncateErrorDetails(await response.text().catch(() => ""));
  const retryMessage = retryAfter ? ` Retry after: ${retryAfter}s.` : "";
  const detailMessage = details ? ` Details: ${details}` : "";

  return `${label} failed: ${response.status}.${retryMessage}${detailMessage}`;
}

function getRetryDelayMs(response: Response) {
  const retryAfterSeconds = Number(response.headers.get("retry-after"));

  if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0) {
    return Math.min(retryAfterSeconds * 1_000, 3_000);
  }

  return 1_500;
}

function wait(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function truncateErrorDetails(text: string) {
  const compactText = text.replace(/\s+/g, " ").trim();

  if (compactText.length <= 300) {
    return compactText;
  }

  return `${compactText.slice(0, 297)}...`;
}

function normalizeResearchMap(
  topic: string,
  papers: ResearchPaper[],
  researchMap: ResearchMap,
  academicLevel: AcademicLevel,
): ResearchMap {
  const paperTitles = new Set(papers.map((paper) => paper.title));
  const themes = Array.isArray(researchMap.themes) ? researchMap.themes : [];
  const normalizedThemes = themes
    .slice(0, 4)
    .map((theme, index) => ({
      ...theme,
      paperTitles: getThemePaperTitles(theme).filter((title) =>
        paperTitles.has(title),
      ),
      debateStatus: getThemeDebateStatus(theme),
      name: getThemeText(theme.name, `Theme ${index + 1}`),
      explanation:
        getThemeText(theme.explanation) ||
        getFallbackThemeExplanation(topic, academicLevel),
      debateQuestions:
        getThemeDebateQuestions(theme).length > 0
          ? getThemeDebateQuestions(theme)
          : [`What does this theme reveal about ${topic}?`],
    }))
    .map((theme, index) => ({
      ...theme,
      paperTitles:
        theme.paperTitles.length >= MIN_THEME_PAPERS
          ? theme.paperTitles.slice(0, MAX_THEME_PAPERS)
          : getSupplementedThemePaperTitles(theme, papers, index),
    }));

  if (normalizedThemes.length === 4 && !isLowQualityResearchMap(normalizedThemes)) {
    return { themes: normalizedThemes };
  }

  return createFallbackResearchMap(topic, papers, academicLevel);
}

function getThemeText(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : fallback;
}

function getThemePaperTitles(theme: ResearchTheme) {
  return Array.isArray(theme.paperTitles)
    ? theme.paperTitles.filter((title) => typeof title === "string")
    : [];
}

function getThemeDebateQuestions(theme: ResearchTheme) {
  return Array.isArray(theme.debateQuestions)
    ? theme.debateQuestions.filter((question) => typeof question === "string")
    : [];
}

function getThemeDebateStatus(theme: ResearchTheme) {
  if (
    theme.debateStatus === "emerging" ||
    theme.debateStatus === "mixed evidence" ||
    theme.debateStatus === "mostly agreed"
  ) {
    return theme.debateStatus;
  }

  return "emerging";
}

function getSupplementedThemePaperTitles(
  theme: ResearchTheme,
  papers: ResearchPaper[],
  index: number,
) {
  const existingTitles = new Set(theme.paperTitles);
  const themeKeywords = getThemeKeywords(theme);
  const relatedTitles = papers
    .filter((paper) => !existingTitles.has(paper.title))
    .map((paper) => ({
      paper,
      score: scorePaperForTheme(paper, themeKeywords),
    }))
    .sort((a, b) => b.score - a.score || b.paper.relevance - a.paper.relevance)
    .map(({ paper }) => paper.title);

  const fallbackTitles = papers
    .slice(index * MIN_THEME_PAPERS, index * MIN_THEME_PAPERS + MAX_THEME_PAPERS)
    .map((paper) => paper.title);

  return [
    ...theme.paperTitles,
    ...relatedTitles,
    ...fallbackTitles,
    ...papers.map((paper) => paper.title),
  ]
    .filter((title, titleIndex, titles) => titles.indexOf(title) === titleIndex)
    .slice(0, MAX_THEME_PAPERS);
}

function getThemeKeywords(theme: ResearchTheme) {
  return `${theme.name} ${theme.explanation}`
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 4);
}

function scorePaperForTheme(paper: ResearchPaper, keywords: string[]) {
  const searchableText = `${paper.title} ${paper.whyItMatters}`.toLowerCase();

  return keywords.filter((keyword) => searchableText.includes(keyword)).length;
}

function isLowQualityResearchMap(themes: ResearchTheme[]) {
  return themes.every((theme, index) => {
    const expectedPlaceholder = `theme ${index + 1}`;
    const normalizedName = theme.name.toLowerCase().trim();

    return (
      normalizedName === expectedPlaceholder ||
      normalizedName === "theme" ||
      theme.explanation.startsWith("A recurring research theme in papers about")
    );
  });
}

function createFallbackResearchMap(
  topic: string,
  papers: ResearchPaper[],
  academicLevel: AcademicLevel,
): ResearchMap {
  const themeTemplates = createTopicAwareFallbackThemes(topic, academicLevel);

  return {
    themes: themeTemplates.map((theme, index) => {
      const { keywords, ...researchTheme } = theme;

      return {
        ...researchTheme,
        paperTitles: selectFallbackPaperTitles(papers, keywords, index),
      };
    }),
  };
}

function createTopicAwareFallbackThemes(
  topic: string,
  academicLevel: AcademicLevel,
): FallbackThemeTemplate[] {
  const topicLabel = topic.toLowerCase();
  const fallbackExplanation = getFallbackThemeExplanation(topic, academicLevel);
  const isClimateTopic =
    topicLabel.includes("climate") ||
    topicLabel.includes("adaptation") ||
    topicLabel.includes("flood") ||
    topicLabel.includes("heat");
  const isAiSoftwareTopic =
    (topicLabel.includes("ai") ||
      topicLabel.includes("artificial intelligence") ||
      topicLabel.includes("generative")) &&
    (topicLabel.includes("software") ||
      topicLabel.includes("developer") ||
      topicLabel.includes("programming") ||
      topicLabel.includes("code"));
  const isCybersecurityTopic =
    topicLabel.includes("cybersecurity") ||
    topicLabel.includes("cyber security") ||
    topicLabel.includes("information security") ||
    topicLabel.includes("network security");

  if (isAiSoftwareTopic) {
    return [
      {
        name: "Developer productivity",
        explanation:
          "Studies that examine whether AI tools help developers complete work faster or shift effort elsewhere.",
        debateStatus: "mixed evidence",
        debateQuestions: [
          "Do productivity gains hold up when review and debugging time are included?",
        ],
        keywords: ["productivity", "developer", "workflow", "efficiency"],
      },
      {
        name: "Code quality and maintenance",
        explanation:
          "Research on whether AI-generated or AI-assisted code is correct, maintainable, and easy to review.",
        debateStatus: "mixed evidence",
        debateQuestions: [
          "How does AI assistance affect long-term code quality?",
        ],
        keywords: ["quality", "maintenance", "review", "correctness"],
      },
      {
        name: "Security and reliability risks",
        explanation:
          "Papers that investigate vulnerabilities, unsafe suggestions, and reliability problems in AI-assisted development.",
        debateStatus: "emerging",
        debateQuestions: [
          "Which risks require new safeguards before AI coding tools can be trusted?",
        ],
        keywords: ["security", "vulnerability", "risk", "reliability"],
      },
      {
        name: "Developer learning",
        explanation:
          "Work that asks how AI tools change programming education, skill development, and developer understanding.",
        debateStatus: "emerging",
        debateQuestions: [
          "Does AI support learning, or can it weaken core programming skills?",
        ],
        keywords: ["learning", "education", "student", "skill"],
      },
    ];
  }

  if (isCybersecurityTopic) {
    return [
      {
        name: "Threats and attack patterns",
        explanation:
          "Research that identifies common cyber threats, attacker behavior, and how risks evolve across systems.",
        debateStatus: "mostly agreed",
        debateQuestions: [
          "Which threats are most consistently supported by the evidence?",
        ],
        keywords: ["threat", "attack", "malware", "phishing", "intrusion"],
      },
      {
        name: "Detection and monitoring",
        explanation:
          "Studies on methods for identifying suspicious behavior, vulnerabilities, breaches, or malicious traffic.",
        debateStatus: "mixed evidence",
        debateQuestions: [
          "Which detection methods work well outside controlled experiments?",
        ],
        keywords: ["detection", "monitoring", "anomaly", "intrusion", "analysis"],
      },
      {
        name: "Defense and mitigation",
        explanation:
          "Papers that focus on controls, tools, policies, and engineering practices that reduce security risk.",
        debateStatus: "mixed evidence",
        debateQuestions: [
          "Which defenses reduce risk without creating major usability problems?",
        ],
        keywords: ["defense", "mitigation", "protection", "secure", "policy"],
      },
      {
        name: "Human and organizational factors",
        explanation:
          "Work on security behavior, awareness, training, governance, and the social side of cybersecurity.",
        debateStatus: "emerging",
        debateQuestions: [
          "How much of cybersecurity risk comes from people and organizations rather than tools?",
        ],
        keywords: ["human", "awareness", "training", "organization", "governance"],
      },
    ];
  }

  if (isClimateTopic) {
    return [
      {
        name: "Impacts and vulnerability",
        explanation:
          "Studies that map who or what is exposed to climate risks, and how severe those impacts may become.",
        debateStatus: "mostly agreed",
        debateQuestions: [
          "Which impacts are best supported by the available evidence?",
        ],
        keywords: ["impact", "vulnerability", "risk", "exposure"],
      },
      {
        name: "Adaptation planning",
        explanation:
          "Work on policies, plans, infrastructure, and local strategies for responding to climate stress.",
        debateStatus: "mixed evidence",
        debateQuestions: [
          "Which adaptation strategies appear practical across different places?",
        ],
        keywords: ["adaptation", "plan", "policy", "infrastructure"],
      },
      {
        name: "Equity and communities",
        explanation:
          "Research focused on unequal impacts, vulnerable communities, and justice in adaptation decisions.",
        debateStatus: "emerging",
        debateQuestions: [
          "Who benefits from adaptation, and who may still be left exposed?",
        ],
        keywords: ["equity", "community", "vulnerable", "inequal", "justice"],
      },
      {
        name: "Tools and evaluation",
        explanation:
          "Papers that compare methods, models, indexes, or frameworks for measuring adaptation choices.",
        debateStatus: "mixed evidence",
        debateQuestions: [
          "Which tools provide useful decisions rather than only descriptions?",
        ],
        keywords: ["tool", "framework", "model", "index", "evaluation"],
      },
    ];
  }

  return [
      {
        name: "Core concepts",
      explanation: fallbackExplanation,
      debateStatus: "mostly agreed",
      debateQuestions: [
        `Which sources are strongest for understanding the basics of ${topic}?`,
      ],
      keywords: ["review", "introduction", "overview", "framework"],
    },
    {
      name: "Methods and evidence",
      explanation:
        "Papers that reveal how researchers study the topic, what data they use, and where evidence quality varies.",
      debateStatus: "mixed evidence",
      debateQuestions: [
        "Which methods produce the most reliable evidence in this area?",
      ],
      keywords: ["method", "model", "analysis", "evidence", "data"],
    },
    {
      name: "Applications and outcomes",
      explanation:
        "Work that connects the research topic to real-world use, consequences, policy, practice, or technical systems.",
      debateStatus: "emerging",
      debateQuestions: [
        "Where does this research appear to matter outside the paper itself?",
      ],
      keywords: ["application", "impact", "practice", "policy", "outcome"],
    },
    {
      name: "Open questions",
      explanation:
        "Recent or unresolved work that suggests where the field still disagrees or needs stronger evidence.",
      debateStatus: "emerging",
      debateQuestions: [
        "Which claims need more research before they should be trusted?",
      ],
      keywords: ["future", "challenge", "risk", "gap", "uncertain"],
    },
  ];
}

function selectFallbackPaperTitles(
  papers: ResearchPaper[],
  keywords: string[] = [],
  index: number,
) {
  const scoredPapers = papers
    .map((paper) => ({
      paper,
      score: keywords.filter((keyword) =>
        paper.title.toLowerCase().includes(keyword),
      ).length,
    }))
    .sort((a, b) => b.score - a.score || b.paper.relevance - a.paper.relevance);

  const matchingTitles = scoredPapers
    .filter(({ score }) => score > 0)
    .slice(0, 3)
    .map(({ paper }) => paper.title);

  if (matchingTitles.length > 0) {
    return matchingTitles;
  }

  return papers.slice(index * 2, index * 2 + 3).map((paper) => paper.title);
}
