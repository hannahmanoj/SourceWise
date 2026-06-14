import Link from "next/link";
import { AuthLinks } from "@/components/AuthLinks";
import { ResearchExperience } from "@/components/ResearchExperience";
import { getResearchProject } from "@/lib/researchProjects";
import { createClient } from "@/lib/supabase/server";

export default async function ResearchPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}) {
  const { project } = await searchParams;
  const supabase = await createClient();
  const savedProject = project
    ? await getResearchProject({ id: project, supabase })
    : null;

  return (
    <main className="aura-bg min-h-screen text-[#171717]">
      <header className="sticky top-0 z-20 border-b border-black/10 bg-[#edf7f5]/80 px-6 py-4 backdrop-blur-xl sm:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-5">
          <Link className="text-sm font-semibold" href="/">
            SourceWise
          </Link>
          <div className="flex items-center gap-4 text-sm font-semibold text-black/55">
            <Link className="transition hover:text-black" href="/research">
              New topic
            </Link>
            <AuthLinks />
          </div>
        </div>
      </header>

      <ResearchExperience
        initialLevel={savedProject?.academicLevel}
        initialResearchResult={savedProject?.result}
        initialTopic={savedProject?.topic}
      />
    </main>
  );
}
