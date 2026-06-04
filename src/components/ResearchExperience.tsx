"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { PaperList } from "@/components/PaperList";
import { mockResearch } from "@/data/mockResearch";

type Stage = "start" | "loading" | "landscape" | "papers" | "debates";
type Level = "Bachelor's" | "Master's" | "PhD";
type LandscapeTheme = (typeof mockResearch.landscape)[number];

const levels: Level[] = ["Bachelor's", "Master's", "PhD"];

export function ResearchExperience() {
  const [topic, setTopic] = useState(mockResearch.topic);
  const [level, setLevel] = useState<Level>("Bachelor's");
  const [stage, setStage] = useState<Stage>("start");
  const [comparisonTitles, setComparisonTitles] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<LandscapeTheme | null>(
    null,
  );

  const comparisonPapers = useMemo(
    () =>
      comparisonTitles
        .map((title) =>
          mockResearch.sources.find((source) => source.title === title),
        )
        .filter((source) => source !== undefined),
    [comparisonTitles],
  );

  const displayedPapers = useMemo(() => {
    if (!selectedTheme) {
      return mockResearch.sources.slice(0, 5);
    }

    return selectedTheme.paperTitles
      .map((title) =>
        mockResearch.sources.find((source) => source.title === title),
      )
      .filter((source) => source !== undefined);
  }, [selectedTheme]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStage("loading");
    setSelectedTheme(null);
    setComparisonTitles([]);
    window.setTimeout(() => setStage("landscape"), 900);
  }

  function openTheme(theme: LandscapeTheme) {
    setSelectedTheme(theme);
    setComparisonTitles([]);
    setStage("papers");
  }

  function toggleComparison(title: string) {
    setComparisonTitles((current) => {
      if (current.includes(title)) {
        return current.filter((paperTitle) => paperTitle !== title);
      }

      if (current.length === 2) {
        return [current[1], title];
      }

      return [...current, title];
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
      <section className="rounded-[8px] border border-black/10 bg-white/75 p-5 shadow-sm backdrop-blur sm:p-8">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-[#446b70]">
          New research topic
        </p>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="sr-only">Research topic</span>
            <input
              className="h-16 w-full rounded-full border border-black/10 bg-[#f7f5f0] px-6 text-lg font-medium outline-none transition placeholder:text-black/35 focus:border-[#446b70] focus:bg-white focus:ring-4 focus:ring-[#cfe4e6]"
              onChange={(event) => setTopic(event.target.value)}
              placeholder="What are you writing about?"
              type="text"
              value={topic}
            />
          </label>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-3 text-sm font-medium text-black/50">
                Choose your academic level
              </p>
              <div className="flex flex-wrap gap-2">
                {levels.map((item) => {
                  const isSelected = item === level;

                  return (
                    <button
                      className={`h-10 rounded-full px-5 text-sm font-medium transition ${
                        isSelected
                          ? "bg-[#171717] text-white"
                          : "border border-black/10 bg-white text-black/65 hover:text-black"
                      }`}
                      key={item}
                      onClick={() => setLevel(item)}
                      type="button"
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              className="h-12 rounded-full bg-[#171717] px-8 text-sm font-medium text-white transition hover:scale-[1.02] hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!topic.trim() || stage === "loading"}
              type="submit"
            >
              {stage === "loading" ? "Finding papers" : "Go"}
            </button>
          </div>
        </form>
      </section>

      {stage === "start" ? (
        <section className="grid gap-4 py-8 md:grid-cols-3">
          {mockResearch.themes.slice(0, 3).map((theme) => (
            <div
              className="rounded-[8px] border border-black/10 bg-white/45 p-5 text-black/55"
              key={theme}
            >
              <p className="text-sm font-medium">Preview</p>
              <p className="mt-8 text-xl font-semibold text-black">{theme}</p>
            </div>
          ))}
        </section>
      ) : null}

      {stage === "loading" ? (
        <section className="py-16">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-8 h-2 overflow-hidden rounded-full bg-black/10">
              <div className="h-full w-2/3 animate-[pulse_1s_ease-in-out_infinite] rounded-full bg-[#9fc5c9]" />
            </div>
            <h2 className="text-4xl font-semibold tracking-tight">
              Mapping the research landscape.
            </h2>
            <p className="mt-4 text-lg leading-8 text-black/55">
              Identifying themes, evidence strength, and active debates before
              showing papers for a {level} research project.
            </p>
          </div>
        </section>
      ) : null}

      {stage === "landscape" ? (
        <section className="animate-[fadeIn_600ms_ease-out] py-10">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-[#446b70]">
                Research landscape
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
                First, understand the shape of {topic}.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-black/60">
                SourceWise groups the topic into themes before showing papers,
                so you know what each source is helping you understand.
              </p>
            </div>
            <div className="rounded-full border border-black/10 bg-white/70 px-5 py-3 text-sm font-medium text-black/60">
              {level} level
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
            <div className="rounded-[8px] border border-black/10 bg-[#171717] p-6 text-white shadow-sm">
              <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-white/45">
                Topic map
              </p>
              <h2 className="text-2xl font-semibold tracking-tight">
                {topic}
              </h2>
              <div className="mt-6 space-y-3 border-l border-white/15 pl-4">
                {mockResearch.landscape.map((theme) => (
                  <button
                    className="block w-full rounded-[8px] border border-white/10 bg-white/[0.06] px-4 py-3 text-left text-sm font-medium text-white/78 transition hover:bg-white/[0.12]"
                    key={theme.name}
                    onClick={() => openTheme(theme)}
                    type="button"
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {mockResearch.landscape.map((theme) => (
                <button
                  className="rounded-[8px] border border-black/10 bg-white/80 p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5"
                  key={theme.name}
                  onClick={() => openTheme(theme)}
                  type="button"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      {theme.name}
                    </h2>
                    <span className="shrink-0 rounded-full bg-[#edf4f5] px-3 py-1 text-xs font-medium text-[#446b70]">
                      {theme.debateStatus}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-black/58">
                    {theme.explanation}
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-4 text-sm">
                    <span className="font-medium text-black/55">
                      {theme.paperTitles.length} related papers
                    </span>
                    <span className="font-medium text-[#446b70]">
                      View theme
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <section className="mt-10 rounded-[8px] border border-black/10 bg-[#edf4f5] p-6">
            <div className="mb-6">
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-[#446b70]">
                Major debates
              </p>
              <h2 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
                Then see where researchers disagree.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-black/60">
                These debates sit across the landscape. Use them to understand
                why papers matter before choosing what to read.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {mockResearch.debates.map((debate, index) => (
                <article
                  className="rounded-[8px] border border-black/10 bg-white/75 p-5 shadow-sm"
                  key={debate.question}
                >
                  <p className="mb-5 text-sm font-medium text-[#446b70]">
                    Debate {index + 1}
                  </p>
                  <h3 className="text-lg font-semibold leading-7">
                    {debate.question}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-black/55">
                    {debate.explanation}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </section>
      ) : null}

      {stage === "papers" || stage === "debates" ? (
        <section className="animate-[fadeIn_600ms_ease-out] py-10">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-[#446b70]">
                {selectedTheme ? "Theme papers" : "Most relevant papers"}
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
                {selectedTheme
                  ? selectedTheme.name
                  : `Strong sources for ${topic}`}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-black/60">
                {selectedTheme
                  ? selectedTheme.explanation
                  : `Showing the top ${displayedPapers.length} strongest starting points. Open papers in a new tab, or select two for an AI-generated comparison.`}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedTheme ? (
                <button
                  className="h-11 rounded-full border border-black/10 bg-white/70 px-5 text-sm font-medium text-black/60 transition hover:bg-white"
                  onClick={() => {
                    setSelectedTheme(null);
                    setStage("landscape");
                  }}
                  type="button"
                >
                  Back to landscape
                </button>
              ) : null}
              <div className="inline-flex h-11 items-center rounded-full border border-black/10 bg-white/70 px-5 text-sm font-medium text-black/60">
                {level} level
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              <PaperList
                onToggleCompare={toggleComparison}
                papers={displayedPapers}
                selectedTitles={comparisonTitles}
              />

              {!selectedTheme ? (
                <Link
                  className="inline-flex h-12 items-center rounded-full border border-black/10 bg-white px-6 text-sm font-medium text-black transition hover:bg-[#f7f5f0]"
                  href="/research/papers"
                >
                  Show more papers
                </Link>
              ) : null}

              {stage === "papers" && !selectedTheme ? (
                <button
                  className="mt-4 h-12 rounded-full bg-[#446b70] px-7 text-sm font-medium text-white transition hover:scale-[1.02]"
                  onClick={() => setStage("debates")}
                  type="button"
                >
                  Continue to debates
                </button>
              ) : null}
            </div>

            <aside className="h-fit rounded-[8px] border border-black/10 bg-[#171717] p-5 text-white shadow-sm">
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-white/45">
                Compare papers
              </p>
              <p className="text-sm leading-6 text-white/55">
                Select 2 papers. If you choose a third, SourceWise replaces the
                oldest selection.
              </p>
              {comparisonPapers.length > 0 ? (
                <div className="mt-4 space-y-2">
                  {comparisonPapers.map((paper) => (
                    <button
                      className="w-full rounded-[8px] border border-white/10 bg-white/[0.06] p-3 text-left text-xs font-medium leading-5 text-white/80 transition hover:bg-white/[0.1]"
                      key={paper.title}
                      onClick={() => toggleComparison(paper.title)}
                      type="button"
                    >
                      {paper.title}
                    </button>
                  ))}
                </div>
              ) : null}
              <ComparisonPanel selectedPapers={comparisonPapers} />
            </aside>
          </div>
        </section>
      ) : null}

      {stage === "debates" ? (
        <section className="animate-[fadeIn_600ms_ease-out] pb-24 pt-4">
          <div className="mb-8">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-[#446b70]">
              Debates
            </p>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              Now understand the disagreements.
            </h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {mockResearch.debates.map((debate, index) => (
              <article
                className="rounded-[8px] border border-black/10 bg-white/75 p-6 shadow-sm"
                key={debate.question}
              >
                <p className="mb-8 text-sm font-medium text-[#446b70]">
                  Debate {index + 1}
                </p>
                <h3 className="text-xl font-semibold leading-8">
                  {debate.question}
                </h3>
                <p className="mt-4 text-sm leading-6 text-black/55">
                  {debate.explanation}
                </p>

                <div className="mt-6 space-y-3">
                  {debate.papers.map((debatePaper) => {
                    const source = mockResearch.sources.find(
                      (paper) => paper.title === debatePaper.title,
                    );

                    if (!source) {
                      return null;
                    }

                    return (
                      <div
                        className="rounded-[8px] border border-black/10 bg-[#f7f5f0] p-4"
                        key={`${debate.question}-${source.title}`}
                      >
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div>
                            <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-[#446b70]">
                              {debatePaper.stance}
                            </p>
                            <p className="text-sm font-semibold leading-6">
                              {source.title}
                            </p>
                          </div>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-black/55">
                            {source.relevance}%
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <a
                            className="inline-flex h-9 items-center rounded-full border border-black/10 bg-white px-3 text-xs font-medium transition hover:bg-white/70"
                            href={source.url}
                            rel="noreferrer"
                            target="_blank"
                          >
                            Open
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function ComparisonPanel({
  selectedPapers,
}: {
  selectedPapers: (typeof mockResearch.sources)[number][];
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="mt-4 border-t border-white/10 pt-4">
      {selectedPapers.length < 2 ? (
        <p className="text-sm leading-6 text-white/45">
          AI comparison will appear here once 2 papers are selected.
        </p>
      ) : (
        <div className="animate-[fadeIn_500ms_ease-out]">
          <div className="relative rounded-[8px] border border-white/15 bg-white/[0.08] p-4">
            <button
              aria-label="Expand AI comparison"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/10 text-sm font-semibold text-white transition hover:bg-white/20"
              onClick={() => setIsExpanded(true)}
              type="button"
            >
              ↗
            </button>
            <p className="mb-3 pr-10 text-xs font-medium uppercase tracking-[0.14em] text-[#b8d8dc]">
              AI generated
            </p>
            <p className="text-sm leading-6 text-white/72">
              Both papers discuss AI-assisted development, but one is stronger
              for productivity claims while the other questions quality and
              review depth.
            </p>
          </div>

          {isExpanded ? (
            <ComparisonPopup
              onClose={() => setIsExpanded(false)}
              selectedPapers={selectedPapers}
            />
          ) : null}
        </div>
      )}
    </section>
  );
}

function ComparisonPopup({
  onClose,
  selectedPapers,
}: {
  onClose: () => void;
  selectedPapers: (typeof mockResearch.sources)[number][];
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-8 backdrop-blur-md">
      <article className="max-h-[82vh] w-full max-w-2xl overflow-y-auto rounded-[8px] border border-white/30 bg-white/20 p-6 text-white shadow-2xl shadow-black/25 backdrop-blur-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-white/55">
              Full AI comparison
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">
              {selectedPapers[0].title} vs {selectedPapers[1].title}
            </h2>
          </div>
          <button
            className="rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-medium transition hover:bg-white/25"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <ComparisonItem
            label="Where they agree"
            text={mockResearch.comparison.agreement}
          />
          <ComparisonItem
            label="Where they differ"
            text={mockResearch.comparison.disagreement}
          />
          <ComparisonItem
            label="Method difference"
            text={mockResearch.comparison.methodDifference}
          />
          <ComparisonItem
            label="Best dissertation use"
            text={mockResearch.comparison.dissertationUse}
          />
        </div>

        <div className="mt-5 rounded-[8px] border border-white/20 bg-white/15 p-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-white/60">
            What to check next
          </p>
          <p className="text-sm leading-6 text-white/72">
            Read the methods sections carefully before relying on either paper.
            Pay attention to whether the evidence measures speed, quality,
            learning, maintainability, or developer perception, because those
            are different claims.
          </p>
        </div>
      </article>
    </div>
  );
}

function ComparisonItem({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-[8px] border border-white/20 bg-white/15 p-4">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-white/60">
        {label}
      </p>
      <p className="text-sm leading-6 text-white/75">{text}</p>
    </div>
  );
}
