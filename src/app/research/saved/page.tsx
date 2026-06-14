import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthLinks } from "@/components/AuthLinks";
import { listResearchProjects } from "@/lib/researchProjects";
import type { SavedResearchProject } from "@/lib/researchProjects";
import { createClient } from "@/lib/supabase/server";

export default async function SavedResearchPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth?next=/research/saved");
  }

  let projects: SavedResearchProject[] = [];
  let errorMessage: string | null = null;

  try {
    projects = await listResearchProjects(supabase);
  } catch {
    errorMessage =
      "Saved research could not load yet. Make sure the research_projects SQL has been run in Supabase.";
  }

  return (
    <main className="aura-bg min-h-screen px-6 py-8 text-[#171717] sm:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-center justify-between gap-5">
          <Link className="text-sm font-semibold" href="/">
            SourceWise
          </Link>
          <div className="flex items-center gap-4 text-sm font-semibold text-black/55">
            <Link className="transition hover:text-black" href="/research">
              New topic
            </Link>
            <AuthLinks />
          </div>
        </header>

        <section className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#57718f]">
              My research
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              Pick up where you left off.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-black/60">
              Saved topics include the map, papers, credibility signals, and
              debates generated for that search.
            </p>
          </div>
          <Link
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#171717] px-6 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-black"
            href="/research"
          >
            New research topic
          </Link>
        </section>

        {errorMessage ? (
          <p className="rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {errorMessage}
          </p>
        ) : null}

        {!errorMessage && projects.length === 0 ? (
          <section className="rounded-[8px] border border-black/10 bg-white/75 p-7 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight">
              No saved topics yet.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-black/60">
              Sign in, map a research topic, and SourceWise will save it here
              automatically.
            </p>
          </section>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <Link
              className="animate-card rounded-[8px] border border-black/10 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#9f8ee8]/40 hover:shadow-xl hover:shadow-black/5"
              href={`/research?project=${project.id}`}
              key={project.id}
            >
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#57718f]">
                {project.academicLevel} level
              </p>
              <h2 className="text-2xl font-semibold tracking-tight">
                {project.topic}
              </h2>
              <div className="mt-6 grid grid-cols-3 gap-2 text-sm">
                <Metric label="Themes" value={project.result.researchMap.themes.length} />
                <Metric label="Papers" value={project.result.papers.length} />
                <Metric label="Debates" value={project.result.debates.length} />
              </div>
              <p className="mt-5 text-sm font-semibold text-black/45">
                Updated {new Date(project.updatedAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[8px] bg-[#f2f7fb] px-3 py-2">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}
