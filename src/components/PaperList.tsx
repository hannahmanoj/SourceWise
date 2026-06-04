"use client";

import { useState } from "react";
import { mockResearch } from "@/data/mockResearch";

type Paper = (typeof mockResearch.sources)[number];

type PaperListProps = {
  papers: Paper[];
  selectedTitles?: string[];
  onToggleCompare?: (title: string) => void;
  showCompare?: boolean;
};

export function PaperList({
  papers,
  selectedTitles = [],
  onToggleCompare,
  showCompare = true,
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

        return (
          <article
            className="rounded-[8px] border border-black/10 bg-white/80 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5"
            key={source.title}
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="mb-3 text-sm font-medium text-black/45">
                  {source.type} · {source.year} · {source.venue}
                </p>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {source.title}
                </h2>
                <p className="mt-2 text-sm text-black/50">{source.authors}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex h-10 items-center rounded-full border border-[#446b70]/20 bg-[#edf4f5] px-4 text-sm font-medium text-[#446b70]">
                  Credibility {source.credibility}/100
                </div>
                <a
                  className="inline-flex h-10 items-center rounded-full border border-black/10 bg-white px-4 text-sm font-medium transition hover:bg-[#f7f5f0]"
                  href={source.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  Open paper
                </a>
                {showCompare && onToggleCompare ? (
                  <button
                    className={`h-10 rounded-full px-4 text-sm font-medium transition ${
                      isSelectedForComparison
                        ? "bg-[#446b70] text-white"
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
              <Metric
                label="Source type"
                value={source.credibilityBreakdown.methodology}
              />
            </div>

            <div className="mt-5 border-t border-black/10 pt-5">
              <button
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium transition hover:bg-[#f7f5f0]"
                onClick={() =>
                  setExpandedCredibilityTitle(
                    isCredibilityExpanded ? null : source.title,
                  )
                }
                type="button"
              >
                {isCredibilityExpanded ? "Hide credibility" : "Why trust this?"}
              </button>

              {isCredibilityExpanded ? (
                <div className="mt-4 rounded-[8px] border border-black/10 bg-white/60 p-5 backdrop-blur">
                  <h4 className="font-semibold tracking-tight">
                    Credibility explanation
                  </h4>

                  <p className="mt-3 text-sm leading-6 text-black/60">
                    {source.credibilityBreakdown.whyTrust}
                  </p>

                  <div className="mt-5 grid gap-3 text-sm text-black/65">
                    <p>
                      <strong className="text-black">Citation strength:</strong>{" "}
                      {source.credibilityBreakdown.citationStrength}
                    </p>
                    <p>
                      <strong className="text-black">Recency:</strong>{" "}
                      {source.credibilityBreakdown.recency}
                    </p>
                    <p>
                      <strong className="text-black">Methodology:</strong>{" "}
                      {source.credibilityBreakdown.methodology}
                    </p>
                    <p>
                      <strong className="text-black">Venue quality:</strong>{" "}
                      {source.credibilityBreakdown.venueQuality}
                    </p>
                    <p>
                      <strong className="text-black">Limitations:</strong>{" "}
                      {source.credibilityBreakdown.limitations}
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
    <div className="rounded-[8px] bg-[#f7f5f0] px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-black/40">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}
