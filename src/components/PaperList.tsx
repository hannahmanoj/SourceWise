"use client";

import { useState } from "react";
import type { ResearchPaper } from "@/types/research";

type Paper = ResearchPaper;

type PaperListProps = {
  papers: Paper[];
  selectedTitles?: string[];
  onToggleCompare?: (title: string) => void;
  showCompare?: boolean;
  showRank?: boolean;
};

export function PaperList({
  papers,
  selectedTitles = [],
  onToggleCompare,
  showCompare = true,
  showRank = false,
}: PaperListProps) {
  const [expandedCredibilityTitle, setExpandedCredibilityTitle] = useState<
    string | null
  >(null);

  return (
    <div className="space-y-4">
      {papers.map((source, index) => {
        const isSelectedForComparison = selectedTitles.includes(source.title);
        const isCredibilityExpanded =
          expandedCredibilityTitle === source.title;
        const paperKey = source.id
          ? `${source.id}-${index}`
          : `${source.title}-${source.year}-${index}`;

        return (
          <article
            className="animate-card rounded-[8px] border border-black/10 bg-white/85 p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#9f8ee8]/35 hover:shadow-xl hover:shadow-black/5"
            key={paperKey}
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <div className="mb-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_190px] md:items-start">
              <div className="min-w-0">
                <p className="mb-3 text-sm font-semibold text-black/45">
                  {showRank ? `#${index + 1} ranked source · ` : ""}
                  {source.type} · {source.year} · {source.venue}
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-balance">
                  {source.title}
                </h2>
                <p className="mt-2 text-sm text-black/50">{source.authors}</p>
              </div>
              <div className="grid gap-2">
                <div className="flex h-10 w-full items-center justify-center rounded-full border border-[#83aee0]/30 bg-[#eef6ff] px-4 text-sm font-semibold text-[#57718f]">
                  Credibility {source.credibility.score}/100
                </div>
                <a
                  className="flex h-10 w-full items-center justify-center rounded-full border border-black/10 bg-white px-4 text-sm font-semibold transition hover:bg-[#f2f7fb]"
                  href={source.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  Open paper
                </a>
                {showCompare && onToggleCompare ? (
                  <button
                    className={`h-10 w-full rounded-full px-4 text-sm font-semibold transition ${
                      isSelectedForComparison
                        ? "bg-[#6b5fa5] text-white"
                        : "border border-black/10 bg-white text-black/65 hover:text-black"
                    }`}
                    onClick={() => onToggleCompare(source.title)}
                    type="button"
                  >
                    {isSelectedForComparison ? "Selected" : "Compare"}
                  </button>
                ) : null}
              </div>
            </div>

            <p className="max-w-3xl text-base leading-7 text-black/60">
              {source.whyItMatters}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Metric label="Relevance" value={`${source.relevance}%`} />
              <Metric label="Citations" value={source.citations} />
              <Metric label="Source type" value={source.type} />
            </div>

            <div className="mt-5 border-t border-black/10 pt-5">
              <button
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold transition hover:bg-[#f2f7fb]"
                onClick={() =>
                  setExpandedCredibilityTitle(
                    isCredibilityExpanded ? null : source.title,
                  )
                }
                type="button"
              >
                {isCredibilityExpanded
                  ? "Hide credibility"
                  : "Credibility signal"}
              </button>

              {isCredibilityExpanded ? (
                <div className="mt-4 rounded-[8px] border border-black/10 bg-[#f2f7fb] p-5">
                  <h4 className="font-semibold tracking-tight">
                    Credibility signal
                  </h4>

                  <p className="mt-3 text-sm leading-6 text-black/60">
                    {source.credibility.whyTrust}
                  </p>

                  <div className="mt-5 grid gap-3 text-sm text-black/65">
                    <p>
                      <strong className="text-black">Citation strength:</strong>{" "}
                      {source.credibility.citationStrength}
                    </p>
                    <p>
                      <strong className="text-black">Recency:</strong>{" "}
                      {source.credibility.recency}
                    </p>
                    <p>
                      <strong className="text-black">Methodology:</strong>{" "}
                      {source.credibility.methodology}
                    </p>
                    <p>
                      <strong className="text-black">Venue quality:</strong>{" "}
                      {source.credibility.venueQuality}
                    </p>
                    <p>
                      <strong className="text-black">Limitations:</strong>{" "}
                      {source.credibility.limitations}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[8px] border border-black/5 bg-[#f2f7fb] px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-black/40">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}
