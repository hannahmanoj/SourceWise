import { assessPaperCredibility } from "@/lib/credibilityAgent";
import type { ResearchPaper } from "@/types/research";

type SemanticScholarAuthor = {
  name?: string | null;
};

type SemanticScholarPaper = {
  paperId?: string | null;
  title?: string | null;
  year?: number | null;
  authors?: SemanticScholarAuthor[] | null;
  venue?: string | null;
  abstract?: string | null;
  citationCount?: number | null;
  url?: string | null;
  openAccessPdf?: {
    url?: string | null;
  } | null;
  publicationTypes?: string[] | null;
  fieldsOfStudy?: string[] | null;
};

type SemanticScholarSearchResponse = {
  data?: SemanticScholarPaper[];
};

const SEMANTIC_SCHOLAR_SEARCH_URL =
  "https://api.semanticscholar.org/graph/v1/paper/search";

const SEMANTIC_SCHOLAR_FIELDS = [
  "title",
  "paperId",
  "year",
  "authors",
  "venue",
  "abstract",
  "citationCount",
  "url",
  "openAccessPdf",
  "publicationTypes",
  "fieldsOfStudy",
].join(",");

export async function searchSemanticScholar(
  topic: string,
): Promise<ResearchPaper[]> {
  const searchUrl = new URL(SEMANTIC_SCHOLAR_SEARCH_URL);
  searchUrl.searchParams.set("query", topic);
  searchUrl.searchParams.set("limit", "20");
  searchUrl.searchParams.set("fields", SEMANTIC_SCHOLAR_FIELDS);

  const headers: HeadersInit = {};

  if (process.env.SEMANTIC_SCHOLAR_API_KEY) {
    headers["x-api-key"] = process.env.SEMANTIC_SCHOLAR_API_KEY;
  }

  const response = await fetch(searchUrl, {
    headers,
    next: {
      revalidate: 60 * 60,
    },
  });

  if (!response.ok) {
    throw new Error(`Semantic Scholar search failed: ${response.status}`);
  }

  const data = (await response.json()) as SemanticScholarSearchResponse;

  return (data.data ?? [])
    .filter((paper) => Boolean(paper.title))
    .map((paper, index) => toResearchPaper(paper, index));
}

function toResearchPaper(
  paper: SemanticScholarPaper,
  index: number,
): ResearchPaper {
  const citations = paper.citationCount ?? 0;
  const year = paper.year ?? new Date().getFullYear();
  const publicationType = paper.publicationTypes?.[0] ?? "Academic paper";
  const venue = paper.venue || "Unknown venue";
  const authors = paper.authors
    ?.map((author) => author.name)
    .filter((name): name is string => Boolean(name))
    .slice(0, 4);
  const fieldLabel = paper.fieldsOfStudy?.[0] ?? "this topic";

  return {
    title: paper.title ?? "Untitled paper",
    id: paper.paperId ?? createPaperId(paper.title ?? "Untitled paper", index),
    year,
    authors:
      authors && authors.length > 0
        ? authors.join(", ")
        : "Unknown authors",
    venue,
    relevance: Math.max(70, 96 - index * 3),
    citations,
    type: publicationType,
    url: paper.openAccessPdf?.url || paper.url || "#",
    whyItMatters: summarizeWhyItMatters(paper.abstract, fieldLabel),
    credibility: assessPaperCredibility({
      abstract: paper.abstract,
      citations,
      publicationType,
      venue,
      year,
    }),
  };
}

function createPaperId(title: string, index: number) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  return slug || `paper-${index + 1}`;
}

function summarizeWhyItMatters(
  abstract: string | null | undefined,
  fieldLabel: string,
) {
  if (!abstract) {
    return `A real Semantic Scholar result that appears relevant to ${fieldLabel}. Open it to inspect the abstract, methods, and claims.`;
  }

  const compactAbstract = abstract.replace(/\s+/g, " ").trim();

  if (compactAbstract.length <= 240) {
    return compactAbstract;
  }

  return `${compactAbstract.slice(0, 237)}...`;
}
