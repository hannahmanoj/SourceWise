import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import { ResearchHistoryDrawer } from "@/components/ResearchHistoryDrawer";
import { listResearchProjects } from "@/lib/researchProjects";
import type { SavedResearchProject } from "@/lib/researchProjects";
import { createClient } from "@/lib/supabase/server";

export async function AuthLinks() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <>
        <Link className="transition hover:text-black" href="/auth?mode=login">
          Login
        </Link>
        <Link
          className="inline-flex h-9 items-center rounded-full bg-[#171717] px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-black"
          href="/auth?mode=signup"
        >
          Sign Up
        </Link>
      </>
    );
  }

  let projects: SavedResearchProject[] = [];
  let errorMessage: string | undefined;

  try {
    projects = await listResearchProjects(supabase);
  } catch {
    errorMessage =
      "Saved research could not load yet. Make sure the research_projects SQL has been run in Supabase.";
  }

  return (
    <>
      <ResearchHistoryDrawer
        errorMessage={errorMessage}
        projects={projects}
        userEmail={user.email}
      />
      <form action={signOut}>
        <button className="transition hover:text-black" type="submit">
          Sign out
        </button>
      </form>
    </>
  );
}
