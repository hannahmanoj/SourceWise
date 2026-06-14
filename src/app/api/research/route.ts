import { mockResearch } from "@/data/mockResearch";
import { generateDebates } from "@/lib/debateAgent";
import { saveResearchProject } from "@/lib/researchProjects";
import { generateResearchMap } from "@/lib/researchMapAgent";
import { searchSemanticScholar } from "@/lib/semanticScholar";
import { createClient } from "@/lib/supabase/server";
import type {
  ResearchDebate,
  ResearchPaper,
  ResearchRequest,
  ResearchResult,
} from "@/types/research";

function isResearchRequest(value: unknown): value is ResearchRequest {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return (
    typeof payload.topic === "string" &&
    payload.topic.trim().length > 0 &&
    (payload.academicLevel === "Bachelor's" ||
      payload.academicLevel === "Master's" ||
      payload.academicLevel === "PhD")
  );
}

export async function POST(request: Request) {
  const payload: unknown = await request.json().catch(() => null);

  if (!isResearchRequest(payload)) {
    return Response.json(
      { error: "Expected topic and academicLevel." },
      { status: 400 },
    );
  }

  const topic = payload.topic.trim();
  const papers = await searchSemanticScholar(topic).catch((error: unknown) => {
    console.error(error);
    return null;
  });

  if (!papers) {
    return Response.json(
      {
        error:
          "Semantic Scholar could not be reached. Add SEMANTIC_SCHOLAR_API_KEY or try again later.",
      },
      { status: 502 },
    );
  }

  if (papers.length === 0) {
    return Response.json(
      { error: "No Semantic Scholar papers found for this topic." },
      { status: 404 },
    );
  }

  const researchMap = await generateResearchMap(
    topic,
    papers,
    payload.academicLevel,
  );
  const debates = await generateDebates(
    topic,
    researchMap,
    papers,
    payload.academicLevel,
  );
  const result = createResearchResult(topic, papers, researchMap, debates);

  await saveResearchResultForCurrentUser(result, payload.academicLevel);

  return Response.json(result);
}

function createResearchResult(
  topic: string,
  papers: ResearchPaper[],
  researchMap: ResearchResult["researchMap"],
  debates: ResearchDebate[],
): ResearchResult {
  return {
    ...mockResearch,
    topic,
    researchMap,
    papers,
    debates,
  };
}

async function saveResearchResultForCurrentUser(
  result: ResearchResult,
  academicLevel: ResearchRequest["academicLevel"],
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  try {
    await saveResearchProject({
      academicLevel,
      result,
      supabase,
      userId: user.id,
    });
  } catch (error) {
    console.error("Could not save research project.", error);
  }
}
