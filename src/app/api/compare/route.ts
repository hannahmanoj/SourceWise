import { comparePapersWithAI } from "@/lib/paperComparisonAgent";
import type { PaperComparisonRequest, ResearchPaper } from "@/types/research";

function isResearchPaper(value: unknown): value is ResearchPaper {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return (
    typeof payload.title === "string" &&
    typeof payload.year === "number" &&
    typeof payload.authors === "string" &&
    typeof payload.venue === "string" &&
    typeof payload.type === "string" &&
    typeof payload.citations === "number" &&
    typeof payload.whyItMatters === "string"
  );
}

function isPaperComparisonRequest(
  value: unknown,
): value is PaperComparisonRequest {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return (
    typeof payload.topic === "string" &&
    payload.topic.trim().length > 0 &&
    Array.isArray(payload.papers) &&
    payload.papers.length === 2 &&
    isResearchPaper(payload.papers[0]) &&
    isResearchPaper(payload.papers[1])
  );
}

export async function POST(request: Request) {
  const payload: unknown = await request.json().catch(() => null);

  if (!isPaperComparisonRequest(payload)) {
    return Response.json(
      { error: "Expected topic and exactly two papers." },
      { status: 400 },
    );
  }

  const comparison = await comparePapersWithAI(payload.topic.trim(), [
    payload.papers[0],
    payload.papers[1],
  ]);

  return Response.json(comparison);
}
