import Link from "next/link";
import { ResearchExperience } from "@/components/ResearchExperience";

export default function ResearchPage() {
  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#171717]">
      <header className="sticky top-0 z-20 border-b border-black/10 bg-[#f7f5f0]/80 px-6 py-4 backdrop-blur-xl sm:px-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link className="text-sm font-semibold" href="/">
            SourceWise
          </Link>
          <div className="flex items-center gap-3 text-sm text-black/55">
            <span>Topic</span>
            <span className="h-1 w-1 rounded-full bg-black/25" />
            <span>Papers</span>
            <span className="h-1 w-1 rounded-full bg-black/25" />
            <span>Debates</span>
          </div>
        </div>
      </header>

      <ResearchExperience />
    </main>
  );
}
