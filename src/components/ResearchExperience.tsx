"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { PaperList } from "@/components/PaperList";
import { mockResearch } from "@/data/mockResearch";
import type {
  AcademicLevel,
  PaperComparison,
  ResearchPaper,
  ResearchResult,
  ResearchTheme,
} from "@/types/research";

type Stage = "start" | "loading" | "landscape" | "papers" | "debates";
type Level = AcademicLevel;
type LandscapeTheme = ResearchTheme;
type PaperSort = "relevance" | "citations" | "year";

const levels: Level[] = ["Bachelor's", "Master's", "PhD"];
const paperSortOptions: { label: string; value: PaperSort }[] = [
  { label: "Relevance", value: "relevance" },
  { label: "Citations", value: "citations" },
  { label: "Release year", value: "year" },
];

export function ResearchExperience({
  initialLevel = "Bachelor's",
  initialResearchResult,
  initialTopic = "",
}: {
  initialLevel?: Level;
  initialResearchResult?: ResearchResult;
  initialTopic?: string;
}) {
  const [researchResult, setResearchResult] =
    useState<ResearchResult>(initialResearchResult ?? mockResearch);
  const [topic, setTopic] = useState(initialTopic);
  const [level, setLevel] = useState<Level>(initialLevel);
  const [stage, setStage] = useState<Stage>(
    initialResearchResult ? "landscape" : "start",
  );
  const [error, setError] = useState<string | null>(null);
  const [comparisonTitles, setComparisonTitles] = useState<string[]>([]);
  const [paperSort, setPaperSort] = useState<PaperSort>("relevance");
  const [selectedTheme, setSelectedTheme] = useState<LandscapeTheme | null>(
    null,
  );

  const comparisonPapers = useMemo(
    () =>
      comparisonTitles
        .map((title) =>
          researchResult.papers.find((source) => source.title === title),
        )
        .filter((source) => source !== undefined),
    [comparisonTitles, researchResult.papers],
  );

  const sortedPapers = useMemo(
    () => sortPapers(researchResult.papers, paperSort),
    [paperSort, researchResult.papers],
  );

  const displayedPapers = useMemo(() => {
    if (!selectedTheme) {
      return sortedPapers;
    }

    const themePapers = selectedTheme.paperTitles
      .map((title) =>
        researchResult.papers.find((source) => source.title === title),
      )
      .filter((source) => source !== undefined);

    return sortPapers(themePapers, paperSort);
  }, [paperSort, researchResult.papers, selectedTheme, sortedPapers]);

  const showResultNavigation =
    stage === "landscape" || stage === "papers" || stage === "debates";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTopic = topic.trim();

    if (!trimmedTopic) {
      return;
    }

    setStage("loading");
    setError(null);
    setSelectedTheme(null);
    setComparisonTitles([]);
    setPaperSort("relevance");

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: trimmedTopic,
          academicLevel: level,
        }),
      });

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;

        throw new Error(errorPayload?.error ?? "Research request failed.");
      }

      const nextResearchResult = (await response.json()) as ResearchResult;

      setResearchResult(nextResearchResult);
      setTopic(nextResearchResult.topic);
      setStage("landscape");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not map this topic yet. Please try again.",
      );
      setStage("start");
    }
  }

  function openTheme(theme: LandscapeTheme) {
    setSelectedTheme(theme);
    setComparisonTitles([]);
    setStage("papers");
  }

  function openAllPapers() {
    setSelectedTheme(null);
    setComparisonTitles([]);
    setStage("papers");
  }

  function openLandscape() {
    setSelectedTheme(null);
    setComparisonTitles([]);
    setStage("landscape");
  }

  function openDebates() {
    setSelectedTheme(null);
    setComparisonTitles([]);
    setStage("debates");
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

  function changePaperSort(nextSort: PaperSort) {
    setPaperSort(nextSort);
    setComparisonTitles([]);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
      <section className="animate-card rounded-[8px] border border-black/10 bg-white/80 p-5 shadow-lg shadow-black/[0.04] backdrop-blur sm:p-7">
        <div className="mb-6">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#57718f]">
              New research topic
            </p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Build a research path from a single question.
            </h1>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="sr-only">Research topic</span>
            <input
              className="h-16 w-full rounded-[8px] border border-black/10 bg-[#f2f7fb] px-5 text-lg font-semibold outline-none transition placeholder:text-black/35 focus:border-[#6b5fa5] focus:bg-white focus:ring-4 focus:ring-[#ded9ff]"
              onChange={(event) => setTopic(event.target.value)}
              placeholder="Enter a research topic, e.g. climate change adaptation"
              type="text"
              value={topic}
            />
          </label>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold text-black/50">
                Choose your academic level
              </p>
              <div className="inline-flex flex-wrap gap-1 rounded-full border border-black/10 bg-[#f2f7fb] p-1">
                {levels.map((item) => {
                  const isSelected = item === level;

                  return (
                    <button
                      className={`h-10 rounded-full px-5 text-sm font-medium transition ${
                        isSelected
                          ? "bg-[#171717] text-white"
                          : "text-black/60 hover:bg-white hover:text-black"
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
              className="h-12 rounded-full bg-[#171717] px-8 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!topic.trim() || stage === "loading"}
              type="submit"
            >
              {stage === "loading" ? "Mapping topic" : "Map topic"}
            </button>
          </div>
        </form>
        {error ? (
          <p className="mt-4 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        ) : null}
      </section>

      {showResultNavigation ? (
        <nav
          aria-label="Research result navigation"
          className="animate-card mt-5 rounded-[8px] border border-black/10 bg-white/75 p-3 shadow-sm backdrop-blur"
        >
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div className="px-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#57718f]">
                Research view
              </p>
              <p className="mt-1 text-sm font-semibold text-black/55">
                {selectedTheme && stage === "papers"
                  ? `Theme: ${selectedTheme.name}`
                  : stage === "papers"
                    ? "All papers"
                    : stage === "debates"
                      ? "Debates"
                      : "Topic map"}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 rounded-full bg-[#f2f7fb] p-1 text-sm font-semibold">
              <button
                aria-current={stage === "landscape" ? "page" : undefined}
                className={`h-11 rounded-full px-4 transition ${
                  stage === "landscape"
                    ? "bg-[#171717] text-white shadow-sm"
                    : "text-black/58 hover:bg-white hover:text-black"
                }`}
                onClick={openLandscape}
                type="button"
              >
                Map
              </button>
              <button
                aria-current={stage === "papers" && !selectedTheme ? "page" : undefined}
                className={`h-11 rounded-full px-4 transition ${
                  stage === "papers" && !selectedTheme
                    ? "bg-[#171717] text-white shadow-sm"
                    : "text-black/58 hover:bg-white hover:text-black"
                }`}
                onClick={openAllPapers}
                type="button"
              >
                Papers
              </button>
              <button
                aria-current={stage === "debates" ? "page" : undefined}
                className={`h-11 rounded-full px-4 transition ${
                  stage === "debates"
                    ? "bg-[#171717] text-white shadow-sm"
                    : "text-black/58 hover:bg-white hover:text-black"
                }`}
                onClick={openDebates}
                type="button"
              >
                Debates
              </button>
            </div>
          </div>
        </nav>
      ) : null}

      {stage === "loading" ? (
        <section className="py-16">
          <div className="animate-rise mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-8 h-2 overflow-hidden rounded-full bg-black/10">
              <div className="h-full w-2/3 animate-[pulse_1s_ease-in-out_infinite] rounded-full bg-[#83aee0]" />
            </div>
            <h2 className="text-4xl font-semibold tracking-tight text-balance">
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
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#57718f]">
                Research landscape
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
                First, understand the shape of {topic}.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-black/60">
                SourceWise groups the topic into themes before showing papers,
                so you know what each source is helping you understand.
              </p>
            </div>
            <div className="rounded-full border border-black/10 bg-white/70 px-5 py-3 text-sm font-semibold text-black/60">
              {level} level
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
            <div className="animate-card rounded-[8px] border border-black/10 bg-[#171717] p-6 text-white shadow-xl shadow-black/[0.08]">
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-white/45">
                Topic map
              </p>
              <h2 className="text-2xl font-semibold tracking-tight">
                {topic}
              </h2>
              <div className="mt-6 space-y-3 border-l border-white/15 pl-4">
                {researchResult.researchMap.themes.map((theme, index) => (
                  <button
                    className="animate-card block w-full rounded-[8px] border border-white/10 bg-white/[0.06] px-4 py-3 text-left text-sm font-semibold text-white/80 transition hover:bg-white/[0.12]"
                    key={theme.name}
                    onClick={() => openTheme(theme)}
                    style={{ animationDelay: `${index * 70}ms` }}
                    type="button"
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {researchResult.researchMap.themes.map((theme, index) => (
                <button
                  className="animate-card rounded-[8px] border border-black/10 bg-white/80 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#9f8ee8]/40 hover:shadow-xl hover:shadow-black/5"
                  key={theme.name}
                  onClick={() => openTheme(theme)}
                  style={{ animationDelay: `${120 + index * 90}ms` }}
                  type="button"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      {theme.name}
                    </h2>
                    <span className="shrink-0 rounded-full bg-[#e9f0ff] px-3 py-1 text-xs font-semibold text-[#6b5fa5]">
                      {theme.debateStatus}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-black/58">
                    {theme.explanation}
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-4 text-sm">
                    <span className="font-semibold text-black/55">
                      {theme.paperTitles.length} related papers
                    </span>
                    <span className="font-semibold text-[#57718f]">
                      View theme
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <section className="animate-card mt-10 rounded-[8px] border border-black/10 bg-white/75 p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#57718f]">
                  Related papers
                </p>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Ready to inspect the sources?
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-black/58">
                  Open a separate ranked paper view with the most relevant and
                  most cited sources for {topic}.
                </p>
              </div>
              <button
                className="h-12 rounded-full bg-[#171717] px-6 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-black"
                onClick={openAllPapers}
                type="button"
              >
                View all {sortedPapers.length} papers
              </button>
            </div>
          </section>

          <section className="animate-card mt-10 rounded-[8px] border border-black/10 bg-[#ecf7f0] p-6">
            <div className="mb-6">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#4f7b61]">
                Major debates
              </p>
              <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
                Then see where researchers disagree.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-black/60">
                These debates sit across the landscape. Use them to understand
                why papers matter before choosing what to read.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {researchResult.debates.map((debate, index) => (
                <article
                  className="animate-card rounded-[8px] border border-black/10 bg-white/75 p-5 shadow-sm"
                  key={debate.question}
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <p className="mb-5 text-sm font-semibold text-[#4f7b61]">
                    Debate {index + 1}
                  </p>
                  <h3 className="text-lg font-semibold leading-7">
                    {debate.question}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-black/55">
                    {debate.explanation}
                  </p>
                  {debate.sides && debate.sides.length > 0 ? (
                    <div className="mt-5 space-y-2 border-t border-black/10 pt-4">
                      {debate.sides.map((side) => (
                        <div
                          className="rounded-[8px] bg-[#f2f7fb] px-3 py-2"
                          key={`${debate.question}-${side.stance}`}
                        >
                          <p className="text-xs font-semibold leading-5 text-black/60">
                            {side.stance}
                          </p>
                          <p className="mt-1 text-xs text-black/40">
                            {side.paperIds.length} linked papers
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        </section>
      ) : null}

      {stage === "papers" ? (
        <section className="animate-[fadeIn_600ms_ease-out] py-10">
          <div className="mb-8">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#57718f]">
                {selectedTheme ? "Theme papers" : "Most relevant papers"}
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
                {selectedTheme
                  ? selectedTheme.name
                  : `Strong sources for ${topic}`}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-black/60">
                {selectedTheme
                  ? selectedTheme.explanation
                  : `Showing ${displayedPapers.length} related papers ranked by relevance, citations, and recency. Open papers in a new tab, or select two for an AI-generated comparison.`}
              </p>

              <div className="mt-6 flex w-fit max-w-full flex-wrap items-center gap-2 rounded-[8px] border border-black/10 bg-white/70 px-3 py-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-black/45">
                  Sort by
                </span>
                <div className="inline-flex flex-wrap gap-1 rounded-full bg-[#f2f7fb] p-1">
                  {paperSortOptions.map((option) => {
                    const isSelected = option.value === paperSort;

                    return (
                      <button
                        aria-pressed={isSelected}
                        className={`h-9 rounded-full px-4 text-xs font-semibold transition ${
                          isSelected
                            ? "bg-[#171717] text-white"
                            : "text-black/55 hover:bg-white hover:text-black"
                        }`}
                        key={option.value}
                        onClick={() => changePaperSort(option.value)}
                        type="button"
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              <PaperList
                onToggleCompare={toggleComparison}
                papers={displayedPapers}
                selectedTitles={comparisonTitles}
                showRank={!selectedTheme}
              />

            </div>

            <aside className="animate-card h-fit rounded-[8px] border border-black/10 bg-[#171717] p-5 text-white shadow-xl shadow-black/[0.08] lg:sticky lg:top-24">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-white/45">
                Compare papers
              </p>
              <p className="text-sm leading-6 text-white/55">
                Select 2 papers. If you choose a third, SourceWise replaces the
                oldest selection.
              </p>
              {comparisonPapers.length > 0 ? (
                <div className="mt-4 space-y-2">
                  {comparisonPapers.map((paper, index) => (
                    <button
                      className="w-full rounded-[8px] border border-white/10 bg-white/[0.06] p-3 text-left text-xs font-semibold leading-5 text-white/80 transition hover:bg-white/[0.1]"
                      key={paper.id ?? `${paper.title}-${index}`}
                      onClick={() => toggleComparison(paper.title)}
                      type="button"
                    >
                      {paper.title}
                    </button>
                  ))}
                </div>
              ) : null}
              <ComparisonPanel
                comparison={researchResult.comparisons.default}
                selectedPapers={comparisonPapers}
                topic={topic}
              />
            </aside>
          </div>
        </section>
      ) : null}

      {stage === "debates" ? (
        <section className="animate-[fadeIn_600ms_ease-out] pb-24 pt-4">
          <div className="mb-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#57718f]">
              Debates
            </p>
            <h2 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              Now understand the disagreements.
            </h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {researchResult.debates.map((debate, index) => (
              <article
                className="animate-card rounded-[8px] border border-black/10 bg-white/75 p-6 shadow-sm"
                key={debate.question}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="mb-8 text-sm font-semibold text-[#6b5fa5]">
                  Debate {index + 1}
                </p>
                <h3 className="text-xl font-semibold leading-8">
                  {debate.question}
                </h3>
                <p className="mt-4 text-sm leading-6 text-black/55">
                  {debate.explanation}
                </p>

                <div className="mt-6 space-y-3">
                  {(debate.sides && debate.sides.length > 0
                    ? debate.sides
                    : debate.papers.map((debatePaper) => ({
                        paperIds: [],
                        stance: debatePaper.stance,
                      }))
                  ).map((side) => {
                    const sidePapers =
                      side.paperIds.length > 0
                        ? side.paperIds
                            .map((paperId) =>
                              researchResult.papers.find(
                                (paper) => paper.id === paperId,
                              ),
                            )
                            .filter(
                              (paper): paper is ResearchPaper => Boolean(paper),
                            )
                        : debate.papers
                            .filter(
                              (debatePaper) =>
                                debatePaper.stance === side.stance,
                            )
                            .map((debatePaper) =>
                              researchResult.papers.find(
                                (paper) => paper.title === debatePaper.title,
                              ),
                            )
                            .filter(
                              (paper): paper is ResearchPaper => Boolean(paper),
                            );

                    return (
                      <div
                        className="rounded-[8px] border border-black/10 bg-[#f2f7fb] p-4"
                        key={`${debate.question}-${side.stance}`}
                      >
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#4f7b61]">
                          {side.stance}
                        </p>
                        <div className="space-y-3">
                          {sidePapers.map((source, paperIndex) => (
                            <div
                              className="rounded-[8px] bg-white p-3"
                              key={`${side.stance}-${source.id ?? `${source.title}-${paperIndex}`}`}
                            >
                              <div className="mb-3 flex items-start justify-between gap-3">
                                <p className="text-sm font-semibold leading-6">
                                  {source.title}
                                </p>
                                <span className="rounded-full bg-[#f2f7fb] px-3 py-1 text-xs font-semibold text-black/55">
                                  {source.relevance}%
                                </span>
                              </div>
                              <a
                                className="inline-flex h-9 items-center rounded-full border border-black/10 bg-white px-3 text-xs font-semibold transition hover:bg-[#f2f7fb]"
                                href={source.url}
                                rel="noreferrer"
                                target="_blank"
                              >
                                Open
                              </a>
                            </div>
                          ))}
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

function sortPapers(papers: ResearchPaper[], sortBy: PaperSort) {
  return [...papers].sort((firstPaper, secondPaper) => {
    if (sortBy === "citations") {
      return (
        secondPaper.citations - firstPaper.citations ||
        secondPaper.relevance - firstPaper.relevance ||
        secondPaper.year - firstPaper.year
      );
    }

    if (sortBy === "year") {
      return (
        secondPaper.year - firstPaper.year ||
        secondPaper.relevance - firstPaper.relevance ||
        secondPaper.citations - firstPaper.citations
      );
    }

    return (
      secondPaper.relevance - firstPaper.relevance ||
      secondPaper.citations - firstPaper.citations ||
      secondPaper.year - firstPaper.year
    );
  });
}

function ComparisonPanel({
  comparison,
  selectedPapers,
  topic,
}: {
  comparison: PaperComparison;
  selectedPapers: ResearchPaper[];
  topic: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [generatedComparison, setGeneratedComparison] =
    useState<PaperComparison | null>(null);
  const [comparisonError, setComparisonError] = useState<string | null>(null);
  const [isGeneratingComparison, setIsGeneratingComparison] = useState(false);
  const activeComparison = generatedComparison ?? comparison;

  useEffect(() => {
    const controller = new AbortController();

    async function generateComparison() {
      setIsExpanded(false);
      setGeneratedComparison(null);
      setComparisonError(null);

      if (selectedPapers.length !== 2) {
        setIsGeneratingComparison(false);
        return;
      }

      setIsGeneratingComparison(true);

      try {
        const response = await fetch("/api/compare", {
          body: JSON.stringify({
            papers: selectedPapers,
            topic,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorPayload = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;

          throw new Error(
            errorPayload?.error ?? "Could not compare these papers yet.",
          );
        }

        const nextComparison = (await response.json()) as PaperComparison;
        setGeneratedComparison(nextComparison);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setComparisonError(
          error instanceof Error
            ? error.message
            : "Could not compare these papers yet.",
        );
      } finally {
        setIsGeneratingComparison(false);
      }
    }

    generateComparison();

    return () => controller.abort();
  }, [selectedPapers, topic]);

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
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/10 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={isGeneratingComparison}
              onClick={() => setIsExpanded(true)}
              type="button"
            >
              ↗
            </button>
            <p className="mb-3 pr-10 text-xs font-medium uppercase tracking-[0.14em] text-[#b8d8dc]">
              {isGeneratingComparison ? "Generating" : "AI generated"}
            </p>
            {isGeneratingComparison ? (
              <p className="text-sm leading-6 text-white/55">
                Comparing claims, evidence, and best use cases for these two
                papers.
              </p>
            ) : (
              <p className="text-sm leading-6 text-white/72">
                {activeComparison.agreement}
              </p>
            )}
            {comparisonError ? (
              <p className="mt-3 rounded-[8px] border border-red-300/30 bg-red-400/10 p-3 text-xs leading-5 text-red-100">
                {comparisonError}
              </p>
            ) : null}
          </div>

          {isExpanded ? (
            <ComparisonPopup
              onClose={() => setIsExpanded(false)}
              comparison={activeComparison}
              selectedPapers={selectedPapers}
            />
          ) : null}
        </div>
      )}
    </section>
  );
}

function ComparisonPopup({
  comparison,
  onClose,
  selectedPapers,
}: {
  comparison: PaperComparison;
  onClose: () => void;
  selectedPapers: ResearchPaper[];
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
            text={comparison.agreement}
          />
          <ComparisonItem
            label="Where they differ"
            text={comparison.disagreement}
          />
          <ComparisonItem
            label="Method difference"
            text={comparison.methodDifference}
          />
          <ComparisonItem
            label="Best dissertation use"
            text={comparison.dissertationUse}
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
