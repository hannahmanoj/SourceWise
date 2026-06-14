"use client";

import Link from "next/link";
import { useState } from "react";
import type { SavedResearchProject } from "@/lib/researchProjects";

export function ResearchHistoryDrawer({
  errorMessage,
  projects,
  userEmail,
}: {
  errorMessage?: string;
  projects: SavedResearchProject[];
  userEmail?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="transition hover:text-black" onClick={() => setIsOpen(true)} type="button">
        My research
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <button
            aria-label="Close research history"
            className="absolute inset-0 hidden cursor-default bg-black/10 pointer-events-auto md:block"
            onClick={() => setIsOpen(false)}
            type="button"
          />
          <aside className="animate-[slideSidebarIn_300ms_cubic-bezier(0.2,0.8,0.2,1)_both] pointer-events-auto absolute left-0 top-0 flex h-full w-[330px] max-w-[88vw] flex-col border-r border-black/10 bg-[#f7fbfa] p-4 shadow-2xl shadow-black/12">
            <div className="mb-6 flex items-center justify-between gap-4">
              <Link className="text-2xl font-semibold tracking-tight" href="/">
                SourceWise
              </Link>
              <button
                aria-label="Close sidebar"
                className="flex h-9 w-9 items-center justify-center rounded-[8px] text-xl font-semibold text-black/45 transition hover:bg-black/5 hover:text-black"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                ⌜
              </button>
            </div>

            <nav className="space-y-1 text-base font-semibold">
              <Link
                className="flex h-12 items-center rounded-[8px] bg-black/[0.05] px-4 text-black transition hover:bg-black/[0.08]"
                href="/research"
                onClick={() => setIsOpen(false)}
              >
                New research
              </Link>
              <Link
                className="flex h-12 items-center rounded-[8px] px-4 text-black/72 transition hover:bg-black/[0.05] hover:text-black"
                href="/research/saved"
                onClick={() => setIsOpen(false)}
              >
                Saved library
              </Link>
            </nav>

            <div className="mt-8 min-h-0 flex-1 overflow-y-auto pr-1">
              <p className="mb-3 px-1 text-sm font-semibold text-black/45">
                Recents
              </p>

            {errorMessage ? (
              <p className="rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700">
                {errorMessage}
              </p>
            ) : null}

            {!errorMessage && projects.length === 0 ? (
              <div className="rounded-[8px] bg-white/70 p-4">
                <p className="text-sm leading-6 text-black/58">
                  Sign in, map a topic, and SourceWise will save it here
                  automatically.
                </p>
              </div>
            ) : null}

            <div className="space-y-1">
              {projects.map((project) => (
                <Link
                  className="block rounded-[8px] px-3 py-3 text-sm font-semibold leading-5 text-black/72 transition hover:bg-black/[0.05] hover:text-black"
                  href={`/research?project=${project.id}`}
                  key={project.id}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="line-clamp-2">{project.topic}</span>
                </Link>
              ))}
            </div>
            </div>

            <div className="mt-4 border-t border-black/10 pt-4">
              <div className="flex items-center gap-3 rounded-[8px] px-2 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d9eaf8] text-sm font-semibold text-[#57718f]">
                  SW
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {userEmail ?? "SourceWise user"}
                  </p>
                  <p className="text-xs font-semibold text-black/40">
                    Saved research
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
