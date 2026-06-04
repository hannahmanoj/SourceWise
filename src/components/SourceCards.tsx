type Source = {
  title: string;
  year: number;
  credibility: number;
};

type SourceCardsProps = {
  sources: Source[];
};

export function SourceCards({ sources }: SourceCardsProps) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
      <div className="mb-8">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-[#446b70]">
          Step 3
        </p>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          Strongest sources, after orientation.
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sources.map((source) => (
          <article
            className="rounded-[8px] border border-black/10 bg-white/75 p-6 shadow-sm backdrop-blur"
            key={source.title}
          >
            <p className="mb-3 text-sm font-medium text-black/45">
              {source.year}
            </p>
            <h3 className="text-2xl font-semibold tracking-tight">
              {source.title}
            </h3>
            <p className="mt-5 text-base leading-7 text-black/60">
              Best used for understanding how AI tools are changing developer
              workflows and research questions.
            </p>
            <div className="mt-6 flex items-center justify-between rounded-[8px] bg-[#eef5f2] px-4 py-3">
              <span className="text-sm font-medium text-[#355c48]">
                Credibility
              </span>
              <span className="text-sm font-semibold text-[#355c48]">
                {source.credibility}/100
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
