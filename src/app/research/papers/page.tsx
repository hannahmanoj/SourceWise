import Link from "next/link";
import { PaperList } from "@/components/PaperList";
import { mockResearch } from "@/data/mockResearch";

export default function PapersPage() {
  return (
    <main className="min-h-screen bg-[#f7f5f0] px-6 py-8 text-[#171717] sm:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 flex flex-col justify-between gap-6 border-b border-black/10 pb-8 md:flex-row md:items-end">
          <div>
            <Link
              className="mb-8 inline-flex h-10 items-center rounded-full border border-black/10 bg-white px-4 text-sm font-medium transition hover:bg-[#fbfaf7]"
              href="/research"
            >
              Back to research
            </Link>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-[#446b70]">
              More papers
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
              All relevant papers for {mockResearch.topic}
            </h1>
          </div>
          <div className="rounded-full border border-black/10 bg-white/70 px-5 py-3 text-sm font-medium text-black/60">
            {mockResearch.sources.length} papers
          </div>
        </header>

        <PaperList papers={mockResearch.sources} showCompare={false} />
      </div>
    </main>
  );
}
